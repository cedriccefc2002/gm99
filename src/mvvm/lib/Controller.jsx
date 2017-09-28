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
 * viewController
 * */
const $ = require("jquery");
const ko = require("knockout");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Model_1 = require("./Model");
const Trigger_1 = require("./Trigger");
var Controller;
(function (Controller) {
    // let GlobalId = 0;
    /**
     * 建置流程
     * init -> render -> bind
     * 移除流程
     * unbind -> clear -> destroy
     */
    class ViewController {
        constructor(name, model, contentFn = () => __awaiter(this, void 0, void 0, function* () { return <div />; }), bindSelf = false, elementString = `#${name}`) {
            this.model = model;
            this.contentFn = contentFn;
            this.elementString = elementString;
            this.bindSelf = bindSelf;
            this.controllerName = name;
        }
        /** 初始化開始*/
        beforeInit(model, Option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /** 初始化結束*/
        afterInit(model, Option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**移除開始 */
        beforeDestroy(model, Option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**移除結束 */
        afterDestroy(model, Option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield model.remove();
            });
        }
        /**before Render */
        beforeRender(model, option, content, parentElement, elementString) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                let element = parentElement.find(elementString);
                let html = "";
                if (content) {
                    html = ReactDOMServer.renderToStaticMarkup(content);
                }
                return [html, element];
            });
        }
        /**after Render */
        afterRender(model, option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**before Clear */
        beforeClear(model, option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**after Clear */
        afterClear(model, option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /** 綁定開始*/
        beforeBind(model, option, element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /** 綁定結束*/
        afterBind(model, option, element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**解除綁定開始 */
        beforeUnbind(model, option, element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        /**解除綁定結束 */
        afterUnbind(model, option, element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
            });
        }
        EachModule(fn) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.model.modules.length > 0) {
                    //相容舊版模組陣列
                    for (let mod of this.model.modules) {
                        yield fn(mod);
                    }
                }
                else {
                    //模組Map
                    for (let mod of this.model.moduleMap.values()) {
                        yield fn(mod);
                    }
                }
            });
        }
        init(option) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield this.beforeInit(this.model, this.option);
                yield this.EachModule(mod => mod.init(option));
                yield this.afterInit(this.model, this.option);
            });
        }
        destroy() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield this.beforeDestroy(this.model, this.option);
                yield this.EachModule(mod => mod.destroy());
                yield this.afterDestroy(this.model, this.option);
            });
        }
        bind(IsParentBind = false) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield this.beforeBind(this.model, this.option, this.element);
                yield this.EachModule(mod => mod.bind(IsParentBind || this.bindSelf));
                if (!IsParentBind && this.bindSelf) {
                    try {
                        this.element.each((index, elem) => {
                            ko.applyBindings(this.model, elem);
                        });
                    }
                    catch (error) {
                        console.log(`[${this.controllerName}][applyBindings error]`);
                        console.error(error);
                    }
                }
                yield this.afterBind(this.model, this.option, this.element);
            });
        }
        unbind(IsParentBind = false) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield this.beforeUnbind(this.model, this.option, this.element);
                yield this.EachModule(mod => mod.unbind(IsParentBind || this.bindSelf));
                if (!IsParentBind && this.bindSelf) {
                    try {
                        this.element.each((index, elem) => {
                            ko.cleanNode(elem);
                            $(elem).off(); //移除所有事件
                        });
                    }
                    catch (error) {
                        console.log(`[${this.controllerName}][applyBindings error]`);
                        console.error(error);
                    }
                }
                yield this.afterUnbind(this.model, this.option, this.element);
            });
        }
        render(parentElement) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                this.parentElement = parentElement;
                let [html, element] = yield this.beforeRender(this.model, this.option, yield this.contentFn(), this.parentElement, this.elementString);
                this.element = element;
                this.element.html(html);
                yield this.EachModule(mod => mod.render(this.element));
                yield this.afterRender(this.model, this.option);
            });
        }
        clear() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Trigger_1.Trigger.wait();
                yield this.beforeClear(this.model, this.option);
                yield this.EachModule(mod => mod.clear());
                this.element.html("");
                yield this.afterClear(this.model, this.option);
            });
        }
    }
    Controller.ViewController = ViewController;
    /**
     * 建立分頁模組DOM
     *
     * @param name 模組名稱
     * @param stateName 判斷狀態名稱
     * */
    function PageContent(name, stateName = 'state', index = -1) {
        return <div key={index} id={name} data-bind={`with: ${name}.model, visible: ${stateName}() == '${name}'`}></div>;
    }
    Controller.PageContent = PageContent;
    function PageContents(names, stateName = 'state') {
        let results = [];
        let index = 0;
        for (let name of names) {
            results.push(PageContent(name, stateName, index++));
        }
        return results;
    }
    Controller.PageContents = PageContents;
    /**
     * 建立模組DOM
     *
     * @param name 模組名稱
     * @param stateName 判斷狀態名稱
     * */
    function PartialContent(name) {
        return <div id={name} data-bind={`with: ${name}.model`}></div>;
    }
    Controller.PartialContent = PartialContent;
})(Controller = exports.Controller || (exports.Controller = {}));
var Test;
(function (Test) {
    if (require.main === module) {
        console.dir(new Controller.ViewController('name', new Model_1.Model.ViewModel('name')));
    }
})(Test || (Test = {}));
