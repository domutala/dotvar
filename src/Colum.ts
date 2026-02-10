import * as z from "zod";
import type { ColumnOptions } from ".";

export class Column<Output, Input> {
  type: string;
  key: string;

  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  optional?: boolean;
  nullable?: boolean;

  private _validator: z.ZodType<Output>;

  submit: (value: Input) => Promise<Output> = async (value) => {
    return value as any as Output;
  };

  outputTransform: (v: any) => Output | undefined = (value) => {
    return value as any as Output;
  };

  constructor({
    type,
    key,

    sortable,
    searchable,
    filterable,
    optional,
    nullable,

    validator,
    submit,
    outputTransform,
  }: ColumnOptions<Output, Input>) {
    this.type = type;
    this.key = key;

    this.sortable = sortable ?? true;
    this.searchable = searchable ?? true;
    this.filterable = filterable ?? true;

    this.optional = optional;
    this.nullable = nullable;

    this._validator = validator;

    this.submit = submit ?? this.submit;
    this.outputTransform = outputTransform ?? this.outputTransform;
  }

  set validator(validator: z.ZodType<Output>) {
    this._validator = validator;
  }
  get validator() {
    let schema = this._validator;

    if (this.optional) schema = schema.optional() as any;
    if (this.nullable) schema = schema.nullable() as any;

    return schema as z.ZodType<Output>;
  }

  async inputValidate(v: any) {
    if (this.optional) this.validator.optional();
    if (this.nullable) this.validator.nullable();

    const parsedData = await this.validator.safeParseAsync(v);

    return parsedData;
  }
}
