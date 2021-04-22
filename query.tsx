import { useRouter } from 'next/router';
import React, { Context, ReactNode, useState, createContext, useRef, useEffect, useMemo } from 'react';
import Debug from 'debug';

import { IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('deepcase:store:use-store-query');

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
  useEffect(() => {
    _renderingRef.current = {};
  }, [router?.query]);

  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): [T, (value: T) => any, () => any] {
      const router = useRouter();
      const { query } = router || fakeRouter;
      const memoDefaultValue = useMemo(() => defaultValue, []);
      const setValue = (value) => {
        try {
          clearTimeout(_timeoutRef.current);
          _timeoutRef.current = setTimeout(() => {
            push({
              pathname: _routerRef.current?.pathname,
              query: {
                ..._routerRef.current?.query,
                ..._renderingRef.current,
                [key]: JSON.stringify(value),
              },
            });
          }, 0);
          _renderingRef.current[key] = JSON.stringify(value);
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

      let value: any = query?.[key];
      try {
        value = JSON.parse(query[key]);
      } catch (error) {
        debug('value:error', { error, key, defaultValue: memoDefaultValue, query });
      }
      return [value || memoDefaultValue, setValue, unsetValue];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useQueryStore<T extends any>(key: string, defaultValue: T, context = QueryStoreContext) {
  return useStore(key, defaultValue, context);
}
