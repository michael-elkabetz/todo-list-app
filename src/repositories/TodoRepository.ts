import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters } from '../types/todo';
import { generateId } from '../utils/id';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export interface ITodoRepository {
  create(data: CreateTodoRequest): Promise<Todo>;
  findAll(filters?: TodoFilters): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  update(id: string, data: UpdateTodoRequest): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

export class LocalStorageTodoRepository implements ITodoRepository {
  private readonly storageKey = `${config.storagePrefix}-todos`;

  private getTodos(): Todo[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    } catch (error) {
      logger.error('Failed to load todos from localStorage', error);
      return [];
    }
  }

  private saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(todos));
      logger.debug('Saved todos to localStorage', { count: todos.length });
    } catch (error) {
      logger.error('Failed to save todos to localStorage', error);
    }
  }

  async create(data: CreateTodoRequest): Promise<Todo> {
    const now = new Date();
    const todo: Todo = {
      id: generateId(),
      text: data.text.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
      priority: data.priority || 'medium',
      category: data.category
    };

    const todos = this.getTodos();
    todos.push(todo);
    this.saveTodos(todos);
    
    return todo;
  }

  async findAll(filters?: TodoFilters): Promise<Todo[]> {
    let todos = this.getTodos();

    if (filters) {
      if (filters.completed !== undefined) {
        todos = todos.filter(todo => todo.completed === filters.completed);
      }
      
      if (filters.priority) {
        todos = todos.filter(todo => todo.priority === filters.priority);
      }
      
      if (filters.category) {
        todos = todos.filter(todo => todo.category === filters.category);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        todos = todos.filter(todo => 
          todo.text.toLowerCase().includes(searchLower)
        );
      }
    }

    return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Todo | null> {
    const todos = this.getTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  async update(id: string, data: UpdateTodoRequest): Promise<Todo | null> {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index === -1) return null;

    const todo = todos[index];
    const updatedTodo: Todo = {
      ...todo,
      ...data,
      updatedAt: new Date()
    };

    todos[index] = updatedTodo;
    this.saveTodos(todos);
    
    return updatedTodo;
  }

  async delete(id: string): Promise<boolean> {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) {
      return false;
    }

    this.saveTodos(filteredTodos);
    return true;
  }
}
