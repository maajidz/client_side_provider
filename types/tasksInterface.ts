export interface TasksInterface {
  id: string; // for 'key' while mapping
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High'
  status: string;
  notes: string;
  dueDate: string;
  assignedProviderId: string;
  assignerProviderId: string;
  assignedByAdmin: boolean;
  userDetailsId: string;
}

export type CreateTaskType = Omit<TasksInterface, 'id'>

export type UpdateTaskType = CreateTaskType

export interface TasksResponseInterface {
  data: TasksInterface[];
  total: number;
  page: number;
  limit: number;
}
