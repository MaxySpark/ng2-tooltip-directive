import { __decorate, __param } from "tslib";
import { Directive, ElementRef, HostListener, Input, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, Injector, ComponentRef, OnInit, Output, EventEmitter, OnDestroy, Inject, Optional } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipOptionsService } from './tooltip-options.service';
import { defaultOptions, backwardCompatibilityOptions } from './options';
let TooltipDirective = class TooltipDirective {
    constructor(initOptions, elementRef, componentFactoryResolver, appRef, injector) {
        this.initOptions = initOptions;
        this.elementRef = elementRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
        this._showDelay = 0;
        this._hideDelay = 300;
        this._options = {};
        this.events = new EventEmitter();
    }
    set options(value) {
        if (value && defaultOptions) {
            this._options = value;
        }
    }
    get options() {
        return this._options;
    }
    get isTooltipDestroyed() {
        return this.componentRef && this.componentRef.hostView.destroyed;
    }
    get destroyDelay() {
        if (this._destroyDelay) {
            return this._destroyDelay;
        }
        else {
            return Number(this.getHideDelay()) + Number(this.options['animationDuration']);
        }
    }
    set destroyDelay(value) {
        this._destroyDelay = value;
    }
    get tooltipPosition() {
        if (this.options['position']) {
            return this.options['position'];
        }
        else {
            return this.elementPosition;
        }
    }
    onMouseEnter() {
        if (this.isDisplayOnHover == false) {
            return;
        }
        this.show();
    }
    onMouseLeave() {
        if (this.options['trigger'] === 'hover') {
            this.destroyTooltip();
        }
    }
    onClick() {
        if (this.isDisplayOnClick == false) {
            return;
        }
        this.show();
        this.hideAfterClickTimeoutId = window.setTimeout(() => {
            this.destroyTooltip();
        }, this.options['hideDelayAfterClick']);
    }
    ngOnInit() {
    }
    ngOnChanges(changes) {
        this.initOptions = this.renameProperties(this.initOptions);
        let changedOptions = this.getProperties(changes);
        changedOptions = this.renameProperties(changedOptions);
        this.applyOptionsDefault(defaultOptions, changedOptions);
    }
    ngOnDestroy() {
        this.destroyTooltip({
            fast: true
        });
        if (this.componentSubscribe) {
            this.componentSubscribe.unsubscribe();
        }
    }
    getShowDelay() {
        return this.options['showDelay'];
    }
    getHideDelay() {
        const hideDelay = this.options['hideDelay'];
        const hideDelayTouchscreen = this.options['hideDelayTouchscreen'];
        return this.isTouchScreen ? hideDelayTouchscreen : hideDelay;
    }
    getProperties(changes) {
        let properties = {};
        for (var prop in changes) {
            if (prop !== 'options' && prop !== 'tooltipValue') {
                properties[prop] = changes[prop].currentValue;
            }
            if (prop === 'options') {
                properties = changes[prop].currentValue;
            }
        }
        return properties;
    }
    renameProperties(options) {
        for (var prop in options) {
            if (backwardCompatibilityOptions[prop]) {
                options[backwardCompatibilityOptions[prop]] = options[prop];
                delete options[prop];
            }
        }
        return options;
    }
    getElementPosition() {
        this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
    }
    createTooltip() {
        this.clearTimeouts();
        this.getElementPosition();
        this.createTimeoutId = window.setTimeout(() => {
            this.appendComponentToBody(TooltipComponent);
        }, this.getShowDelay());
        this.showTimeoutId = window.setTimeout(() => {
            this.showTooltipElem();
        }, this.getShowDelay());
    }
    destroyTooltip(options = {
        fast: false
    }) {
        this.clearTimeouts();
        if (this.isTooltipDestroyed == false) {
            this.hideTimeoutId = window.setTimeout(() => {
                this.hideTooltip();
            }, options.fast ? 0 : this.getHideDelay());
            this.destroyTimeoutId = window.setTimeout(() => {
                if (!this.componentRef || this.isTooltipDestroyed) {
                    return;
                }
                this.appRef.detachView(this.componentRef.hostView);
                this.componentRef.destroy();
                this.events.emit({
                    type: 'hidden',
                    position: this.tooltipPosition
                });
            }, options.fast ? 0 : this.destroyDelay);
        }
    }
    showTooltipElem() {
        this.clearTimeouts();
        this.componentRef.instance.show = true;
        this.events.emit({
            type: 'show',
            position: this.tooltipPosition
        });
    }
    hideTooltip() {
        if (!this.componentRef || this.isTooltipDestroyed) {
            return;
        }
        this.componentRef.instance.show = false;
        this.events.emit({
            type: 'hide',
            position: this.tooltipPosition
        });
    }
    appendComponentToBody(component, data = {}) {
        this.componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);
        this.componentRef.instance.data = {
            value: this.tooltipValue,
            element: this.elementRef.nativeElement,
            elementPosition: this.tooltipPosition,
            options: this.options
        };
        this.appRef.attachView(this.componentRef.hostView);
        const domElem = this.componentRef.hostView.rootNodes[0];
        document.body.appendChild(domElem);
        this.componentSubscribe = this.componentRef.instance.events.subscribe((event) => {
            this.handleEvents(event);
        });
    }
    clearTimeouts() {
        if (this.createTimeoutId) {
            clearTimeout(this.createTimeoutId);
        }
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
        }
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
        }
        if (this.destroyTimeoutId) {
            clearTimeout(this.destroyTimeoutId);
        }
    }
    get isDisplayOnHover() {
        if (this.options['display'] == false) {
            return false;
        }
        if (this.options['displayTouchscreen'] == false && this.isTouchScreen) {
            return false;
        }
        if (this.options['trigger'] !== 'hover') {
            return false;
        }
        return true;
    }
    get isDisplayOnClick() {
        if (this.options['display'] == false) {
            return false;
        }
        if (this.options['displayTouchscreen'] == false && this.isTouchScreen) {
            return false;
        }
        if (this.options['trigger'] != 'click') {
            return false;
        }
        return true;
    }
    get isTouchScreen() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function (query) {
            return window.matchMedia(query).matches;
        };
        if (('ontouchstart' in window)) {
            return true;
        }
        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }
    applyOptionsDefault(defaultOptions, options) {
        this.options = Object.assign({}, defaultOptions, this.initOptions || {}, options);
    }
    handleEvents(event) {
        if (event.type === 'shown') {
            this.events.emit({
                type: 'shown',
                position: this.tooltipPosition
            });
        }
    }
    show() {
        if (!this.componentRef || this.isTooltipDestroyed) {
            this.createTooltip();
        }
        else if (!this.isTooltipDestroyed) {
            this.showTooltipElem();
        }
    }
    hide() {
        this.destroyTooltip();
    }
};
TooltipDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [TooltipOptionsService,] }] },
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: ApplicationRef },
    { type: Injector }
];
__decorate([
    Input('options')
], TooltipDirective.prototype, "options", null);
__decorate([
    Input('tooltip')
], TooltipDirective.prototype, "tooltipValue", void 0);
__decorate([
    Input('placement')
], TooltipDirective.prototype, "placement", void 0);
__decorate([
    Input('autoPlacement')
], TooltipDirective.prototype, "autoPlacement", void 0);
__decorate([
    Input('content-type')
], TooltipDirective.prototype, "contentType", void 0);
__decorate([
    Input('hide-delay-mobile')
], TooltipDirective.prototype, "hideDelayMobile", void 0);
__decorate([
    Input('hideDelayTouchscreen')
], TooltipDirective.prototype, "hideDelayTouchscreen", void 0);
__decorate([
    Input('z-index')
], TooltipDirective.prototype, "zIndex", void 0);
__decorate([
    Input('animation-duration')
], TooltipDirective.prototype, "animationDuration", void 0);
__decorate([
    Input('trigger')
], TooltipDirective.prototype, "trigger", void 0);
__decorate([
    Input('tooltip-class')
], TooltipDirective.prototype, "tooltipClass", void 0);
__decorate([
    Input('display')
], TooltipDirective.prototype, "display", void 0);
__decorate([
    Input('display-mobile')
], TooltipDirective.prototype, "displayMobile", void 0);
__decorate([
    Input('displayTouchscreen')
], TooltipDirective.prototype, "displayTouchscreen", void 0);
__decorate([
    Input('shadow')
], TooltipDirective.prototype, "shadow", void 0);
__decorate([
    Input('theme')
], TooltipDirective.prototype, "theme", void 0);
__decorate([
    Input('offset')
], TooltipDirective.prototype, "offset", void 0);
__decorate([
    Input('width')
], TooltipDirective.prototype, "width", void 0);
__decorate([
    Input('max-width')
], TooltipDirective.prototype, "maxWidth", void 0);
__decorate([
    Input('id')
], TooltipDirective.prototype, "id", void 0);
__decorate([
    Input('show-delay')
], TooltipDirective.prototype, "showDelay", void 0);
__decorate([
    Input('hide-delay')
], TooltipDirective.prototype, "hideDelay", void 0);
__decorate([
    Input('hideDelayAfterClick')
], TooltipDirective.prototype, "hideDelayAfterClick", void 0);
__decorate([
    Input('pointerEvents')
], TooltipDirective.prototype, "pointerEvents", void 0);
__decorate([
    Input('position')
], TooltipDirective.prototype, "position", void 0);
__decorate([
    Output()
], TooltipDirective.prototype, "events", void 0);
__decorate([
    HostListener('focusin'),
    HostListener('mouseenter')
], TooltipDirective.prototype, "onMouseEnter", null);
__decorate([
    HostListener('focusout'),
    HostListener('mouseleave')
], TooltipDirective.prototype, "onMouseLeave", null);
__decorate([
    HostListener('click')
], TooltipDirective.prototype, "onClick", null);
TooltipDirective = __decorate([
    Directive({
        selector: '[tooltip]',
        exportAs: 'tooltip',
    }),
    __param(0, Optional()), __param(0, Inject(TooltipOptionsService))
], TooltipDirective);
export { TooltipDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdG9vbHRpcC1kaXJlY3RpdmUvIiwic291cmNlcyI6WyJzcmMvdG9vbHRpcC90b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDek4sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGNBQWMsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQWV6RSxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQTRFekIsWUFDdUQsV0FBVyxFQUN0RCxVQUFzQixFQUN0Qix3QkFBa0QsRUFDbEQsTUFBc0IsRUFDdEIsUUFBa0I7UUFKeUIsZ0JBQVcsR0FBWCxXQUFXLENBQUE7UUFDdEQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0Qiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQVU7UUF4RTlCLGVBQVUsR0FBUSxDQUFDLENBQUM7UUFDcEIsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUV6QixhQUFRLEdBQVEsRUFBRSxDQUFDO1FBOERULFdBQU0sR0FBeUIsSUFBSSxZQUFZLEVBQVcsQ0FBQztJQU9wQyxDQUFDO0lBaEVoQixJQUFJLE9BQU8sQ0FBQyxLQUFxQjtRQUMvQyxJQUFJLEtBQUssSUFBSSxj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QUFRLEVBQUUsV0FBVztRQUNyQixRQUFRLEVBQUUsU0FBUztLQUN0QixDQUFDO0lBK0VPLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0dBN0VyQyxnQkFBZ0IsQ0F3VjVCO1NBeFZZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBFbWJlZGRlZFZpZXdSZWYsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3RvciwgQ29tcG9uZW50UmVmLCBPbkluaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIEluamVjdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVG9vbHRpcENvbXBvbmVudCB9IGZyb20gJy4vdG9vbHRpcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUb29sdGlwT3B0aW9uc1NlcnZpY2UgfSBmcm9tICcuL3Rvb2x0aXAtb3B0aW9ucy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgZGVmYXVsdE9wdGlvbnMsIGJhY2t3YXJkQ29tcGF0aWJpbGl0eU9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xyXG5pbXBvcnQgeyBUb29sdGlwT3B0aW9ucyB9IGZyb20gJy4vdG9vbHRpcC1vcHRpb25zLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFkQ29tcG9uZW50IHtcclxuICAgIGRhdGE6IGFueTtcclxuICAgIHNob3c6IGJvb2xlYW47XHJcbiAgICBjbG9zZTogYm9vbGVhbjtcclxuICAgIGV2ZW50czogYW55O1xyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3Rvb2x0aXBdJyxcclxuICAgIGV4cG9ydEFzOiAndG9vbHRpcCcsXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcERpcmVjdGl2ZSB7XHJcblxyXG4gICAgaGlkZVRpbWVvdXRJZDogbnVtYmVyO1xyXG4gICAgZGVzdHJveVRpbWVvdXRJZDogbnVtYmVyO1xyXG4gICAgaGlkZUFmdGVyQ2xpY2tUaW1lb3V0SWQ6IG51bWJlcjtcclxuICAgIGNyZWF0ZVRpbWVvdXRJZDogbnVtYmVyO1xyXG4gICAgc2hvd1RpbWVvdXRJZDogbnVtYmVyO1xyXG4gICAgY29tcG9uZW50UmVmOiBhbnk7XHJcbiAgICBlbGVtZW50UG9zaXRpb246IGFueTtcclxuICAgIF9zaG93RGVsYXk6IGFueSA9IDA7XHJcbiAgICBfaGlkZURlbGF5OiBudW1iZXIgPSAzMDA7XHJcbiAgICBfaWQ6IGFueTtcclxuICAgIF9vcHRpb25zOiBhbnkgPSB7fTtcclxuICAgIF9kZWZhdWx0T3B0aW9uczogYW55O1xyXG4gICAgX2Rlc3Ryb3lEZWxheTogbnVtYmVyO1xyXG4gICAgY29tcG9uZW50U3Vic2NyaWJlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KCdvcHRpb25zJykgc2V0IG9wdGlvbnModmFsdWU6IFRvb2x0aXBPcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIGRlZmF1bHRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgb3B0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoJ3Rvb2x0aXAnKSB0b29sdGlwVmFsdWU6IHN0cmluZztcclxuICAgIEBJbnB1dCgncGxhY2VtZW50JykgcGxhY2VtZW50OiBzdHJpbmc7XHJcbiAgICBASW5wdXQoJ2F1dG9QbGFjZW1lbnQnKSBhdXRvUGxhY2VtZW50OiBib29sZWFuO1xyXG4gICAgQElucHV0KCdjb250ZW50LXR5cGUnKSBjb250ZW50VHlwZTogc3RyaW5nO1xyXG4gICAgQElucHV0KCdoaWRlLWRlbGF5LW1vYmlsZScpIGhpZGVEZWxheU1vYmlsZTogbnVtYmVyO1xyXG4gICAgQElucHV0KCdoaWRlRGVsYXlUb3VjaHNjcmVlbicpIGhpZGVEZWxheVRvdWNoc2NyZWVuOiBudW1iZXI7XHJcbiAgICBASW5wdXQoJ3otaW5kZXgnKSB6SW5kZXg6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnYW5pbWF0aW9uLWR1cmF0aW9uJykgYW5pbWF0aW9uRHVyYXRpb246IG51bWJlcjtcclxuICAgIEBJbnB1dCgndHJpZ2dlcicpIHRyaWdnZXI6IHN0cmluZztcclxuICAgIEBJbnB1dCgndG9vbHRpcC1jbGFzcycpIHRvb2x0aXBDbGFzczogc3RyaW5nO1xyXG4gICAgQElucHV0KCdkaXNwbGF5JykgZGlzcGxheTogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgnZGlzcGxheS1tb2JpbGUnKSBkaXNwbGF5TW9iaWxlOiBib29sZWFuO1xyXG4gICAgQElucHV0KCdkaXNwbGF5VG91Y2hzY3JlZW4nKSBkaXNwbGF5VG91Y2hzY3JlZW46IGJvb2xlYW47XHJcbiAgICBASW5wdXQoJ3NoYWRvdycpIHNoYWRvdzogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgndGhlbWUnKSB0aGVtZTogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgnb2Zmc2V0Jykgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoJ3dpZHRoJykgd2lkdGg6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnbWF4LXdpZHRoJykgbWF4V2lkdGg6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnaWQnKSBpZDogYW55O1xyXG4gICAgQElucHV0KCdzaG93LWRlbGF5Jykgc2hvd0RlbGF5OiBudW1iZXI7XHJcbiAgICBASW5wdXQoJ2hpZGUtZGVsYXknKSBoaWRlRGVsYXk6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnaGlkZURlbGF5QWZ0ZXJDbGljaycpIGhpZGVEZWxheUFmdGVyQ2xpY2s6IG51bWJlcjtcclxuICAgIEBJbnB1dCgncG9pbnRlckV2ZW50cycpIHBvaW50ZXJFdmVudHM6ICdhdXRvJyB8ICdub25lJztcclxuICAgIEBJbnB1dCgncG9zaXRpb24nKSBwb3NpdGlvbjoge3RvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXJ9O1xyXG5cclxuICAgIGdldCBpc1Rvb2x0aXBEZXN0cm95ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50UmVmICYmIHRoaXMuY29tcG9uZW50UmVmLmhvc3RWaWV3LmRlc3Ryb3llZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVzdHJveURlbGF5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kZXN0cm95RGVsYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3Ryb3lEZWxheTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZ2V0SGlkZURlbGF5KCkpICsgTnVtYmVyKHRoaXMub3B0aW9uc1snYW5pbWF0aW9uRHVyYXRpb24nXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0IGRlc3Ryb3lEZWxheSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZGVzdHJveURlbGF5ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRvb2x0aXBQb3NpdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWydwb3NpdGlvbiddKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAT3V0cHV0KCkgZXZlbnRzOiBFdmVudEVtaXR0ZXIgPCBhbnkgPiA9IG5ldyBFdmVudEVtaXR0ZXIgPCBhbnkgPiAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFRvb2x0aXBPcHRpb25zU2VydmljZSkgcHJpdmF0ZSBpbml0T3B0aW9ucyxcclxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuICAgICAgICBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IpIHt9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignZm9jdXNpbicpXHJcbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcclxuICAgIG9uTW91c2VFbnRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlPbkhvdmVyID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2ZvY3Vzb3V0JylcclxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxyXG4gICAgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3RyaWdnZXInXSA9PT0gJ2hvdmVyJykge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lUb29sdGlwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcclxuICAgIG9uQ2xpY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5T25DbGljayA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgICB0aGlzLmhpZGVBZnRlckNsaWNrVGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lUb29sdGlwKCk7XHJcbiAgICAgICAgfSwgdGhpcy5vcHRpb25zWydoaWRlRGVsYXlBZnRlckNsaWNrJ10pXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuaW5pdE9wdGlvbnMgPSB0aGlzLnJlbmFtZVByb3BlcnRpZXModGhpcy5pbml0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGNoYW5nZWRPcHRpb25zID0gdGhpcy5nZXRQcm9wZXJ0aWVzKGNoYW5nZXMpO1xyXG4gICAgICAgIGNoYW5nZWRPcHRpb25zID0gdGhpcy5yZW5hbWVQcm9wZXJ0aWVzKGNoYW5nZWRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBseU9wdGlvbnNEZWZhdWx0KGRlZmF1bHRPcHRpb25zLCBjaGFuZ2VkT3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95VG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGZhc3Q6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50U3Vic2NyaWJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50U3Vic2NyaWJlLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFNob3dEZWxheSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zWydzaG93RGVsYXknXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIaWRlRGVsYXkoKSB7XHJcbiAgICAgICAgY29uc3QgaGlkZURlbGF5ID0gdGhpcy5vcHRpb25zWydoaWRlRGVsYXknXTtcclxuICAgICAgICBjb25zdCBoaWRlRGVsYXlUb3VjaHNjcmVlbiA9IHRoaXMub3B0aW9uc1snaGlkZURlbGF5VG91Y2hzY3JlZW4nXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUb3VjaFNjcmVlbiA/IGhpZGVEZWxheVRvdWNoc2NyZWVuIDogaGlkZURlbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3BlcnRpZXMoY2hhbmdlcyl7XHJcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wICE9PSAnb3B0aW9ucycgJiYgcHJvcCAhPT0gJ3Rvb2x0aXBWYWx1ZScpe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wXSA9IGNoYW5nZXNbcHJvcF0uY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnb3B0aW9ucycpe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IGNoYW5nZXNbcHJvcF0uY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmFtZVByb3BlcnRpZXMob3B0aW9uczogVG9vbHRpcE9wdGlvbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKGJhY2t3YXJkQ29tcGF0aWJpbGl0eU9wdGlvbnNbcHJvcF0pIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNbYmFja3dhcmRDb21wYXRpYmlsaXR5T3B0aW9uc1twcm9wXV0gPSBvcHRpb25zW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnNbcHJvcF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnRQb3NpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRQb3NpdGlvbiA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVRvb2x0aXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XHJcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ29tcG9uZW50VG9Cb2R5KFRvb2x0aXBDb21wb25lbnQpO1xyXG4gICAgICAgIH0sIHRoaXMuZ2V0U2hvd0RlbGF5KCkpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3dUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1Rvb2x0aXBFbGVtKCk7XHJcbiAgICAgICAgfSwgdGhpcy5nZXRTaG93RGVsYXkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveVRvb2x0aXAob3B0aW9ucyA9IHtcclxuICAgICAgICBmYXN0OiBmYWxzZVxyXG4gICAgfSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaW1lb3V0cygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1Rvb2x0aXBEZXN0cm95ZWQgPT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgfSwgb3B0aW9ucy5mYXN0ID8gMCA6IHRoaXMuZ2V0SGlkZURlbGF5KCkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95VGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudFJlZiB8fCB0aGlzLmlzVG9vbHRpcERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcFJlZi5kZXRhY2hWaWV3KHRoaXMuY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoaWRkZW4nLCBcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy50b29sdGlwUG9zaXRpb25cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBvcHRpb25zLmZhc3QgPyAwIDogdGhpcy5kZXN0cm95RGVsYXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93VG9vbHRpcEVsZW0oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XHJcbiAgICAgICAgKCA8IEFkQ29tcG9uZW50ID4gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UpLnNob3cgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xyXG4gICAgICAgICAgICB0eXBlOiAnc2hvdycsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnRvb2x0aXBQb3NpdGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVUb29sdGlwKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRSZWYgfHwgdGhpcy5pc1Rvb2x0aXBEZXN0cm95ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoIDwgQWRDb21wb25lbnQgPiB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZSkuc2hvdyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xyXG4gICAgICAgICAgICB0eXBlOiAnaGlkZScsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnRvb2x0aXBQb3NpdGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZENvbXBvbmVudFRvQm9keShjb21wb25lbnQ6IGFueSwgZGF0YTogYW55ID0ge30pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyXHJcbiAgICAgICAgICAgIC5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnQpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5pbmplY3Rvcik7XHJcblxyXG4gICAgICAgICggPCBBZENvbXBvbmVudCA+IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlKS5kYXRhID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy50b29sdGlwVmFsdWUsXHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAgICAgICBlbGVtZW50UG9zaXRpb246IHRoaXMudG9vbHRpcFBvc2l0aW9uLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnNcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hcHBSZWYuYXR0YWNoVmlldyh0aGlzLmNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XHJcbiAgICAgICAgY29uc3QgZG9tRWxlbSA9ICh0aGlzLmNvbXBvbmVudFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWYgPCBhbnkgPiApLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvbUVsZW0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudFN1YnNjcmliZSA9ICggPCBBZENvbXBvbmVudCA+IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlKS5ldmVudHMuc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKGV2ZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclRpbWVvdXRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmNyZWF0ZVRpbWVvdXRJZCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jcmVhdGVUaW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RpbWVvdXRJZCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zaG93VGltZW91dElkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhpZGVUaW1lb3V0SWQpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRpbWVvdXRJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kZXN0cm95VGltZW91dElkKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRlc3Ryb3lUaW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNEaXNwbGF5T25Ib3ZlcigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWydkaXNwbGF5J10gPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1snZGlzcGxheVRvdWNoc2NyZWVuJ10gPT0gZmFsc2UgJiYgdGhpcy5pc1RvdWNoU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3RyaWdnZXInXSAhPT0gJ2hvdmVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNEaXNwbGF5T25DbGljaygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWydkaXNwbGF5J10gPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1snZGlzcGxheVRvdWNoc2NyZWVuJ10gPT0gZmFsc2UgJiYgdGhpcy5pc1RvdWNoU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3RyaWdnZXInXSAhPSAnY2xpY2snKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc1RvdWNoU2NyZWVuKCkge1xyXG4gICAgICAgIHZhciBwcmVmaXhlcyA9ICcgLXdlYmtpdC0gLW1vei0gLW8tIC1tcy0gJy5zcGxpdCgnICcpO1xyXG4gICAgICAgIHZhciBtcSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShxdWVyeSkubWF0Y2hlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluY2x1ZGUgdGhlICdoZWFydHonIGFzIGEgd2F5IHRvIGhhdmUgYSBub24gbWF0Y2hpbmcgTVEgdG8gaGVscCB0ZXJtaW5hdGUgdGhlIGpvaW5cclxuICAgICAgICAvLyBodHRwczovL2dpdC5pby92em5GSFxyXG4gICAgICAgIHZhciBxdWVyeSA9IFsnKCcsIHByZWZpeGVzLmpvaW4oJ3RvdWNoLWVuYWJsZWQpLCgnKSwgJ2hlYXJ0eicsICcpJ10uam9pbignJyk7XHJcbiAgICAgICAgcmV0dXJuIG1xKHF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseU9wdGlvbnNEZWZhdWx0KGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHRoaXMuaW5pdE9wdGlvbnMgfHwge30sIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50cyhldmVudDogYW55KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdzaG93bicpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2hvd24nLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMudG9vbHRpcFBvc2l0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50UmVmIHx8IHRoaXMuaXNUb29sdGlwRGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVG9vbHRpcCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNUb29sdGlwRGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1Rvb2x0aXBFbGVtKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVRvb2x0aXAoKTtcclxuICAgIH1cclxufVxyXG4iXX0=