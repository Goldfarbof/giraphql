import {
  TypeParam,
  InputFields,
  FieldNullability,
  FieldOptionsFromKind,
  FieldKind,
  SchemaTypes,
} from '../types';
import Field from '../graphql/field';
import BaseFieldUtil from './base';
import InputFieldBuilder from './input';

export default class RootFieldBuilder<
  Types extends SchemaTypes,
  ParentShape,
  Kind extends FieldKind = FieldKind
> extends BaseFieldUtil<Types, ParentShape> {
  arg: InputFieldBuilder<Types> & InputFieldBuilder<Types>['type'] = new InputFieldBuilder<
    Types
  >().callableBuilder();

  boolean<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<'Boolean'> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        'Boolean',
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, 'Boolean', Nullable>({
      ...options,
      type: 'Boolean',
    });
  }

  float<
    Args extends InputFields<Types>,
    Nullable extends FieldNullability<'Float'>,
    ResolveShape,
    ResolveReturnShape
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        'Float',
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, 'Float', Nullable>({
      ...options,
      type: 'Float',
    });
  }

  id<
    Args extends InputFields<Types>,
    Nullable extends FieldNullability<'ID'>,
    ResolveShape,
    ResolveReturnShape
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        'ID',
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, 'ID', Nullable>({ ...options, type: 'ID' });
  }

  int<
    Args extends InputFields<Types>,
    Nullable extends FieldNullability<'Int'>,
    ResolveShape,
    ResolveReturnShape
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        'Int',
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, 'Int', Nullable>({ ...options, type: 'Int' });
  }

  string<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<'String'> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        'String',
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, 'String', Nullable>({
      ...options,
      type: 'String',
    });
  }

  booleanList<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<['Boolean']> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        ['Boolean'],
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, ['Boolean'], Nullable>({ ...options, type: ['Boolean'] });
  }

  floatList<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<['Float']> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        ['Float'],
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, ['Float'], Nullable>({ ...options, type: ['Float'] });
  }

  idList<
    Args extends InputFields<Types>,
    Nullable extends FieldNullability<['ID']>,
    ResolveShape,
    ResolveReturnShape
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        ['ID'],
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, ['ID'], Nullable>({ ...options, type: ['ID'] });
  }

  intList<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<['Int']> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        ['Int'],
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, ['Int'], Nullable>({ ...options, type: ['Int'] });
  }

  stringList<
    Args extends InputFields<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<['String']> = false
  >(
    options: Omit<
      FieldOptionsFromKind<
        Types,
        ParentShape,
        ['String'],
        Nullable,
        Args,
        Kind,
        ResolveShape,
        ResolveReturnShape
      >,
      'type'
    >,
  ): Field {
    return this.createField<Args, ['String'], Nullable>({ ...options, type: ['String'] });
  }

  field<
    Args extends InputFields<Types>,
    Type extends TypeParam<Types>,
    ResolveShape,
    ResolveReturnShape,
    Nullable extends FieldNullability<Type> = false
  >(
    options: FieldOptionsFromKind<
      Types,
      ParentShape,
      Type,
      Nullable,
      Args,
      Kind,
      ResolveShape,
      ResolveReturnShape
    >,
  ): Field {
    return this.createField(options as GiraphQLSchemaTypes.FieldOptions);
  }
}
