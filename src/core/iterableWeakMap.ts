/**
 * @source [tc39 / proposal weakrefs](https://github.com/tc39/proposal-weakrefs?tab=readme-ov-file#iterable-weakmaps)
 */
export default class IterableWeakMap<
  _KEY extends object,
  _VALUE extends object,
> {
  #weakKeySet = new Set<WeakRef<_KEY>>();
  #weakMap = new WeakMap<
    _KEY,
    { value: _VALUE; weakKey: WeakRef<_KEY> }
  >();

  #cleanupRegistry = new FinalizationRegistry((weakRef: WeakRef<_KEY>) => this.#weakKeySet.delete(weakRef));

  set(key: _KEY, value: _VALUE): this {
    const entry = this.#weakMap.get(key);

    if (entry) {
      entry.value = value;
      return this;
    }

    const weakKey = new WeakRef(key);

    this.#weakMap.set(key, { value, weakKey });
    this.#weakKeySet.add(weakKey);
    this.#cleanupRegistry.register(key, weakKey, weakKey);

    return this;
  }

  get(key: _KEY): _VALUE | undefined {
    return this.#weakMap.get(key)?.value;
  }

  has(key: _KEY): boolean {
    return this.#weakMap.has(key);
  }

  delete(key: _KEY): boolean {
    const entry = this.#weakMap.get(key);
    if (!entry) return false;

    this.#weakMap.delete(key);
    this.#weakKeySet.delete(entry.weakKey);
    this.#cleanupRegistry.unregister(entry.weakKey);

    return true;
  }

  *[Symbol.iterator](): IterableIterator<[key: _KEY, value: _VALUE]> {
    for (const ref of this.#weakKeySet) {
      const key = ref.deref();
      if (!key) continue;

      const mapValue = this.#weakMap.get(key);
      if (!mapValue) continue;

      yield [key, mapValue.value];
    }
  }

  entries(): IterableIterator<[key: _KEY, value: _VALUE]> {
    return this[Symbol.iterator]();
  }
}
