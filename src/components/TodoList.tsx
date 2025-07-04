import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { useTodos } from '../hooks/useTodos';
import { TodoFilters as TodoFiltersType } from '../types/todo';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import TodoItem from './TodoItem';
import { AlertCircle } from 'lucide-react';

const TodoList: React.FC = () => {
  const [filters, setFilters] = useState<TodoFiltersType>({});
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
    searchTodos,
    clearError
  } = useTodos(filters);

  const handleFiltersChange = (newFilters: TodoFiltersType) => {
    setFilters(newFilters);
    refreshTodos(newFilters);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchTodos(query);
    } else {
      refreshTodos(filters);
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
        <p className="text-gray-600">
          {totalCount > 0 ? `${completedCount}/${totalCount} tasks completed` : 'No tasks yet'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <TodoForm onSubmit={createTodo} loading={loading} />
      
      <TodoFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
      />

      <div className="space-y-4">
        {loading && todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found. Add one above!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
      
      {totalCount > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => refreshTodos(filters)}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoList;