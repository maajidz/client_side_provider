import * as z from 'zod';

export const providerDetailsSchema = z.object({
    professionalSummary: z
        .string()
        .min(3, { message: 'Professional summary is required.' }),
    gender: z
        .string()
        .min(3, { message: 'Gender is required.' }),
    roleName: z
        .string()
        .min(3, { message: 'roleName is required.' }),
    licenseNumber: z
        .string()
        .min(3, { message: 'Gender is required.' }),
    nip: z
        .string()
        .min(3, { message: 'nip is required.' }),
    yearsOfExperience: z
        .number().min(1, "Required"),
});

export type ProviderDetailsFormValues = z.infer<typeof providerDetailsSchema>;
