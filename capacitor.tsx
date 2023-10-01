import React, { Context, ReactNode, useState, useEffect, useRef, createContext, useMemo } from 'react';
import { EventEmitter } from 'events';
import { isEqual, isNull } from 'lodash';
import { Preferences } from '@capacitor/preferences';
import Debug from 'debug';

import { IStoreContext, defaultContext, useStore } from './store'; // I assume this import is correct based on your initial code

const debug = Debug('store:capacitor');

const capacitorStorageEvent = new EventEmitter();

export const CapacitorStoreContext = createContext(defaultContext);

export const CapacitorStoreProvider = ({
  context = CapacitorStoreContext,
  children,
  fetchInterval = 0,
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
  fetchInterval?: number;
}) => {
  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): ReturnType<IStoreContext['useStore']>  {
      const getStateRef = useRef<any>();
      const intervalRef = useRef<any>();
      const memoDefaultValue = useMemo(() => defaultValue, []);
      const [state, setState] = useState<T>(memoDefaultValue);
      const [isLoading, setIsLoading] = useState<boolean>(true);

      const stateRef = useRef<any>();
      stateRef.current = state;

      const [setValue] = useState(() => (value) => {
        const _value = typeof(value) === 'function' ? value(stateRef.current) : value;
        debug('setValue', { key, defaultValue: memoDefaultValue, value: _value });
        Preferences.set({ key, value: JSON.stringify(_value) }).then(() => setState(_value));
        capacitorStorageEvent.emit(key, JSON.stringify(_value));
      });
      
      const [unsetValue] = useState(() => () => {
        debug('unsetValue', { key, defaultValue: memoDefaultValue });
        Preferences.remove({ key }).then(() => setState(memoDefaultValue));
        capacitorStorageEvent.emit(key, memoDefaultValue);
      });
      
      getStateRef.current = () => Preferences.get({ key }).then(async ({ value }) => {
        const { keys } = await Preferences.keys();
        if (!!~keys.indexOf(key)) {
          let valueParsed: any;
          try {
            valueParsed = JSON.parse(value);
          } catch (error) {
            debug('setStore:error', { error, key, defaultValue: memoDefaultValue, value });
          }
          debug('getStore', { key, defaultValue: memoDefaultValue, valueParsed, value });
          if (!isEqual(valueParsed, state)) {
            if (typeof(valueParsed) === 'undefined' || isNull(value)) setState(defaultValue);
            else setState(valueParsed);
          }
        }
      });
      
      useEffect(
        () => {
          debug('init', { key, defaultValue: memoDefaultValue });
          getStateRef.current().then(() => setIsLoading(false));
          const fn = (value) => {
            let valueParsed;
            try {
              valueParsed = JSON.parse(value);
            } catch (error) {
              debug('fn:error', { error, key, defaultValue: memoDefaultValue, value });
            }
            if (typeof(valueParsed) === 'undefined' || isNull(valueParsed)) setState(memoDefaultValue);
            else setState(valueParsed);
          };
          if (fetchInterval) intervalRef.current = setInterval(() => getStateRef.current(), fetchInterval);
          capacitorStorageEvent.on(key, fn);
          return () => {
            clearInterval(intervalRef.current);
            capacitorStorageEvent.off(key, fn);
          };
        },
        [],
      );
      return {
        value: state, setValue, unsetValue, isLoading
      };
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useCapacitorStore<T extends any>(key: string, defaultValue: T, context = CapacitorStoreContext) {
  return useStore(key, defaultValue, context);
}