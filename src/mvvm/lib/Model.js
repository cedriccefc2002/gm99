"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Trigger_1 = require("./Trigger");
var Model;
(function (Model) {
    var observableEvent = Trigger_1.Trigger.observableEvent;
    class Event {
        constructor() {
            this.Process = observableEvent();
            this.Finish = observableEvent();
            this.Fail = observableEvent();
            this.Cancel = observableEvent();
        }
        remove() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                for (let event of [
                    this.Process,
                    this.Finish,
                    this.Cancel,
                    this.Process,
                ]) {
                    yield event.remove();
                }
            });
        }
    }
    class ViewModel {
        constructor(name) {
            this.showEvent = new Event();
            this.hideEvent = new Event();
            this.editEvent = new Event();
            this.resetEvent = new Event();
            this.refreshEvent = new Event();
            this.createEvent = new Event();
            this.searchEvent = new Event();
            this.updateEvent = new Event();
            this.deleteEvent = new Event();
            this.exportEvent = new Event();
            this.importEvent = new Event();
            this.sleepEvent = new Event();
            this.wakeUpEvent = new Event();
            this.modules = [];
            this.moduleMap = new Map();
            this.modelName = name;
            this.Id = Symbol(name);
        }
        remove() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                for (let event of [
                    this.showEvent,
                    this.hideEvent,
                    this.editEvent,
                    this.resetEvent,
                    this.refreshEvent,
                    this.createEvent,
                    this.searchEvent,
                    this.updateEvent,
                    this.deleteEvent,
                    this.exportEvent,
                    this.importEvent,
                    this.sleepEvent,
                    this.wakeUpEvent,
                ]) {
                    yield event.remove();
                }
            });
        }
    }
    Model.ViewModel = ViewModel;
})(Model = exports.Model || (exports.Model = {}));
var Test;
(function (Test) {
    if (require.main === module) {
        console.dir(new Model.ViewModel('modelName'));
    }
})(Test || (Test = {}));
