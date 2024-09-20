[![npm](https://img.shields.io/npm/v/@deep-foundation/store.svg)](https://www.npmjs.com/package/@deep-foundation/store)
[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/deep-foundation/store) 
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label&color=purple)](https://discord.gg/deep-foundation)

# Usage
## Library
See [Documentation] for examples and API

## interface

```js
// js
const [value, setValue, unsetValue] = useSomeStore(keyInStorage, defaultValue);
```

```ts
// ts
const [value, setValue, unsetValue]: [Type, (value: Type) => any, () => any] = useSomeStore<Type>(keyInStorage: string, defaultValue: Type);
```

- `value` works equal with useStore
- `setValue(newValue)` works equal with useStore, set `newValue` in selected store in `keyInStorage`
- `unsetValue()` delete `keyInStorage` from store
- `keyInStorage` key used in storage
- `defaultValue` used as default `value` data when store `keyInStorage` is empty

## usage

> To use any hook, be sure to use the appropriate provider higher in the react tree.

```tsx
import { QueryStoreProvider, useQueryStore } from '@deep-foundation/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deep-foundation/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deep-foundation/store/capacitor';
```

```tsx
<QueryStoreProvider useRouter={useRouter}>
  <CookiesStoreProvider>
    <LocalStoreProvider>
      <CapacitorStoreProvider
        fetchInterval={5000} {/* optional, disabled by default, need to support catching not @deep-foundation/store based capacitor store changes. */}
      >
        <Content/>
      </CapacitorStoreProvider>
    </LocalStoreProvider>
  </CookiesStoreProvider>
</QueryStoreProvider>
```

```tsx
const [query, setQuery] = useQueryStore('demo', 5);
// ?demo=5
const [cookie, setCookie] = useCookiesStore('demo', 5);
// cookies demo=5
const [local, setLocal] = useLocalStore('demo', 5);
// localStorage.getItem('demo') // 5
const [capacitor, setCapacitor] = useCapacitorStore('demo', 5);
// await Preferences.get('demo') // { value: 5 }
```

## compatibility

- [x] useStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useCookiesStore
  - [x] web
  - [x] android
  - [ ] ios
  - [ ] electron
- [x] useQueryStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useLocalStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useCapacitorStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron

## cases

### prepare stores

```ts
// stores.tsx
export function useToken() {
  return useCookiesStore('my-token-key', null);
}
// component.tsx
const [token, setToken] = useToken();
```

### provide contextual stores

```ts
// stores.tsx
import { IUseStore } from '@deep-foundation/store/store';
export const OptionsContext = React.createContext<IUseStore | void>();
export function OptionsProvider({ key, children }: { key: string; children: any }) {
  const useStore = React.useMemo(() => {
    return function useOptions(defualtValue) {
      return useQueryStore(key, defualtValue);
    };
  }, []);
  return <OptionsContext.Provider value={useStore}>{children}</OptionsContext.Provider>
}
export function useOptions(defualtValue) {
  return React.useContext(OptionsContext)(defualtValue);
}
// component1.tsx
<OptionsProvider key={'abc'}><Component2/></OptionsProvider>
// component2.tsx
const [options, setOptions] = useOptions({ x: 'y' });
```


[Documentation]: https://deep-foundation.github.io/store/
