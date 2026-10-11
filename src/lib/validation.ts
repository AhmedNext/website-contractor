import { z } from "zod";
import type { Field } from "@/content/tools";
export function validateField(field: Field, text: string): string | null {
  const signed = field.key === "opening" || field.key.startsWith("other");
  let schema = z
    .number()
    .finite()
    .max(1e12, "Use a value no greater than one trillion.");
  if (!signed) schema = schema.min(0, "Enter zero or a positive value.");
  if (field.unit === "months")
    schema = schema
      .int("Enter a whole number of months.")
      .max(120, "Use 120 months or fewer.");
  if (field.key === "release")
    schema = schema.min(1, "Release month must be at least 1.");
  if (field.key === "billable")
    schema = schema.positive("Billable hours must be greater than zero.");
  if (field.key === "target")
    schema = schema.max(99.999, "Target margin must be less than 100%.");
  if (field.key === "retainage")
    schema = schema.max(100, "Retainage cannot exceed 100%.");
  if (text.trim() === "") return "Enter a value; use 0 if none.";
  const result = schema.safeParse(Number(text.replace(/,/g, "")));
  return result.success ? null : result.error.issues[0].message;
}
