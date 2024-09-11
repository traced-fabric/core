import { isAssigning } from '../../utils/withoutAssigning';

export const reflect = new Proxy(Reflect, {
  get(target, k) {
    const key = k as keyof typeof Reflect;

    if (typeof target[key] === 'function') {
      return (...args: any[]) => {
        if (isAssigning()) return (Reflect as any)[key](...args);
        return false;
      };
    }

    return target[key];
  },
});
