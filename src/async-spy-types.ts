export type AsyncSpy<T> = T & {
  [k in keyof T]: AsyncSpyFunction;
}

// In Jasmine, Spy is a function and SpyObj is an Object
// We decided to call the Objects "Spies", and functions - "SpyFunctions"
export interface AsyncSpyFunction extends jasmine.Spy {
  (...params: any[]): any;
  and: AsyncSpyFunctionAnd
}

export interface AsyncSpyFunctionAnd extends jasmine.SpyAnd {
  nextWith(value: any): void;
  resolveWith(value: any): void;
  rejectWith(value: any): void;
}