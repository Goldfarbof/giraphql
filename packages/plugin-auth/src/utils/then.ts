import { types } from 'util';

export default class ValueOrPromise<T> {
  private valueOrPromise: T | Promise<T>;

  constructor(valueOrPromise: ValueOrPromise<T> | Promise<T> | T) {
    if (valueOrPromise instanceof ValueOrPromise) {
      this.valueOrPromise = valueOrPromise.toValueOrPromise();
    } else {
      this.valueOrPromise = valueOrPromise;
    }
  }

  static all<T>(values: (ValueOrPromise<T> | Promise<T> | T)[]): ValueOrPromise<T[]> {
    let hasPromise = false;

    const list = values.map((value) => {
      const unwrapped = ValueOrPromise.unwrap(value);

      if (types.isPromise(unwrapped)) {
        hasPromise = true;

        return (unwrapped as Promise<T>).then((result) => ValueOrPromise.unwrap(result));
      }

      return unwrapped;
    });

    return new ValueOrPromise(hasPromise ? Promise.all(list) : (list as T[]));
  }

  static unwrap<T>(value: ValueOrPromise<T> | T) {
    return value instanceof ValueOrPromise ? value.toValueOrPromise() : value;
  }

  nowOrThen<U>(cb: (val: T) => ValueOrPromise<U> | Promise<U> | U): ValueOrPromise<U> {
    if (types.isPromise(this.valueOrPromise)) {
      return new ValueOrPromise<U>(
        this.valueOrPromise.then((value) => {
          // eslint-disable-next-line promise/no-callback-in-promise
          const next = cb(value);

          return next instanceof ValueOrPromise ? next.toValueOrPromise() : next;
        }),
      );
    }

    return new ValueOrPromise(cb(this.valueOrPromise));
  }

  toValueOrPromise() {
    return this.valueOrPromise;
  }
}
