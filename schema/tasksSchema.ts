"use client";

import { z } from "zod";

export const tasksSchema = z.object({
  category: z.string().nonempty({ message: "Category is required" }),
  task: z.string().nonempty({ message: "Task is required" }),
  owner: z.string().nonempty(),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().optional(),
  sendReminder: z.array(z.string()).optional(),
  comments: z.string().optional(),
  userDetailsId: z.string().optional(),
});

export const filterTasksSchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  userDetailsId:z.string().optional(),
});