import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters } from '../types/todo';
import { TodoService } from '../services/TodoService';
import { LocalStorageTodoRepository } from '../repositories/TodoRepository';
import { ValidationError } from '../utils/validation';

interface UseTodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

interface UseTodosReturn extends UseTodosState {
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  refreshTodos: (filters?: TodoFilters) => Promise<void>;
  searchTodos: (query: string) => Promise<void>;
  clearError: () => void;
}

const repository = new LocalStorageTodoRepository();
const todoService = new TodoService(repository);

export const useTodos = (initialFilters?: TodoFilters): UseTodosReturn => {
  const [state, setState] = useState<UseTodosState>({
    todos: [],
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setTodos = useCallback((todos: Todo[]) => {
    setState(prev => ({ ...prev, todos }));
  }, []);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ValidationError) {
      setError(error.message);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, [setError]);

  const refreshTodos = useCallback(async (filters?: TodoFilters) => {
    setLoading(true);
    setError(null);
    try {
      const todos = await todoService.getAllTodos(filters);
      setTodos(todos);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setTodos, handleError]);

  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    setLoading(true);
    setError(null);
    try {
      await todoService.createTodo(data);
      await refreshTodos(initialFilters);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, refreshTodos, handleError, initialFilters]);

  const updateTodo = useCallback(async (id: string, data: UpdateTodoRequest) => {
    setLoading(true);
    setError(null);
    try {
      await todoService.updateTodo(id, data);
      await refreshTodos(initialFilters);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, refreshTodos, handleError, initialFilters]);

  const deleteTodo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await todoService.deleteTodo(id);
      await refreshTodos(initialFilters);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, refreshTodos, handleError, initialFilters]);

  const toggleTodo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await todoService.toggleTodoCompletion(id);
      await refreshTodos(initialFilters);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, refreshTodos, handleError, initialFilters]);

  const searchTodos = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const todos = await todoService.searchTodos(query);
      setTodos(todos);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setTodos, handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    refreshTodos(initialFilters);
  }, [refreshTodos, initialFilters]);

  return {
    ...state,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
    searchTodos,
    clearError
  };
};
