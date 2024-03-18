import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { TodoInterface } from '../types/todoInterface';
import { addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodosFirebaseService {
  [x: string]: any;
  firestore = inject(Firestore);
  authService = inject(AuthService);
  todosCollection = collection(this.firestore, 'tasks');

  getTodos(): Observable<TodoInterface[]> {
    return collectionData(this.todosCollection, {
      idField: 'id',
    }) as Observable<TodoInterface[]>;
  }

  AddTodo(newTask: TodoInterface): Observable<string> {
    const todoToCreate = {
      title: newTask.title,
      description: newTask.description,
      done: newTask.done,
      onGoing: newTask.onGoing,
      userUID: this.authService.currentUser?.uid
    };

    const promise = addDoc(this.todosCollection, todoToCreate).then(
      (response) => response.id
    );

    return from(promise);
  }

  removeTodo(todoId: string): Observable<void> {
    const docRef = doc(this.firestore, 'tasks/' + todoId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  updateTodo(
    todoId: string,
    dataToUpdate: { title: string, description: string, done: boolean, onGoing: boolean, userUID: string }
  ): Observable<void> {
    const docRef = doc(this.firestore, 'tasks/' + todoId);
    const promise = setDoc(docRef, dataToUpdate);
    return from(promise);
  }

  constructor() { }
}
