# AbstractSequentialPromiseChain &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ndphan/AbstractSequentialPromiseChain/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/abstract-sequential-promise-chain.svg?style=flat)](https://www.npmjs.com/package/abstract-sequential-promise-chain)

A wrapper for a promise function that will keep track and resolve the promise in order of execution.
This is useful when you need to ensure promises are in order but the function calls occur in different code boundaries.

## Installation

```bash
npm i abstract-sequential-promise-chain
```

## Usage
Call the AbstractSequentialPromiseChain function on a promise function parameter to return a wrapper.

```javascript
import abstractSeqPromiseChain from "abstract-sequential-promise-chain";

function asyncFunction(count) {
  return new Promise((resolve, reject) => {
    // try reverse order
    const timeout = 1000.0 / count;
    setTimeout(() => {
      resolve(count);
    }, timeout);
  });
}

const chainedAsyncFunction = abstractSeqPromiseChain(asyncFunction);
```

## Example
```javascript
import abstractSeqPromiseChain from "abstract-sequential-promise-chain";

function asyncFunction(count) {
  return new Promise((resolve, reject) => {
    // try reverse order
    const timeout = 1000.0 / count;
    setTimeout(() => {
      resolve(count);
    }, timeout);
  });
}

const chainedAsyncFunction = abstractSeqPromiseChain(asyncFunction);

let startTime = new Date();
for (let count = 1; count <= 5; count++) {
  chainedAsyncFunction(count)
    .then(order => {
      const elapsed = new Date() - startTime;
      console.log(`${order}: took ${elapsed} mills`);
      startTime = new Date();
    })
    .catch(console.error);
}

// Output
// 1: took 1004 mills
// 2: took 504 mills
// 3: took 335 mills
// 4: took 255 mills
// 5: took 205 mills
```

This shows that even though the timeout should have resulted in 5, 4, 3, 2, 1. However, as this was chained, the order was 1, 2, 3, 4, 5.

## Api
function AbstractSequentialPromiseChain(promiseFunction)

parameters
- promiseFunction: a function that returns a promise
