/**
 * viewController
 * */
import * as $ from 'jquery'
import * as ko from 'knockout'
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Model as Model } from './Model'
import { Trigger as Trigger } from './Trigger'
import { Loader as Loader } from './Loader'

export namespace Controller {
    // let GlobalId = 0;

    // interface ICallbackFn {
    //     (): Promise<void>;
    // }

    // interface IModuleFn {
    //     (module: Interface.Controller.IController): Promise<void>;
    // }

    export interface Option {
        //Loader: Loader.ViewLoader;
    }

    /**
     * 建置流程
     * init -> render -> bind 
     * 移除流程
     * unbind -> clear -> destroy
     */
    export class ViewController {
        private contentFn: () => Promise<JSX.Element>;
        private element: JQuery;
        private parentElement: JQuery;
        private bindSelf: boolean;
        private elementString: string;

        public Id: Symbol;
        public model: Model.ViewModel;
        public option: Option;
        public controllerName: string;

        constructor(name: string, model: Model.ViewModel, contentFn: () => Promise<JSX.Element> = async () => <div />, bindSelf: boolean = false, elementString: string = `#${name}`) {
            this.model = model;
            this.contentFn = contentFn;
            this.elementString = elementString;
            this.bindSelf = bindSelf;
            this.controllerName = name;
        }

        /** 初始化開始*/
        public async beforeInit(model: Model.ViewModel, Option: Option) {
            await Trigger.wait();
        }

        /** 初始化結束*/
        public async afterInit(model: Model.ViewModel, Option: Option) {
            await Trigger.wait();
        }

        /**移除開始 */
        public async beforeDestroy(model: Model.ViewModel, Option: Option) {
            await Trigger.wait();
        }

        /**移除結束 */
        public async afterDestroy(model: Model.ViewModel, Option: Option) {
            await Trigger.wait();
            await model.remove();
        }

        /**before Render */
        public async beforeRender(model: Model.ViewModel, option: Option, content: JSX.Element, parentElement: JQuery, elementString: string): Promise<[string, JQuery]> {
            await Trigger.wait();
            let element = parentElement.find(elementString);
            let html = "";
            if (content) {
                html = ReactDOMServer.renderToStaticMarkup(content);
            }
            return [html, element]
        }

        /**after Render */
        public async afterRender(model: Model.ViewModel, option: Option) {
            await Trigger.wait();
        }

        /**before Clear */
        public async beforeClear(model: Model.ViewModel, option: Option) {
            await Trigger.wait();
        }

        /**after Clear */
        public async afterClear(model: Model.ViewModel, option: Option) {
            await Trigger.wait();
        }

        /** 綁定開始*/
        public async beforeBind(model: Model.ViewModel, option: Option, element: JQuery) {
            await Trigger.wait();
        }

        /** 綁定結束*/
        public async afterBind(model: Model.ViewModel, option: Option, element: JQuery) {
            await Trigger.wait();
        }

        /**解除綁定開始 */
        public async beforeUnbind(model: Model.ViewModel, option: Option, element: JQuery) {
            await Trigger.wait();
        }
        /**解除綁定結束 */
        public async afterUnbind(model: Model.ViewModel, option: Option, element: JQuery) {
            await Trigger.wait();
        }

        private async EachModule(fn: (mod: ViewController) => Promise<void>) {
            if (this.model.modules.length > 0) {
                //相容舊版模組陣列
                for (let mod of this.model.modules) {
                    await fn(mod);
                }
            } else {
                //模組Map
                for (let mod of this.model.moduleMap.values()) {
                    await fn(mod);
                }
            }
        }

        public async init(option: Option) {
            await Trigger.wait();
            await this.beforeInit(this.model, this.option);
            await this.EachModule(mod => mod.init(option));
            await this.afterInit(this.model, this.option);
        }
        public async destroy() {
            await Trigger.wait();
            await this.beforeDestroy(this.model, this.option);
            await this.EachModule(mod => mod.destroy());
            await this.afterDestroy(this.model, this.option);
        }

        public async bind(IsParentBind: boolean = false) {
            await Trigger.wait();
            await this.beforeBind(this.model, this.option, this.element);
            await this.EachModule(mod => mod.bind(IsParentBind || this.bindSelf));
            if (!IsParentBind && this.bindSelf) {
                try {
                    this.element.each((index, elem) => {
                        ko.applyBindings(this.model, elem);
                    });
                } catch (error) {
                    console.log(`[${this.controllerName}][applyBindings error]`);
                    console.error(error);
                }
            }
            await this.afterBind(this.model, this.option, this.element);
        }

        public async unbind(IsParentBind: boolean = false) {
            await Trigger.wait();
            await this.beforeUnbind(this.model, this.option, this.element);
            await this.EachModule(mod => mod.unbind(IsParentBind || this.bindSelf));
            if (!IsParentBind && this.bindSelf) {
                try {
                    this.element.each((index, elem) => {
                        ko.cleanNode(elem);
                        $(elem).off();//移除所有事件
                    });
                } catch (error) {
                    console.log(`[${this.controllerName}][applyBindings error]`);
                    console.error(error);
                }
            }
            await this.afterUnbind(this.model, this.option, this.element);
        }

        public async render(parentElement: JQuery) {
            await Trigger.wait();
            this.parentElement = parentElement;
            let [html, element] = await this.beforeRender(this.model, this.option, await this.contentFn(), this.parentElement, this.elementString);
            this.element = element;
            this.element.html(html);
            await this.EachModule(mod => mod.render(this.element));
            await this.afterRender(this.model, this.option);
        }

        public async clear() {
            await Trigger.wait();
            await this.beforeClear(this.model, this.option);
            await this.EachModule(mod => mod.clear());
            this.element.html("");
            await this.afterClear(this.model, this.option);
        }
    }

    /**
     * 建立分頁模組DOM
     * 
     * @param name 模組名稱
     * @param stateName 判斷狀態名稱
     * */
    export function PageContent(name: string, stateName: string = 'state', index = -1) {
        return <div key={index} id={name} data-bind={`with: ${name}.model, visible: ${stateName}() == '${name}'`}></div>
    }

    export function PageContents(names: IterableIterator<string> | string[], stateName: string = 'state') {
        let results: JSX.Element[] = [];
        let index = 0;
        for (let name of names) {
            results.push(PageContent(name, stateName, index++));
        }
        return results;
    }

    /**
     * 建立模組DOM
     * 
     * @param name 模組名稱
     * @param stateName 判斷狀態名稱
     * */
    export function PartialContent(name: string) {
        return <div id={name} data-bind={`with: ${name}.model`}></div>
    }
}

namespace Test {
    if (require.main === module) {
        console.dir(new Controller.ViewController('name', new Model.ViewModel('name')));
    }
}