/**
 * Trigger
 * 
 * 非同步的事件依序觸發機制
 * */
export namespace Trigger {
    /** 
     * 事件
     * */
    interface Event {
        Id: Symbol;
        subscribes: Subscribe[];
        lock: {
            /**觸發狀態鎖 */
            emit: boolean;
        }
    }

    /**訂閱 */
    export interface Subscribe {
        Id: Symbol;
        status: {
            /** 為單次訂閱*/
            isOnce: boolean;
            /** 訂閱結束*/
            isFinish: boolean;
            /** 要等待訂閱函數執行結束再進行下個訂閱*/
            isWaitAsyncFinish: boolean;
        }
        /**訂閱函數 */
        fn: SubscribeFn;
    }

    /**
     * return isFinish 是否結束訂閱
     * 
     * @return isFinish 是否結束訂閱
     */
    export type SubscribeFn = (event: Event) => Promise<boolean | void>;

    export async function msleep(timeout: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(resolve, timeout);
        });
    }

    export async function wait() {
        return await msleep(1);
    }


    /**
     * 所有事件儲存在單一的事件池進行統一管理
     */
    namespace Pool {
        /** 
         * 事件池
         * */
        const pool: Map<Symbol, Event> = new Map();

        /**
         * 移除事件
         * */
        export async function removeEvent(eventId: Symbol) {
            if (pool.has(eventId)) {
                return pool.delete(eventId);
            } else {
                return true;
            }
        }

        /**
         * 取得事件
         * */
        export async function getEvent(eventId: Symbol) {
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
        }

        /**
         * 新增訂閱
         * */
        export async function addSubscribe(eventId: Symbol, observableFn: SubscribeFn, isOnce: boolean = false, isWaitAsyncFinish = false) {
            let event = await getEvent(eventId);
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
        }

        /**
         * 移除訂閱
         * */
        export async function removeSubscribe(eventId: Symbol, filterFn: (subscribe: Subscribe) => boolean) {
            let event = await getEvent(eventId);
            if (event) {
                event.subscribes = event.subscribes.filter(filterFn);
            }
        }
    }

    /**
     * 觸發程序
     * */
    namespace AutoEmit {
        export interface IEmit {
            eventId: Symbol;
            callback: () => void;
            status: {
                onProcess: boolean;
            }
        }

        let list: IEmit[] = [];
        let idleTimer = 250;

        export function add(e: IEmit) {
            list.push(e)
        }

        export async function remove(eventId: Symbol) {
            list = list.filter(item => item.eventId == eventId && item.status.onProcess == false);
        }

        async function emit(event: Event) {
            if (event.subscribes.length > 0) {
                event.lock.emit = true;
                for (let subscribe of event.subscribes) {
                    let isFinish: boolean | void;

                    if (subscribe.status.isWaitAsyncFinish) {
                        isFinish = await subscribe.fn(event);
                    } else {
                        subscribe.fn(event);
                    }

                    if (isFinish == true || subscribe.status.isOnce) {
                        subscribe.status.isFinish = true;
                    }
                }
                await Pool.removeSubscribe(event.Id, subscribe => subscribe && !subscribe.status.isFinish);
                event.lock.emit = false;
            }
        }

        async function processFn() {
            while (true) {
                try {
                    if (list.length > 0) {
                        list[0].status.onProcess = true;
                        let event = await Pool.getEvent(list[0].eventId);
                        if (event) {
                            if (event.lock.emit) {
                                list[0].status.onProcess = false;
                            } else {
                                await emit(event)
                                list[0].callback();
                                list.shift();
                            }
                        }
                        await wait();
                    } else {
                        await msleep(idleTimer);
                    }
                } catch (error) {

                } finally {
                    await msleep(idleTimer);
                }
            }
        }
        processFn();
    }

    export class ObservableEvent {
        public eventId: Symbol;
        constructor(eventId: string) {
            this.eventId = Symbol(eventId);
        }
        public async on(observableFn: SubscribeFn, isWaitAsyncFinish = false) {
            return await Pool.addSubscribe(this.eventId, observableFn, false, isWaitAsyncFinish);
        }
        public async once(observableFn: SubscribeFn, isWaitAsyncFinish = false) {
            return await Pool.addSubscribe(this.eventId, observableFn, true, isWaitAsyncFinish);
        }
        public async off(observableFn: SubscribeFn) {
            return await Pool.removeSubscribe(this.eventId, subscribe => (subscribe && (subscribe.fn == observableFn)));
        }
        public async remove() {
            await wait();
            await AutoEmit.remove(this.eventId);
            await Pool.removeEvent(this.eventId);
        }
        public async emit() {
            await wait();
            let event = await Pool.getEvent(this.eventId);
            if (event) {
                if (event.subscribes.length > 0) {
                    return new Promise<void>((resolve, reject) => {
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
        }
    }

    export function observableEvent(eventId: string = "") {
        return new ObservableEvent(eventId);
    }
}

namespace Test {
    if (require.main === module) {
        Trigger.observableEvent().emit().then();
    }
}