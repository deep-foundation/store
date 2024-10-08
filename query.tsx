import React, { Context, ReactNode, useState, createContext, useRef, useEffect, useMemo, useCallback } from 'react';
import Debug from 'debug';
import isEqual from 'lodash/isEqual';
import { EventEmitter } from 'events';

import { IStoreContext, IUseStore, defaultContext, useStore } from './store';

const debug = Debug('store:use-store-query');
const capacitorStorageEvent = new EventEmitter();
capacitorStorageEvent.setMaxListeners(0);

export const QueryStoreContext = createContext(defaultContext);

export const fakeRouter: any = {};

export const QueryStoreProvider = ({
  context = QueryStoreContext,
  useRouter,
  children,
}: {
  context?: Context<IStoreContext>;
  useRouter: any;
  children?: ReactNode;
}) => {
  const router = useRouter();
  const { query, pathname, push } = router || fakeRouter;

  const _routerRef = useRef<any>({});
  _routerRef.current = { query, pathname };

  const _renderingRef = useRef({});
  const _timeoutRef = useRef<any>();
  const _cacheRef = useRef<any>();
  const _getDefaultValue = useRef<any>();
  _getDefaultValue.current = (key, defaultValue) => {
    if (query && query.hasOwnProperty(key)) {
      try {
        return JSON.parse(query[key]);
      } catch(error) { return query[key]; }
    }
    return defaultValue;
  };
  useEffect(() => {
    _renderingRef.current = {};
    const keys = Object.keys(router.query);
    for (let k in keys) {
      const key = keys[k];
      const value = router.query[key];
      if (!isEqual(value, _cacheRef?.current?.[key])) {
        if (value) {
          try {
            if (typeof value !== 'string') throw new Error('value is not string');
            capacitorStorageEvent.emit(key, JSON.parse(value));
          } catch(error) {
            capacitorStorageEvent.emit(key, value);
          }
        } else {
          capacitorStorageEvent.emit(key, undefined);
        }
      }
    }
    _cacheRef.current = router?.query;
  }, [router?.query]);

  const [useStoreValue] = useState(() => {
    function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): ReturnType<IUseStore<T>> {
      const [state, setState] = useState(_getDefaultValue.current(key, defaultValue));

      const stateRef = useRef<any>();
      stateRef.current = state;

      const memoDefaultValue = useMemo(() => defaultValue, []);
      useEffect(() => {
        const fn = (value) => {
          setState(value);
        };
        capacitorStorageEvent.on(key, fn);
        return () => {
          capacitorStorageEvent.off(key, fn);
        };
      }, []);
      const setValue = useCallback((value) => {
        const _value = typeof(value) === 'function' ? value(stateRef.current) : value;
        try {
          _renderingRef.current[key] = JSON.stringify(_value);
          clearTimeout(_timeoutRef.current);
          _timeoutRef.current = setTimeout(() => {
            push({
              pathname: _routerRef.current?.pathname,
              query: {
                ..._routerRef.current?.query,
                ..._renderingRef.current,
              },
            });
          }, 0);
        } catch (error) {
          debug('setStore:error', { error, key, defaultValue: memoDefaultValue, value: _value });
        }
      }, []);

      const [unsetValue] = useState(() => () => {
        try {
          if (query[key]) delete query[key];
          clearTimeout(_timeoutRef.current);
          _timeoutRef.current = setTimeout(() => {
            const _q = {
              ..._routerRef.current?.query,
              ..._renderingRef.current,
            };
            delete _q[key];
            push({
              pathname: _routerRef.current?.pathname,
              query: _q,
            });
          }, 0);
          _renderingRef.current[key] = undefined;
        } catch (error) {
          debug('unsetStore:error', { error, key });
        }
      });

      return [state, setValue, unsetValue, false];
    };
    return { useStore };
  });

  return <context.Provider value={useStoreValue}>
    {children}
  </context.Provider>;
};

/**
 * A hook to use a react-state-based store
 * 
 * @example
 * ```
 * // Wrap your component with QueryStoreProvider to use useQueryStore hook.
 * <QueryStoreProvider useRouter={useRouter}>
 *   <MyComponent />
 * </QueryStoreProvider>
 * 
 * function MyComponent() {
 *   const [value, setValue, unsetValue, isLoading] = useQueryStore('key', 'defaultValue');
 *   return <div>{value}</div>;
 * }
 * ```
 */
export function useQueryStore<T extends any>(key: string, defaultValue: T, context = QueryStoreContext) {
  return useStore(key, defaultValue, context);
}
