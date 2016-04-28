'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var o = require('../output/output_ast');
var identifiers_1 = require('../identifiers');
var util_1 = require('./util');
var _PurePipeProxy = (function () {
    function _PurePipeProxy(instance, argCount) {
        this.instance = instance;
        this.argCount = argCount;
    }
    return _PurePipeProxy;
}());
var CompilePipe = (function () {
    function CompilePipe(view, name) {
        this.view = view;
        this._purePipeProxies = [];
        this.meta = _findPipeMeta(view, name);
        this.instance = o.THIS_EXPR.prop("_pipe_" + name + "_" + view.pipeCount++);
    }
    Object.defineProperty(CompilePipe.prototype, "pure", {
        get: function () { return this.meta.pure; },
        enumerable: true,
        configurable: true
    });
    CompilePipe.prototype.create = function () {
        var _this = this;
        var deps = this.meta.type.diDeps.map(function (diDep) {
            if (diDep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.ChangeDetectorRef))) {
                return o.THIS_EXPR.prop('ref');
            }
            return util_1.injectFromViewParentInjector(diDep.token, false);
        });
        this.view.fields.push(new o.ClassField(this.instance.name, o.importType(this.meta.type), [o.StmtModifier.Private]));
        this.view.createMethod.resetDebugInfo(null, null);
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(this.instance.name)
            .set(o.importExpr(this.meta.type).instantiate(deps))
            .toStmt());
        this._purePipeProxies.forEach(function (purePipeProxy) {
            util_1.createPureProxy(_this.instance.prop('transform').callMethod(o.BuiltinMethod.bind, [_this.instance]), purePipeProxy.argCount, purePipeProxy.instance, _this.view);
        });
    };
    CompilePipe.prototype.call = function (callingView, args) {
        if (this.meta.pure) {
            var purePipeProxy = new _PurePipeProxy(o.THIS_EXPR.prop(this.instance.name + "_" + this._purePipeProxies.length), args.length);
            this._purePipeProxies.push(purePipeProxy);
            return util_1.getPropertyInView(o.importExpr(identifiers_1.Identifiers.castByValue)
                .callFn([purePipeProxy.instance, this.instance.prop('transform')]), callingView, this.view)
                .callFn(args);
        }
        else {
            return util_1.getPropertyInView(this.instance, callingView, this.view).callMethod('transform', args);
        }
    };
    return CompilePipe;
}());
exports.CompilePipe = CompilePipe;
function _findPipeMeta(view, name) {
    var pipeMeta = null;
    for (var i = view.pipeMetas.length - 1; i >= 0; i--) {
        var localPipeMeta = view.pipeMetas[i];
        if (localPipeMeta.name == name) {
            pipeMeta = localPipeMeta;
            break;
        }
    }
    if (lang_1.isBlank(pipeMeta)) {
        throw new exceptions_1.BaseException("Illegal state: Could not find pipe " + name + " although the parser should have detected this error!");
    }
    return pipeMeta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1lTFc3Y2Rkei50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29tcGlsZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBaUMsMEJBQTBCLENBQUMsQ0FBQTtBQUM1RCwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUM3RCxJQUFZLENBQUMsV0FBTSxzQkFBc0IsQ0FBQyxDQUFBO0FBRzFDLDRCQUEyQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVELHFCQUErRSxRQUFRLENBQUMsQ0FBQTtBQUV4RjtJQUNFLHdCQUFtQixRQUF3QixFQUFTLFFBQWdCO1FBQWpELGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUFHLENBQUM7SUFDMUUscUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVEO0lBS0UscUJBQW1CLElBQWlCLEVBQUUsSUFBWTtRQUEvQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBRjVCLHFCQUFnQixHQUFxQixFQUFFLENBQUM7UUFHOUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBUyxJQUFJLFNBQUksSUFBSSxDQUFDLFNBQVMsRUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELHNCQUFJLDZCQUFJO2FBQVIsY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFOUMsNEJBQU0sR0FBTjtRQUFBLGlCQWtCQztRQWpCQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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QUFBRCxDQUFDLEFBOUNELElBOENDO0FBOUNZLG1CQUFXLGNBOEN2QixDQUFBO0FBR0QsdUJBQXVCLElBQWlCLEVBQUUsSUFBWTtJQUNwRCxJQUFJLFFBQVEsR0FBd0IsSUFBSSxDQUFDO0lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0IsUUFBUSxHQUFHLGFBQWEsQ0FBQztZQUN6QixLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0gsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxJQUFJLDBCQUFhLENBQ25CLHdDQUFzQyxJQUFJLDBEQUF1RCxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge0NvbXBpbGVQaXBlTWV0YWRhdGF9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtJZGVudGlmaWVycywgaWRlbnRpZmllclRva2VufSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge2luamVjdEZyb21WaWV3UGFyZW50SW5qZWN0b3IsIGNyZWF0ZVB1cmVQcm94eSwgZ2V0UHJvcGVydHlJblZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIF9QdXJlUGlwZVByb3h5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGluc3RhbmNlOiBvLlJlYWRQcm9wRXhwciwgcHVibGljIGFyZ0NvdW50OiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlUGlwZSB7XG4gIG1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGE7XG4gIGluc3RhbmNlOiBvLlJlYWRQcm9wRXhwcjtcbiAgcHJpdmF0ZSBfcHVyZVBpcGVQcm94aWVzOiBfUHVyZVBpcGVQcm94eVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1ldGEgPSBfZmluZFBpcGVNZXRhKHZpZXcsIG5hbWUpO1xuICAgIHRoaXMuaW5zdGFuY2UgPSBvLlRISVNfRVhQUi5wcm9wKGBfcGlwZV8ke25hbWV9XyR7dmlldy5waXBlQ291bnQrK31gKTtcbiAgfVxuXG4gIGdldCBwdXJlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tZXRhLnB1cmU7IH1cblxuICBjcmVhdGUoKTogdm9pZCB7XG4gICAgdmFyIGRlcHMgPSB0aGlzLm1ldGEudHlwZS5kaURlcHMubWFwKChkaURlcCkgPT4ge1xuICAgICAgaWYgKGRpRGVwLnRva2VuLmVxdWFsc1RvKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5DaGFuZ2VEZXRlY3RvclJlZikpKSB7XG4gICAgICAgIHJldHVybiBvLlRISVNfRVhQUi5wcm9wKCdyZWYnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmplY3RGcm9tVmlld1BhcmVudEluamVjdG9yKGRpRGVwLnRva2VuLCBmYWxzZSk7XG4gICAgfSk7XG4gICAgdGhpcy52aWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQodGhpcy5pbnN0YW5jZS5uYW1lLCBvLmltcG9ydFR5cGUodGhpcy5tZXRhLnR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QucmVzZXREZWJ1Z0luZm8obnVsbCwgbnVsbCk7XG4gICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KG8uVEhJU19FWFBSLnByb3AodGhpcy5pbnN0YW5jZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIodGhpcy5tZXRhLnR5cGUpLmluc3RhbnRpYXRlKGRlcHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgICB0aGlzLl9wdXJlUGlwZVByb3hpZXMuZm9yRWFjaCgocHVyZVBpcGVQcm94eSkgPT4ge1xuICAgICAgY3JlYXRlUHVyZVByb3h5KFxuICAgICAgICAgIHRoaXMuaW5zdGFuY2UucHJvcCgndHJhbnNmb3JtJykuY2FsbE1ldGhvZChvLkJ1aWx0aW5NZXRob2QuYmluZCwgW3RoaXMuaW5zdGFuY2VdKSxcbiAgICAgICAgICBwdXJlUGlwZVByb3h5LmFyZ0NvdW50LCBwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLnZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsbChjYWxsaW5nVmlldzogQ29tcGlsZVZpZXcsIGFyZ3M6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5tZXRhLnB1cmUpIHtcbiAgICAgIHZhciBwdXJlUGlwZVByb3h5ID0gbmV3IF9QdXJlUGlwZVByb3h5KFxuICAgICAgICAgIG8uVEhJU19FWFBSLnByb3AoYCR7dGhpcy5pbnN0YW5jZS5uYW1lfV8ke3RoaXMuX3B1cmVQaXBlUHJveGllcy5sZW5ndGh9YCksIGFyZ3MubGVuZ3RoKTtcbiAgICAgIHRoaXMuX3B1cmVQaXBlUHJveGllcy5wdXNoKHB1cmVQaXBlUHJveHkpO1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KFxuICAgICAgICAgICAgICAgICBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuY2FzdEJ5VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAuY2FsbEZuKFtwdXJlUGlwZVByb3h5Lmluc3RhbmNlLCB0aGlzLmluc3RhbmNlLnByb3AoJ3RyYW5zZm9ybScpXSksXG4gICAgICAgICAgICAgICAgIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpXG4gICAgICAgICAgLmNhbGxGbihhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5WaWV3KHRoaXMuaW5zdGFuY2UsIGNhbGxpbmdWaWV3LCB0aGlzLnZpZXcpLmNhbGxNZXRob2QoJ3RyYW5zZm9ybScsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIF9maW5kUGlwZU1ldGEodmlldzogQ29tcGlsZVZpZXcsIG5hbWU6IHN0cmluZyk6IENvbXBpbGVQaXBlTWV0YWRhdGEge1xuICB2YXIgcGlwZU1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGEgPSBudWxsO1xuICBmb3IgKHZhciBpID0gdmlldy5waXBlTWV0YXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbG9jYWxQaXBlTWV0YSA9IHZpZXcucGlwZU1ldGFzW2ldO1xuICAgIGlmIChsb2NhbFBpcGVNZXRhLm5hbWUgPT0gbmFtZSkge1xuICAgICAgcGlwZU1ldGEgPSBsb2NhbFBpcGVNZXRhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChpc0JsYW5rKHBpcGVNZXRhKSkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ291bGQgbm90IGZpbmQgcGlwZSAke25hbWV9IGFsdGhvdWdoIHRoZSBwYXJzZXIgc2hvdWxkIGhhdmUgZGV0ZWN0ZWQgdGhpcyBlcnJvciFgKTtcbiAgfVxuICByZXR1cm4gcGlwZU1ldGE7XG59XG4iXX0=