import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoService } from '../TodoService';
import { ITodoRepository } from '../../repositories/TodoRepository';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../types/todo';
import { ValidationError } from '../../utils/validation';

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium',
  category: 'test'
};

const mockRepository: ITodoRepository = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(mockRepository);
    vi.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create a todo with valid data', async () => {
      const createRequest: CreateTodoRequest = {
        text: 'Test todo',
        priority: 'medium'
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockTodo);

      const result = await service.createTodo(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockTodo);
    });

    it('should throw validation error for empty text', async () => {
      const createRequest: CreateTodoRequest = {
        text: ''
      };

      await expect(service.createTodo(createRequest)).rejects.toThrow(ValidationError);
    });

    it('should throw validation error for text that is too long', async () => {
      const createRequest: CreateTodoRequest = {
        text: 'a'.repeat(501)
      };

      await expect(service.createTodo(createRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const todos = [mockTodo];
      vi.mocked(mockRepository.findAll).mockResolvedValue(todos);

      const result = await service.getAllTodos();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(todos);
    });

    it('should return filtered todos', async () => {
      const todos = [mockTodo];
      const filters = { completed: false };
      vi.mocked(mockRepository.findAll).mockResolvedValue(todos);

      const result = await service.getAllTodos(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(todos);
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTodo);

      const result = await service.getTodoById('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTodo);
    });

    it('should throw error for empty id', async () => {
      await expect(service.getTodoById('')).rejects.toThrow('Todo ID is required');
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const updateRequest: UpdateTodoRequest = {
        text: 'Updated todo'
      };
      const updatedTodo = { ...mockTodo, text: 'Updated todo' };
      vi.mocked(mockRepository.update).mockResolvedValue(updatedTodo);

      const result = await service.updateTodo('1', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateRequest);
      expect(result).toEqual(updatedTodo);
    });

    it('should throw error for empty id', async () => {
      await expect(service.updateTodo('', { text: 'test' })).rejects.toThrow('Todo ID is required');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      vi.mocked(mockRepository.delete).mockResolvedValue(true);

      const result = await service.deleteTodo('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should throw error for empty id', async () => {
      await expect(service.deleteTodo('')).rejects.toThrow('Todo ID is required');
    });
  });

  describe('toggleTodoCompletion', () => {
    it('should toggle completion status', async () => {
      const completedTodo = { ...mockTodo, completed: true };
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(mockRepository.update).mockResolvedValue(completedTodo);

      const result = await service.toggleTodoCompletion('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', { completed: true });
      expect(result).toEqual(completedTodo);
    });

    it('should return null if todo not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await service.toggleTodoCompletion('1');

      expect(result).toBeNull();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });
});
