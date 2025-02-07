"use client";

import { z } from "zod";

export const messageSchema = z.object({
  message_body: z.string(),
});
