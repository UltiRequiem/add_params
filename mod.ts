/**
 * This module is browser compatible.
 *
 * ultraqs — the safest way to build URLs in TypeScript.
 *
 * https://github.com/UltiRequiem/ultraqs
 *
 * https://ulti.js.org/ultraqs
 *
 * Copyright (c) Eliaz Bobadilla.
 *
 * Released under the MIT License.
 *
 * @module
 */

export { addParams } from "./src/add-params.ts";
export { removeParams } from "./src/remove-params.ts";
export { mergeParams } from "./src/merge-params.ts";
export { parse } from "./src/parse.ts";
export { stringify } from "./src/stringify.ts";
export { query } from "./src/query-builder.ts";
export type { QueryBuilder } from "./src/query-builder.ts";
export { build } from "./src/template.ts";
export { t, validateParams } from "./src/schema.ts";
export type {
  InferSchema,
  Parseable,
  Schema,
  SchemaMap,
} from "./src/schema.ts";
export type {
  ArrayStrategy,
  MergeStrategy,
  NestedStrategy,
  SerializeOptions,
} from "./src/types.ts";
