import React, { Context, ReactNode } from 'react';
import { IStoreContext } from './store';
export declare const QueryStoreContext: React.Context<IStoreContext<any>>;
export declare const fakeRouter: any;
export declare const QueryStoreProvider: ({ context, children, }: {
    context?: Context<IStoreContext>;
    children?: ReactNode;
}) => React.JSX.Element;
export declare function useQueryStore<T extends any>(key: string, defaultValue: T, context?: React.Context<IStoreContext<any>>): {
    value: any;
    setValue: (value: any) => any;
    unsetValue: () => any;
    isLoading?: boolean;
};
