class AbstractSequentialPromiseChain {
  active = [];
  pending = [];
  id = 0;
  originalFunction;

  constructor(originalFunction) {
    this.originalFunction = originalFunction;
  }

  chainedFunction = (...args) => {
    return new Promise((resolve, reject) => {
      if(!this.active.length){        
        const active = this._buildRequest(resolve, reject, args);
        this._resolveActive(active);
      } else {
        const pending = this._buildRequest(resolve, reject, args)
        this.pending.push(pending)
      }
    })
  }

  _callFunction = (args) => {
    return this.originalFunction.apply(this, args);
  }

  _buildRequest = (resolve, reject, args) => {
    return {
      args: args,
      resolve: resolve, 
      reject: reject,
      isResolved: false,
      isError: false,
      isResolving: false,
      id: this.id++
    }
  }

  _next = () => {
    this.active = this.active.filter(active => !active.isResolved && !active.isError);
    if(!this.pending.length) return;

    const nextActive = this.pending.shift();
    this._resolveActive(nextActive);
  }

  _resolveActive = (active) => {
    this.active.push(active);
    active.isResolving = true;
    const args = active.args;
    this._callFunction(args).then(result => {
      active.isResolved = true;
      active.isResolving = false;
      active.resolve(result);
    }).catch(error => {
      active.isError = true;
      active.isResolving = false;
      active.reject(error);
    }).then(this._next);
  }
}

export default function sequentialPromise(requestFunction){
  const seqPromise = new AbstractSequentialPromiseChain(requestFunction);
  const chainedFunction = seqPromise.chainedFunction;
  chainedFunction._internals = seqPromise;
  return chainedFunction;
}