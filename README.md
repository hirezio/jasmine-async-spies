# jasmine-async-spies
Automatic Async spies for promises and observables in TypeScript Jasmine Tests


## Motivation

Setting up ways to control async objects like promises, or potential async objects like Observables is hard.

What if there was a short and simple API for setting up automatic async spies in Jasmine?

## Requirements

In your `tsconfig.json` file make sure that you have the following property set to true - 
`emitDecoratorMetadata: true`

And add `@AsyncSpyable()` before every method which returns a Promise or an Observable

## Installation

`npm install -D jasmine-async-spies`

## Usage

### Step 1 - annotate your async methods

```ts
import { AsyncSpyable } from 'jasmine-async-spies';

export class SomeService{

   @AsyncSpyable() // <- this is required for the resolveWith / rejectWith to automatically work
   getSomething():Promise<any>{
      return Promise.resolve();
   }
   
   @AsyncSpyable() // <- this is required for the nextWith to automatically work
   getStream():Observable<any>{
    return Observable.of();
   }
   
   getSyncName(){
    return 'Some Name' 
   }
   
}

```

### Step 2 - Create and setup the Spy

```ts
import { Spy, createSpyFromClass } from 'jasmine-async-spies';

let someServiceSpy: Spy<SomeService>;

beforeEach( ()=> {
  someServiceSpy = createSpyFromClass(SomeService)
});

it(){
  // BASIC SYNC METHOD
  someServiceSpy.getSyncName.and.returnValue('Successful sync call');
  
  // PROMISES
  someServiceSpy.getSomething.and.resolveWith('Successful promise');
  someServiceSpy.getSomething.and.rejectWith('Successful promise');
  
  // OBSERVABLE
  someServiceSpy.getStream.and.nextWith('Successful observable');
  
  

}

```

