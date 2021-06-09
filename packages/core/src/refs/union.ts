import { OutputRef, outputShapeKey, parentShapeKey } from '../types';
import BaseTypeRef from './base';

export default class UnionRef<T, P = T> extends BaseTypeRef implements OutputRef {
  kind = 'Union' as const;

  [outputShapeKey]: T;
  [parentShapeKey]: P;

  constructor(name: string) {
    super('Union', name);
  }
}
