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
/**
 * Trigger
 *
 * 非同步的事件依序觸發機制
 * */
var Trigger;
(function (Trigger) {
    function msleep(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, timeout);
            });
        });
    }
    Trigger.msleep = msleep;
    function wait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield msleep(1);
        });
    }
    Trigger.wait = wait;
    /**
     * 所有事件儲存在單一的事件池進行統一管理
     */
    let Pool;
    (function (Pool) {
        /**
         * 事件池
         * */
        const pool = new Map();
        /**
         * 移除事件
         * */
        function removeEvent(eventId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (pool.has(eventId)) {
                    return pool.delete(eventId);
                }
                else {
                    return true;
                }
            });
        }
        Pool.removeEvent = removeEvent;
        /**
         * 取得事件
         * */
        function getEvent(eventId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!pool.has(eventId)) {
                    pool.set(eventId, {
                        Id: eventId,
                        lock: {
                            emit: false
                        },
                        subscribes: []
                    });
                }
                return pool.get(eventId);
            });
        }
        Pool.getEvent = getEvent;
        /**
         * 新增訂閱
         * */
        function addSubscribe(eventId, observableFn, isOnce = false, isWaitAsyncFinish = false) {
            return __awaiter(this, void 0, void 0, function* () {
                let event = yield getEvent(eventId);
                if (event) {
                    event.subscribes.push({
                        Id: Symbol(),
                        status: {
                            isOnce: isOnce,
                            isFinish: false,
                            isWaitAsyncFinish: isWaitAsyncFinish
                        },
                        fn: observableFn
                    });
                }
                return event;
            });
        }
        Pool.addSubscribe = addSubscribe;
        /**
         * 移除訂閱
         * */
        function removeSubscribe(eventId, filterFn) {
            return __awaiter(this, void 0, void 0, function* () {
                let event = yield getEvent(eventId);
                if (event) {
                    event.subscribes = event.subscribes.filter(filterFn);
                }
            });
        }
        Pool.removeSubscribe = removeSubscribe;
    })(Pool || (Pool = {}));
    /**
     * 觸發程序
     * */
    let AutoEmit;
    (function (AutoEmit) {
        let list = [];
        let idleTimer = 250;
        function add(e) {
            list.push(e);
        }
        AutoEmit.add = add;
        function remove(eventId) {
            return __awaiter(this, void 0, void 0, function* () {
                list = list.filter(item => item.eventId == eventId && item.status.onProcess == false);
            });
        }
        AutoEmit.remove = remove;
        function emit(event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (event.subscribes.length > 0) {
                    event.lock.emit = true;
                    for (let subscribe of event.subscribes) {
                        let isFinish;
                        if (subscribe.status.isWaitAsyncFinish) {
                            isFinish = yield subscribe.fn(event);
                        }
                        else {
                            subscribe.fn(event);
                        }
                        if (isFinish == true || subscribe.status.isOnce) {
                            subscribe.status.isFinish = true;
                        }
                    }
                    yield Pool.removeSubscribe(event.Id, subscribe => subscribe && !subscribe.status.isFinish);
                    event.lock.emit = false;
                }
            });
        }
        function processFn() {
            return __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    try {
                        if (list.length > 0) {
                            list[0].status.onProcess = true;
                            let event = yield Pool.getEvent(list[0].eventId);
                            if (event) {
                                if (event.lock.emit) {
                                    list[0].status.onProcess = false;
                                }
                                else {
                                    yield emit(event);
                                    list[0].callback();
                                    list.shift();
                                }
                            }
                            yield wait();
                        }
                        else {
                            yield msleep(idleTimer);
                        }
                    }
                    catch (error) {
                    }
                    finally {
                        yield msleep(idleTimer);
                    }
                }
            });
        }
        processFn();
    })(AutoEmit || (AutoEmit = {}));
    class ObservableEvent {
        constructor(eventId) {
            this.eventId = Symbol(eventId);
        }
        on(observableFn, isWaitAsyncFinish = false) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield Pool.addSubscribe(this.eventId, observableFn, false, isWaitAsyncFinish);
            });
        }
        once(observableFn, isWaitAsyncFinish = false) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield Pool.addSubscribe(this.eventId, observableFn, true, isWaitAsyncFinish);
            });
        }
        off(observableFn) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield Pool.removeSubscribe(this.eventId, subscribe => (subscribe && (subscribe.fn == observableFn)));
            });
        }
        remove() {
            return __awaiter(this, void 0, void 0, function* () {
                yield wait();
                yield AutoEmit.remove(this.eventId);
                yield Pool.removeEvent(this.eventId);
            });
        }
        emit() {
            return __awaiter(this, void 0, void 0, function* () {
                yield wait();
                let event = yield Pool.getEvent(this.eventId);
                if (event) {
                    if (event.subscribes.length > 0) {
                        return new Promise((resolve, reject) => {
                            AutoEmit.add({
                                eventId: this.eventId,
                                callback: resolve,
                                status: {
                                    onProcess: false
                                }
                            });
                        });
                    }
                }
            });
        }
    }
    Trigger.ObservableEvent = ObservableEvent;
    function observableEvent(eventId = "") {
        return new ObservableEvent(eventId);
    }
    Trigger.observableEvent = observableEvent;
})(Trigger = exports.Trigger || (exports.Trigger = {}));
var Test;
(function (Test) {
    if (require.main === module) {
        Trigger.observableEvent().emit().then();
    }
})(Test || (Test = {}));
