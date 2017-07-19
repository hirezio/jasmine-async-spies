import { FakeChildClass, FakeClass } from './fake-classes-to-test';

import { AsyncSpy } from "./async-spy-types";
import { Observable } from 'rxjs/Observable';
import { createAsyncSpy } from './create-async-spy';

let fakeClassSpy: AsyncSpy<FakeClass>;
let fakeChildClassSpy: AsyncSpy<FakeChildClass>;
let fakeValue: any;
let actualResult: any;
let actualRejection: any;

describe('createAsyncSpy', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
  });
  
  describe('FakeClass', () => {

    Given(() => {
      fakeClassSpy = createAsyncSpy(FakeClass);
    });

    describe('should be able to return fake sync values', () => {
      Given(() => {
        fakeClassSpy.syncMethod.and.returnValue(fakeValue);
      });

      When(() => {
        actualResult = fakeClassSpy.syncMethod()
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('PROMISES', () => {
      When((done) => { 

        fakeClassSpy.promiseMethod() 
          .then(result => {
            actualResult = result;
            done();
          })
          .catch(error => {
            actualRejection = error;
            done()
          })
      }); 

      describe('should be able to fake resolve', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.resolveWith(fakeValue);
        });
        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('should be able to fake reject', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.rejectWith(fakeValue);
        });
        Then(() => {
          expect(actualRejection).toBe(fakeValue);
        });
      });

    });

    describe('should be able to deal with provided promises list', () => {

      Given(() => {
        fakeClassSpy = createAsyncSpy(FakeClass, ['providedPromiseMethod']);
        fakeClassSpy.providedPromiseMethod.and.resolveWith(fakeValue);
      });

      When((done) => {

        fakeClassSpy.providedPromiseMethod()
          .then(result => { 
            actualResult = result;
            done();
          })
          .catch(error => {
            actualRejection = error;
            done()
          })
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('should be able to return fake Observable values', () => {
      Given(() => {
        fakeClassSpy.observableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeClassSpy.observableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });
  });

  describe('should be able to handle child class', () => {
    Given(() => {
      fakeChildClassSpy = createAsyncSpy(FakeChildClass);
    });
    describe('should be able to return fake Observable values', () => {
      Given(() => {
        fakeChildClassSpy.anotherObservableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.anotherObservableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('should handle parent methods', () => {
      Given(() => {
        fakeChildClassSpy.observableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.observableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });
  });

});