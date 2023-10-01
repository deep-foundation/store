import { createContext, Context, useContext } from 'react';

export interface IUseStoreSetHandler<T> {
  (oldValue: T): T;
};

export interface IUseStore <T>{
  (key: string, defaultValue: T): {
    value: T;
    setValue: (value: (T | IUseStoreSetHandler<T>)) => any
    unsetValue: () => any;
    isLoading?: boolean|undefined;
  };
}

export interface IStoreContext<T = any> {
  useStore: IUseStore<T>;
}

export const defaultContext: IStoreContext = {
  useStore: (key, defaultValue) => ({
    value: defaultValue, 
    setValue: value => undefined, 
    unsetValue: () => undefined,
    isLoading: undefined
  }),
};

export const StoreContext = createContext<IStoreContext>(defaultContext);

export interface ISetKeyValue {}

export function useStore<T>(
  key: string,
  defaultValue: T,
  context: Context<IStoreContext> = StoreContext,
): ReturnType<IStoreContext['useStore']> {
  const { useStore } = useContext(context);
  return useStore(key, defaultValue);
}
