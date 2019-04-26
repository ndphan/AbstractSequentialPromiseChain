var abstractSequentialPromiseChain = require("../index").default;
var expect = require("expect");

describe("abstractSequentialPromiseChain", function () {
  describe("#constructor()", function () {
    it("should return a wrapped function", function () {
      expect(sequentialResolve).toBeA("function");
    });
    it("should resolve to a promise resolve", function (done) {
      testResolveTruth(done, sequentialResolve());
    });
    it("should reject to a promise reject", function (done) {
      testRejectTruth(done, sequentialReject());
    });
    it("should resolve to a async promise", function (done) {
      testResolveTruth(done, sequentialTimer(true));
    });
    it("should reject to a async promise", function (done) {
      testRejectTruth(done, sequentialTimer(false));
    });
  });
  describe("chaining promises", function () {
    it("should resolve and reject in order", function (done) {
      var resolved = [];
      var rejected = [];
      for (var index = 0; index < orderTruths.length; index++) {
        var seq = sequentialTimer(orderTruths[index])
          .then(function (value) {
            resolved.push(value);
            rejected.push("placeholder");
            return value;
          })
          .catch(function (error) {
            rejected.push(error);
            resolved.push("placeholder");
            return error;
          });
        if (index === orderTruths.length - 1) {
          seq.then(function () {
            expect(resolved.length).toEqual(orderTruths.length);
            for (var index = 0; index < orderTruths.length; index++) {
              if (orderTruths[index]) {
                expect(resolved[index]).toEqual(orderTruths[index]);
              } else {
                expect(rejected[index]).toEqual(orderTruths[index]);
              }
            }
            done();
          });
        }
      }
    });
    it("should reject in order", function (done) {
      var length = 10;
      var rejected = [];
      for (var index = 0; index < length; index++) {
        var seq = sequentialTimer(false)
          .then(function (value) {
            return value;
          })
          .catch(function (error) {
            rejected.push(error);
            return error;
          });

        if (index === length - 1) {
          seq.then(function () {
            expect(rejected.length).toEqual(length);
            for (var index = 0; index < length; index++) {
              expect(rejected[index]).toEqual(false);
            }
            done();
          });
        }
      }
    });
    it("should resolve in order with different arguments", function (done) {
      var resolved = [];
      for (var index = 0; index < orderArgs.length; index++) {
        var seq = sequentialTimerResolved(orderArgs[index])
          .then(function (value) {
            resolved.push(value);
            return value;
          })
          .catch(function (error) {
            return error;
          });

        if (index === orderArgs.length - 1) {
          seq.then(function () {
            expect(resolved.length).toEqual(orderArgs.length);
            for (var index = 0; index < orderArgs.length; index++) {
              expect(resolved[index]).toEqual(orderArgs[index]);
            }
            done();
          });
        }
      }
    });
  });
  describe("pending and active promises", function () {
    it("should return the correct pending and active promises", function () {
      for (var index = 0; index < orderArgs.length; index++) {
        sequentialTimerResolved(orderArgs[index]);
        expect(sequentialTimerResolved._internals.active).toBeA("array");
        expect(sequentialTimerResolved._internals.active.length).toEqual(1);
        expect(sequentialTimerResolved._internals.pending).toBeA("array");
        expect(sequentialTimerResolved._internals.pending.length).toEqual(
          index
        );
        expect(sequentialTimerResolved._internals.id).toEqual(index + 1);
      }
    });
  });
});


// TEST //
var sequentialResolve;
var sequentialReject;
var sequentialTimerResolved;
var sequentialTimer;
var orderArgs = [true, 1, false, "a", false, function test() { }, true];
var orderTruths = [true, true, false, true, false, false, true];
beforeEach(function () {
  function promiseResolve() {
    return Promise.resolve(true);
  }
  sequentialResolve = abstractSequentialPromiseChain(promiseResolve);

  function promiseReject() {
    return Promise.reject(false);
  }
  sequentialReject = abstractSequentialPromiseChain(promiseReject);

  function promiseTimer(isResolved) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (isResolved) {
          resolve(true);
        } else {
          reject(false);
        }
      }, 2);
    });
  }
  sequentialTimer = abstractSequentialPromiseChain(promiseTimer);

  function promiseTimerResolved(args) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(args);
      }, 2);
    });
  }
  sequentialTimerResolved = abstractSequentialPromiseChain(promiseTimerResolved);
});

function testResolveTruth(done, promise) {
  return promise
    .then(function (value) {
      done(value !== true);
    })
    .catch(function () {
      done(true);
    });
}

function testRejectTruth(done, promise) {
  return promise
    .then(function () {
      done(true);
    })
    .catch(function (value) {
      done(value !== false);
    });
}
