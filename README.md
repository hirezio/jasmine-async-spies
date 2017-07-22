# jasmine-async-spies
Automatic Async spies for promises and observables in TypeScript Jasmine Tests
Setting up async (promises / observables) spies is too hard, and you don't get type completion. 
What if there was a short and simple API for setting up automatic async spies in Jasmine?

## Benefits

- [x] **Keep you tests Dry** - no more repeated spy setup code, no need for separate spy files

- [x] **Type completion** for both the original Class and the spy methods

- [x] **Automatic return type detection** by using a simple decorator


## Installation

`npm install -D jasmine-async-spies`

## Requirements

In `tsconfig.json` set: 
```json
 "compilerOptions": {
   "emitDecoratorMetadata": true
 }

``` 

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

