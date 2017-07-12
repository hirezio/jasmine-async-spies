# jasmine-async-spies
Automatic Async spies for promises and observables in TypeScript Jasmine Tests


## Motivation

Setting up ways to control async objects like promises, or potential async objects like Observables is hard.

What if there was a short and simple API for setting up async spies in Jasmine. 

## Requirements

`emitDecoratorMetadata: true`

Add `@AsyncSpyable()` before every method which returns a Promise or an Observable

## Installation

## Usage

`let someClassSpy = createAsyncSpy(SomeClass)`
