import React, { Context, ReactNode, useState, createContext, useMemo, useRef } from 'react';
import { useCookies, CookiesProvider } from 'react-cookie';
import Cookies, { Cookie, CookieSetOptions } from 'universal-cookie';
import Debug from 'debug';

import { IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('store:cookie');

export const CookiesStoreContext = createContext(defaultContext);

export const CookiesStoreProvider = ({
  context = CookiesStoreContext,
  children,
  defaultCookies,
  options = {},
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
  defaultCookies?: Cookie;
  options?: CookieSetOptions;
}) => {
  const [cookies] = useState(() => defaultCookies && new Cookies(defaultCookies));
  return <CookiesProvider cookies={cookies}>
    <CookiesStoreProviderCore options={options} context={context} defaultCookies={defaultCookies}>
      {children}
    </CookiesStoreProviderCore>
  </CookiesProvider>;
};

export const CookiesStoreProviderCore = ({
  context = CookiesStoreContext,
  children,
  defaultCookies = {},
  options = {},
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
  defaultCookies?: any;
  options?: CookieSetOptions;
}) => {
  const [useStore] = useState(() => {
    return function useStore<T>(
      key: string,
      defaultValue: T,
    ): ReturnType<IStoreContext['useStore']> {
      const memoDefaultValue = useMemo(() => defaultValue, []);
      const [cookie, setCookie, removeCookie] = useCookies([key]);

      const stateRef = useRef<any>();
      stateRef.current = cookie?.[key];

      const [setValue] = useState(() => (value) => {
        const _value = typeof(value) === 'function' ? value(stateRef.current) : value;
        debug('setValue', { key, defaultValue: memoDefaultValue, value: _value, options });
        return setCookie(key, { value: _value }, options);
      });
      const [unsetValue] = useState(() => () => {
        debug('unsetValue', { key, defaultValue: memoDefaultValue, options });
        return removeCookie(key, options);
      });
      let defaultCookie;
      try {
        defaultCookie = defaultCookies && defaultCookies[key] && typeof(defaultCookies[key]) === 'string' ? JSON.parse(defaultCookies[key]).value : defaultCookies[key];
      } catch (error) {
        debug('setStore:error', { error, key, defaultValue: memoDefaultValue, defaultCookie: defaultCookies[key] });
      }
      return {
        value: (cookie?.[key] && cookie?.[key]?.value) || (defaultCookies && defaultCookie) || memoDefaultValue,
        setValue: setValue,
        unsetValue: unsetValue,
      };
    };
  });
  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useCookiesStore<T extends any>(key: string, defaultValue: T, context = CookiesStoreContext) {
  return useStore(key, defaultValue, context);
}
