import { isAssigning } from '../../utils/withoutAssigning';

export function apply(): typeof Reflect | undefined {
  if (isAssigning()) return Reflect;
  return undefined;
}
