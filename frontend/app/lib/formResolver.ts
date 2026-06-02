import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

export function zodFormResolver<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: FieldErrors<TFieldValues> = {};

    for (const issue of result.error.issues) {
      const name = issue.path.join(".");

      if (!name) {
        continue;
      }

      errors[name as keyof TFieldValues] = {
        type: issue.code,
        message: issue.message,
      } as FieldErrors<TFieldValues>[keyof TFieldValues];
    }

    return {
      values: {},
      errors,
    };
  };
}
