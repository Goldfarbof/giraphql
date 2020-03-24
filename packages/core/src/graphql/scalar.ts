import { GraphQLScalarType } from 'graphql';
import { BaseInputType } from '..';

export default class ScalarType<InputShape, OutputShape> extends BaseInputType<
  OutputShape,
  InputShape
> {
  kind: 'Scalar' = 'Scalar';

  options: GiraphQLSchemaTypes.ScalarOptions<unknown, unknown>;

  constructor(name: string, options: GiraphQLSchemaTypes.ScalarOptions<InputShape, OutputShape>) {
    super(name);

    this.options = options;
  }

  buildType() {
    return new GraphQLScalarType({
      name: this.options.name,
      description: this.options.description,
      serialize: this.options.serialize,
      parseLiteral: this.options.parseLiteral,
      parseValue: this.options.parseValue,
      extensions: this.options.extensions,
    });
  }
}
