"use client";

import { z } from "zod";

export const tasksSchema = z.object({
    category: z.string().nonempty({ message: "Category is required" }),
    task: z.string().nonempty({ message: "Task is required" }),
    owner: z.string().nonempty(),
    priority: z.string(),
    dueDate:  z.string().optional(),
    sendReminder: z.array(z.string()).optional(),
    comments: z.string().optional(),
  });