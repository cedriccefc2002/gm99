"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Trigger = require("./Trigger");
const ko = require("knockout");
const viewModel = require("./Model");
const viewController = require("./Controller");
var BindingHandler;
(function (BindingHandler) {
    class Model extends viewModel.Model.ViewModel {
        constructor() {
            super(...arguments);
            this.initElement = ko.observable();
            this.updateElement = ko.observable();
            this.destroyElement = ko.observable();
            this.initElementEvent = Trigger.Trigger.observableEvent();
            this.updateElementEvent = Trigger.Trigger.observableEvent();
            this.destroyElementEvent = Trigger.Trigger.observableEvent();
        }
    }
    BindingHandler.Model = Model;
    function bindingHandlerInit(element, valueAccessor) {
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
    function bindingHandlerUpdate(element, valueAccessor) {
        setImmediate(function () {
            let model = valueAccessor();
            setImmediate(() => {
                model.updateElement(element);
                model.updateElementEvent.emit();
            });
        });
    }
    class Controller extends viewController.Controller.ViewController {
    }
    Controller.bindingHandler = {
        init: bindingHandlerInit,
        update: bindingHandlerUpdate
    };
    BindingHandler.Controller = Controller;
})(BindingHandler = exports.BindingHandler || (exports.BindingHandler = {}));
