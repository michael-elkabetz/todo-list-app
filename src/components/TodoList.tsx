import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [newTodo, setNewTodo] = React.useState("");

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) {
      return;
    }
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Todo List</h2>
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-white p-2 rounded shadow"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span
                className={
                  todo.completed ? "line-through text-gray-500" : undefined
                }
              >
                {todo.text}
              </span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeTodo(todo.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;