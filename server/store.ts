import { EventEmitter } from 'events';
import * as fse from 'fs-extra';
import { objectToMap, mapToObject } from "./util";

export interface StoreOptions {
  /** Path to JSON file to store data in. */
  path: string;
  /** Whether to write to disk every time `store.set()` is called. */
  writeOnSet?: boolean;
}

export class Store<T> {
  public events: EventEmitter;
  private map: Map<string, T>;
  public path: string;

  constructor({ path, writeOnSet }: StoreOptions) {
    this.events = new EventEmitter();
    this.path = path;
    this.map = this.readFile();
    if (writeOnSet) {
      this.events.addListener('set', () => {
        this.writeFile();
      });
    }
  }
  /** Read the contents of `userStore.path`
   * and interpret as `Map`; if it throws an error,
   * will return an empty map instead. */
  readFile() {
    try {
      const raw = (fse.readFileSync(this.path) as unknown) as string;
      const data: object = JSON.parse(raw);
      return objectToMap(data) as Map<string, T>;
    } catch (err) {
      return new Map<string, T>();
    }
  }
  /** Delete all users from the map.
   * Emits `clear` once writing is complete. */
  async clear() {
    this.map.clear();
    await this.writeFile();
    this.events.emit('clear');
  }
  /** Write the current contents to disk.
   * Emits `write` after complete. */
  async writeFile() {
    await fse.writeFile(this.path, JSON.stringify(mapToObject(this.map)));
    this.events.emit('write');
  }
  /** Set the value for a given key.
   * Emits `set` after setting is complete. */
  set(key: string, value: T) {
    this.map.set(key, value);
    this.events.emit('set');
  }
  /** Only set the value if it doesn't exist. */
  setIfUnset(key: string, value: T) {
    if (this.has(key)) return;
    this.set(key, value);
  }
  /** Retrieve the value for a given key.
   * Emits `get`. */
  get(key: string) {
    this.events.emit('get');
    return this.map.get(key);
  }
  /** Returns an iterable of duples in the format [key, value]. */
  get entries() {
    return this.map.entries;
  }
  /** Returns an array of all keys stored. */
  get keys() {
    return this.map.keys;
  }
  /** Check if a key exists in the map. */
  has(key: string) {
    return this.map.has(key);
  }
}
