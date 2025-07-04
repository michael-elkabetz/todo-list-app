import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Todo } from '../types/todo';
import { Trash2, Edit } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${todo.completed ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium break-words ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                {todo.category && (
                  <Badge variant="outline">
                    {todo.category}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Created: {todo.createdAt.toLocaleDateString()}
                {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                  <span className="ml-2">
                    Updated: {todo.updatedAt.toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
