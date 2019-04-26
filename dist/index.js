"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sequentialPromise;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AbstractSequentialPromiseChain = function AbstractSequentialPromiseChain(originalFunction) {
  var _this = this;

  _classCallCheck(this, AbstractSequentialPromiseChain);

  _defineProperty(this, "active", []);

  _defineProperty(this, "pending", []);

  _defineProperty(this, "id", 0);

  _defineProperty(this, "originalFunction", void 0);

  _defineProperty(this, "chainedFunction", function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      if (!_this.active.length) {
        var active = _this._buildRequest(resolve, reject, args);

        _this._resolveActive(active);
      } else {
        var pending = _this._buildRequest(resolve, reject, args);

        _this.pending.push(pending);
      }
    });
  });

  _defineProperty(this, "_callFunction", function (args) {
    return _this.originalFunction.apply(_this, args);
  });

  _defineProperty(this, "_buildRequest", function (resolve, reject, args) {
    return {
      args: args,
      resolve: resolve,
      reject: reject,
      isResolved: false,
      isError: false,
      isResolving: false,
      id: _this.id++
    };
  });

  _defineProperty(this, "_next", function () {
    _this.active = _this.active.filter(function (active) {
      return !active.isResolved && !active.isError;
    });
    if (!_this.pending.length) return;

    var nextActive = _this.pending.shift();

    _this._resolveActive(nextActive);
  });

  _defineProperty(this, "_resolveActive", function (active) {
    _this.active.push(active);

    active.isResolving = true;
    var args = active.args;

    _this._callFunction(args).then(function (result) {
      active.isResolved = true;
      active.isResolving = false;
      active.resolve(result);
    }).catch(function (error) {
      active.isError = true;
      active.isResolving = false;
      active.reject(error);
    }).then(_this._next);
  });

  this.originalFunction = originalFunction;
};

function sequentialPromise(requestFunction) {
  var seqPromise = new AbstractSequentialPromiseChain(requestFunction);
  var chainedFunction = seqPromise.chainedFunction;
  chainedFunction._internals = seqPromise;
  return chainedFunction;
}
