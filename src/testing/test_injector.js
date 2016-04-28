'use strict';"use strict";
var core_1 = require('angular2/core');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('./async');
var async_test_completer_1 = require('./async_test_completer');
var async_2 = require('./async');
exports.async = async_2.async;
var TestInjector = (function () {
    function TestInjector() {
        this._instantiated = false;
        this._injector = null;
        this._providers = [];
        this.platformProviders = [];
        this.applicationProviders = [];
    }
    TestInjector.prototype.reset = function () {
        this._injector = null;
        this._providers = [];
        this._instantiated = false;
    };
    TestInjector.prototype.addProviders = function (providers) {
        if (this._instantiated) {
            throw new exceptions_1.BaseException('Cannot add providers after test injector is instantiated');
        }
        this._providers = collection_1.ListWrapper.concat(this._providers, providers);
    };
    TestInjector.prototype.createInjector = function () {
        var rootInjector = core_1.ReflectiveInjector.resolveAndCreate(this.platformProviders);
        this._injector = rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(this.applicationProviders, this._providers));
        this._instantiated = true;
        return this._injector;
    };
    TestInjector.prototype.get = function (token) {
        if (!this._instantiated) {
            this.createInjector();
        }
        return this._injector.get(token);
    };
    TestInjector.prototype.execute = function (tokens, fn) {
        var _this = this;
        if (!this._instantiated) {
            this.createInjector();
        }
        var params = tokens.map(function (t) { return _this._injector.get(t); });
        return lang_1.FunctionWrapper.apply(fn, params);
    };
    return TestInjector;
}());
exports.TestInjector = TestInjector;
var _testInjector = null;
function getTestInjector() {
    if (_testInjector == null) {
        _testInjector = new TestInjector();
    }
    return _testInjector;
}
exports.getTestInjector = getTestInjector;
/**
 * Set the providers that the test injector should use. These should be providers
 * common to every test in the suite.
 *
 * This may only be called once, to set up the common providers for the current test
 * suite on teh current platform. If you absolutely need to change the providers,
 * first use `resetBaseTestProviders`.
 *
 * Test Providers for individual platforms are available from
 * 'angular2/platform/testing/<platform_name>'.
 */
function setBaseTestProviders(platformProviders, applicationProviders) {
    var testInjector = getTestInjector();
    if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
        throw new exceptions_1.BaseException('Cannot set base providers because it has already been called');
    }
    testInjector.platformProviders = platformProviders;
    testInjector.applicationProviders = applicationProviders;
    var injector = testInjector.createInjector();
    var inits = injector.get(core_1.PLATFORM_INITIALIZER, null);
    if (lang_1.isPresent(inits)) {
        inits.forEach(function (init) { return init(); });
    }
    testInjector.reset();
}
exports.setBaseTestProviders = setBaseTestProviders;
/**
 * Reset the providers for the test injector.
 */
function resetBaseTestProviders() {
    var testInjector = getTestInjector();
    testInjector.platformProviders = [];
    testInjector.applicationProviders = [];
    testInjector.reset();
}
exports.resetBaseTestProviders = resetBaseTestProviders;
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {Function}
 */
function inject(tokens, fn) {
    var testInjector = getTestInjector();
    if (tokens.indexOf(async_test_completer_1.AsyncTestCompleter) >= 0) {
        // Return an async test method that returns a Promise if AsyncTestCompleter is one of the
        // injected tokens.
        return function () {
            var completer = testInjector.get(async_test_completer_1.AsyncTestCompleter);
            testInjector.execute(tokens, fn);
            return completer.promise;
        };
    }
    else {
        // Return a synchronous test method with the injected tokens.
        return function () { return getTestInjector().execute(tokens, fn); };
    }
}
exports.inject = inject;
var InjectSetupWrapper = (function () {
    function InjectSetupWrapper(_providers) {
        this._providers = _providers;
    }
    InjectSetupWrapper.prototype._addProviders = function () {
        var additionalProviders = this._providers();
        if (additionalProviders.length > 0) {
            getTestInjector().addProviders(additionalProviders);
        }
    };
    InjectSetupWrapper.prototype.inject = function (tokens, fn) {
        var _this = this;
        return function () {
            _this._addProviders();
            return inject(tokens, fn)();
        };
    };
    /** @Deprecated {use async(withProviders().inject())} */
    InjectSetupWrapper.prototype.injectAsync = function (tokens, fn) {
        var _this = this;
        return function () {
            _this._addProviders();
            return injectAsync(tokens, fn)();
        };
    };
    return InjectSetupWrapper;
}());
exports.InjectSetupWrapper = InjectSetupWrapper;
function withProviders(providers) {
    return new InjectSetupWrapper(providers);
}
exports.withProviders = withProviders;
/**
 * @Deprecated {use async(inject())}
 *
 * Allows injecting dependencies in `beforeEach()` and `it()`. The test must return
 * a promise which will resolve when all asynchronous activity is complete.
 *
 * Example:
 *
 * ```
 * it('...', injectAsync([AClass], (object) => {
 *   return object.doSomething().then(() => {
 *     expect(...);
 *   });
 * })
 * ```
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {Function}
 */
function injectAsync(tokens, fn) {
    return async_1.async(inject(tokens, fn));
}
exports.injectAsync = injectAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtc1BoU3JUa0sudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpRSxlQUFlLENBQUMsQ0FBQTtBQUNqRiwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCxxQkFBK0MsMEJBQTBCLENBQUMsQ0FBQTtBQUUxRSxzQkFBb0IsU0FBUyxDQUFDLENBQUE7QUFDOUIscUNBQWlDLHdCQUF3QixDQUFDLENBQUE7QUFFMUQsc0JBQW9CLFNBQVMsQ0FBQztBQUF0Qiw4QkFBc0I7QUFFOUI7SUFBQTtRQUNVLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRS9CLGNBQVMsR0FBdUIsSUFBSSxDQUFDO1FBRXJDLGVBQVUsR0FBbUMsRUFBRSxDQUFDO1FBUXhELHNCQUFpQixHQUFtQyxFQUFFLENBQUM7UUFFdkQseUJBQW9CLEdBQW1DLEVBQUUsQ0FBQztJQStCNUQsQ0FBQztJQXZDQyw0QkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQU1ELG1DQUFZLEdBQVosVUFBYSxTQUF5QztRQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLElBQUksMEJBQWEsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLHdCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7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LENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdEQsQ0FBQztJQUNILENBQUM7SUFFRCxtQ0FBTSxHQUFOLFVBQU8sTUFBYSxFQUFFLEVBQVk7UUFBbEMsaUJBS0M7UUFKQyxNQUFNLENBQUM7WUFDTCxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELHdDQUFXLEdBQVgsVUFBWSxNQUFhLEVBQUUsRUFBWTtRQUF2QyxpQkFLQztRQUpDLE1BQU0sQ0FBQztZQUNMLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25DLENBQUMsQ0FBQTtJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4QlksMEJBQWtCLHFCQXdCOUIsQ0FBQTtBQUVELHVCQUE4QixTQUFvQjtJQUNoRCxNQUFNLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRmUscUJBQWEsZ0JBRTVCLENBQUE7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILHFCQUE0QixNQUFhLEVBQUUsRUFBWTtJQUNyRCxNQUFNLENBQUMsYUFBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRmUsbUJBQVcsY0FFMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVmbGVjdGl2ZUluamVjdG9yLCBQcm92aWRlciwgUExBVEZPUk1fSU5JVElBTElaRVJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBFeGNlcHRpb25IYW5kbGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7RnVuY3Rpb25XcmFwcGVyLCBpc1ByZXNlbnQsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7YXN5bmN9IGZyb20gJy4vYXN5bmMnO1xuaW1wb3J0IHtBc3luY1Rlc3RDb21wbGV0ZXJ9IGZyb20gJy4vYXN5bmNfdGVzdF9jb21wbGV0ZXInO1xuXG5leHBvcnQge2FzeW5jfSBmcm9tICcuL2FzeW5jJztcblxuZXhwb3J0IGNsYXNzIFRlc3RJbmplY3RvciB7XG4gIHByaXZhdGUgX2luc3RhbnRpYXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2luamVjdG9yOiBSZWZsZWN0aXZlSW5qZWN0b3IgPSBudWxsO1xuXG4gIHByaXZhdGUgX3Byb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5faW5qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuX3Byb3ZpZGVycyA9IFtdO1xuICAgIHRoaXMuX2luc3RhbnRpYXRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxhdGZvcm1Qcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IFtdO1xuXG4gIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBbXTtcblxuICBhZGRQcm92aWRlcnMocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgICBpZiAodGhpcy5faW5zdGFudGlhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IGFkZCBwcm92aWRlcnMgYWZ0ZXIgdGVzdCBpbmplY3RvciBpcyBpbnN0YW50aWF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gTGlzdFdyYXBwZXIuY29uY2F0KHRoaXMuX3Byb3ZpZGVycywgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIGNyZWF0ZUluamVjdG9yKCkge1xuICAgIHZhciByb290SW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZSh0aGlzLnBsYXRmb3JtUHJvdmlkZXJzKTtcbiAgICB0aGlzLl9pbmplY3RvciA9IHJvb3RJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlQ2hpbGQoXG4gICAgICAgIExpc3RXcmFwcGVyLmNvbmNhdCh0aGlzLmFwcGxpY2F0aW9uUHJvdmlkZXJzLCB0aGlzLl9wcm92aWRlcnMpKTtcbiAgICB0aGlzLl9pbnN0YW50aWF0ZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9pbmplY3RvcjtcbiAgfVxuXG4gIGdldCh0b2tlbjogYW55KSB7XG4gICAgaWYgKCF0aGlzLl9pbnN0YW50aWF0ZWQpIHtcbiAgICAgIHRoaXMuY3JlYXRlSW5qZWN0b3IoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2luamVjdG9yLmdldCh0b2tlbik7XG4gIH1cblxuICBleGVjdXRlKHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IGFueSB7XG4gICAgaWYgKCF0aGlzLl9pbnN0YW50aWF0ZWQpIHtcbiAgICAgIHRoaXMuY3JlYXRlSW5qZWN0b3IoKTtcbiAgICB9XG4gICAgdmFyIHBhcmFtcyA9IHRva2Vucy5tYXAodCA9PiB0aGlzLl9pbmplY3Rvci5nZXQodCkpO1xuICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkoZm4sIHBhcmFtcyk7XG4gIH1cbn1cblxudmFyIF90ZXN0SW5qZWN0b3I6IFRlc3RJbmplY3RvciA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXN0SW5qZWN0b3IoKSB7XG4gIGlmIChfdGVzdEluamVjdG9yID09IG51bGwpIHtcbiAgICBfdGVzdEluamVjdG9yID0gbmV3IFRlc3RJbmplY3RvcigpO1xuICB9XG4gIHJldHVybiBfdGVzdEluamVjdG9yO1xufVxuXG4vKipcbiAqIFNldCB0aGUgcHJvdmlkZXJzIHRoYXQgdGhlIHRlc3QgaW5qZWN0b3Igc2hvdWxkIHVzZS4gVGhlc2Ugc2hvdWxkIGJlIHByb3ZpZGVyc1xuICogY29tbW9uIHRvIGV2ZXJ5IHRlc3QgaW4gdGhlIHN1aXRlLlxuICpcbiAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICogc3VpdGUgb24gdGVoIGN1cnJlbnQgcGxhdGZvcm0uIElmIHlvdSBhYnNvbHV0ZWx5IG5lZWQgdG8gY2hhbmdlIHRoZSBwcm92aWRlcnMsXG4gKiBmaXJzdCB1c2UgYHJlc2V0QmFzZVRlc3RQcm92aWRlcnNgLlxuICpcbiAqIFRlc3QgUHJvdmlkZXJzIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAqICdhbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nLzxwbGF0Zm9ybV9uYW1lPicuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRCYXNlVGVzdFByb3ZpZGVycyhwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgdmFyIHRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuICBpZiAodGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzLmxlbmd0aCA+IDAgfHwgdGVzdEluamVjdG9yLmFwcGxpY2F0aW9uUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gIH1cbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gcGxhdGZvcm1Qcm92aWRlcnM7XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IGFwcGxpY2F0aW9uUHJvdmlkZXJzO1xuICB2YXIgaW5qZWN0b3IgPSB0ZXN0SW5qZWN0b3IuY3JlYXRlSW5qZWN0b3IoKTtcbiAgbGV0IGluaXRzOiBGdW5jdGlvbltdID0gaW5qZWN0b3IuZ2V0KFBMQVRGT1JNX0lOSVRJQUxJWkVSLCBudWxsKTtcbiAgaWYgKGlzUHJlc2VudChpbml0cykpIHtcbiAgICBpbml0cy5mb3JFYWNoKGluaXQgPT4gaW5pdCgpKTtcbiAgfVxuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0QmFzZVRlc3RQcm92aWRlcnMoKSB7XG4gIHZhciB0ZXN0SW5qZWN0b3IgPSBnZXRUZXN0SW5qZWN0b3IoKTtcbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gW107XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IFtdO1xuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBBbGxvd3MgaW5qZWN0aW5nIGRlcGVuZGVuY2llcyBpbiBgYmVmb3JlRWFjaCgpYCBhbmQgYGl0KClgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBiZWZvcmVFYWNoKGluamVjdChbRGVwZW5kZW5jeSwgQUNsYXNzXSwgKGRlcCwgb2JqZWN0KSA9PiB7XG4gKiAgIC8vIHNvbWUgY29kZSB0aGF0IHVzZXMgYGRlcGAgYW5kIGBvYmplY3RgXG4gKiAgIC8vIC4uLlxuICogfSkpO1xuICpcbiAqIGl0KCcuLi4nLCBpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nKCk7XG4gKiAgIGV4cGVjdCguLi4pO1xuICogfSlcbiAqIGBgYFxuICpcbiAqIE5vdGVzOlxuICogLSBpbmplY3QgaXMgY3VycmVudGx5IGEgZnVuY3Rpb24gYmVjYXVzZSBvZiBzb21lIFRyYWNldXIgbGltaXRhdGlvbiB0aGUgc3ludGF4IHNob3VsZFxuICogZXZlbnR1YWxseVxuICogICBiZWNvbWVzIGBpdCgnLi4uJywgQEluamVjdCAob2JqZWN0OiBBQ2xhc3MsIGFzeW5jOiBBc3luY1Rlc3RDb21wbGV0ZXIpID0+IHsgLi4uIH0pO2BcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdCh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gIGxldCB0ZXN0SW5qZWN0b3IgPSBnZXRUZXN0SW5qZWN0b3IoKTtcbiAgaWYgKHRva2Vucy5pbmRleE9mKEFzeW5jVGVzdENvbXBsZXRlcikgPj0gMCkge1xuICAgIC8vIFJldHVybiBhbiBhc3luYyB0ZXN0IG1ldGhvZCB0aGF0IHJldHVybnMgYSBQcm9taXNlIGlmIEFzeW5jVGVzdENvbXBsZXRlciBpcyBvbmUgb2YgdGhlXG4gICAgLy8gaW5qZWN0ZWQgdG9rZW5zLlxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgY29tcGxldGVyOiBBc3luY1Rlc3RDb21wbGV0ZXIgPSB0ZXN0SW5qZWN0b3IuZ2V0KEFzeW5jVGVzdENvbXBsZXRlcik7XG4gICAgICB0ZXN0SW5qZWN0b3IuZXhlY3V0ZSh0b2tlbnMsIGZuKTtcbiAgICAgIHJldHVybiBjb21wbGV0ZXIucHJvbWlzZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gUmV0dXJuIGEgc3luY2hyb25vdXMgdGVzdCBtZXRob2Qgd2l0aCB0aGUgaW5qZWN0ZWQgdG9rZW5zLlxuICAgIHJldHVybiAoKSA9PiB7IHJldHVybiBnZXRUZXN0SW5qZWN0b3IoKS5leGVjdXRlKHRva2VucywgZm4pOyB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RTZXR1cFdyYXBwZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wcm92aWRlcnM6ICgpID0+IGFueSkge31cblxuICBwcml2YXRlIF9hZGRQcm92aWRlcnMoKSB7XG4gICAgdmFyIGFkZGl0aW9uYWxQcm92aWRlcnMgPSB0aGlzLl9wcm92aWRlcnMoKTtcbiAgICBpZiAoYWRkaXRpb25hbFByb3ZpZGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBnZXRUZXN0SW5qZWN0b3IoKS5hZGRQcm92aWRlcnMoYWRkaXRpb25hbFByb3ZpZGVycyk7XG4gICAgfVxuICB9XG5cbiAgaW5qZWN0KHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fYWRkUHJvdmlkZXJzKCk7XG4gICAgICByZXR1cm4gaW5qZWN0KHRva2VucywgZm4pKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMod2l0aFByb3ZpZGVycygpLmluamVjdCgpKX0gKi9cbiAgaW5qZWN0QXN5bmModG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9hZGRQcm92aWRlcnMoKTtcbiAgICAgIHJldHVybiBpbmplY3RBc3luYyh0b2tlbnMsIGZuKSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFByb3ZpZGVycyhwcm92aWRlcnM6ICgpID0+IGFueSkge1xuICByZXR1cm4gbmV3IEluamVjdFNldHVwV3JhcHBlcihwcm92aWRlcnMpO1xufVxuXG4vKipcbiAqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMoaW5qZWN0KCkpfVxuICpcbiAqIEFsbG93cyBpbmplY3RpbmcgZGVwZW5kZW5jaWVzIGluIGBiZWZvcmVFYWNoKClgIGFuZCBgaXQoKWAuIFRoZSB0ZXN0IG11c3QgcmV0dXJuXG4gKiBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyBhY3Rpdml0eSBpcyBjb21wbGV0ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogaXQoJy4uLicsIGluamVjdEFzeW5jKFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBvYmplY3QuZG9Tb21ldGhpbmcoKS50aGVuKCgpID0+IHtcbiAqICAgICBleHBlY3QoLi4uKTtcbiAqICAgfSk7XG4gKiB9KVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RBc3luYyh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gIHJldHVybiBhc3luYyhpbmplY3QodG9rZW5zLCBmbikpO1xufVxuIl19