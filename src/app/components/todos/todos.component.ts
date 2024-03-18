import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoInterface } from '../../types/todoInterface';
import { TodosFirebaseService } from '../../services/todos-firebase.service';
import { TodosService } from '../../services/todos.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent {
  @Input() todos: TodoInterface[] = []
  @Input() todosType: string = ''

  authService = inject(AuthService);

  editingMode: boolean = false;
  editingIndex: number | null = null;

  todoTitleValue: string = '';
  todoDescriptionValue: string = '';
  todoTitleModel: string = '';
  todoDescriptionModel: string = '';

  constructor(private todosService: TodosService, private todosFirebaseService: TodosFirebaseService) { }

  doneTodo(): void {
    const updatedDoneStatus = !this.todos[0].done;
    const dataToUpdate = {
      title: this.todos[0].title,
      description: this.todos[0].description,
      done: updatedDoneStatus,
      onGoing: this.todos[0].onGoing,
      userUID: this.authService.currentUser?.uid!
    };

    this.todosFirebaseService.updateTodo(this.todos[0].id, dataToUpdate)
      .subscribe(() => {
        this.todosService.changeTodo(
          this.todos[0].id,
          this.todos[0].title,
          this.todos[0].description,
          updatedDoneStatus,
          this.todos[0].onGoing,
          this.authService.currentUser?.uid!
        );
      });
  }

  showAlert(): void {
    if (this.todosType == 'canceled' && this.todos[0].done == false) {
      alert('First You have To UnCancel this task');
    } else if (this.todosType == 'finished' && this.todos[0].onGoing == true) {
      alert('First You have To UnFinish this task');
    }
  }


  removeTodo(): void {
    this.todosFirebaseService.removeTodo(this.todos[0].id).subscribe(() => {
      this.todosService.removeTodo(this.todos[0].id);
    });
  }

  toggleEditing(index: number | null): void {
    this.editingMode = !this.editingMode;
    if (index !== null) {
      this.editingMode = true;
      this.editingIndex = index;
      this.todoTitleModel = this.todos[index].title;
      this.todoDescriptionModel = this.todos[index].description;
    } else {
      this.editingMode = false;
      this.editingIndex = null;
      this.todoTitleModel = '';
      this.todoDescriptionModel = '';
    }
    console.log("togling")
    console.log("todos[0]:", this.todos[0].title);

    console.log("todoTitleValue:", this.todoTitleValue);
    console.log("todoDescriptionValue:", this.todoDescriptionValue);

  }

  changeTodo(index: number | null) {
    this.editingMode = !this.editingMode

    console.log("todoTitleModel:", this.todoTitleModel);
    console.log("todoDescriptionModel:", this.todoDescriptionModel);
    console.log("todos[0]:", this.todos[0].title);

    const dataToUpdate = {
      title: this.todoTitleModel,
      description: this.todoDescriptionModel,
      done: this.todos[0].done,
      onGoing: this.todos[0].onGoing,
      userUID: this.authService.currentUser?.uid!
    };

    this.todosFirebaseService
      .updateTodo(this.todos[0].id, dataToUpdate)
      .subscribe(() => {
        this.todosService.changeTodo(
          this.todos[index!].id,
          this.todoTitleModel,
          this.todoDescriptionModel,
          this.todos[index!].done,
          this.todos[index!].onGoing,
          this.authService.currentUser?.uid!
        )
      })
  }

  cancelTodo(): void {
    const updateOnGoingStatus = !this.todos[0].onGoing;

    const dataToUpdate = {
      title: this.todos[0].title,
      description: this.todos[0].description,
      done: this.todos[0].done,
      onGoing: updateOnGoingStatus,
      userUID: this.authService.currentUser?.uid!
    };

    this.todosFirebaseService.updateTodo(this.todos[0].id, dataToUpdate)
      .subscribe(() => {
        this.todosService.changeTodo(
          this.todos[0].id,
          this.todos[0].title,
          this.todos[0].description,
          this.todos[0].done,
          updateOnGoingStatus,
          this.authService.currentUser?.uid!
        );
      })
  }

}
