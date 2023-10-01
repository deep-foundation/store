import React, { Context, ReactNode } from 'react';
import { Cookie, CookieSetOptions } from 'universal-cookie';
import { IStoreContext } from './store';
export declare const CookiesStoreContext: React.Context<IStoreContext<any>>;
export declare const CookiesStoreProvider: ({ context, children, defaultCookies, options, }: {
    context?: Context<IStoreContext>;
    children?: ReactNode;
    defaultCookies?: Cookie;
    options?: CookieSetOptions;
}) => React.JSX.Element;
export declare const CookiesStoreProviderCore: ({ context, children, defaultCookies, options, }: {
    context?: Context<IStoreContext>;
    children?: ReactNode;
    defaultCookies?: any;
    options?: CookieSetOptions;
}) => React.JSX.Element;
export declare function useCookiesStore<T extends any>(key: string, defaultValue: T, context?: React.Context<IStoreContext<any>>): {
    value: any;
    setValue: (value: any) => any;
    unsetValue: () => any;
    isLoading?: boolean;
};
