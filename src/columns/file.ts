import * as z from "zod";
import { type ColumnParams } from "..";
import { Column } from "../Colum";

type XFile = { name: string; url: string; size: number; type: string };

export type ColumnFileOptions = Omit<
  ColumnParams,
  "sortable" | "filterable" | "searchable"
> & {
  type: "file";
  maxSize?: number;
  accepts?: string[];
};

export type ColumnFilesOptions = Omit<ColumnFileOptions, "type"> & {
  type: "files";
};

export type ColumnAvatarOptions = Omit<
  ColumnFileOptions,
  "accepts" | "type"
> & {
  type: "avatar";
};

export class ColumnFile extends Column<XFile, File> {
  constructor(options: ColumnFileOptions) {
    const validator = z
      .custom<XFile>()
      .refine((file) =>
        options.accepts ? options.accepts.includes(file?.type) : true
      )
      .refine((file) =>
        options.maxSize ? file?.size <= options.maxSize : true
      );

    super({
      ...options,
      validator,
      sortable: false,
      filterable: false,
      searchable: false,
    });
  }
}

export class ColumnFiles extends Column<XFile[], File> {
  constructor(options: ColumnFilesOptions) {
    const validator = z
      .any()
      .refine((file) =>
        options.accepts ? options.accepts.includes(file?.type) : true
      )
      .refine((file) =>
        options.maxSize ? file?.size <= options.maxSize : true
      )
      .array();

    super({
      ...options,
      validator,
      sortable: false,
      filterable: false,
      searchable: false,
      type: "files" as "file",
    });
  }
}

export class ColumnAvatar extends ColumnFile {
  constructor(options: ColumnAvatarOptions) {
    super({
      ...options,
      accepts: ["image/png", "image/jpeg", "image/webp"],
      type: "avatar" as "file",
    });
  }
}

export function createColumnFile(options: ColumnFileOptions) {
  return new ColumnFile(options);
}

export function createColumnFiles(options: ColumnFilesOptions) {
  return new ColumnFiles(options);
}

export function createColumnAvatar(options: ColumnAvatarOptions) {
  return new ColumnAvatar(options);
}
