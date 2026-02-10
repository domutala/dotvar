import * as z from "zod";

import { type ColumnParams } from "..";
import { Column } from "../Colum";

export type ColumnTimeOptions = ColumnParams & {
  type: "time";
  withTime?: boolean;
  min?: string;
  max?: string;
};

const timeToSeconds = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h! * 3600 + m! * 60;
};

export class ColumnTime extends Column<string, string> {
  constructor(options: ColumnTimeOptions) {
    let v = z.iso.time();

    if (options.min) {
      const min = timeToSeconds(options.min);
      v = v.refine((value) => {
        const time = timeToSeconds(value);
        return time >= min;
      });
    }

    if (options.max) {
      const max = timeToSeconds(options.max);
      v = v.refine((value) => {
        const time = timeToSeconds(value);
        return time >= max;
      });
    }

    super({
      ...options,
      validator: v,
    });
  }
}

export function createColumnTime(options: ColumnTimeOptions) {
  return new ColumnTime({ ...options });
}

export type ColumnTimeintervalOptions = Omit<ColumnTimeOptions, "type"> & {
  type: "timeinterval";
};

export class ColumnTimeinterval extends Column<
  { start: string; end: string },
  { start: string; end: string }
> {
  constructor(options: ColumnTimeintervalOptions) {
    let v = z
      .object({
        start: z.iso.time(),
        end: z.iso.time(),
      })
      .refine((times) => {
        if (options.min) {
          const min = timeToSeconds(options.min);
          const time = timeToSeconds(times.start);
          if (time < min) return false;
        }

        if (options.max) {
          const max = timeToSeconds(options.max);
          const time = timeToSeconds(times.end);
          if (time > max) return false;
        }

        return true;
      });

    super({
      ...options,
      validator: v,
    });
  }
}

export function createColumnTimeinterval(options: ColumnTimeintervalOptions) {
  return new ColumnTimeinterval(options);
}
