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
