import { z } from "zod";

export const addDiagnosesSchema = z.object({
  diagnoses: z.array(
    z.object({
      diagnosis_name: z
        .string()
        .min(1, { message: "Diagnosis name is required" }),
      ICD_Code: z.string().min(1, { message: "ICD Code is required" }),
      fromDate: z.string().min(1, { message: "From Date is required" }),
      // ! This field needs confirmation
      toDate: z.string().optional(),
      status: z.enum(["inactive", "active"]),
      notes: z.string().min(1, { message: "Notes is required" }),
    })
  ),
});

export const editDiagnosisSchema = z.object({
  // ! These fields need confirmation
  fromDate: z.string().min(1, "From Date is required"),
  toDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});