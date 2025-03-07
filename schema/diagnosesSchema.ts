import { z } from "zod";

export const addDiagnosesSchema = z.object({
  diagnoses: z.array(
    z.object({
      diagnosis_Id: z
        .string()
        .min(1, { message: "Diagnosis name is required" }),
      ICD_Code: z.string().min(1, { message: "ICD Code is required" }),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      status: z.enum(["inactive", "active"]).optional(),
      notes: z.string().optional(),
    })
  ),
});

export const editDiagnosisSchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});
