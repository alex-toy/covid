import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private ls = window.localStorage;

  constructor() { }

  public setItem(key: string, value) {
    value = JSON.stringify(value);
    this.ls.setItem(key, value);
    return true;
  }

  public getItem(key: string) {
    const value = this.ls.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  public clear() {
    this.ls.clear();
  }

  /**
   * Removes the key/value pair with the given key from the list associated with the object, 
   * if a key/value pair with the given key exists.
   */
  public removeItem(key: string) {
    this.ls.removeItem(key);
  }
}
