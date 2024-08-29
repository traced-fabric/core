import type { JSONStructure } from '../types/json';
import type { TMutationCallback } from '../types/mutation';

export const mutationCallbacks = new WeakMap<JSONStructure, TMutationCallback>();
