import { __decorate, __param } from 'tslib';
import { EventEmitter, ElementRef, Renderer2, Input, HostBinding, HostListener, Component, InjectionToken, Optional, Inject, ComponentFactoryResolver, ApplicationRef, Injector, Output, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

let TooltipComponent = class TooltipComponent {
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._show = false;
        this.events = new EventEmitter();
    }
    transitionEnd(event) {
        if (this.show) {
            this.events.emit({
                type: 'shown'
            });
        }
    }
    set show(value) {
        if (value) {
            this.setPosition();
        }
        this._show = this.hostClassShow = value;
    }
    get show() {
        return this._show;
    }
    get placement() {
        return this.data.options.placement;
    }
    get autoPlacement() {
        return this.data.options.autoPlacement;
    }
    get element() {
        return this.data.element;
    }
    get elementPosition() {
        return this.data.elementPosition;
    }
    get options() {
        return this.data.options;
    }
    get value() {
        return this.data.value;
    }
    get tooltipOffset() {
        return Number(this.data.options.offset);
    }
    get isThemeLight() {
        return this.options['theme'] === 'light';
    }
    ngOnInit() {
        this.setCustomClass();
        this.setStyles();
    }
    setPosition() {
        if (this.setHostStyle(this.placement)) {
            this.setPlacementClass(this.placement);
            return;
        }
        else {
            /* Is tooltip outside the visible area */
            const placements = ['top', 'right', 'bottom', 'left'];
            let isPlacementSet;
            for (const placement of placements) {
                if (this.setHostStyle(placement)) {
                    this.setPlacementClass(placement);
                    isPlacementSet = true;
                    return;
                }
            }
            /* Set original placement */
            if (!isPlacementSet) {
                this.setHostStyle(this.placement, true);
                this.setPlacementClass(this.placement);
            }
        }
    }
    setPlacementClass(placement) {
        this.renderer.addClass(this.elementRef.nativeElement, 'tooltip-' + placement);
    }
    setHostStyle(placement, disableAutoPlacement = false) {
        const isSvg = this.element instanceof SVGElement;
        const tooltip = this.elementRef.nativeElement;
        const isCustomPosition = !this.elementPosition.right;
        let elementHeight = isSvg ? this.element.getBoundingClientRect().height : this.element.offsetHeight;
        let elementWidth = isSvg ? this.element.getBoundingClientRect().width : this.element.offsetWidth;
        const tooltipHeight = tooltip.clientHeight;
        const tooltipWidth = tooltip.clientWidth;
        const scrollY = window.pageYOffset;
        if (isCustomPosition) {
            elementHeight = 0;
            elementWidth = 0;
        }
        let topStyle;
        let leftStyle;
        if (placement === 'top') {
            topStyle = (this.elementPosition.top + scrollY) - (tooltipHeight + this.tooltipOffset);
        }
        if (placement === 'bottom') {
            topStyle = (this.elementPosition.top + scrollY) + elementHeight + this.tooltipOffset;
        }
        if (placement === 'top' || placement === 'bottom') {
            leftStyle = (this.elementPosition.left + elementWidth / 2) - tooltipWidth / 2;
        }
        if (placement === 'left') {
            leftStyle = this.elementPosition.left - tooltipWidth - this.tooltipOffset;
        }
        if (placement === 'right') {
            leftStyle = this.elementPosition.left + elementWidth + this.tooltipOffset;
        }
        if (placement === 'left' || placement === 'right') {
            topStyle = (this.elementPosition.top + scrollY) + elementHeight / 2 - tooltip.clientHeight / 2;
        }
        /* Is tooltip outside the visible area */
        if (this.autoPlacement && !disableAutoPlacement) {
            const topEdge = topStyle;
            const bottomEdge = topStyle + tooltipHeight;
            const leftEdge = leftStyle;
            const rightEdge = leftStyle + tooltipWidth;
            const bodyHeight = window.innerHeight + scrollY;
            const bodyWidth = document.body.clientWidth;
            if (topEdge < 0 || bottomEdge > bodyHeight || leftEdge < 0 || rightEdge > bodyWidth) {
                return false;
            }
        }
        this.hostStyleTop = topStyle + 'px';
        this.hostStyleLeft = leftStyle + 'px';
        return true;
    }
    setZIndex() {
        if (this.options['zIndex'] !== 0) {
            this.hostStyleZIndex = this.options['zIndex'];
        }
    }
    setPointerEvents() {
        if (this.options['pointerEvents']) {
            this.hostStylePointerEvents = this.options['pointerEvents'];
        }
    }
    setCustomClass() {
        if (this.options['tooltipClass']) {
            this.options['tooltipClass'].split(' ').forEach(className => {
                this.renderer.addClass(this.elementRef.nativeElement, className);
            });
        }
    }
    setAnimationDuration() {
        if (Number(this.options['animationDuration']) != this.options['animationDurationDefault']) {
            this.hostStyleTransition = 'opacity ' + this.options['animationDuration'] + 'ms';
        }
    }
    setStyles() {
        this.setZIndex();
        this.setPointerEvents();
        this.setAnimationDuration();
        this.hostClassShadow = this.options['shadow'];
        this.hostClassLight = this.isThemeLight;
        this.hostStyleMaxWidth = this.options['maxWidth'] + "px";
        this.hostStyleWidth = this.options['width'] ? this.options['width'] + "px" : '';
    }
};
TooltipComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
__decorate([
    Input()
], TooltipComponent.prototype, "data", void 0);
__decorate([
    HostBinding('style.top')
], TooltipComponent.prototype, "hostStyleTop", void 0);
__decorate([
    HostBinding('style.left')
], TooltipComponent.prototype, "hostStyleLeft", void 0);
__decorate([
    HostBinding('style.z-index')
], TooltipComponent.prototype, "hostStyleZIndex", void 0);
__decorate([
    HostBinding('style.transition')
], TooltipComponent.prototype, "hostStyleTransition", void 0);
__decorate([
    HostBinding('style.width')
], TooltipComponent.prototype, "hostStyleWidth", void 0);
__decorate([
    HostBinding('style.max-width')
], TooltipComponent.prototype, "hostStyleMaxWidth", void 0);
__decorate([
    HostBinding('style.pointer-events')
], TooltipComponent.prototype, "hostStylePointerEvents", void 0);
__decorate([
    HostBinding('class.tooltip-show')
], TooltipComponent.prototype, "hostClassShow", void 0);
__decorate([
    HostBinding('class.tooltip-shadow')
], TooltipComponent.prototype, "hostClassShadow", void 0);
__decorate([
    HostBinding('class.tooltip-light')
], TooltipComponent.prototype, "hostClassLight", void 0);
__decorate([
    HostListener('transitionend', ['$event'])
], TooltipComponent.prototype, "transitionEnd", null);
__decorate([
    Input()
], TooltipComponent.prototype, "show", null);
TooltipComponent = __decorate([
    Component({
        selector: 'tooltip',
        template: "<div *ngIf=\"isThemeLight\" class=\"tooltip-arrow\"></div>\r\n\r\n<div *ngIf=\"options['contentType'] === 'template' else htmlOrStringTemplate\">\r\n\r\n\t<ng-container *ngTemplateOutlet=\"value\"></ng-container>\r\n</div>\r\n\r\n<ng-template #htmlOrStringTemplate>\r\n\t<div [innerHTML]=\"value\"></div>\r\n</ng-template>\r\n",
        host: {
            'class': 'tooltip'
        },
        styles: [":host{max-width:200px;background-color:#000;color:#fff;text-align:center;border-radius:6px;padding:5px 8px;position:absolute;pointer-events:none;z-index:1000;display:block;opacity:0;transition:opacity .3s;top:0;left:0}:host.tooltip-show{opacity:1}:host.tooltip-shadow{box-shadow:0 7px 15px -5px rgba(0,0,0,.4)}:host.tooltip-light.tooltip-shadow{box-shadow:0 5px 15px -5px rgba(0,0,0,.4)}:host.tooltip::after{content:\"\";position:absolute;border-style:solid}:host.tooltip-top::after{top:100%;left:50%;margin-left:-5px;border-width:5px;border-color:#000 transparent transparent}:host.tooltip-bottom::after{bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-color:transparent transparent #000}:host.tooltip-left::after{top:50%;left:100%;margin-top:-5px;border-width:5px;border-color:transparent transparent transparent #000}:host.tooltip-right::after{top:50%;right:100%;margin-top:-5px;border-width:5px;border-color:transparent #000 transparent transparent}:host.tooltip-light::after{display:none}:host.tooltip-light{border:1px solid rgba(0,0,0,.06);background-color:#fff;color:#000}:host.tooltip-light .tooltip-arrow{position:absolute;width:10px;height:10px;transform:rotate(135deg);background-color:rgba(0,0,0,.07)}:host.tooltip-light .tooltip-arrow::after{background-color:#fff;content:\"\";display:block;position:absolute;width:10px;height:10px}:host.tooltip-top.tooltip-light{margin-top:-2px}:host.tooltip-top.tooltip-light .tooltip-arrow{top:100%;left:50%;margin-top:-4px;margin-left:-5px;background:linear-gradient(to bottom left,rgba(0,0,0,.07) 50%,transparent 50%)}:host.tooltip-top.tooltip-light .tooltip-arrow::after{top:1px;right:1px}:host.tooltip-bottom.tooltip-light .tooltip-arrow{bottom:100%;left:50%;margin-bottom:-4px;margin-left:-5px;background:linear-gradient(to top right,rgba(0,0,0,.1) 50%,transparent 50%)}:host.tooltip-bottom.tooltip-light .tooltip-arrow::after{top:-1px;right:-1px}:host.tooltip-left.tooltip-light .tooltip-arrow{top:50%;left:100%;margin-top:-5px;margin-left:-4px;background:linear-gradient(to bottom right,rgba(0,0,0,.07) 50%,transparent 50%)}:host.tooltip-left.tooltip-light .tooltip-arrow::after{top:1px;right:-1px}:host.tooltip-right.tooltip-light .tooltip-arrow{top:50%;right:100%;margin-top:-5px;margin-right:-4px;background:linear-gradient(to top left,rgba(0,0,0,.07) 50%,transparent 50%)}:host.tooltip-right.tooltip-light .tooltip-arrow::after{top:-1px;right:1px}"]
    })
], TooltipComponent);

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionToken used to import the config (initOptions) object, provided from the outside
 */
const TooltipOptionsService = new InjectionToken('TooltipOptions');

const defaultOptions = {
    'placement': 'top',
    'autoPlacement': true,
    'contentType': 'string',
    'showDelay': 0,
    'hideDelay': 300,
    'hideDelayMobile': 0,
    'hideDelayTouchscreen': 0,
    'zIndex': 0,
    'animationDuration': 300,
    'animationDurationDefault': 300,
    'trigger': 'hover',
    'tooltipClass': '',
    'display': true,
    'displayMobile': true,
    'displayTouchscreen': true,
    'shadow': true,
    'theme': 'dark',
    'offset': 8,
    'maxWidth': '',
    'id': false,
    'hideDelayAfterClick': 2000
};
const backwardCompatibilityOptions = {
    'delay': 'showDelay',
    'show-delay': 'showDelay',
    'hide-delay': 'hideDelay',
    'hide-delay-mobile': 'hideDelayTouchscreen',
    'hideDelayMobile': 'hideDelayTouchscreen',
    'z-index': 'zIndex',
    'animation-duration': 'animationDuration',
    'animation-duration-default': 'animationDurationDefault',
    'tooltip-class': 'tooltipClass',
    'display-mobile': 'displayTouchscreen',
    'displayMobile': 'displayTouchscreen',
    'max-width': 'maxWidth'
};

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

var TooltipModule_1;
let TooltipModule = TooltipModule_1 = class TooltipModule {
    static forRoot(initOptions) {
        return {
            ngModule: TooltipModule_1,
            providers: [
                {
                    provide: TooltipOptionsService,
                    useValue: initOptions
                }
            ]
        };
    }
};
TooltipModule = TooltipModule_1 = __decorate([
    NgModule({
        declarations: [
            TooltipDirective,
            TooltipComponent
        ],
        imports: [
            CommonModule
        ],
        exports: [
            TooltipDirective
        ],
        entryComponents: [
            TooltipComponent
        ]
    })
], TooltipModule);

/**
 * Generated bundle index. Do not edit.
 */

export { TooltipComponent, TooltipDirective, TooltipModule, TooltipOptionsService as ɵa };
//# sourceMappingURL=ngx-tooltip-directive.js.map
