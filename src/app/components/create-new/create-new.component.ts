import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodosFirebaseService } from '../../services/todos-firebase.service';
import { TodoInterface } from '../../types/todoInterface';
import { TodosService } from '../../services/todos.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-new.component.html',
  styleUrl: './create-new.component.css'
})
export class CreateNewComponent {
  authService = inject(AuthService);
  errorMessage: string | null = null
  constructor(
    private router: Router,
    private todosService: TodosService,
    private todosFirebaseService: TodosFirebaseService,
  ) { }

  applyForm = new FormGroup({
    id: new FormControl('1111'),
    title: new FormControl(''),
    description: new FormControl(''),
    done: new FormControl(false),
    onGoing: new FormControl(true),
  });

  submitApplication() {
    this.AddTodo();
  }

  AddTodo(): void {
    const todoData = this.applyForm.value;
    const newTask: TodoInterface = {
      id: todoData.id!,
      title: todoData.title!,
      description: todoData.description!,
      done: todoData.done!,
      onGoing: todoData.onGoing!,
      userUID: this.authService.currentUser?.uid!!
    };

    this.todosFirebaseService.AddTodo(newTask).subscribe((addedTodoId) => {
      this.todosService.AddTodo(newTask);
      this.applyForm.reset();
      this.router.navigate(['/on-going'])
    });
  }
}
