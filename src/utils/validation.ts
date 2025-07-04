import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateCreateTodo = (data: CreateTodoRequest): void => {
  if (!data.text || data.text.trim().length === 0) {
    throw new ValidationError('Todo text is required');
  }
  
  if (data.text.length > 500) {
    throw new ValidationError('Todo text cannot exceed 500 characters');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    throw new ValidationError('Priority must be low, medium, or high');
  }
  
  if (data.category && data.category.length > 50) {
    throw new ValidationError('Category cannot exceed 50 characters');
  }
};

export const validateUpdateTodo = (data: UpdateTodoRequest): void => {
  if (data.text !== undefined) {
    if (!data.text || data.text.trim().length === 0) {
      throw new ValidationError('Todo text cannot be empty');
    }
    
    if (data.text.length > 500) {
      throw new ValidationError('Todo text cannot exceed 500 characters');
    }
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    throw new ValidationError('Priority must be low, medium, or high');
  }
  
  if (data.category && data.category.length > 50) {
    throw new ValidationError('Category cannot exceed 50 characters');
  }
};
