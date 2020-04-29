import { __decorate, __values } from "tslib";
import { Component, ElementRef, HostListener, HostBinding, Input, OnInit, EventEmitter, Renderer2 } from '@angular/core';
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
export { TooltipComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdG9vbHRpcC1kaXJlY3RpdmUvIiwic291cmNlcyI6WyJzcmMvdG9vbHRpcC90b29sdGlwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFXdkg7SUFvRUksMEJBQW9CLFVBQXNCLEVBQVUsUUFBbUI7UUFBbkQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFuRXZFLFVBQUssR0FBWSxLQUFLLENBQUM7UUFDdkIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFrRThDLENBQUM7SUFsRDNFLHdDQUFhLEdBQWIsVUFBYyxLQUFLO1FBQ2YsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLE9BQU87YUFDaEIsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRVEsc0JBQUksa0NBQUk7YUFNakI7WUFDSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQzthQVJRLFVBQVMsS0FBYztZQUM1QixJQUFJLEtBQUssRUFBRTtnQkFDUCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEI7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzVDLENBQUM7OztPQUFBO0lBS0Qsc0JBQUksdUNBQVM7YUFBYjtZQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksMkNBQWE7YUFBakI7WUFD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O2dCQUNGLE9BQU8sRUFBRSxTQUFTO2FBQ3JCOztTQUVKLENBQUM7T0FFVyxnQkFBZ0IsQ0EyTTVCO0lBQUQsdUJBQUM7Q0FBQSxBQTNNRCxJQTJNQztTQTNNWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdCwgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3Rvb2x0aXAnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL3Rvb2x0aXAuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICdjbGFzcyc6ICd0b29sdGlwJ1xyXG4gICAgfSxcclxuICAgIHN0eWxlVXJsczogWycuL3Rvb2x0aXAuY29tcG9uZW50LnNhc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb21wb25lbnQge1xyXG4gICAgX3Nob3c6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBASW5wdXQoKSBkYXRhOiBhbnk7XHJcblxyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS50b3AnKSBob3N0U3R5bGVUb3A6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpIGhvc3RTdHlsZUxlZnQ6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuei1pbmRleCcpIGhvc3RTdHlsZVpJbmRleDogbnVtYmVyO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS50cmFuc2l0aW9uJykgaG9zdFN0eWxlVHJhbnNpdGlvbjogc3RyaW5nO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIGhvc3RTdHlsZVdpZHRoOiBzdHJpbmc7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1heC13aWR0aCcpIGhvc3RTdHlsZU1heFdpZHRoOiBzdHJpbmc7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLnBvaW50ZXItZXZlbnRzJykgaG9zdFN0eWxlUG9pbnRlckV2ZW50czogc3RyaW5nO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy50b29sdGlwLXNob3cnKSBob3N0Q2xhc3NTaG93OiBib29sZWFuO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy50b29sdGlwLXNoYWRvdycpIGhvc3RDbGFzc1NoYWRvdzogYm9vbGVhbjtcclxuICAgIEBIb3N0QmluZGluZygnY2xhc3MudG9vbHRpcC1saWdodCcpIGhvc3RDbGFzc0xpZ2h0OiBib29sZWFuO1xyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBbJyRldmVudCddKVxyXG4gICAgdHJhbnNpdGlvbkVuZChldmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3cpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2hvd24nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBzZXQgc2hvdyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Nob3cgPSB0aGlzLmhvc3RDbGFzc1Nob3cgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGdldCBzaG93KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaG93O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwbGFjZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5vcHRpb25zLnBsYWNlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYXV0b1BsYWNlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm9wdGlvbnMuYXV0b1BsYWNlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsZW1lbnRQb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsZW1lbnRQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb3B0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRvb2x0aXBPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZGF0YS5vcHRpb25zLm9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzVGhlbWVMaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zWyd0aGVtZSddID09PSAnbGlnaHQnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuc2V0Q3VzdG9tQ2xhc3MoKTtcclxuICAgICAgICB0aGlzLnNldFN0eWxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnNldEhvc3RTdHlsZSh0aGlzLnBsYWNlbWVudCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQbGFjZW1lbnRDbGFzcyh0aGlzLnBsYWNlbWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKiBJcyB0b29sdGlwIG91dHNpZGUgdGhlIHZpc2libGUgYXJlYSAqL1xyXG4gICAgICAgICAgICBjb25zdCBwbGFjZW1lbnRzID0gWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXTtcclxuICAgICAgICAgICAgbGV0IGlzUGxhY2VtZW50U2V0O1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBwbGFjZW1lbnQgb2YgcGxhY2VtZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0SG9zdFN0eWxlKHBsYWNlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBsYWNlbWVudENsYXNzKHBsYWNlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRTZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogU2V0IG9yaWdpbmFsIHBsYWNlbWVudCAqL1xyXG4gICAgICAgICAgICBpZiAoIWlzUGxhY2VtZW50U2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEhvc3RTdHlsZSh0aGlzLnBsYWNlbWVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBsYWNlbWVudENsYXNzKHRoaXMucGxhY2VtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0UGxhY2VtZW50Q2xhc3MocGxhY2VtZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndG9vbHRpcC0nICsgcGxhY2VtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRIb3N0U3R5bGUocGxhY2VtZW50OiBzdHJpbmcsIGRpc2FibGVBdXRvUGxhY2VtZW50OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc1N2ZyA9IHRoaXMuZWxlbWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGlzQ3VzdG9tUG9zaXRpb24gPSAhdGhpcy5lbGVtZW50UG9zaXRpb24ucmlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50SGVpZ2h0ID0gaXNTdmcgPyB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IDogdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgICAgICBsZXQgZWxlbWVudFdpZHRoID0gaXNTdmcgPyB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggOiB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcEhlaWdodCA9IHRvb2x0aXAuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcbiAgICAgICAgaWYgKGlzQ3VzdG9tUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgZWxlbWVudEhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgIGVsZW1lbnRXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9wU3R5bGU7XHJcbiAgICAgICAgbGV0IGxlZnRTdHlsZTtcclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgdG9wU3R5bGUgPSAodGhpcy5lbGVtZW50UG9zaXRpb24udG9wICsgc2Nyb2xsWSkgLSAodG9vbHRpcEhlaWdodCArIHRoaXMudG9vbHRpcE9mZnNldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VtZW50ID09PSAnYm90dG9tJykge1xyXG4gICAgICAgICAgICB0b3BTdHlsZSA9ICh0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3AgKyBzY3JvbGxZKSArIGVsZW1lbnRIZWlnaHQgKyB0aGlzLnRvb2x0aXBPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VtZW50ID09PSAndG9wJyB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XHJcbiAgICAgICAgICAgIGxlZnRTdHlsZSA9ICh0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0ICsgZWxlbWVudFdpZHRoIC8gMikgLSB0b29sdGlwV2lkdGggLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgIGxlZnRTdHlsZSA9IHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQgLSB0b29sdGlwV2lkdGggLSB0aGlzLnRvb2x0aXBPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VtZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIGxlZnRTdHlsZSA9IHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQgKyBlbGVtZW50V2lkdGggKyB0aGlzLnRvb2x0aXBPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VtZW50ID09PSAnbGVmdCcgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIHRvcFN0eWxlID0gKHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCArIHNjcm9sbFkpICsgZWxlbWVudEhlaWdodCAvIDIgLSB0b29sdGlwLmNsaWVudEhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBJcyB0b29sdGlwIG91dHNpZGUgdGhlIHZpc2libGUgYXJlYSAqL1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGFjZW1lbnQgJiYgIWRpc2FibGVBdXRvUGxhY2VtZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcEVkZ2UgPSB0b3BTdHlsZTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tRWRnZSA9IHRvcFN0eWxlICsgdG9vbHRpcEhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgbGVmdEVkZ2UgPSBsZWZ0U3R5bGU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0RWRnZSA9IGxlZnRTdHlsZSArIHRvb2x0aXBXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgYm9keUhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCArIHNjcm9sbFk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAodG9wRWRnZSA8IDAgfHwgYm90dG9tRWRnZSA+IGJvZHlIZWlnaHQgfHwgbGVmdEVkZ2UgPCAwIHx8IHJpZ2h0RWRnZSA+IGJvZHlXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhvc3RTdHlsZVRvcCA9IHRvcFN0eWxlICsgJ3B4JztcclxuICAgICAgICB0aGlzLmhvc3RTdHlsZUxlZnQgPSBsZWZ0U3R5bGUgKyAncHgnO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFpJbmRleCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWyd6SW5kZXgnXSAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmhvc3RTdHlsZVpJbmRleCA9IHRoaXMub3B0aW9uc1snekluZGV4J107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFBvaW50ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1sncG9pbnRlckV2ZW50cyddKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9zdFN0eWxlUG9pbnRlckV2ZW50cyA9IHRoaXMub3B0aW9uc1sncG9pbnRlckV2ZW50cyddO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXN0b21DbGFzcygpe1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3Rvb2x0aXBDbGFzcyddKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1sndG9vbHRpcENsYXNzJ10uc3BsaXQoJyAnKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5pbWF0aW9uRHVyYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKE51bWJlcih0aGlzLm9wdGlvbnNbJ2FuaW1hdGlvbkR1cmF0aW9uJ10pICE9IHRoaXMub3B0aW9uc1snYW5pbWF0aW9uRHVyYXRpb25EZWZhdWx0J10pIHtcclxuICAgICAgICAgICAgdGhpcy5ob3N0U3R5bGVUcmFuc2l0aW9uID0gJ29wYWNpdHkgJyArIHRoaXMub3B0aW9uc1snYW5pbWF0aW9uRHVyYXRpb24nXSArICdtcyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFN0eWxlcygpIHtcclxuICAgICAgICB0aGlzLnNldFpJbmRleCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9pbnRlckV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uRHVyYXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3N0Q2xhc3NTaGFkb3cgPSB0aGlzLm9wdGlvbnNbJ3NoYWRvdyddO1xyXG4gICAgICAgIHRoaXMuaG9zdENsYXNzTGlnaHQgPSB0aGlzLmlzVGhlbWVMaWdodDtcclxuICAgICAgICB0aGlzLmhvc3RTdHlsZU1heFdpZHRoID0gdGhpcy5vcHRpb25zWydtYXhXaWR0aCddICsgXCJweFwiO1xyXG4gICAgICAgIHRoaXMuaG9zdFN0eWxlV2lkdGggPSB0aGlzLm9wdGlvbnNbJ3dpZHRoJ10gPyB0aGlzLm9wdGlvbnNbJ3dpZHRoJ10gKyBcInB4XCIgOiAnJztcclxuICAgIH1cclxufVxyXG4iXX0=