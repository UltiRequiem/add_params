/**
 * Anything with a `.parse(value: unknown): T` method satisfies this — which
 * is exactly the shape of a real Zod (or Valibot) schema too, so a genuine
 * `z.string()` / `z.coerce.number()` can be passed anywhere a `SchemaMap` is
 * expected with zero dependency on Zod itself (structural duck-typing, not
 * an integration shim).
 *
 * Since query values arrive as strings, prefer `z.coerce.number()` /
 * `z.coerce.boolean()` over `z.number()` / `z.boolean()` when mixing in a
 * real Zod schema.
 */
export interface Parseable<T> {
  parse(value: unknown): T;
}

/** A `Parseable` that also supports `.optional()`/`.default()` chaining, as returned by {@link t}. */
export interface Schema<T> extends Parseable<T> {
  optional(): Schema<T | undefined>;
  default(fallback: T): Schema<T>;
}

export type SchemaMap = Record<string, Parseable<unknown>>;

export type InferSchema<S extends SchemaMap> = {
  [K in keyof S]: S[K] extends Parseable<infer T> ? T : never;
};

function makeSchema<T>(parse: (value: unknown) => T): Schema<T> {
  return {
    parse,
    optional(): Schema<T | undefined> {
      return makeSchema((value) =>
        value === undefined ? undefined : parse(value)
      );
    },
    default(fallback: T): Schema<T> {
      return makeSchema((value) =>
        value === undefined ? fallback : parse(value)
      );
    },
  };
}

function toScalarString(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  throw new TypeError(`Expected a scalar query value, got ${typeof value}`);
}

interface NumberSchema extends Schema<number> {
  min(minimum: number): NumberSchema;
  max(maximum: number): NumberSchema;
}

function numberSchema(
  checks: Array<(value: number) => void> = [],
): NumberSchema {
  const base = makeSchema<number>((value) => {
    const raw = toScalarString(value);
    const num = Number(raw);
    if (Number.isNaN(num)) {
      throw new TypeError(`Expected a number, got "${raw}"`);
    }
    for (const check of checks) check(num);
    return num;
  });

  return Object.assign(base, {
    min(minimum: number): NumberSchema {
      return numberSchema([...checks, (num) => {
        if (num < minimum) {
          throw new RangeError(`Expected >= ${minimum}, got ${num}`);
        }
      }]);
    },
    max(maximum: number): NumberSchema {
      return numberSchema([...checks, (num) => {
        if (num > maximum) {
          throw new RangeError(`Expected <= ${maximum}, got ${num}`);
        }
      }]);
    },
  });
}

/** Tiny built-in schema builder for {@link parse}'s `schema` option and {@link validateParams}. */
export const t = {
  string(): Schema<string> {
    return makeSchema((value) => toScalarString(value));
  },

  number(): NumberSchema {
    return numberSchema();
  },

  boolean(): Schema<boolean> {
    return makeSchema((value) => {
      const raw = toScalarString(value);
      if (raw === "true") return true;
      if (raw === "false") return false;
      throw new TypeError(`Expected "true" or "false", got "${raw}"`);
    });
  },

  array<E>(element: Parseable<E>): Schema<E[]> {
    return makeSchema((value) => {
      if (value === undefined) {
        throw new TypeError("Required array value is missing");
      }
      const list = Array.isArray(value) ? value : [value];
      return list.map((item) => element.parse(item));
    });
  },
};

/** Validates a plain object (not necessarily from a URL) against a schema map. */
export function validateParams<S extends SchemaMap>(
  schema: S,
  params: Record<string, unknown>,
): InferSchema<S> {
  const result = {} as InferSchema<S>;
  for (const key in schema) {
    (result as Record<string, unknown>)[key] = schema[key].parse(params[key]);
  }
  return result;
}
