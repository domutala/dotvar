import * as z from "zod";
import type { Column } from "./Colum";

import {
  // text
  createColumnText,
  type ColumnTextOptions,

  // paragraph
  createColumnParagraph,
  type ColumnParagraphOptions,

  // date
  createColumnDate,
  createColumnDateinterval,
  type ColumnDateintervalOptions,
  type ColumnDateOptions,

  // file
  createColumnAvatar,
  createColumnFile,
  createColumnFiles,
  type ColumnAvatarOptions,
  type ColumnFileOptions,
  type ColumnFilesOptions,

  // number
  createColumnNumber,
  type ColumnNumberOptions,
  type ColumnTimeOptions,
  type ColumnTimeintervalOptions,

  // time
  createColumnTime,
  createColumnTimeinterval,
  type ColumnSelectOptions,
  createColumnSelect,
  createColumnSelectMultiple,
  type ColumnSelectMultipleOptions,
} from "./columns";

export type ColumnParams = {
  key: string;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  optional?: boolean;
  nullable?: boolean;
};

export type ColumnOptions<
  // le type à modifier dans le formulaire
  Input,
  /** le type que sera enregistrer dans la base de donné */
  DBType
> = ColumnParams & {
  type: string;

  /** Validateur de la donnée d'entrée */
  validator: z.ZodType<Input>;

  /**
   * La fonction qui envoie la donné au serveur
   * pour enregistrement dans la base dennées.
   */
  submit?: (value: DBType) => Promise<Input>;

  /** Transforme la donnée enregistrée dans la base en donnée de sortie */
  outputTransform?: (v?: DBType) => Input | undefined;
};

export type ModelOptions = {
  version: number;
  code: string;
  columns: Array<
    | ColumnTextOptions
    | ColumnNumberOptions
    | ColumnFileOptions
    | ColumnFilesOptions
    | ColumnAvatarOptions
    | ColumnParagraphOptions
    | ColumnDateOptions
    | ColumnDateintervalOptions
    | ColumnTimeOptions
    | ColumnTimeintervalOptions
    | ColumnSelectOptions
    | ColumnSelectMultipleOptions
  >;
};

const columns = {
  text: createColumnText,
  paragraph: createColumnParagraph,

  number: createColumnNumber,

  file: createColumnFile,
  files: createColumnFiles,
  avatar: createColumnAvatar,

  date: createColumnDate,
  dateinterval: createColumnDateinterval,
  time: createColumnTime,
  timeinterval: createColumnTimeinterval,

  select: createColumnSelect,
  selectmultiple: createColumnSelectMultiple,
};

export function createModel<const T extends ModelOptions>(options: T) {
  type Keys = T["columns"][number]["key"];

  const cols = options.columns.map((c) => columns[c.type](c as any));

  type _Input<T extends ModelOptions> = {
    [K in T["columns"][number]["key"]]: ReturnType<
      (typeof columns)[T["columns"][number]["type"]]
    > extends Column<infer O, any>
      ? O
      : never;
  };

  const output: Partial<_Input<ModelOptions>> = {};

  type ColumnValidator<T> = T extends Column<infer O, any>
    ? z.ZodType<O>
    : never;

  type ValidatorsFromColumns<T extends readonly Column<any, any>[]> = {
    [C in T[number] as C["key"]]: ColumnValidator<C>;
  };

  const validators = cols.reduce(
    (a, v) => ({ ...a, [v.key]: v.validator }),
    {}
  ) as ValidatorsFromColumns<typeof cols>;

  function getColumnIndexByKey(key: Keys) {
    return options.columns.findIndex((c) => c.type === key);
  }

  return {
    options,
    validators,
    output,
    columns: cols,
    getColumnIndexByKey,
  };
}

//   | "checkbox"
//   | "rating"
//   | "choice"
//   | "logo"
//   | "phone"
//   | "country"
//   | "audio"
//   | "color"
//   | "signature"
