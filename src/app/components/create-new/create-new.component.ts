import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodosFirebaseService } from '../../services/todos-firebase.service';
import { TodoInterface } from '../../types/todoInterface';
import { TodosService } from '../../services/todos.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-new.component.html',
  styleUrl: './create-new.component.css'
})
export class CreateNewComponent implements OnInit{
  authService = inject(AuthService);
  visibleSection: boolean = false
  constructor(
    private router: Router,
    private todosService: TodosService,
    private todosFirebaseService: TodosFirebaseService,
    private snackBar: MatSnackBar
  ) { }

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
    }
  }

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
      id: todoData.id !,
      title: todoData.title !,
      description: todoData.description !,
      done: todoData.done !,
      onGoing: todoData.onGoing !,
      userUID: this.authService.currentUser?.uid! !
    };
    console.log("newTask", newTask)

    this.todosFirebaseService.AddTodo(newTask).subscribe((addedTodoId) => {
      this.todosService.AddTodo(newTask);
      this.applyForm.reset();
      this.router.navigate(['/on-going'])
    });
  } 
  showMessage(message: string): void {
    this.snackBar.open(message, ' ', {
      duration: 2000, // Duration in milliseconds
    });
  }
}
