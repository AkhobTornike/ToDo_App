import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TodosFirebaseService } from '../../services/todos-firebase.service';
import { TodosService } from '../../services/todos.service';
import { TodoInterface } from '../../types/todoInterface';
import { TodosComponent } from '../todos/todos.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-finished',
  standalone: true,
  imports: [CommonModule, TodosComponent],
  templateUrl: './finished.component.html',
  styleUrl: './finished.component.css'
})
export class FinishedComponent {
  todos: TodoInterface[] = []
  todosType: string = ''
  visibleSection: boolean = false

  authService = inject(AuthService)
  router = inject(Router)

  constructor(private todosService: TodosService, private todosFirebaseService: TodosFirebaseService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(!this.authService.currentUser){
      // window.postMessage('First You have to sign in')
      this.showMessage('First You have to sign in');
      setTimeout(() => { 
        this.router.navigateByUrl('/profile/log-in')
      }, 2500);
    }
    if(this.authService.currentUser)  {
      this.visibleSection = true

    this.todosFirebaseService.getTodos().subscribe((todos) => {
      this.todos = todos.filter(todo => todo.done && todo.onGoing && this.authService.currentUser?.uid == todo.userUID);
      this.todosType = 'finished'
    })
  }
  }
  
  showMessage(message: string): void {
    this.snackBar.open(message, ' ', {
      duration: 2000, // Duration in milliseconds
    });
  }
}
