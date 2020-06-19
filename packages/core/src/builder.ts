import {
  GraphQLScalarType,
  GraphQLDirective,
  GraphQLSchema,
  GraphQLIsTypeOfFn,
  GraphQLObjectType,
  GraphQLTypeResolver,
} from 'graphql';

import {
  EnumValues,
  ObjectFieldsShape,
  QueryFieldsShape,
  MutationFieldsShape,
  SubscriptionFieldsShape,
  InterfaceFieldsShape,
  ObjectFieldThunk,
  InterfaceFieldThunk,
  QueryFieldThunk,
  MutationFieldThunk,
  SubscriptionFieldThunk,
  SchemaTypes,
  OutputShape,
  InputShape,
  ObjectParam,
  InterfaceParam,
  ShapeFromEnumValues,
  ScalarName,
} from './types';
import BuildCache from './build-cache';
import {
  InputFieldBuilder,
  ObjectFieldBuilder,
  QueryFieldBuilder,
  MutationFieldBuilder,
  SubscriptionFieldBuilder,
  InterfaceFieldBuilder,
  InputShapeFromFields,
  ObjectTypeOptions,
  GiraphQLQueryTypeConfig,
  GiraphQLObjectTypeConfig,
  GiraphQLMutationTypeConfig,
  GiraphQLSubscriptionTypeConfig,
  GiraphQLInterfaceTypeConfig,
  GiraphQLUnionTypeConfig,
  GiraphQLEnumTypeConfig,
  GiraphQLScalarTypeConfig,
  ImplementableInputObjectRef,
  ResolverMap,
  InputObjectRef,
  GiraphQLInputObjectTypeConfig,
  InputFieldMap,
} from '.';
import { BasePlugin, mergePlugins } from './plugins';
import ConfigStore from './config-store';
import InterfaceRef, { ImplementableInterfaceRef } from './refs/interface';
import UnionRef from './refs/union';
import EnumRef from './refs/enum';
import ScalarRef from './refs/scalar';
import ObjectRef, { ImplementableObjectRef } from './refs/object';
import { normalizeEnumValues } from './utils';

export default class SchemaBuilder<Types extends SchemaTypes> {
  private plugin: Required<BasePlugin>;

  private configStore: ConfigStore<Types>;

  constructor(options: { plugins?: BasePlugin[] } = {}) {
    this.plugin = mergePlugins(options.plugins ?? []);
    this.configStore = new ConfigStore<Types>(this.plugin);
  }

  objectType<Interfaces extends InterfaceParam<Types>[], Param extends ObjectParam<Types>>(
    param: Param,
    options: ObjectTypeOptions<Types, OutputShape<Param, Types>, Interfaces>,
    shape?: ObjectFieldsShape<Types, OutputShape<Param, Types>>,
  ) {
    const name = typeof param === 'string' ? param : (param as { name: string }).name;

    if (name === 'Query' || name === 'Mutation' || name === 'Subscription') {
      throw new Error(`Invalid object name ${name} use .create${name}Type() instead`);
    }

    const ref: ObjectRef<OutputShape<Param, Types>> =
      param instanceof ObjectRef ? param : new ObjectRef<OutputShape<Param, Types>>(name);

    const config: GiraphQLObjectTypeConfig = {
      kind: 'Object',
      name,
      interfaces: (options.interfaces || []) as ObjectParam<SchemaTypes>[],
      description: options.description,
      isTypeOf: options.isType as GraphQLIsTypeOfFn<unknown, Types['context']>,
      giraphqlOptions: options as GiraphQLSchemaTypes.ObjectTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    if (shape) {
      this.configStore.buildFields(ref, shape(new ObjectFieldBuilder(name, this)));
    }

    if (options.fields) {
      this.configStore.buildFields(ref, options.fields!(new ObjectFieldBuilder(name, this)));
    }

    return ref;
  }

  objectFields<Type extends ObjectParam<Types>>(
    ref: Type,
    fields: ObjectFieldsShape<Types, OutputShape<Type, Types>>,
  ) {
    this.configStore.resolveRef(ref, ({ name }) => {
      this.configStore.buildFields(ref, fields(new ObjectFieldBuilder(name, this)));
    });
  }

  objectField<Type extends ObjectParam<Types>>(
    ref: Type,
    fieldName: string,
    field: ObjectFieldThunk<Types, OutputShape<Type, Types>>,
  ) {
    this.configStore.resolveRef(ref, ({ name }) => {
      this.configStore.buildFields(ref, {
        [fieldName]: field(new ObjectFieldBuilder(name, this)),
      });
    });
  }

  queryType(options: GiraphQLSchemaTypes.QueryTypeOptions<Types>, shape?: QueryFieldsShape<Types>) {
    const config: GiraphQLQueryTypeConfig = {
      kind: 'Query',
      name: 'Query',
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.QueryTypeOptions,
    };

    this.configStore.addTypeConfig(config);

    if (shape) {
      this.configStore.buildFields('Query', shape(new QueryFieldBuilder(this)));
    }

    if (options.fields) {
      this.configStore.buildFields('Query', options.fields!(new QueryFieldBuilder(this)));
    }
  }

  queryFields(fields: QueryFieldsShape<Types>) {
    this.configStore.buildFields('Query', fields(new QueryFieldBuilder(this)));
  }

  queryField(name: string, field: QueryFieldThunk<Types>) {
    this.configStore.buildFields('Query', { [name]: field(new QueryFieldBuilder(this)) });
  }

  mutationType(
    options: GiraphQLSchemaTypes.MutationTypeOptions<Types>,
    fields?: MutationFieldsShape<Types>,
  ) {
    const config: GiraphQLMutationTypeConfig = {
      kind: 'Mutation',
      name: 'Mutation',
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.MutationTypeOptions,
    };

    this.configStore.addTypeConfig(config);

    if (fields) {
      this.configStore.buildFields('Mutation', fields(new MutationFieldBuilder(this)));
    }

    if (options.fields) {
      this.configStore.buildFields('Mutation', options.fields!(new MutationFieldBuilder(this)));
    }
  }

  mutationFields(fields: MutationFieldsShape<Types>) {
    this.configStore.buildFields('Mutation', fields(new MutationFieldBuilder(this)));
  }

  mutationField(name: string, field: MutationFieldThunk<Types>) {
    this.configStore.buildFields('Mutation', {
      [name]: field(new MutationFieldBuilder(this)),
    });
  }

  subscriptionType(
    options: GiraphQLSchemaTypes.SubscriptionTypeOptions<Types>,
    fields?: SubscriptionFieldsShape<Types>,
  ) {
    const config: GiraphQLSubscriptionTypeConfig = {
      kind: 'Subscription',
      name: 'Subscription',
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.SubscriptionTypeOptions,
    };

    this.configStore.addTypeConfig(config);

    if (fields) {
      this.configStore.buildFields('Subscription', fields(new SubscriptionFieldBuilder(this)));
    }

    if (options.fields) {
      this.configStore.buildFields(
        'Subscription',
        options.fields!(new SubscriptionFieldBuilder(this)),
      );
    }
  }

  subscriptionFields(fields: SubscriptionFieldsShape<Types>) {
    this.configStore.buildFields('Subscription', fields(new SubscriptionFieldBuilder(this)));
  }

  subscriptionField(name: string, field: SubscriptionFieldThunk<Types>) {
    this.configStore.buildFields('Subscription', {
      [name]: field(new SubscriptionFieldBuilder(this)),
    });
  }

  args<Shape extends InputFieldMap>(
    fields: (t: GiraphQLSchemaTypes.InputFieldBuilder<Types>) => Shape,
  ): Shape {
    return fields(new InputFieldBuilder<Types>(this));
  }

  interfaceType<Param extends InterfaceParam<Types>>(
    param: Param,
    options: GiraphQLSchemaTypes.InterfaceTypeOptions<Types, OutputShape<Param, Types>>,
    fields?: InterfaceFieldsShape<Types, OutputShape<Param, Types>>,
  ) {
    const name = typeof param === 'string' ? param : (param as { name: string }).name;
    const ref: InterfaceRef<OutputShape<Param, Types>> =
      param instanceof InterfaceRef ? param : new InterfaceRef<OutputShape<Param, Types>>(name);

    const typename = ref.name;

    const config: GiraphQLInterfaceTypeConfig = {
      kind: 'Interface',
      name: typename,
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.InterfaceTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    if (fields) {
      this.configStore.buildFields(ref, fields(new InterfaceFieldBuilder(typename, this)));
    }

    if (options.fields) {
      this.configStore.buildFields(ref, options.fields!(new InterfaceFieldBuilder(typename, this)));
    }

    return ref;
  }

  interfaceFields<Type extends InterfaceParam<Types>>(
    ref: Type,
    fields: InterfaceFieldsShape<Types, OutputShape<Type, Types>>,
  ) {
    this.configStore.resolveRef(ref, ({ name }) => {
      this.configStore.buildFields(ref, fields(new InterfaceFieldBuilder(name, this)));
    });
  }

  interfaceField<Type extends InterfaceParam<Types>>(
    ref: Type,
    fieldName: string,
    field: InterfaceFieldThunk<Types, OutputShape<Type, Types>>,
  ) {
    this.configStore.resolveRef(ref, ({ name }) => {
      this.configStore.buildFields(ref, {
        [fieldName]: field(new InterfaceFieldBuilder(name, this)),
      });
    });
  }

  unionType<Member extends ObjectParam<Types>>(
    name: string,
    options: GiraphQLSchemaTypes.UnionTypeOptions<Types, Member>,
  ) {
    const ref = new UnionRef<OutputShape<Member, Types>>(name);

    const config: GiraphQLUnionTypeConfig = {
      kind: 'Union',
      name,
      types: (options.types || []) as ObjectParam<SchemaTypes>[],
      description: options.description,
      resolveType: options.resolveType as GraphQLTypeResolver<unknown, object>,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.UnionTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    return ref;
  }

  enumType<Name extends string, Values extends EnumValues>(
    name: Name,
    options: GiraphQLSchemaTypes.EnumTypeOptions<Values>,
  ) {
    const ref = new EnumRef<ShapeFromEnumValues<Values>>(name);

    const values = normalizeEnumValues(options);

    const config: GiraphQLEnumTypeConfig = {
      kind: 'Enum',
      name,
      values,
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.EnumTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    return ref;
  }

  scalarType<Name extends ScalarName<Types>>(
    name: Name,
    options: GiraphQLSchemaTypes.ScalarTypeOptions<
      InputShape<Name, Types>,
      OutputShape<Name, Types>
    >,
  ) {
    const ref = new ScalarRef<InputShape<Name, Types>, OutputShape<Name, Types>>(name);

    const config: GiraphQLScalarTypeConfig = {
      kind: 'Scalar',
      name,
      description: options.description,
      parseLiteral: options.parseLiteral,
      parseValue: options.parseValue,
      serialize: options.serialize,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.ScalarTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    return ref;
  }

  addScalarType<Name extends ScalarName<Types>>(
    name: Name,
    scalar: GraphQLScalarType,
    options: Omit<
      GiraphQLSchemaTypes.ScalarTypeOptions<InputShape<Name, Types>, OutputShape<Name, Types>>,
      'description' | 'parseLiteral' | 'parseValue' | 'serialize'
    >,
  ) {
    const config = scalar.toConfig();

    return this.scalarType<Name>(name, {
      ...config,
      ...options,
    } as GiraphQLSchemaTypes.ScalarTypeOptions<InputShape<Name, Types>, OutputShape<Name, Types>>);
  }

  inputType<Param extends string | InputObjectRef<unknown>, Fields extends InputFieldMap>(
    param: Param,
    options: GiraphQLSchemaTypes.InputObjectTypeOptions<Types, Fields>,
  ): InputObjectRef<InputShapeFromFields<Fields>> {
    const name = typeof param === 'string' ? param : (param as { name: string }).name;

    const ref: InputObjectRef<InputShapeFromFields<Fields>> =
      param instanceof InputObjectRef
        ? param
        : new InputObjectRef<InputShapeFromFields<Fields>>(name);

    const config: GiraphQLInputObjectTypeConfig = {
      kind: 'InputObject',
      name,
      description: options.description,
      giraphqlOptions: (options as unknown) as GiraphQLSchemaTypes.InputObjectTypeOptions,
    };

    this.configStore.addTypeConfig(config, ref);

    this.configStore.buildInputFields(ref, options.fields(new InputFieldBuilder(this)));

    return ref;
  }

  inputRef<T extends object>(name: string): ImplementableInputObjectRef<Types, T> {
    return new ImplementableInputObjectRef<Types, T>(this, name);
  }

  objectRef<T>(name: string): ImplementableObjectRef<Types, T> {
    return new ImplementableObjectRef<Types, T>(this, name);
  }

  interfaceRef<T>(name: string): ImplementableInterfaceRef<Types, T> {
    return new ImplementableInterfaceRef<Types, T>(this, name);
  }

  toSchema({
    directives,
    extensions,
    mocks,
  }: {
    directives?: readonly GraphQLDirective[];
    extensions?: Record<string, unknown>;
    mocks?: ResolverMap;
  } = {}) {
    this.configStore.prepareForBuild();

    this.plugin.beforeBuild(this);

    const buildCache = new BuildCache(this.configStore, this.plugin, {
      mocks,
    });

    buildCache.buildAll();

    const builtTypes = [...buildCache.types.values()];

    const schema = new GraphQLSchema({
      query: buildCache.types.get('Query') as GraphQLObjectType | undefined,
      mutation: buildCache.types.get('Mutation') as GraphQLObjectType | undefined,
      subscription: buildCache.types.get('Subscription') as GraphQLObjectType | undefined,
      extensions,
      directives: directives as GraphQLDirective[],
      types: builtTypes,
    });

    this.plugin.afterBuild(schema, this);

    return schema;
  }
}
