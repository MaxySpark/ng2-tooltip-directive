import { __decorate, __param } from "tslib";
import { Directive, ElementRef, HostListener, Input, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, Injector, ComponentRef, OnInit, Output, EventEmitter, OnDestroy, Inject, Optional } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipOptionsService } from './tooltip-options.service';
import { defaultOptions, backwardCompatibilityOptions } from './options';
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
export { TooltipDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdG9vbHRpcC1kaXJlY3RpdmUvIiwic291cmNlcyI6WyJzcmMvdG9vbHRpcC90b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDek4sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGNBQWMsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQWV6RTtJQTRFSSwwQkFDdUQsV0FBVyxFQUN0RCxVQUFzQixFQUN0Qix3QkFBa0QsRUFDbEQsTUFBc0IsRUFDdEIsUUFBa0I7UUFKeUIsZ0JBQVcsR0FBWCxXQUFXLENBQUE7UUFDdEQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0Qiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQVU7UUF4RTlCLGVBQVUsR0FBUSxDQUFDLENBQUM7UUFDcEIsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUV6QixhQUFRLEdBQVEsRUFBRSxDQUFDO1FBOERULFdBQU0sR0FBeUIsSUFBSSxZQUFZLEVBQVcsQ0FBQztJQU9wQyxDQUFDO0lBaEVoQixzQkFBSSxxQ0FBTzthQUs3QjtZQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO2FBUGlCLFVBQVksS0FB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REFBNEQ7SUFXckU7UUFGQyxZQUFZLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLFlBQVksQ0FBQyxZQUFZLENBQUM7d0RBTzFCO0lBSUQ7UUFGQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBQ3hCLFlBQVksQ0FBQyxZQUFZLENBQUM7d0RBSzFCO0lBR0Q7UUFEQyxZQUFZLENBQUMsT0FBTyxDQUFDO21EQVVyQjtJQS9HUSxnQkFBZ0I7UUFMNUIsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLFNBQVM7U0FDdEIsQ0FBQztRQStFTyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTtPQTdFckMsZ0JBQWdCLENBd1Y1QjtJQUFELHVCQUFDO0NBQUEsQUF4VkQsSUF3VkM7U0F4VlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEVtYmVkZGVkVmlld1JlZiwgQXBwbGljYXRpb25SZWYsIEluamVjdG9yLCBDb21wb25lbnRSZWYsIE9uSW5pdCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgSW5qZWN0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUb29sdGlwQ29tcG9uZW50IH0gZnJvbSAnLi90b29sdGlwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRvb2x0aXBPcHRpb25zU2VydmljZSB9IGZyb20gJy4vdG9vbHRpcC1vcHRpb25zLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBkZWZhdWx0T3B0aW9ucywgYmFja3dhcmRDb21wYXRpYmlsaXR5T3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucyc7XHJcbmltcG9ydCB7IFRvb2x0aXBPcHRpb25zIH0gZnJvbSAnLi90b29sdGlwLW9wdGlvbnMuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWRDb21wb25lbnQge1xyXG4gICAgZGF0YTogYW55O1xyXG4gICAgc2hvdzogYm9vbGVhbjtcclxuICAgIGNsb3NlOiBib29sZWFuO1xyXG4gICAgZXZlbnRzOiBhbnk7XHJcbn1cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbdG9vbHRpcF0nLFxyXG4gICAgZXhwb3J0QXM6ICd0b29sdGlwJyxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUb29sdGlwRGlyZWN0aXZlIHtcclxuXHJcbiAgICBoaWRlVGltZW91dElkOiBudW1iZXI7XHJcbiAgICBkZXN0cm95VGltZW91dElkOiBudW1iZXI7XHJcbiAgICBoaWRlQWZ0ZXJDbGlja1RpbWVvdXRJZDogbnVtYmVyO1xyXG4gICAgY3JlYXRlVGltZW91dElkOiBudW1iZXI7XHJcbiAgICBzaG93VGltZW91dElkOiBudW1iZXI7XHJcbiAgICBjb21wb25lbnRSZWY6IGFueTtcclxuICAgIGVsZW1lbnRQb3NpdGlvbjogYW55O1xyXG4gICAgX3Nob3dEZWxheTogYW55ID0gMDtcclxuICAgIF9oaWRlRGVsYXk6IG51bWJlciA9IDMwMDtcclxuICAgIF9pZDogYW55O1xyXG4gICAgX29wdGlvbnM6IGFueSA9IHt9O1xyXG4gICAgX2RlZmF1bHRPcHRpb25zOiBhbnk7XHJcbiAgICBfZGVzdHJveURlbGF5OiBudW1iZXI7XHJcbiAgICBjb21wb25lbnRTdWJzY3JpYmU6IGFueTtcclxuXHJcbiAgICBASW5wdXQoJ29wdGlvbnMnKSBzZXQgb3B0aW9ucyh2YWx1ZTogVG9vbHRpcE9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodmFsdWUgJiYgZGVmYXVsdE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldCBvcHRpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgndG9vbHRpcCcpIHRvb2x0aXBWYWx1ZTogc3RyaW5nO1xyXG4gICAgQElucHV0KCdwbGFjZW1lbnQnKSBwbGFjZW1lbnQ6IHN0cmluZztcclxuICAgIEBJbnB1dCgnYXV0b1BsYWNlbWVudCcpIGF1dG9QbGFjZW1lbnQ6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoJ2NvbnRlbnQtdHlwZScpIGNvbnRlbnRUeXBlOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoJ2hpZGUtZGVsYXktbW9iaWxlJykgaGlkZURlbGF5TW9iaWxlOiBudW1iZXI7XHJcbiAgICBASW5wdXQoJ2hpZGVEZWxheVRvdWNoc2NyZWVuJykgaGlkZURlbGF5VG91Y2hzY3JlZW46IG51bWJlcjtcclxuICAgIEBJbnB1dCgnei1pbmRleCcpIHpJbmRleDogbnVtYmVyO1xyXG4gICAgQElucHV0KCdhbmltYXRpb24tZHVyYXRpb24nKSBhbmltYXRpb25EdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgQElucHV0KCd0cmlnZ2VyJykgdHJpZ2dlcjogc3RyaW5nO1xyXG4gICAgQElucHV0KCd0b29sdGlwLWNsYXNzJykgdG9vbHRpcENsYXNzOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoJ2Rpc3BsYXknKSBkaXNwbGF5OiBib29sZWFuO1xyXG4gICAgQElucHV0KCdkaXNwbGF5LW1vYmlsZScpIGRpc3BsYXlNb2JpbGU6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoJ2Rpc3BsYXlUb3VjaHNjcmVlbicpIGRpc3BsYXlUb3VjaHNjcmVlbjogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgnc2hhZG93Jykgc2hhZG93OiBib29sZWFuO1xyXG4gICAgQElucHV0KCd0aGVtZScpIHRoZW1lOiBib29sZWFuO1xyXG4gICAgQElucHV0KCdvZmZzZXQnKSBvZmZzZXQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnd2lkdGgnKSB3aWR0aDogbnVtYmVyO1xyXG4gICAgQElucHV0KCdtYXgtd2lkdGgnKSBtYXhXaWR0aDogbnVtYmVyO1xyXG4gICAgQElucHV0KCdpZCcpIGlkOiBhbnk7XHJcbiAgICBASW5wdXQoJ3Nob3ctZGVsYXknKSBzaG93RGVsYXk6IG51bWJlcjtcclxuICAgIEBJbnB1dCgnaGlkZS1kZWxheScpIGhpZGVEZWxheTogbnVtYmVyO1xyXG4gICAgQElucHV0KCdoaWRlRGVsYXlBZnRlckNsaWNrJykgaGlkZURlbGF5QWZ0ZXJDbGljazogbnVtYmVyO1xyXG4gICAgQElucHV0KCdwb2ludGVyRXZlbnRzJykgcG9pbnRlckV2ZW50czogJ2F1dG8nIHwgJ25vbmUnO1xyXG4gICAgQElucHV0KCdwb3NpdGlvbicpIHBvc2l0aW9uOiB7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcn07XHJcblxyXG4gICAgZ2V0IGlzVG9vbHRpcERlc3Ryb3llZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRSZWYgJiYgdGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcuZGVzdHJveWVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkZXN0cm95RGVsYXkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc3Ryb3lEZWxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVzdHJveURlbGF5O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIodGhpcy5nZXRIaWRlRGVsYXkoKSkgKyBOdW1iZXIodGhpcy5vcHRpb25zWydhbmltYXRpb25EdXJhdGlvbiddKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXQgZGVzdHJveURlbGF5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kZXN0cm95RGVsYXkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdG9vbHRpcFBvc2l0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3Bvc2l0aW9uJ10pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1sncG9zaXRpb24nXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50UG9zaXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBPdXRwdXQoKSBldmVudHM6IEV2ZW50RW1pdHRlciA8IGFueSA+ID0gbmV3IEV2ZW50RW1pdHRlciA8IGFueSA+ICgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoVG9vbHRpcE9wdGlvbnNTZXJ2aWNlKSBwcml2YXRlIGluaXRPcHRpb25zLFxyXG4gICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG4gICAgICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcclxuICAgICAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge31cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdmb2N1c2luJylcclxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxyXG4gICAgb25Nb3VzZUVudGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheU9uSG92ZXIgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignZm9jdXNvdXQnKVxyXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXHJcbiAgICBvbk1vdXNlTGVhdmUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1sndHJpZ2dlciddID09PSAnaG92ZXInKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveVRvb2x0aXAoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxyXG4gICAgb25DbGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlPbkNsaWNrID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIHRoaXMuaGlkZUFmdGVyQ2xpY2tUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveVRvb2x0aXAoKTtcclxuICAgICAgICB9LCB0aGlzLm9wdGlvbnNbJ2hpZGVEZWxheUFmdGVyQ2xpY2snXSlcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5pbml0T3B0aW9ucyA9IHRoaXMucmVuYW1lUHJvcGVydGllcyh0aGlzLmluaXRPcHRpb25zKTtcclxuICAgICAgICBsZXQgY2hhbmdlZE9wdGlvbnMgPSB0aGlzLmdldFByb3BlcnRpZXMoY2hhbmdlcyk7XHJcbiAgICAgICAgY2hhbmdlZE9wdGlvbnMgPSB0aGlzLnJlbmFtZVByb3BlcnRpZXMoY2hhbmdlZE9wdGlvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGx5T3B0aW9uc0RlZmF1bHQoZGVmYXVsdE9wdGlvbnMsIGNoYW5nZWRPcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lUb29sdGlwKHtcclxuICAgICAgICAgICAgZmFzdDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRTdWJzY3JpYmUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRTdWJzY3JpYmUudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2hvd0RlbGF5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbJ3Nob3dEZWxheSddO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhpZGVEZWxheSgpIHtcclxuICAgICAgICBjb25zdCBoaWRlRGVsYXkgPSB0aGlzLm9wdGlvbnNbJ2hpZGVEZWxheSddO1xyXG4gICAgICAgIGNvbnN0IGhpZGVEZWxheVRvdWNoc2NyZWVuID0gdGhpcy5vcHRpb25zWydoaWRlRGVsYXlUb3VjaHNjcmVlbiddO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pc1RvdWNoU2NyZWVuID8gaGlkZURlbGF5VG91Y2hzY3JlZW4gOiBoaWRlRGVsYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydGllcyhjaGFuZ2VzKXtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgICAgaWYgKHByb3AgIT09ICdvcHRpb25zJyAmJiBwcm9wICE9PSAndG9vbHRpcFZhbHVlJyl7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BdID0gY2hhbmdlc1twcm9wXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvcHRpb25zJyl7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gY2hhbmdlc1twcm9wXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuYW1lUHJvcGVydGllcyhvcHRpb25zOiBUb29sdGlwT3B0aW9ucykge1xyXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoYmFja3dhcmRDb21wYXRpYmlsaXR5T3B0aW9uc1twcm9wXSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1tiYWNrd2FyZENvbXBhdGliaWxpdHlPcHRpb25zW3Byb3BdXSA9IG9wdGlvbnNbcHJvcF07XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgb3B0aW9uc1twcm9wXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudFBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudFBvc2l0aW9uID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVG9vbHRpcCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNsZWFyVGltZW91dHMoKTtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDb21wb25lbnRUb0JvZHkoVG9vbHRpcENvbXBvbmVudCk7XHJcbiAgICAgICAgfSwgdGhpcy5nZXRTaG93RGVsYXkoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd1RpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zaG93VG9vbHRpcEVsZW0oKTtcclxuICAgICAgICB9LCB0aGlzLmdldFNob3dEZWxheSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95VG9vbHRpcChvcHRpb25zID0ge1xyXG4gICAgICAgIGZhc3Q6IGZhbHNlXHJcbiAgICB9KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzVG9vbHRpcERlc3Ryb3llZCA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oaWRlVGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICB9LCBvcHRpb25zLmZhc3QgPyAwIDogdGhpcy5nZXRIaWRlRGVsYXkoKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50UmVmIHx8IHRoaXMuaXNUb29sdGlwRGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwUmVmLmRldGFjaFZpZXcodGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnRvb2x0aXBQb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuZmFzdCA/IDAgOiB0aGlzLmRlc3Ryb3lEZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dUb29sdGlwRWxlbSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNsZWFyVGltZW91dHMoKTtcclxuICAgICAgICAoIDwgQWRDb21wb25lbnQgPiB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZSkuc2hvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdzaG93JyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMudG9vbHRpcFBvc2l0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZVRvb2x0aXAoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudFJlZiB8fCB0aGlzLmlzVG9vbHRpcERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICggPCBBZENvbXBvbmVudCA+IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlKS5zaG93ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdoaWRlJyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMudG9vbHRpcFBvc2l0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kQ29tcG9uZW50VG9Cb2R5KGNvbXBvbmVudDogYW55LCBkYXRhOiBhbnkgPSB7fSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJcclxuICAgICAgICAgICAgLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudClcclxuICAgICAgICAgICAgLmNyZWF0ZSh0aGlzLmluamVjdG9yKTtcclxuXHJcbiAgICAgICAgKCA8IEFkQ29tcG9uZW50ID4gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UpLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnRvb2x0aXBWYWx1ZSxcclxuICAgICAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICAgICAgIGVsZW1lbnRQb3NpdGlvbjogdGhpcy50b29sdGlwUG9zaXRpb24sXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9uc1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFwcFJlZi5hdHRhY2hWaWV3KHRoaXMuY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcclxuICAgICAgICBjb25zdCBkb21FbGVtID0gKHRoaXMuY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZiA8IGFueSA+ICkucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9tRWxlbSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50U3Vic2NyaWJlID0gKCA8IEFkQ29tcG9uZW50ID4gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UpLmV2ZW50cy5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyVGltZW91dHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3JlYXRlVGltZW91dElkKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNyZWF0ZVRpbWVvdXRJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zaG93VGltZW91dElkKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNob3dUaW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaGlkZVRpbWVvdXRJZCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVGltZW91dElkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3lUaW1lb3V0SWQpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVzdHJveVRpbWVvdXRJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Rpc3BsYXlPbkhvdmVyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ2Rpc3BsYXknXSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWydkaXNwbGF5VG91Y2hzY3JlZW4nXSA9PSBmYWxzZSAmJiB0aGlzLmlzVG91Y2hTY3JlZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1sndHJpZ2dlciddICE9PSAnaG92ZXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Rpc3BsYXlPbkNsaWNrKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ2Rpc3BsYXknXSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWydkaXNwbGF5VG91Y2hzY3JlZW4nXSA9PSBmYWxzZSAmJiB0aGlzLmlzVG91Y2hTY3JlZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1sndHJpZ2dlciddICE9ICdjbGljaycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzVG91Y2hTY3JlZW4oKSB7XHJcbiAgICAgICAgdmFyIHByZWZpeGVzID0gJyAtd2Via2l0LSAtbW96LSAtby0gLW1zLSAnLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgdmFyIG1xID0gZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKHF1ZXJ5KS5tYXRjaGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaW5jbHVkZSB0aGUgJ2hlYXJ0eicgYXMgYSB3YXkgdG8gaGF2ZSBhIG5vbiBtYXRjaGluZyBNUSB0byBoZWxwIHRlcm1pbmF0ZSB0aGUgam9pblxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0LmlvL3Z6bkZIXHJcbiAgICAgICAgdmFyIHF1ZXJ5ID0gWycoJywgcHJlZml4ZXMuam9pbigndG91Y2gtZW5hYmxlZCksKCcpLCAnaGVhcnR6JywgJyknXS5qb2luKCcnKTtcclxuICAgICAgICByZXR1cm4gbXEocXVlcnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5T3B0aW9uc0RlZmF1bHQoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgdGhpcy5pbml0T3B0aW9ucyB8fCB7fSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnRzKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3Nob3duJykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzaG93bicsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy50b29sdGlwUG9zaXRpb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb21wb25lbnRSZWYgfHwgdGhpcy5pc1Rvb2x0aXBEZXN0cm95ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUb29sdGlwKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc1Rvb2x0aXBEZXN0cm95ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93VG9vbHRpcEVsZW0oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95VG9vbHRpcCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==