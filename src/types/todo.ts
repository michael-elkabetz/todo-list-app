export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface CreateTodoRequest {
  text: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search?: string;
}
