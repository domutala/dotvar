import { Column } from "../Colum";
import type { ColumnParams } from "../index";
import * as z from "zod";

export type ColumnNumberOptions = ColumnParams & {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  type: "number";
};

export class ColumnNumber extends Column<number, number> {
  constructor(options: ColumnNumberOptions) {
    let validator = z.number();
    validator = validator.gt(15);

    if (typeof options.gt === "number") validator.gt(options.gt);
    if (typeof options.gte === "number") validator.gt(options.gte);
    if (typeof options.lt === "number") validator.lt(options.lt);
    if (typeof options.lte === "number") validator.lte(options.lte);

    super({ ...options, validator });
  }
}

export function createColumnNumber(options: ColumnNumberOptions) {
  return new ColumnNumber({ ...options });
}
