import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TodosComponent } from '../todos/todos.component';

import { TodosService } from '../../services/todos.service';
import { TodosFirebaseService } from '../../services/todos-firebase.service';
import { TodoInterface } from '../../types/todoInterface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-on-going',
  standalone: true,
  imports: [CommonModule, TodosComponent],
  templateUrl: './on-going.component.html',
  styleUrl: './on-going.component.css'
})
export class OnGoingComponent {
  authService = inject(AuthService)
  router = inject(Router)
  todos: TodoInterface[] = [];
  todosType: string = ''
  visibleSection: boolean = false

  constructor(private todosService: TodosService, private todosFirebaseService: TodosFirebaseService) { }

  ngOnInit(): void {
    this.visibleSection = true
    this.todosFirebaseService.getTodos().subscribe((todos) => {
      this.todos = todos.filter(todo => !todo.done && todo.onGoing && this.authService.currentUser?.uid == todo.userUID);
      this.todosType = 'onGoing'
    })
  }
}
