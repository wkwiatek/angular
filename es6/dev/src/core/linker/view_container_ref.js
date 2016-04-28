import { ListWrapper } from 'angular2/src/facade/collection';
import { unimplemented } from 'angular2/src/facade/exceptions';
import { isPresent } from 'angular2/src/facade/lang';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
/**
 * Represents a container where one or more Views can be attached.
 *
 * The container can contain two kinds of Views. Host Views, created by instantiating a
 * {@link Component} via {@link #createComponent}, and Embedded Views, created by instantiating an
 * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
 *
 * The location of the View Container within the containing View is specified by the Anchor
 * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
 * have a single View Container.
 *
 * Root elements of Views attached to this container become siblings of the Anchor Element in
 * the Rendered View.
 *
 * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
 * with `ViewContainerRef` on the Element, or you obtain it via a {@link ViewChild} query.
 */
export class ViewContainerRef {
    /**
     * Anchor element that specifies the location of this container in the containing View.
     * <!-- TODO: rename to anchorElement -->
     */
    get element() { return unimplemented(); }
    get injector() { return unimplemented(); }
    get parentInjector() { return unimplemented(); }
    /**
     * Returns the number of Views currently attached to this container.
     */
    get length() { return unimplemented(); }
    ;
}
export class ViewContainerRef_ {
    constructor(_element) {
        this._element = _element;
        /** @internal */
        this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
        /** @internal */
        this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
        /** @internal */
        this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
        /** @internal */
        this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
    }
    get(index) { return this._element.nestedViews[index].ref; }
    get length() {
        var views = this._element.nestedViews;
        return isPresent(views) ? views.length : 0;
    }
    get element() { return this._element.elementRef; }
    get injector() { return this._element.injector; }
    get parentInjector() { return this._element.parentInjector; }
    // TODO(rado): profile and decide whether bounds checks should be added
    // to the methods below.
    createEmbeddedView(templateRef, index = -1) {
        var viewRef = templateRef.createEmbeddedView();
        this.insert(viewRef, index);
        return viewRef;
    }
    createComponent(componentFactory, index = -1, injector = null, projectableNodes = null) {
        var s = this._createComponentInContainerScope();
        var contextInjector = isPresent(injector) ? injector : this._element.parentInjector;
        var componentRef = componentFactory.create(contextInjector, projectableNodes);
        this.insert(componentRef.hostView, index);
        return wtfLeave(s, componentRef);
    }
    // TODO(i): refactor insert+remove into move
    insert(viewRef, index = -1) {
        var s = this._insertScope();
        if (index == -1)
            index = this.length;
        var viewRef_ = viewRef;
        this._element.attachView(viewRef_.internalView, index);
        return wtfLeave(s, viewRef_);
    }
    indexOf(viewRef) {
        return ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
    }
    // TODO(i): rename to destroy
    remove(index = -1) {
        var s = this._removeScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        view.destroy();
        // view is intentionally not returned to the client.
        wtfLeave(s);
    }
    // TODO(i): refactor insert+remove into move
    detach(index = -1) {
        var s = this._detachScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        return wtfLeave(s, view.ref);
    }
    clear() {
        for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb250YWluZXJfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC03cWU3ZkZrVi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfY29udGFpbmVyX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUVyRCxFQUFDLFNBQVMsRUFBVSxNQUFNLDBCQUEwQjtPQUNwRCxFQUFDLGNBQWMsRUFBRSxRQUFRLEVBQWEsTUFBTSxvQkFBb0I7QUFTdkU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQUNFOzs7T0FHRztJQUNILElBQUksT0FBTyxLQUFpQixNQUFNLENBQWEsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWpFLElBQUksUUFBUSxLQUFlLE1BQU0sQ0FBVyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUQsSUFBSSxjQUFjLEtBQWUsTUFBTSxDQUFXLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQVlwRTs7T0FFRztJQUNILElBQUksTUFBTSxLQUFhLE1BQU0sQ0FBUyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBd0QxRCxDQUFDO0FBRUQ7SUFDRSxZQUFvQixRQUFvQjtRQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBc0J4QyxnQkFBZ0I7UUFDaEIscUNBQWdDLEdBQzVCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBV3pELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBZTNELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBWTNELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxD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USxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixvREFBb0Q7UUFDcEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUtELDRDQUE0QztJQUM1QyxNQUFNLENBQUMsS0FBSyxHQUFXLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSztRQUNILEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2luamVjdG9yJztcbmltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHt3dGZDcmVhdGVTY29wZSwgd3RmTGVhdmUsIFd0ZlNjb3BlRm59IGZyb20gJy4uL3Byb2ZpbGUvcHJvZmlsZSc7XG5cbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnLi9lbGVtZW50JztcblxuaW1wb3J0IHtFbGVtZW50UmVmfSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7VGVtcGxhdGVSZWYsIFRlbXBsYXRlUmVmX30gZnJvbSAnLi90ZW1wbGF0ZV9yZWYnO1xuaW1wb3J0IHtFbWJlZGRlZFZpZXdSZWYsIFZpZXdSZWYsIFZpZXdSZWZffSBmcm9tICcuL3ZpZXdfcmVmJztcbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50UmVmfSBmcm9tICcuL2NvbXBvbmVudF9mYWN0b3J5JztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29udGFpbmVyIHdoZXJlIG9uZSBvciBtb3JlIFZpZXdzIGNhbiBiZSBhdHRhY2hlZC5cbiAqXG4gKiBUaGUgY29udGFpbmVyIGNhbiBjb250YWluIHR3byBraW5kcyBvZiBWaWV3cy4gSG9zdCBWaWV3cywgY3JlYXRlZCBieSBpbnN0YW50aWF0aW5nIGFcbiAqIHtAbGluayBDb21wb25lbnR9IHZpYSB7QGxpbmsgI2NyZWF0ZUNvbXBvbmVudH0sIGFuZCBFbWJlZGRlZCBWaWV3cywgY3JlYXRlZCBieSBpbnN0YW50aWF0aW5nIGFuXG4gKiB7QGxpbmsgVGVtcGxhdGVSZWYgRW1iZWRkZWQgVGVtcGxhdGV9IHZpYSB7QGxpbmsgI2NyZWF0ZUVtYmVkZGVkVmlld30uXG4gKlxuICogVGhlIGxvY2F0aW9uIG9mIHRoZSBWaWV3IENvbnRhaW5lciB3aXRoaW4gdGhlIGNvbnRhaW5pbmcgVmlldyBpcyBzcGVjaWZpZWQgYnkgdGhlIEFuY2hvclxuICogYGVsZW1lbnRgLiBFYWNoIFZpZXcgQ29udGFpbmVyIGNhbiBoYXZlIG9ubHkgb25lIEFuY2hvciBFbGVtZW50IGFuZCBlYWNoIEFuY2hvciBFbGVtZW50IGNhbiBvbmx5XG4gKiBoYXZlIGEgc2luZ2xlIFZpZXcgQ29udGFpbmVyLlxuICpcbiAqIFJvb3QgZWxlbWVudHMgb2YgVmlld3MgYXR0YWNoZWQgdG8gdGhpcyBjb250YWluZXIgYmVjb21lIHNpYmxpbmdzIG9mIHRoZSBBbmNob3IgRWxlbWVudCBpblxuICogdGhlIFJlbmRlcmVkIFZpZXcuXG4gKlxuICogVG8gYWNjZXNzIGEgYFZpZXdDb250YWluZXJSZWZgIG9mIGFuIEVsZW1lbnQsIHlvdSBjYW4gZWl0aGVyIHBsYWNlIGEge0BsaW5rIERpcmVjdGl2ZX0gaW5qZWN0ZWRcbiAqIHdpdGggYFZpZXdDb250YWluZXJSZWZgIG9uIHRoZSBFbGVtZW50LCBvciB5b3Ugb2J0YWluIGl0IHZpYSBhIHtAbGluayBWaWV3Q2hpbGR9IHF1ZXJ5LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlld0NvbnRhaW5lclJlZiB7XG4gIC8qKlxuICAgKiBBbmNob3IgZWxlbWVudCB0aGF0IHNwZWNpZmllcyB0aGUgbG9jYXRpb24gb2YgdGhpcyBjb250YWluZXIgaW4gdGhlIGNvbnRhaW5pbmcgVmlldy5cbiAgICogPCEtLSBUT0RPOiByZW5hbWUgdG8gYW5jaG9yRWxlbWVudCAtLT5cbiAgICovXG4gIGdldCBlbGVtZW50KCk6IEVsZW1lbnRSZWYgeyByZXR1cm4gPEVsZW1lbnRSZWY+dW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIDxJbmplY3Rvcj51bmltcGxlbWVudGVkKCk7IH1cblxuICBnZXQgcGFyZW50SW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gPEluamVjdG9yPnVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyBhbGwgVmlld3MgaW4gdGhpcyBjb250YWluZXIuXG4gICAqL1xuICBhYnN0cmFjdCBjbGVhcigpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVmlld1JlZn0gZm9yIHRoZSBWaWV3IGxvY2F0ZWQgaW4gdGhpcyBjb250YWluZXIgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICovXG4gIGFic3RyYWN0IGdldChpbmRleDogbnVtYmVyKTogVmlld1JlZjtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIFZpZXdzIGN1cnJlbnRseSBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lci5cbiAgICovXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIDxudW1iZXI+dW5pbXBsZW1lbnRlZCgpOyB9O1xuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZXMgYW4gRW1iZWRkZWQgVmlldyBiYXNlZCBvbiB0aGUge0BsaW5rIFRlbXBsYXRlUmVmIGB0ZW1wbGF0ZVJlZmB9IGFuZCBpbnNlcnRzIGl0XG4gICAqIGludG8gdGhpcyBjb250YWluZXIgYXQgdGhlIHNwZWNpZmllZCBgaW5kZXhgLlxuICAgKlxuICAgKiBJZiBgaW5kZXhgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBuZXcgVmlldyB3aWxsIGJlIGluc2VydGVkIGFzIHRoZSBsYXN0IFZpZXcgaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIFZpZXdSZWZ9IGZvciB0aGUgbmV3bHkgY3JlYXRlZCBWaWV3LlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlRW1iZWRkZWRWaWV3KHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZiwgaW5kZXg/OiBudW1iZXIpOiBFbWJlZGRlZFZpZXdSZWY7XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhIHNpbmdsZSB7QGxpbmsgQ29tcG9uZW50fSBhbmQgaW5zZXJ0cyBpdHMgSG9zdCBWaWV3IGludG8gdGhpcyBjb250YWluZXIgYXQgdGhlXG4gICAqIHNwZWNpZmllZCBgaW5kZXhgLlxuICAgKlxuICAgKiBUaGUgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZCB1c2luZyBpdHMge0BsaW5rIENvbXBvbmVudEZhY3Rvcnl9IHdoaWNoIGNhbiBiZVxuICAgKiBvYnRhaW5lZCB2aWEge0BsaW5rIENvbXBvbmVudFJlc29sdmVyI3Jlc29sdmVDb21wb25lbnR9LlxuICAgKlxuICAgKiBJZiBgaW5kZXhgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBuZXcgVmlldyB3aWxsIGJlIGluc2VydGVkIGFzIHRoZSBsYXN0IFZpZXcgaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogWW91IGNhbiBvcHRpb25hbGx5IHNwZWNpZnkgdGhlIHtAbGluayBJbmplY3Rvcn0gdGhhdCB3aWxsIGJlIHVzZWQgYXMgcGFyZW50IGZvciB0aGUgQ29tcG9uZW50LlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgQ29tcG9uZW50UmVmfSBvZiB0aGUgSG9zdCBWaWV3IGNyZWF0ZWQgZm9yIHRoZSBuZXdseSBpbnN0YW50aWF0ZWQgQ29tcG9uZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3Rvcnk6IENvbXBvbmVudEZhY3RvcnksIGluZGV4PzogbnVtYmVyLCBpbmplY3Rvcj86IEluamVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGFibGVOb2Rlcz86IGFueVtdW10pOiBDb21wb25lbnRSZWY7XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSBWaWV3IGlkZW50aWZpZWQgYnkgYSB7QGxpbmsgVmlld1JlZn0gaW50byB0aGUgY29udGFpbmVyIGF0IHRoZSBzcGVjaWZpZWQgYGluZGV4YC5cbiAgICpcbiAgICogSWYgYGluZGV4YCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgbmV3IFZpZXcgd2lsbCBiZSBpbnNlcnRlZCBhcyB0aGUgbGFzdCBWaWV3IGluIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGluc2VydGVkIHtAbGluayBWaWV3UmVmfS5cbiAgICovXG4gIGFic3RyYWN0IGluc2VydCh2aWV3UmVmOiBWaWV3UmVmLCBpbmRleD86IG51bWJlcik6IFZpZXdSZWY7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBWaWV3LCBzcGVjaWZpZWQgdmlhIHtAbGluayBWaWV3UmVmfSwgd2l0aGluIHRoZSBjdXJyZW50IGNvbnRhaW5lciBvclxuICAgKiBgLTFgIGlmIHRoaXMgY29udGFpbmVyIGRvZXNuJ3QgY29udGFpbiB0aGUgVmlldy5cbiAgICovXG4gIGFic3RyYWN0IGluZGV4T2Yodmlld1JlZjogVmlld1JlZik6IG51bWJlcjtcblxuICAvKipcbiAgICogRGVzdHJveXMgYSBWaWV3IGF0dGFjaGVkIHRvIHRoaXMgY29udGFpbmVyIGF0IHRoZSBzcGVjaWZpZWQgYGluZGV4YC5cbiAgICpcbiAgICogSWYgYGluZGV4YCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgbGFzdCBWaWV3IGluIHRoZSBjb250YWluZXIgd2lsbCBiZSByZW1vdmVkLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVtb3ZlKGluZGV4PzogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogVXNlIGFsb25nIHdpdGgge0BsaW5rICNpbnNlcnR9IHRvIG1vdmUgYSBWaWV3IHdpdGhpbiB0aGUgY3VycmVudCBjb250YWluZXIuXG4gICAqXG4gICAqIElmIHRoZSBgaW5kZXhgIHBhcmFtIGlzIG9taXR0ZWQsIHRoZSBsYXN0IHtAbGluayBWaWV3UmVmfSBpcyBkZXRhY2hlZC5cbiAgICovXG4gIGFic3RyYWN0IGRldGFjaChpbmRleD86IG51bWJlcik6IFZpZXdSZWY7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3Q29udGFpbmVyUmVmXyBpbXBsZW1lbnRzIFZpZXdDb250YWluZXJSZWYge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBBcHBFbGVtZW50KSB7fVxuXG4gIGdldChpbmRleDogbnVtYmVyKTogRW1iZWRkZWRWaWV3UmVmIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmVzdGVkVmlld3NbaW5kZXhdLnJlZjsgfVxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgdmFyIHZpZXdzID0gdGhpcy5fZWxlbWVudC5uZXN0ZWRWaWV3cztcbiAgICByZXR1cm4gaXNQcmVzZW50KHZpZXdzKSA/IHZpZXdzLmxlbmd0aCA6IDA7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuZWxlbWVudFJlZjsgfVxuXG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9lbGVtZW50LmluamVjdG9yOyB9XG5cbiAgZ2V0IHBhcmVudEluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQucGFyZW50SW5qZWN0b3I7IH1cblxuICAvLyBUT0RPKHJhZG8pOiBwcm9maWxlIGFuZCBkZWNpZGUgd2hldGhlciBib3VuZHMgY2hlY2tzIHNob3VsZCBiZSBhZGRlZFxuICAvLyB0byB0aGUgbWV0aG9kcyBiZWxvdy5cbiAgY3JlYXRlRW1iZWRkZWRWaWV3KHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZiwgaW5kZXg6IG51bWJlciA9IC0xKTogRW1iZWRkZWRWaWV3UmVmIHtcbiAgICB2YXIgdmlld1JlZjogRW1iZWRkZWRWaWV3UmVmID0gdGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KCk7XG4gICAgdGhpcy5pbnNlcnQodmlld1JlZiwgaW5kZXgpO1xuICAgIHJldHVybiB2aWV3UmVmO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY3JlYXRlQ29tcG9uZW50SW5Db250YWluZXJTY29wZTogV3RmU2NvcGVGbiA9XG4gICAgICB3dGZDcmVhdGVTY29wZSgnVmlld0NvbnRhaW5lclJlZiNjcmVhdGVDb21wb25lbnQoKScpO1xuXG4gIGNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5LCBpbmRleDogbnVtYmVyID0gLTEsIGluamVjdG9yOiBJbmplY3RvciA9IG51bGwsXG4gICAgICAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzOiBhbnlbXVtdID0gbnVsbCk6IENvbXBvbmVudFJlZiB7XG4gICAgdmFyIHMgPSB0aGlzLl9jcmVhdGVDb21wb25lbnRJbkNvbnRhaW5lclNjb3BlKCk7XG4gICAgdmFyIGNvbnRleHRJbmplY3RvciA9IGlzUHJlc2VudChpbmplY3RvcikgPyBpbmplY3RvciA6IHRoaXMuX2VsZW1lbnQucGFyZW50SW5qZWN0b3I7XG4gICAgdmFyIGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKGNvbnRleHRJbmplY3RvciwgcHJvamVjdGFibGVOb2Rlcyk7XG4gICAgdGhpcy5pbnNlcnQoY29tcG9uZW50UmVmLmhvc3RWaWV3LCBpbmRleCk7XG4gICAgcmV0dXJuIHd0ZkxlYXZlKHMsIGNvbXBvbmVudFJlZik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9pbnNlcnRTY29wZSA9IHd0ZkNyZWF0ZVNjb3BlKCdWaWV3Q29udGFpbmVyUmVmI2luc2VydCgpJyk7XG5cbiAgLy8gVE9ETyhpKTogcmVmYWN0b3IgaW5zZXJ0K3JlbW92ZSBpbnRvIG1vdmVcbiAgaW5zZXJ0KHZpZXdSZWY6IFZpZXdSZWYsIGluZGV4OiBudW1iZXIgPSAtMSk6IFZpZXdSZWYge1xuICAgIHZhciBzID0gdGhpcy5faW5zZXJ0U2NvcGUoKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIGluZGV4ID0gdGhpcy5sZW5ndGg7XG4gICAgdmFyIHZpZXdSZWZfID0gPFZpZXdSZWZfPnZpZXdSZWY7XG4gICAgdGhpcy5fZWxlbWVudC5hdHRhY2hWaWV3KHZpZXdSZWZfLmludGVybmFsVmlldywgaW5kZXgpO1xuICAgIHJldHVybiB3dGZMZWF2ZShzLCB2aWV3UmVmXyk7XG4gIH1cblxuICBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXIge1xuICAgIHJldHVybiBMaXN0V3JhcHBlci5pbmRleE9mKHRoaXMuX2VsZW1lbnQubmVzdGVkVmlld3MsICg8Vmlld1JlZl8+dmlld1JlZikuaW50ZXJuYWxWaWV3KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlbW92ZVNjb3BlID0gd3RmQ3JlYXRlU2NvcGUoJ1ZpZXdDb250YWluZXJSZWYjcmVtb3ZlKCknKTtcblxuICAvLyBUT0RPKGkpOiByZW5hbWUgdG8gZGVzdHJveVxuICByZW1vdmUoaW5kZXg6IG51bWJlciA9IC0xKTogdm9pZCB7XG4gICAgdmFyIHMgPSB0aGlzLl9yZW1vdmVTY29wZSgpO1xuICAgIGlmIChpbmRleCA9PSAtMSkgaW5kZXggPSB0aGlzLmxlbmd0aCAtIDE7XG4gICAgdmFyIHZpZXcgPSB0aGlzLl9lbGVtZW50LmRldGFjaFZpZXcoaW5kZXgpO1xuICAgIHZpZXcuZGVzdHJveSgpO1xuICAgIC8vIHZpZXcgaXMgaW50ZW50aW9uYWxseSBub3QgcmV0dXJuZWQgdG8gdGhlIGNsaWVudC5cbiAgICB3dGZMZWF2ZShzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2RldGFjaFNjb3BlID0gd3RmQ3JlYXRlU2NvcGUoJ1ZpZXdDb250YWluZXJSZWYjZGV0YWNoKCknKTtcblxuICAvLyBUT0RPKGkpOiByZWZhY3RvciBpbnNlcnQrcmVtb3ZlIGludG8gbW92ZVxuICBkZXRhY2goaW5kZXg6IG51bWJlciA9IC0xKTogVmlld1JlZiB7XG4gICAgdmFyIHMgPSB0aGlzLl9kZXRhY2hTY29wZSgpO1xuICAgIGlmIChpbmRleCA9PSAtMSkgaW5kZXggPSB0aGlzLmxlbmd0aCAtIDE7XG4gICAgdmFyIHZpZXcgPSB0aGlzLl9lbGVtZW50LmRldGFjaFZpZXcoaW5kZXgpO1xuICAgIHJldHVybiB3dGZMZWF2ZShzLCB2aWV3LnJlZik7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5yZW1vdmUoaSk7XG4gICAgfVxuICB9XG59XG4iXX0=