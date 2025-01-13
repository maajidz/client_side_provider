export interface TasksInterface {
  id: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: string;
  notes: string;
  dueDate: string;
  assignedProviderId: string;
  assignerProviderId: string;
  assignedByAdmin: boolean;
  userDetailsId: string;
}

export interface CreateTaskType {
  category: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  reminders?: string[];
  notes?: string;
  priority?: "Low" | "Medium" | "High";
  dueDate?: string;
  assignedProviderId: string;
  assignerProviderId?: string;
  assignedByAdmin?: boolean;
  userDetailsId?: string;
}

export interface UpdateTaskType extends CreateTaskType {}

export interface TasksResponseInterface {
  data: TasksInterface[];
  total: number;
  page: number;
  limit: number;
}
