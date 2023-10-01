import React, { Context, ReactNode, useState, createContext, useEffect, useMemo, useRef } from 'react';
import { EventEmitter } from 'events';
import { isNull } from 'lodash';
import Debug from 'debug';

import { IStoreContext, IUseStore, defaultContext, useStore } from './store';

const debug = Debug('store:local');

const localStorageEvent = new EventEmitter();

export const LocalContext = createContext(defaultContext);

const stringify = (item) => {
  if (typeof(item) === 'undefined' || isNull(item)) return '';
  return JSON.stringify(item);
};

export const LocalStoreProvider = ({
  context = LocalContext,
  children,
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
}) => {
  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): ReturnType<IUseStore<T>> {
      const memoDefaultValue = useMemo(() => defaultValue, []);
      const [value, _setValue] = useState<string>(typeof(localStorage) === 'undefined' ? stringify(memoDefaultValue) : (localStorage.hasOwnProperty(key) ? localStorage.getItem(key) : stringify(memoDefaultValue)));

      const stateRef = useRef<any>();
      stateRef.current = value;

      useEffect(
        () => {
          const hasOwnProperty = localStorage.hasOwnProperty(key);
          debug('init', { key, defaultValue: memoDefaultValue, hasOwnProperty });
          if (!hasOwnProperty) {
            const json = stringify(memoDefaultValue);
            localStorage.setItem(key, json);
            _setValue(json);
          }
          const fn = (value) => {
            const item = localStorage.getItem(key);
            if (typeof(item) === 'undefined' || isNull(item)) _setValue(stringify(memoDefaultValue));
            else _setValue(value);
          };
          localStorageEvent.on(key, fn);
          return () => {
            localStorageEvent.off(key, fn);
          };
        },
        [],
      );
      const [setValue] = useState(() => (value) => {
        debug('setValue', { key, defaultValue: memoDefaultValue, value });
        let current;
        try {
          current = JSON.parse(stateRef.current);
        } catch(error) {
          current = undefined;
        }
        const _value = typeof(value) === 'function' ? value(current) : value;
        const json = stringify(_value);
        localStorage.setItem(key, json);
        _setValue(json);
        localStorageEvent.emit(key, json);
      });
      const [unsetValue] = useState(() => () => {
        debug('unsetValue', { key, defaultValue: memoDefaultValue });
        localStorage.removeItem(key);
        localStorageEvent.emit(key, memoDefaultValue);
      });
      const _value = useMemo(() => {
        try {
          return JSON.parse(value);
        } catch(error) {
          return undefined;
        }
      }, [value]);
      return [_value, setValue, unsetValue, false];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useLocalStore<T extends any>(key: string, defaultValue: T, context = LocalContext) {
  return useStore(key, defaultValue, context);
}
