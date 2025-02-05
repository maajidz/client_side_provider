import { ProviderDetails } from "./loginInterface";

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
  status?: string;
  reminder?: string[];
  notes?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  sendReminder?: string[];
  assignedProviderId: string;
  assignerProviderId: string;
  assignedByAdmin: boolean;
  userDetailsId: string;
}

export interface UpdateTaskType extends CreateTaskType {}

export interface TasksResponseInterface {
  data: TasksResponseDataInterface[];
  total: number;
  page: number;
  limit: number;
}

export interface TasksResponseDataInterface {
  id: string
  category: string
  description: string
  status: string
  notes: string
  priority?: "low" | "medium" | "high";
  dueDate: string
  reminder: any
  assignedByAdmin: boolean
  userDetailsId: string
  isAccepted: boolean
  createdAt: string
  updatedAt: string
  assignedProvider: ProviderDetails
  assignerProvider: ProviderDetails
}

export interface Status {
  status: string
}
