/**
 * bindingHandlerBase
 * ko 自訂元件的基礎
 * */
import * as Trigger from './Trigger'
import * as ko from 'knockout'
import * as viewModel from './Model'
import * as viewController from './Controller'
export namespace BindingHandler {
    /**
     * element
     * 事件
     * initEvent
     * updateEvent
     * destroyEvent
     * */
    export class Model extends viewModel.Model.ViewModel {
        public initElement: KnockoutObservable<HTMLElement> = ko.observable();
        public updateElement: KnockoutObservable<HTMLElement> = ko.observable();
        public destroyElement: KnockoutObservable<HTMLElement> = ko.observable();
        //Event
        public initElementEvent = Trigger.Trigger.observableEvent();
        public updateElementEvent = Trigger.Trigger.observableEvent();
        public destroyElementEvent = Trigger.Trigger.observableEvent();
    }

    function bindingHandlerInit(element: HTMLElement, valueAccessor: KnockoutObservable<Model>) {
        setImmediate(() => {
            let model = valueAccessor();
            setImmediate(() => {
                model.initElement(element);
                model.initElementEvent.emit();
            });
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                setImmediate(() => {
                    model.destroyElement(element);
                    model.destroyElementEvent.emit();
                });
            });
        });
    }

    function bindingHandlerUpdate(element: HTMLElement, valueAccessor: KnockoutObservable<Model>) {
        setImmediate(function () {
            let model = valueAccessor();
            setImmediate(() => {
                model.updateElement(element);
                model.updateElementEvent.emit();
            });
        });
    }

    export class Controller extends viewController.Controller.ViewController {
        public static bindingHandler: KnockoutBindingHandler = {
            init: bindingHandlerInit,
            update: bindingHandlerUpdate
        }
    }
}
