# AbstractSequentialPromiseChain &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ndphan/AbstractSequentialPromiseChain/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/abstract-sequential-promise-chain.svg?style=flat)](https://www.npmjs.com/package/abstract-sequential-promise-chain)

Wraps a function to become a sequential promise chain. 
It will keep track and chain promises together automatically on multiple invocations of the same function.

For example:
```
WrapperMethod = Wrapped(Function A)

Calls
WrapperMethod(1)
WrapperMethod(2)
WrapperMethod(3)

It will automatically call one after the other and ignores catch conditions.

Resolves WrapperMethod(1) then/catch WrapperMethod(2) then/catch WrapperMethod(3)
```

Therefore any async calls to Function A will automatically resolve sequentially but in an async manner.

This is useful when you need to ensure async calls are in order but the function calls occur in different code boundaries.

## Getting Started

Simply call it on a function that returns a promise and use the result function in future calls to chain requests.

```javascript
import abstractSeqPromiseChain from "abstract-sequential-promise-chain";

const chainedAsyncFunction = abstractSeqPromiseChain(asyncFunction);
```

## Example
This shows that even though the timeout should have resulted in 5, 4, 3, 2, 1, however, as this was chained, the order was 1, 2, 3, 4, 5.

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
