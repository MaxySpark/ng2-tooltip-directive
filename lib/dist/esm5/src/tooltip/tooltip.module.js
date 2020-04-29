import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';
import { TooltipOptionsService } from './tooltip-options.service';
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
export { TooltipModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdG9vbHRpcC1kaXJlY3RpdmUvIiwic291cmNlcyI6WyJzcmMvdG9vbHRpcC90b29sdGlwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXZELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBaUJsRTtJQUFBO0lBYUEsQ0FBQztzQkFiWSxhQUFhO0lBRWYscUJBQU8sR0FBZCxVQUFlLFdBQTJCO1FBQ3RDLE9BQU87WUFDSCxRQUFRLEVBQUUsZUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsUUFBUSxFQUFFLFdBQVc7aUJBQ3hCO2FBQ0o7U0FDSixDQUFDO0lBQ04sQ0FBQzs7SUFaUSxhQUFhO1FBZnpCLFFBQVEsQ0FBQztZQUNOLFlBQVksRUFBRTtnQkFDVixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjthQUNuQjtZQUNELE9BQU8sRUFBRTtnQkFDTCxZQUFZO2FBQ2Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsZ0JBQWdCO2FBQ25CO1lBQ0QsZUFBZSxFQUFFO2dCQUNiLGdCQUFnQjthQUNuQjtTQUNKLENBQUM7T0FDVyxhQUFhLENBYXpCO0lBQUQsb0JBQUM7Q0FBQSxBQWJELElBYUM7U0FiWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgVG9vbHRpcERpcmVjdGl2ZSB9IGZyb20gJy4vdG9vbHRpcC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBUb29sdGlwQ29tcG9uZW50IH0gZnJvbSAnLi90b29sdGlwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRvb2x0aXBPcHRpb25zIH0gZnJvbSAnLi90b29sdGlwLW9wdGlvbnMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgVG9vbHRpcE9wdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi90b29sdGlwLW9wdGlvbnMuc2VydmljZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgVG9vbHRpcERpcmVjdGl2ZSxcclxuICAgICAgICBUb29sdGlwQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIENvbW1vbk1vZHVsZVxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBUb29sdGlwRGlyZWN0aXZlXHJcbiAgICBdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICAgICAgVG9vbHRpcENvbXBvbmVudFxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcE1vZHVsZSB7XHJcblxyXG4gICAgc3RhdGljIGZvclJvb3QoaW5pdE9wdGlvbnM6IFRvb2x0aXBPcHRpb25zKTogTW9kdWxlV2l0aFByb3ZpZGVyczxUb29sdGlwTW9kdWxlPiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IFRvb2x0aXBNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IFRvb2x0aXBPcHRpb25zU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZTogaW5pdE9wdGlvbnNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIl19