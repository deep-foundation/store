import { useRouter } from 'next/router';
import React, { Context, ReactNode, useState, createContext, useRef, useEffect, useMemo } from 'react';
import Debug from 'debug';
import _ from 'lodash';
import { EventEmitter } from 'events';

import { IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('deepcase:store:use-store-query');
const capacitorStorageEvent = new EventEmitter();

export const QueryStoreContext = createContext(defaultContext);

export const fakeRouter: any = {};

export const QueryStoreProvider = ({
  context = QueryStoreContext,
  children,
}: {
  context?: Context<IStoreContext>;
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
    _.each(router?.query, (value, key) => {
      if (!_.isEqual(value, _cacheRef?.current?.[key])) {
        if (value) {
          try {
            capacitorStorageEvent.emit(key, JSON.parse(value));
          } catch(error) {
            capacitorStorageEvent.emit(key, value);
          }
        } else {
          capacitorStorageEvent.emit(key, undefined);
        }
      }
    });
    _cacheRef.current = router?.query;
  }, [router?.query]);

  const [useStoreValue] = useState(() => {
    function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): [T, (value: T) => any, () => any] {
      const [state, setState] = useState(_getDefaultValue.current(key, defaultValue));
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
      const setValue = (value) => {
        try {
          _renderingRef.current[key] = JSON.stringify(value);
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
          debug('setStore:error', { error, key, defaultValue: memoDefaultValue, value });
        }
      };

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

      return [state, setValue, unsetValue];
    };
    return { useStore };
  });

  return <context.Provider value={useStoreValue}>
    {children}
  </context.Provider>;
};

export function useQueryStore<T extends any>(key: string, defaultValue: T, context = QueryStoreContext) {
  return useStore(key, defaultValue, context);
}
