import { StoreEntry, NamedTypeParam } from './types';
import InterfaceType from './interface';

export default class TypeStore<
  Types extends SpiderSchemaTypes.TypeInfo,
  Key = string | keyof Types['Input'] | keyof Types['Output']
> {
  types = new Map<Key, StoreEntry<Types>>();

  has(name: Key) {
    return this.types.has(name);
  }

  set(name: Key, entry: StoreEntry<Types>) {
    return this.types.set(name, entry);
  }

  getBuilt(name: Key) {
    const entry = this.getEntry(name);

    if (entry.kind === 'InputObject') {
      throw new Error(`${name} is of type ${entry.type}, expected valid output type`);
    }

    return entry.built;
  }

  getBuiltInput(name: Key) {
    const entry = this.getEntry(name);

    if (entry.kind === 'Object' || entry.kind === 'Interface' || entry.kind === 'Union') {
      throw new Error(`${name} is of type ${entry.type}, expected valid input type`);
    }

    return entry.built;
  }

  getType(name: Key) {
    return this.getEntry(name).type;
  }

  getBuiltObject(name: Key) {
    const entry = this.getEntryOfType(name, 'Object');

    return entry.built;
  }

  getImplementers(type: InterfaceType<{}, Types, NamedTypeParam<Types>>) {
    const implementers = [];
    for (const entry of this.types.values()) {
      if (entry.kind === 'Object' && (entry.type.interfaces as unknown[]).includes(type)) {
        implementers.push(entry.type);
      }
    }

    return implementers;
  }

  getEntryOfType<Type extends StoreEntry<Types>['kind']>(
    name: Key,
    type: Type,
  ): Extract<StoreEntry<Types>, { kind: Type }> {
    const entry = this.getEntry(name);

    if (entry.kind !== type) {
      throw new Error(`Found ${name} of kind ${entry.type.kind}, expected ${type}`);
    }

    return entry as Extract<StoreEntry<Types>, { kind: Type }>;
  }

  getEntry(name: Key): StoreEntry<Types> {
    if (!this.types.has(name)) {
      throw new Error(`${name} not found in type store`);
    }

    return this.types.get(name)!;
  }
}
