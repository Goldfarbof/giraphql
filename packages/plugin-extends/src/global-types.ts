/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CompatibleInterfaceNames,
  ShapeFromTypeParam,
  InterfaceType,
  FieldsShape,
  ObjectName,
} from '@giraphql/core';

declare global {
  export namespace GiraphQLSchemaTypes {
    export interface ObjectTypeOptions<
      Shape extends {},
      Interfaces extends InterfaceType<
        {},
        Types,
        CompatibleInterfaceNames<Types, ShapeFromTypeParam<Types, Type, false>>
      >[],
      Types extends TypeInfo,
      Type extends ObjectName<Types>
    > {
      extends?: {
        [K in ObjectName<Types>]?: FieldsShape<{ [s: string]: unknown }, Types, K, {}>;
      };
    }
  }
}
