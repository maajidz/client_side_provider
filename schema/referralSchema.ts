"use client";

import { z } from "zod";

export const referralOutFormSchema = z.object({
  userDetailsId: z.string(),
  // referralFrom: z.string().min(1, { message: "Referral From is required" }),
  referralTo: z.string().min(1, { message: "Referral From is required" }),
  referralReason: z.string().min(1, { message: "Referral Reason is required" }),
  referralDate: z.string().min(1, { message: "Referral Date is required" }),
  priority: z.enum(["Normal", "High", "Low"], {
    message: "Please select Priority",
  }),
  relatedEncounter: z.string().min(1, { message: "Referral From is required" }),
  referralNotes: z.string().optional(),
});

export const referralFormSchema = z.object({
  userDetailsId: z.string(),
  referralFrom: z.string().min(1, { message: "Referral From is required" }),
  referralTo: z.string().min(1, { message: "Referral From is required" }),
  referralReason: z.string().min(1, { message: "Referral Reason is required" }),
  referralDate: z.string().min(1, { message: "Referral Date is required" }),
  priority: z.enum(["Normal", "High", "Low"], {
    message: "Please select Priority",
  }),
  relatedEncounter: z.string().min(1, { message: "Referral From is required" }),
  referralNotes: z.string().optional(),
});

export const referralOutSearchParams = z.object({
  referralFrom: z.string().optional(),
  referralTo: z.enum(["internal", "external", ""]).optional(),
  referralProviderId: z.string().optional(),
  statusType: z.enum(["responseStatus", "requestStatus", "all"]).optional(),
  status: z.string().optional(),
});

export const referralInSearchParams = z.object({
  referralTo: z.string().optional(),
  referralFrom: z.enum(["internal", "external", ""]).optional(),
  referralProviderId: z.string().optional(),
  statusType: z.enum(["responseStatus", "requestStatus", "all"]).optional(),
  status: z.string().optional(),
});
