/**
 * @source [tc39 / proposal weakrefs](https://github.com/tc39/proposal-weakrefs?tab=readme-ov-file#iterable-weakmaps)
 */
export default class IterableWeakMap<
  _KEY extends object,
  _VALUE extends object,
> {
  #weakMap = new WeakMap<_KEY, { value: _VALUE; ref: WeakRef<_KEY> }>();
  #refSet = new Set<WeakRef<_KEY>>();
  #finalizationGroup = new FinalizationRegistry(IterableWeakMap.#cleanup);

  static #cleanup({ refSet, weakRef }: {
    refSet: Set<WeakRef<object>>;
    weakRef: WeakRef<object>;
  }): void {
    refSet.delete(weakRef);
  }

  set(key: _KEY, value: _VALUE): this {
    const entry = this.#weakMap.get(key);

    if (entry) {
      entry.value = value;
      return this;
    }

    const weakRef = new WeakRef(key);

    this.#weakMap.set(key, { value, ref: weakRef });
    this.#refSet.add(weakRef);
    this.#finalizationGroup.register(key, { refSet: this.#refSet, weakRef }, weakRef);

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
    this.#refSet.delete(entry.ref);
    this.#finalizationGroup.unregister(entry.ref);

    return true;
  }

  *[Symbol.iterator](): IterableIterator<[key: _KEY, value: _VALUE]> {
    for (const ref of this.#refSet) {
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
