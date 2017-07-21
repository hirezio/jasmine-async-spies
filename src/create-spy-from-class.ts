import { AsyncSpyFunction, Spy } from "./spy-types";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

declare var global: any;

const Reflect = global['Reflect'];

export function createSpyFromClass<T>(ObjectClass: { new (...args: any[]): T, [key: string]: any; },
  providedPromiseMethodNames?: string[],
  providedObservableMethodNames?: string[]): Spy<T> {

  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);

  let asyncSpy: any = {};

  methodNames.forEach((methodName) => {
    let returnTypeClass = Reflect.getMetadata('design:returntype', proto, methodName);

    if ((providedPromiseMethodNames &&
      providedPromiseMethodNames.indexOf(methodName) !== -1) ||
      returnTypeClass === Promise) {

      asyncSpy[methodName] = createPromiseSpyFunction(methodName);

    } else if ((providedObservableMethodNames &&
      providedObservableMethodNames.indexOf(methodName) !== -1) ||
      returnTypeClass === Observable) {
      
      asyncSpy[methodName] = createObservableSpyFunction(methodName);
    } else {
      asyncSpy[methodName] = jasmine.createSpy(methodName);
    }
  })
  return asyncSpy as Spy<T>;
}


function createObservableSpyFunction(name: string): AsyncSpyFunction {
  const spyFunction: any = jasmine.createSpy(name);
  const subject: BehaviorSubject<any> = new BehaviorSubject(null);

  spyFunction.and.returnValue(subject)
  spyFunction.and.nextWith = function nextWith(value: any) {
    subject.next(value);
  }

  return spyFunction as AsyncSpyFunction;

}

function createPromiseSpyFunction(name: string): AsyncSpyFunction {
  const spyFunction: any = jasmine.createSpy(name);

  spyFunction.and.returnValue(new Promise<any>((resolveWith, rejectWith) => {
    spyFunction.and.resolveWith = resolveWith;
    spyFunction.and.rejectWith = rejectWith;
  }))

  return spyFunction as AsyncSpyFunction;
}

function getAllMethodNames(obj: any) {
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