import { GraphQLSchema } from 'graphql';
import {
  SchemaTypes,
  GiraphQLOutputFieldConfig,
  GiraphQLTypeConfig,
  GiraphQLInputFieldConfig,
} from '../types';
import BaseFieldWrapper from './field-wrapper';

export class BasePlugin<Types extends SchemaTypes> {
  name!: keyof GiraphQLSchemaTypes.Plugins<Types>;

  builder: GiraphQLSchemaTypes.SchemaBuilder<Types>;

  constructor(builder: GiraphQLSchemaTypes.SchemaBuilder<Types>) {
    this.builder = builder;
  }

  onTypeConfig(typeConfig: GiraphQLTypeConfig) {}

  onOutputFieldConfig(fieldConfig: GiraphQLOutputFieldConfig<Types>) {}

  onInputFieldConfig(fieldConfig: GiraphQLInputFieldConfig<Types>) {}

  beforeBuild() {}

  afterBuild(schema: GraphQLSchema) {}

  wrapOutputField(
    fieldConfig: GiraphQLOutputFieldConfig<Types>,
  ): BaseFieldWrapper<Types> | BaseFieldWrapper<Types>[] | null {
    return null;
  }
}
