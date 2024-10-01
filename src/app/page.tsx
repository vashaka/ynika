"use client";

import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";

interface Todo {
  id: number;
  bg: string;
  content: string[];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [show, setShow] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const colors = ["green", "red", "blue"];

  useEffect(() => {
    const res = localStorage.getItem("todos");
    if (res) {
      const arr: Todo[] = JSON.parse(res);
      setTodos(arr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => {
    const { value } = e.target;
    setInputValues((prev) => ({ ...prev, [todoId]: value }));
  };

  const handleSubmit = (todoId: number) => {
    const task = inputValues[todoId];
    if (!task || task.trim() === "") {
      alert("Enter a task");
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, content: [...todo.content, task] }
          : todo
      )
    );

    setInputValues((prev) => ({ ...prev, [todoId]: "" }));
  };

  const handleDeleteTask = (todoId: number, taskIndex: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              content: todo.content.filter((_, index) => index !== taskIndex),
            }
          : todo
      )
    );
  };

  return (
    <div>
      <div className="w-full flex items-end justify-center flex-col gap-2">
        <button
          className="bg-black p-4 rounded-full text-white"
          onClick={() => setShow(!show)}
        >
          +
        </button>

        {show &&
          colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color }}
              className="w-[40px] h-[40px] rounded-full cursor-pointer"
              onClick={() => {
                const newTodo: Todo = {
                  id: todos.length
                    ? Math.max(...todos.map((todo) => todo.id)) + 1
                    : 1,
                  bg: color,
                  content: [],
                };

                setTodos((prev) => [...prev, newTodo]);
                setInputValues((prev) => ({ ...prev, [newTodo.id]: "" }));
              }}
            />
          ))}
      </div>

      <Reorder.Group axis="y" values={todos} onReorder={setTodos}>
        {todos.map((todo) => (
          <Reorder.Item
            key={todo.id}
            style={{ backgroundColor: todo.bg }}
            className="p-2"
            value={todo}
          >
            <input
              type="text"
              placeholder="Enter task"
              value={inputValues[todo.id] || ""}
              onChange={(e) => handleChange(e, todo.id)}
            />
            <button onClick={() => handleSubmit(todo.id)}>Add task</button>

            {todo.content.map((task, index) => (
              <div
                key={index}
                className="bg-black text-white w-[30%] flex items-center justify-between p-2 mt-2"
              >
                <input type="checkbox" />
                <span>{task}</span>
                <button onClick={() => handleDeleteTask(todo.id, index)}>
                  Delete
                </button>
              </div>
            ))}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}