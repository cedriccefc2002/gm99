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
 * ViewModel
 * */
const Trigger_1 = require("./Trigger");
var Model;
(function (Model) {
    var observableEvent = Trigger_1.Trigger.observableEvent;
    class Event {
        constructor() {
            /**執行 */
            this.Process = observableEvent();
            /**成功 */
            this.Finish = observableEvent();
            /**失敗 */
            this.Fail = observableEvent();
            /**取消 */
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
            //IModel_ShowHide
            /**顯示到畫面中 */
            this.showEvent = new Event();
            /**畫面中隱藏 */
            this.hideEvent = new Event();
            /**利用使用者輸入的資料進行編輯 */
            //IModel_CRUD
            this.editEvent = new Event();
            /**重設使用者輸入的資料 */
            this.resetEvent = new Event();
            /**更新由伺服器取得的資料 */
            this.refreshEvent = new Event();
            /**新增使用者輸入的資料資料到伺服器 */
            this.createEvent = new Event();
            /**利用使用者輸入的資料進行搜尋 */
            this.searchEvent = new Event();
            /**更新使用者輸入的資料資料到伺服器 */
            this.updateEvent = new Event();
            /**刪除伺服器的資料 */
            this.deleteEvent = new Event();
            //IModel_ExportImport
            /**匯出 */
            this.exportEvent = new Event();
            /**匯入 */
            //IModel_SleepWakeUp
            this.importEvent = new Event();
            /**休眠模式 */
            this.sleepEvent = new Event();
            /**離開休眠模式 */
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
