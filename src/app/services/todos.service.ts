import { Injectable, signal } from '@angular/core';
import { TodoInterface } from '../types/todoInterface';
import { FilterEnum } from '../types/filter.enums';
import { NewTodoInterface } from '../types/newToDoInterFace';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  todosSig = signal<TodoInterface[]>([]);


  AddTodo(newTask: NewTodoInterface): void { }

  removeTodo(id: string): void {
    this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  changeTodo(id: string, title: string, description: string, done: boolean, onGoing: boolean, userUID: string): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, title, description, done, onGoing, userUID } : todo))
    )
  }

  constructor() { }
}
