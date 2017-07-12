import 'rxjs/add/observable/of';

import { AsyncSpy } from "./async-spy-types";
import { AsyncSpyable } from "./async-spyable-decorator";
import { Observable } from 'rxjs/Observable';
import { createAsyncSpy } from './create-async-spy';

class FakeClass {
  
  syncMethod() {
    return '';
  }

  @AsyncSpyable()  
  promiseMethod(): Promise<any>{
    return Promise.resolve();
  }

  @AsyncSpyable()  
  observableMethod(): Observable<any>{
    return Observable.of();
  }
};

let fakeClassSpy: AsyncSpy<FakeClass>;
let fakeValue: any;
let actualResult: any;
let actualRejection: any;

describe('createAsyncSpy', () => {

  Given(() => {
    fakeClassSpy = createAsyncSpy(FakeClass);
    fakeValue = 'BOOM!';
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