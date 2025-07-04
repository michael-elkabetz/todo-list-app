import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { CreateTodoRequest } from '../types/todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => Promise<void>;
  loading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading = false }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      return;
    }

    const data: CreateTodoRequest = {
      text: text.trim(),
      priority,
      category: category.trim() || undefined
    };

    await onSubmit(data);
    setText('');
    setCategory('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="todo-text">Task</Label>
          <Input
            id="todo-text"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            maxLength={500}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="todo-category">Category (Optional)</Label>
          <Input
            id="todo-category"
            placeholder="e.g., Work, Personal, Shopping"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            maxLength={50}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label htmlFor="todo-priority">Priority</Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger id="todo-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" disabled={loading || !text.trim()} className="w-full sm:w-auto">
          {loading ? 'Adding...' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
