import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters } from '../types/todo';
import { ITodoRepository } from '../repositories/TodoRepository';
import { validateCreateTodo, validateUpdateTodo } from '../utils/validation';

export class TodoService {
  constructor(private repository: ITodoRepository) {}

  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    validateCreateTodo(data);
    return await this.repository.create(data);
  }

  async getAllTodos(filters?: TodoFilters): Promise<Todo[]> {
    return await this.repository.findAll(filters);
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    return await this.repository.findById(id);
  }

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo | null> {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    validateUpdateTodo(data);
    return await this.repository.update(id, data);
  }

  async deleteTodo(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    return await this.repository.delete(id);
  }

  async toggleTodoCompletion(id: string): Promise<Todo | null> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      return null;
    }
    
    return await this.repository.update(id, { completed: !todo.completed });
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return await this.repository.findAll({ completed: true });
  }

  async getPendingTodos(): Promise<Todo[]> {
    return await this.repository.findAll({ completed: false });
  }

  async getTodosByPriority(priority: 'low' | 'medium' | 'high'): Promise<Todo[]> {
    return await this.repository.findAll({ priority });
  }

  async searchTodos(query: string): Promise<Todo[]> {
    if (!query.trim()) {
      return await this.repository.findAll();
    }
    return await this.repository.findAll({ search: query });
  }
}
