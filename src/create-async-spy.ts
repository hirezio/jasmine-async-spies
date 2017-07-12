import 'core-js/es6/promise';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

import { AsyncSpy, AsyncSpyFunction } from "./async-spy-types";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

declare var global: any;

const Reflect = global['Reflect'];

export function createAsyncSpy<T>(ObjectClass: { new (...args: any[]): T, [key: string]: any; }): AsyncSpy<T> {
  const proto = ObjectClass.prototype;
  
  const methodNames = Object.getOwnPropertyNames(proto)
    .filter(methodName => typeof proto[methodName] == 'function'); 
  
  let asyncSpy:any = {};

  methodNames.forEach((methodName) => {
    
    let returnTypeClass = Reflect.getMetadata('design:returntype', ObjectClass.prototype, methodName);
    console.log('methodName', methodName, returnTypeClass);
    if (returnTypeClass === Observable) {
      asyncSpy[methodName] = createObservableSpyFunction(methodName);
    } else if (returnTypeClass === Promise) {
      asyncSpy[methodName] = createPromiseSpyFunction(methodName);
    } else {
      asyncSpy[methodName] = jasmine.createSpy(methodName);
    }
  })
  return asyncSpy as AsyncSpy<T>;
}


function createObservableSpyFunction(name: string): AsyncSpyFunction {
  const spyMethod: any = jasmine.createSpy(name);
  const subject: Subject<any> = new Subject();

  spyMethod.and.returnValue(subject)
  spyMethod.and.nextWith = function nextWith(value: any) {
    subject.next(value);
  }

  return spyMethod as AsyncSpyFunction;

}

function createPromiseSpyFunction(name: string): AsyncSpyFunction{
  const spyMethod: any = jasmine.createSpy(name);

  spyMethod.and.returnValue(new Promise<any>((resolveWith, rejectWith) => {
    spyMethod.and.resolveWith = resolveWith;
    spyMethod.and.rejectWith = rejectWith;
  }))

  return spyMethod as AsyncSpyFunction;
}
