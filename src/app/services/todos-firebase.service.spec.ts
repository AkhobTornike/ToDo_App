import { TestBed } from '@angular/core/testing';

import { TodosFirebaseService } from './todos-firebase.service';

describe('TodosFirebaseService', () => {
  let service: TodosFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
