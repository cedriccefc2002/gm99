/**
 * ViewModel
 * */
import { Trigger as Trigger } from './Trigger'
import { Controller as Controller } from './Controller'

export namespace Model {
    import observableEvent = Trigger.observableEvent;
    class Event {
        /**執行 */
        public Process = observableEvent();
        /**成功 */
        public Finish = observableEvent();
        /**失敗 */
        public Fail = observableEvent();
        /**取消 */
        public Cancel = observableEvent();
        public async remove() {
            await Trigger.wait();
            for (let event of [
                this.Process,
                this.Finish,
                this.Cancel,
                this.Process,
            ]) {
                await event.remove();
            }
        }
    }
    export class ViewModel {
        public Id: Symbol;
        /**模組名稱，用於除錯時使用 */
        public modelName: string;
        //IModel_ShowHide
        /**顯示到畫面中 */
        public showEvent = new Event();
        /**畫面中隱藏 */
        public hideEvent = new Event();
        /**利用使用者輸入的資料進行編輯 */
        //IModel_CRUD
        public editEvent = new Event();
        /**重設使用者輸入的資料 */
        public resetEvent = new Event();
        /**更新由伺服器取得的資料 */
        public refreshEvent = new Event();
        /**新增使用者輸入的資料資料到伺服器 */
        public createEvent = new Event();
        /**利用使用者輸入的資料進行搜尋 */
        public searchEvent = new Event();
        /**更新使用者輸入的資料資料到伺服器 */
        public updateEvent = new Event();
        /**刪除伺服器的資料 */
        public deleteEvent = new Event();
        //IModel_ExportImport
        /**匯出 */
        public exportEvent = new Event();
        /**匯入 */
        //IModel_SleepWakeUp
        public importEvent = new Event();
        /**休眠模式 */
        public sleepEvent = new Event();
        /**離開休眠模式 */
        public wakeUpEvent = new Event();
        public modules: Controller.ViewController[] = [];
        public moduleMap: Map<string, Controller.ViewController> = new Map();
        constructor(name: string) {
            this.modelName = name;
            this.Id = Symbol(name);
        }
        public async remove() {
            await Trigger.wait();
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
                await event.remove();
            }
        }
    }
}

namespace Test {
    if (require.main === module) {
        console.dir(new Model.ViewModel('modelName'));
    }
}