import * as z from "zod";
import { type ColumnParams } from "..";
import { Column } from "../Colum";

export type ColumnSelectOptions = ColumnParams & {
  type: "select";
  enum: { value: string | boolean | number; label: string }[];
};

export type ColumnSelectMultipleOptions = ColumnParams & {
  type: "selectmultiple";
  enum: { value: string | boolean | number; label: string }[];
};

export class ColumnSelect extends Column<
  string | boolean | number,
  string | boolean | number
> {
  constructor(options: ColumnSelectOptions) {
    const v = z.union([z.string(), z.boolean(), z.number()]).refine((v) => {
      return options.enum.map((e) => e.value).includes(v);
    });

    super({ ...options, validator: v });
  }
}

export class ColumnSelectMultiple extends Column<
  (string | boolean | number)[],
  (string | boolean | number)[]
> {
  constructor(options: ColumnSelectMultipleOptions) {
    const v = z
      .union([z.string(), z.boolean(), z.number()])
      .refine((v) => {
        return options.enum.map((e) => e.value).includes(v);
      })
      .array();

    super({ ...options, validator: v });
  }
}

export function createColumnSelect(options: ColumnSelectOptions) {
  return new ColumnSelect(options);
}

export function createColumnSelectMultiple(
  options: ColumnSelectMultipleOptions
) {
  return new ColumnSelectMultiple(options);
}
