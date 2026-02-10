import * as z from "zod";

import { type ColumnParams } from "..";
import { Column } from "../Colum";

export type ColumnParagraphOptions = ColumnParams & {
  type: "text";
  regex?: "email" | "url";
  min?: number;
  max?: number;
  length?: number;
};

export class ColumnParagraph extends Column<string, string> {
  constructor(options: ColumnParagraphOptions) {
    let v = z.string();

    if (typeof options.min === "number") v = v.min(options.min);
    if (typeof options.max === "number") v = v.max(options.max);

    super({ ...options, validator: v });
  }
}

export function createColumnParagraph(options: ColumnParagraphOptions) {
  return new ColumnParagraph({ ...options });
}
