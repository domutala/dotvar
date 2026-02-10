import z from "zod";

import { type ColumnParams } from "..";
import { Column } from "../Colum";

export type ColumnTextOptions = ColumnParams & {
  type: "text";
  regex?: "email" | "url";
  min?: number;
  max?: number;
  length?: number;
};

export class ColumnText extends Column<string, string> {
  constructor(options: ColumnTextOptions) {
    let v = z.string();
    if (options.regex === "email") v = z.email() as any;
    else if (options.regex === "url") v = z.url() as any;
    else {
      if (typeof options.min === "number") v = v.min(options.min);
      if (typeof options.max === "number") v = v.max(options.max);
      if (typeof options.length === "number") v = v.length(options.length);
    }

    super({ ...options, validator: v });
  }
}

export function createColumnText(options: ColumnTextOptions) {
  return new ColumnText({ ...options });
}
