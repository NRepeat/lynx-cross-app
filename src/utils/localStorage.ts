export class LocalStorage {
  static update(key: string, value: string) {
    NativeModules.NativeLocalStorageModule.updateStorageItem(key, value);
  }
  static get(key: string) {
    return NativeModules.NativeLocalStorageModule.getStorageItem(key);
  }
  static clear() {
    NativeModules.NativeLocalStorageModule.clearStorage();
  }
  static set(key: string, value: string | string[]) {
    NativeModules.NativeLocalStorageModule.setStorageItem(key, value);
  }
}
