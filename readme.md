# deepcase store

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
import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';
```

```tsx
<QueryStoreProvider>
  <CookiesStoreProvider>
    <LocalStoreProvider>
      <CapacitorStoreProvider fetchInterval={5000}>
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
// await Storage.get('demo') // { value: 5 }
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
import { IUseStore } from '@deepcase/store/store';
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
