import { AsyncSpy, AsyncSpyFunction } from "./async-spy-types";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

declare var global: any;

const Reflect = global['Reflect'];

export function createAsyncSpy<T>(ObjectClass: { new (...args: any[]): T, [key: string]: any; }): AsyncSpy<T> {
  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto); 
  
  let asyncSpy:any = {};

  methodNames.forEach((methodName) => {
    let returnTypeClass = Reflect.getMetadata('design:returntype', proto, methodName);
    
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
  const subject: BehaviorSubject<any> = new BehaviorSubject(null);

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

function getAllMethodNames(obj:any) {
  let methods: string[] = [];
  
  do {
    methods = methods.concat(Object.keys((obj)));
  } while (obj = Object.getPrototypeOf(obj));
  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }

  // .filter(methodName => typeof proto[methodName] == 'function')
  return methods;
  
}