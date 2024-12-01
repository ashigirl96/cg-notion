declare global {
  interface Array<T> {
    last(): T | undefined
  }
}

// @ts-ignore
if (!Array.prototype.last) {
  // @ts-ignore
  Array.prototype.last = function <T>(): T | undefined {
    return this.length > 0 ? this[this.length - 1] : undefined
  }
}

export {}
