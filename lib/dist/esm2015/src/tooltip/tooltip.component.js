import { __decorate } from "tslib";
import { Component, ElementRef, HostListener, HostBinding, Input, OnInit, EventEmitter, Renderer2 } from '@angular/core';
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
export { TooltipComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdG9vbHRpcC1kaXJlY3RpdmUvIiwic291cmNlcyI6WyJzcmMvdG9vbHRpcC90b29sdGlwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFXdkgsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFvRXpCLFlBQW9CLFVBQXNCLEVBQVUsUUFBbUI7UUFBbkQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFuRXZFLFVBQUssR0FBWSxLQUFLLENBQUM7UUFDdkIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFrRThDLENBQUM7SUFsRDNFLGFBQWEsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLE9BQU87YUFDaEIsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRVEsSUFBSSxJQUFJLENBQUMsS0FBYztRQUM1QixJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUNELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLE9B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TyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDcEYsQ0FBQztDQUNKLENBQUE7O1lBdkltQyxVQUFVO1lBQW9CLFNBQVM7O0FBaEU5RDtJQUFSLEtBQUssRUFBRTs4Q0FBVztBQUVPO0lBQXpCLFdBQVcsQ0FBQyxXQUFXLENBQUM7c0RBQXNCO0FBQ3BCO0lBQTFCLFdBQVcsQ0FBQyxZQUFZLENBQUM7dURBQXVCO0FBQ25CO0lBQTdCLFdBQVcsQ0FBQyxlQUFlLENBQUM7eURBQXlCO0FBQ3JCO0lBQWhDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQzs2REFBNkI7QUFDakM7SUFBM0IsV0FBVyxDQUFDLGFBQWEsQ0FBQzt3REFBd0I7QUFDbkI7SUFBL0IsV0FBVyxDQUFDLGlCQUFpQixDQUFDOzJEQUEyQjtBQUNyQjtJQUFwQyxXQUFXLENBQUMsc0JBQXNCLENBQUM7Z0VBQWdDO0FBQ2pDO0lBQWxDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQzt1REFBd0I7QUFDckI7SUFBcEMsV0FBVyxDQUFDLHNCQUFzQixDQUFDO3lEQUEwQjtBQUMxQjtJQUFuQyxXQUFXLENBQUMscUJBQXFCLENBQUM7d0RBQXlCO0FBRzVEO0lBREMsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FEQU96QztBQUVRO0lBQVIsS0FBSyxFQUFFOzRDQUtQO0FBL0JRLGdCQUFnQjtJQVQ1QixTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsU0FBUztRQUNuQixrVkFBdUM7UUFDdkMsSUFBSSxFQUFFO1lBQ0YsT0FBTyxFQUFFLFNBQVM7U0FDckI7O0tBRUosQ0FBQztHQUVXLGdCQUFnQixDQTJNNUI7U0EzTVksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSG9zdEJpbmRpbmcsIElucHV0LCBPbkluaXQsIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICd0b29sdGlwJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi90b29sdGlwLmNvbXBvbmVudC5odG1sJyxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnY2xhc3MnOiAndG9vbHRpcCdcclxuICAgIH0sXHJcbiAgICBzdHlsZVVybHM6IFsnLi90b29sdGlwLmNvbXBvbmVudC5zYXNzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IHtcclxuICAgIF9zaG93OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KCkgZGF0YTogYW55O1xyXG5cclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUudG9wJykgaG9zdFN0eWxlVG9wOiBzdHJpbmc7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKSBob3N0U3R5bGVMZWZ0OiBzdHJpbmc7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLnotaW5kZXgnKSBob3N0U3R5bGVaSW5kZXg6IG51bWJlcjtcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUudHJhbnNpdGlvbicpIGhvc3RTdHlsZVRyYW5zaXRpb246IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKSBob3N0U3R5bGVXaWR0aDogc3RyaW5nO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXgtd2lkdGgnKSBob3N0U3R5bGVNYXhXaWR0aDogc3RyaW5nO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5wb2ludGVyLWV2ZW50cycpIGhvc3RTdHlsZVBvaW50ZXJFdmVudHM6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnY2xhc3MudG9vbHRpcC1zaG93JykgaG9zdENsYXNzU2hvdzogYm9vbGVhbjtcclxuICAgIEBIb3N0QmluZGluZygnY2xhc3MudG9vbHRpcC1zaGFkb3cnKSBob3N0Q2xhc3NTaGFkb3c6IGJvb2xlYW47XHJcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLnRvb2x0aXAtbGlnaHQnKSBob3N0Q2xhc3NMaWdodDogYm9vbGVhbjtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgWyckZXZlbnQnXSlcclxuICAgIHRyYW5zaXRpb25FbmQoZXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5zaG93KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3Nob3duJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCkgc2V0IHNob3codmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zaG93ID0gdGhpcy5ob3N0Q2xhc3NTaG93ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXQgc2hvdygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hvdztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGxhY2VtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEub3B0aW9ucy5wbGFjZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGF1dG9QbGFjZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5vcHRpb25zLmF1dG9QbGFjZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbGVtZW50UG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbGVtZW50UG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0b29sdGlwT2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRhdGEub3B0aW9ucy5vZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc1RoZW1lTGlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1sndGhlbWUnXSA9PT0gJ2xpZ2h0JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLnNldEN1c3RvbUNsYXNzKCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdHlsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zZXRIb3N0U3R5bGUodGhpcy5wbGFjZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGxhY2VtZW50Q2xhc3ModGhpcy5wbGFjZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLyogSXMgdG9vbHRpcCBvdXRzaWRlIHRoZSB2aXNpYmxlIGFyZWEgKi9cclxuICAgICAgICAgICAgY29uc3QgcGxhY2VtZW50cyA9IFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J107XHJcbiAgICAgICAgICAgIGxldCBpc1BsYWNlbWVudFNldDtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGxhY2VtZW50IG9mIHBsYWNlbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldEhvc3RTdHlsZShwbGFjZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRQbGFjZW1lbnRDbGFzcyhwbGFjZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50U2V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFNldCBvcmlnaW5hbCBwbGFjZW1lbnQgKi9cclxuICAgICAgICAgICAgaWYgKCFpc1BsYWNlbWVudFNldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIb3N0U3R5bGUodGhpcy5wbGFjZW1lbnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQbGFjZW1lbnRDbGFzcyh0aGlzLnBsYWNlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldFBsYWNlbWVudENsYXNzKHBsYWNlbWVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3Rvb2x0aXAtJyArIHBsYWNlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SG9zdFN0eWxlKHBsYWNlbWVudDogc3RyaW5nLCBkaXNhYmxlQXV0b1BsYWNlbWVudDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaXNTdmcgPSB0aGlzLmVsZW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcclxuICAgICAgICBjb25zdCBpc0N1c3RvbVBvc2l0aW9uID0gIXRoaXMuZWxlbWVudFBvc2l0aW9uLnJpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgZWxlbWVudEhlaWdodCA9IGlzU3ZnID8gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCA6IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRXaWR0aCA9IGlzU3ZnID8gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIDogdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRvb2x0aXBIZWlnaHQgPSB0b29sdGlwLmNsaWVudEhlaWdodDtcclxuICAgICAgICBjb25zdCB0b29sdGlwV2lkdGggPSB0b29sdGlwLmNsaWVudFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG4gICAgICAgIGlmIChpc0N1c3RvbVBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICBlbGVtZW50V2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRvcFN0eWxlO1xyXG4gICAgICAgIGxldCBsZWZ0U3R5bGU7XHJcblxyXG4gICAgICAgIGlmIChwbGFjZW1lbnQgPT09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIHRvcFN0eWxlID0gKHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCArIHNjcm9sbFkpIC0gKHRvb2x0aXBIZWlnaHQgKyB0aGlzLnRvb2x0aXBPZmZzZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ2JvdHRvbScpIHtcclxuICAgICAgICAgICAgdG9wU3R5bGUgPSAodGhpcy5lbGVtZW50UG9zaXRpb24udG9wICsgc2Nyb2xsWSkgKyBlbGVtZW50SGVpZ2h0ICsgdGhpcy50b29sdGlwT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ3RvcCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJykge1xyXG4gICAgICAgICAgICBsZWZ0U3R5bGUgPSAodGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdCArIGVsZW1lbnRXaWR0aCAvIDIpIC0gdG9vbHRpcFdpZHRoIC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbGFjZW1lbnQgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICBsZWZ0U3R5bGUgPSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0IC0gdG9vbHRpcFdpZHRoIC0gdGhpcy50b29sdGlwT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgICBsZWZ0U3R5bGUgPSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0ICsgZWxlbWVudFdpZHRoICsgdGhpcy50b29sdGlwT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ2xlZnQnIHx8IHBsYWNlbWVudCA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgICB0b3BTdHlsZSA9ICh0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3AgKyBzY3JvbGxZKSArIGVsZW1lbnRIZWlnaHQgLyAyIC0gdG9vbHRpcC5jbGllbnRIZWlnaHQgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogSXMgdG9vbHRpcCBvdXRzaWRlIHRoZSB2aXNpYmxlIGFyZWEgKi9cclxuICAgICAgICBpZiAodGhpcy5hdXRvUGxhY2VtZW50ICYmICFkaXNhYmxlQXV0b1BsYWNlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b3BFZGdlID0gdG9wU3R5bGU7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbUVkZ2UgPSB0b3BTdHlsZSArIHRvb2x0aXBIZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRFZGdlID0gbGVmdFN0eWxlO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodEVkZ2UgPSBsZWZ0U3R5bGUgKyB0b29sdGlwV2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKyBzY3JvbGxZO1xyXG4gICAgICAgICAgICBjb25zdCBib2R5V2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvcEVkZ2UgPCAwIHx8IGJvdHRvbUVkZ2UgPiBib2R5SGVpZ2h0IHx8IGxlZnRFZGdlIDwgMCB8fCByaWdodEVkZ2UgPiBib2R5V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ob3N0U3R5bGVUb3AgPSB0b3BTdHlsZSArICdweCc7XHJcbiAgICAgICAgdGhpcy5ob3N0U3R5bGVMZWZ0ID0gbGVmdFN0eWxlICsgJ3B4JztcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRaSW5kZXgoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1snekluZGV4J10gIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5ob3N0U3R5bGVaSW5kZXggPSB0aGlzLm9wdGlvbnNbJ3pJbmRleCddO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ3BvaW50ZXJFdmVudHMnXSkge1xyXG4gICAgICAgICAgICB0aGlzLmhvc3RTdHlsZVBvaW50ZXJFdmVudHMgPSB0aGlzLm9wdGlvbnNbJ3BvaW50ZXJFdmVudHMnXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q3VzdG9tQ2xhc3MoKXtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zWyd0b29sdGlwQ2xhc3MnXSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNbJ3Rvb2x0aXBDbGFzcyddLnNwbGl0KCcgJykuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEFuaW1hdGlvbkR1cmF0aW9uKCkge1xyXG4gICAgICAgIGlmIChOdW1iZXIodGhpcy5vcHRpb25zWydhbmltYXRpb25EdXJhdGlvbiddKSAhPSB0aGlzLm9wdGlvbnNbJ2FuaW1hdGlvbkR1cmF0aW9uRGVmYXVsdCddKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9zdFN0eWxlVHJhbnNpdGlvbiA9ICdvcGFjaXR5ICcgKyB0aGlzLm9wdGlvbnNbJ2FuaW1hdGlvbkR1cmF0aW9uJ10gKyAnbXMnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRTdHlsZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRaSW5kZXgoKTtcclxuICAgICAgICB0aGlzLnNldFBvaW50ZXJFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbkR1cmF0aW9uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9zdENsYXNzU2hhZG93ID0gdGhpcy5vcHRpb25zWydzaGFkb3cnXTtcclxuICAgICAgICB0aGlzLmhvc3RDbGFzc0xpZ2h0ID0gdGhpcy5pc1RoZW1lTGlnaHQ7XHJcbiAgICAgICAgdGhpcy5ob3N0U3R5bGVNYXhXaWR0aCA9IHRoaXMub3B0aW9uc1snbWF4V2lkdGgnXSArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmhvc3RTdHlsZVdpZHRoID0gdGhpcy5vcHRpb25zWyd3aWR0aCddID8gdGhpcy5vcHRpb25zWyd3aWR0aCddICsgXCJweFwiIDogJyc7XHJcbiAgICB9XHJcbn1cclxuIl19