import { z } from "zod";

export const referralReconcilationSchema = z.object({
    reconcilationList:  z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
  });
