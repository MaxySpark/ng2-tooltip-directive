import { __values, __decorate, __param } from 'tslib';
import { EventEmitter, ElementRef, Renderer2, Input, HostBinding, HostListener, Component, InjectionToken, Optional, Inject, ComponentFactoryResolver, ApplicationRef, Injector, Output, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var TooltipComponent = /** @class */ (function () {
    function TooltipComponent(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._show = false;
        this.events = new EventEmitter();
    }
    TooltipComponent.prototype.transitionEnd = function (event) {
        if (this.show) {
            this.events.emit({
                type: 'shown'
            });
        }
    };
    Object.defineProperty(TooltipComponent.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (value) {
            if (value) {
                this.setPosition();
            }
            this._show = this.hostClassShow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "placement", {
        get: function () {
            return this.data.options.placement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "autoPlacement", {
        get: function () {
            return this.data.options.autoPlacement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "element", {
        get: function () {
            return this.data.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "elementPosition", {
        get: function () {
            return this.data.elementPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "options", {
        get: function () {
            return this.data.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "value", {
        get: function () {
            return this.data.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "tooltipOffset", {
        get: function () {
            return Number(this.data.options.offset);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipComponent.prototype, "isThemeLight", {
        get: function () {
            return this.options['theme'] === 'light';
        },
        enumerable: true,
        configurable: true
    });
    TooltipComponent.prototype.ngOnInit = function () {
        this.setCustomClass();
        this.setStyles();
    };
    TooltipComponent.prototype.setPosition = function () {
        var e_1, _a;
        if (this.setHostStyle(this.placement)) {
            this.setPlacementClass(this.placement);
            return;
        }
        else {
            /* Is tooltip outside the visible area */
            var placements = ['top', 'right', 'bottom', 'left'];
            var isPlacementSet = void 0;
            try {
                for (var placements_1 = __values(placements), placements_1_1 = placements_1.next(); !placements_1_1.done; placements_1_1 = placements_1.next()) {
                    var placement = placements_1_1.value;
                    if (this.setHostStyle(placement)) {
                        this.setPlacementClass(placement);
                        isPlacementSet = true;
                        return;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (placements_1_1 && !placements_1_1.done && (_a = placements_1.return)) _a.call(placements_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            /* Set original placement */
            if (!isPlacementSet) {
                this.setHostStyle(this.placement, true);
                this.setPlacementClass(this.placement);
            }
        }
    };
    TooltipComponent.prototype.setPlacementClass = function (placement) {
        this.renderer.addClass(this.elementRef.nativeElement, 'tooltip-' + placement);
    };
    TooltipComponent.prototype.setHostStyle = function (placement, disableAutoPlacement) {
        if (disableAutoPlacement === void 0) { disableAutoPlacement = false; }
        var isSvg = this.element instanceof SVGElement;
        var tooltip = this.elementRef.nativeElement;
        var isCustomPosition = !this.elementPosition.right;
        var elementHeight = isSvg ? this.element.getBoundingClientRect().height : this.element.offsetHeight;
        var elementWidth = isSvg ? this.element.getBoundingClientRect().width : this.element.offsetWidth;
        var tooltipHeight = tooltip.clientHeight;
        var tooltipWidth = tooltip.clientWidth;
        var scrollY = window.pageYOffset;
        if (isCustomPosition) {
            elementHeight = 0;
            elementWidth = 0;
        }
        var topStyle;
        var leftStyle;
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
            var topEdge = topStyle;
            var bottomEdge = topStyle + tooltipHeight;
            var leftEdge = leftStyle;
            var rightEdge = leftStyle + tooltipWidth;
            var bodyHeight = window.innerHeight + scrollY;
            var bodyWidth = document.body.clientWidth;
            if (topEdge < 0 || bottomEdge > bodyHeight || leftEdge < 0 || rightEdge > bodyWidth) {
                return false;
            }
        }
        this.hostStyleTop = topStyle + 'px';
        this.hostStyleLeft = leftStyle + 'px';
        return true;
    };
    TooltipComponent.prototype.setZIndex = function () {
        if (this.options['zIndex'] !== 0) {
            this.hostStyleZIndex = this.options['zIndex'];
        }
    };
    TooltipComponent.prototype.setPointerEvents = function () {
        if (this.options['pointerEvents']) {
            this.hostStylePointerEvents = this.options['pointerEvents'];
        }
    };
    TooltipComponent.prototype.setCustomClass = function () {
        var _this = this;
        if (this.options['tooltipClass']) {
            this.options['tooltipClass'].split(' ').forEach(function (className) {
                _this.renderer.addClass(_this.elementRef.nativeElement, className);
            });
        }
    };
    TooltipComponent.prototype.setAnimationDuration = function () {
        if (Number(this.options['animationDuration']) != this.options['animationDurationDefault']) {
            this.hostStyleTransition = 'opacity ' + this.options['animationDuration'] + 'ms';
        }
    };
    TooltipComponent.prototype.setStyles = function () {
        this.setZIndex();
        this.setPointerEvents();
        this.setAnimationDuration();
        this.hostClassShadow = this.options['shadow'];
        this.hostClassLight = this.isThemeLight;
        this.hostStyleMaxWidth = this.options['maxWidth'] + "px";
        this.hostStyleWidth = this.options['width'] ? this.options['width'] + "px" : '';
    };
    TooltipComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
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
    return TooltipComponent;
}());

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionToken used to import the config (initOptions) object, provided from the outside
 */
var TooltipOptionsService = new InjectionToken('TooltipOptions');

var defaultOptions = {
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
var backwardCompatibilityOptions = {
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

var TooltipDirective = /** @class */ (function () {
    function TooltipDirective(initOptions, elementRef, componentFactoryResolver, appRef, injector) {
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
    Object.defineProperty(TooltipDirective.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            if (value && defaultOptions) {
                this._options = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "isTooltipDestroyed", {
        get: function () {
            return this.componentRef && this.componentRef.hostView.destroyed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "destroyDelay", {
        get: function () {
            if (this._destroyDelay) {
                return this._destroyDelay;
            }
            else {
                return Number(this.getHideDelay()) + Number(this.options['animationDuration']);
            }
        },
        set: function (value) {
            this._destroyDelay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "tooltipPosition", {
        get: function () {
            if (this.options['position']) {
                return this.options['position'];
            }
            else {
                return this.elementPosition;
            }
        },
        enumerable: true,
        configurable: true
    });
    TooltipDirective.prototype.onMouseEnter = function () {
        if (this.isDisplayOnHover == false) {
            return;
        }
        this.show();
    };
    TooltipDirective.prototype.onMouseLeave = function () {
        if (this.options['trigger'] === 'hover') {
            this.destroyTooltip();
        }
    };
    TooltipDirective.prototype.onClick = function () {
        var _this = this;
        if (this.isDisplayOnClick == false) {
            return;
        }
        this.show();
        this.hideAfterClickTimeoutId = window.setTimeout(function () {
            _this.destroyTooltip();
        }, this.options['hideDelayAfterClick']);
    };
    TooltipDirective.prototype.ngOnInit = function () {
    };
    TooltipDirective.prototype.ngOnChanges = function (changes) {
        this.initOptions = this.renameProperties(this.initOptions);
        var changedOptions = this.getProperties(changes);
        changedOptions = this.renameProperties(changedOptions);
        this.applyOptionsDefault(defaultOptions, changedOptions);
    };
    TooltipDirective.prototype.ngOnDestroy = function () {
        this.destroyTooltip({
            fast: true
        });
        if (this.componentSubscribe) {
            this.componentSubscribe.unsubscribe();
        }
    };
    TooltipDirective.prototype.getShowDelay = function () {
        return this.options['showDelay'];
    };
    TooltipDirective.prototype.getHideDelay = function () {
        var hideDelay = this.options['hideDelay'];
        var hideDelayTouchscreen = this.options['hideDelayTouchscreen'];
        return this.isTouchScreen ? hideDelayTouchscreen : hideDelay;
    };
    TooltipDirective.prototype.getProperties = function (changes) {
        var properties = {};
        for (var prop in changes) {
            if (prop !== 'options' && prop !== 'tooltipValue') {
                properties[prop] = changes[prop].currentValue;
            }
            if (prop === 'options') {
                properties = changes[prop].currentValue;
            }
        }
        return properties;
    };
    TooltipDirective.prototype.renameProperties = function (options) {
        for (var prop in options) {
            if (backwardCompatibilityOptions[prop]) {
                options[backwardCompatibilityOptions[prop]] = options[prop];
                delete options[prop];
            }
        }
        return options;
    };
    TooltipDirective.prototype.getElementPosition = function () {
        this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
    };
    TooltipDirective.prototype.createTooltip = function () {
        var _this = this;
        this.clearTimeouts();
        this.getElementPosition();
        this.createTimeoutId = window.setTimeout(function () {
            _this.appendComponentToBody(TooltipComponent);
        }, this.getShowDelay());
        this.showTimeoutId = window.setTimeout(function () {
            _this.showTooltipElem();
        }, this.getShowDelay());
    };
    TooltipDirective.prototype.destroyTooltip = function (options) {
        var _this = this;
        if (options === void 0) { options = {
            fast: false
        }; }
        this.clearTimeouts();
        if (this.isTooltipDestroyed == false) {
            this.hideTimeoutId = window.setTimeout(function () {
                _this.hideTooltip();
            }, options.fast ? 0 : this.getHideDelay());
            this.destroyTimeoutId = window.setTimeout(function () {
                if (!_this.componentRef || _this.isTooltipDestroyed) {
                    return;
                }
                _this.appRef.detachView(_this.componentRef.hostView);
                _this.componentRef.destroy();
                _this.events.emit({
                    type: 'hidden',
                    position: _this.tooltipPosition
                });
            }, options.fast ? 0 : this.destroyDelay);
        }
    };
    TooltipDirective.prototype.showTooltipElem = function () {
        this.clearTimeouts();
        this.componentRef.instance.show = true;
        this.events.emit({
            type: 'show',
            position: this.tooltipPosition
        });
    };
    TooltipDirective.prototype.hideTooltip = function () {
        if (!this.componentRef || this.isTooltipDestroyed) {
            return;
        }
        this.componentRef.instance.show = false;
        this.events.emit({
            type: 'hide',
            position: this.tooltipPosition
        });
    };
    TooltipDirective.prototype.appendComponentToBody = function (component, data) {
        var _this = this;
        if (data === void 0) { data = {}; }
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
        var domElem = this.componentRef.hostView.rootNodes[0];
        document.body.appendChild(domElem);
        this.componentSubscribe = this.componentRef.instance.events.subscribe(function (event) {
            _this.handleEvents(event);
        });
    };
    TooltipDirective.prototype.clearTimeouts = function () {
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
    };
    Object.defineProperty(TooltipDirective.prototype, "isDisplayOnHover", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "isDisplayOnClick", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "isTouchScreen", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    TooltipDirective.prototype.applyOptionsDefault = function (defaultOptions, options) {
        this.options = Object.assign({}, defaultOptions, this.initOptions || {}, options);
    };
    TooltipDirective.prototype.handleEvents = function (event) {
        if (event.type === 'shown') {
            this.events.emit({
                type: 'shown',
                position: this.tooltipPosition
            });
        }
    };
    TooltipDirective.prototype.show = function () {
        if (!this.componentRef || this.isTooltipDestroyed) {
            this.createTooltip();
        }
        else if (!this.isTooltipDestroyed) {
            this.showTooltipElem();
        }
    };
    TooltipDirective.prototype.hide = function () {
        this.destroyTooltip();
    };
    TooltipDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [TooltipOptionsService,] }] },
        { type: ElementRef },
        { type: ComponentFactoryResolver },
        { type: ApplicationRef },
        { type: Injector }
    ]; };
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
    return TooltipDirective;
}());

var TooltipModule = /** @class */ (function () {
    function TooltipModule() {
    }
    TooltipModule_1 = TooltipModule;
    TooltipModule.forRoot = function (initOptions) {
        return {
            ngModule: TooltipModule_1,
            providers: [
                {
                    provide: TooltipOptionsService,
                    useValue: initOptions
                }
            ]
        };
    };
    var TooltipModule_1;
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
    return TooltipModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TooltipComponent, TooltipDirective, TooltipModule, TooltipOptionsService as ɵa };
//# sourceMappingURL=ngx-tooltip-directive.js.map
