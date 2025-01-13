"use client";

import { z } from "zod";

export const tasksSchema = z.object({
    category: z.string().nonempty({ message: "Category is required" }),
    task: z.string().nonempty({ message: "Task is required" }),
    owner: z.string().nonempty(),
    priority: z.enum(['Low', 'Medium', 'High']),
    dueDate:  z.string().optional(),
    sendReminder: z.array(z.string()).optional(),
    comments: z.string().optional(),
  });