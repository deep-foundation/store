import React, { Context, ReactNode } from 'react';
import { IStoreContext } from './store';
export declare const LocalContext: React.Context<IStoreContext<any>>;
export declare const LocalStoreProvider: ({ context, children, }: {
    context?: Context<IStoreContext>;
    children?: ReactNode;
}) => React.JSX.Element;
export declare function useLocalStore<T extends any>(key: string, defaultValue: T, context?: React.Context<IStoreContext<any>>): {
    value: any;
    setValue: (value: any) => any;
    unsetValue: () => any;
    isLoading?: boolean;
};
