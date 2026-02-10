import * as z from "zod";

import { type ColumnParams } from "..";
import { Column } from "../Colum";
import dayjs from "dayjs";

export type ColumnDateOptions = ColumnParams & {
  type: "date";
  withTime?: boolean;
  min?: string | number | Date;
  max?: string | number | Date;
};

export class ColumnDate extends Column<Date, string> {
  constructor(options: ColumnDateOptions) {
    let v = z.date();

    if (options.min) v = v.min(dayjs(options.min).toDate());
    if (options.max) v = v.max(dayjs(options.max).toDate());

    super({
      ...options,
      validator: v,

      outputTransform(v) {
        if (v && z.date(v).safeParse(v)) return new Date(v);
        return;
      },
    });
  }
}

export function createColumnDate(options: ColumnDateOptions) {
  return new ColumnDate({ ...options });
}

export type ColumnDateintervalOptions = Omit<ColumnDateOptions, "type"> & {
  type: "dateinterval";
};

export class ColumnDateinterval extends Column<
  { start: Date; end: Date },
  { start: string; end: string }
> {
  constructor(options: ColumnDateintervalOptions) {
    let v = z.object({ start: z.date(), end: z.date() }).refine((dates) => {
      if (dayjs(dates.start).isAfter(dates.end)) return false;

      if (options.min && dayjs(dates.start).isBefore(options.min)) return false;
      if (options.max && dayjs(dates.end).isAfter(options.max)) return false;

      return true;
    });

    super({
      ...options,
      validator: v,

      outputTransform(dates) {
        if (dates && Object.values(dates).length === 2) {
          if (!Object.keys(dates).every((v) => dayjs(v).isValid() === true)) {
            return;
          }

          return {
            start: dayjs(dates.start).toDate(),
            end: dayjs(dates.end).toDate(),
          };
        }

        return;
      },
    });
  }
}

export function createColumnDateinterval(options: ColumnDateintervalOptions) {
  return new ColumnDateinterval(options);
}
