import * as $ from 'jquery'
import { Controller as Controller } from './Controller'

export namespace Loader {
    export const enum Message {
        Init = "Init",
        Render = "Render",
        Bind = "Bind",
        Finish = "Finish"
    }
    export interface AppConfig {
        name: string;
        createFn: (option: Controller.Option) => Promise<Controller.ViewController>;
    }
    export interface Config {
        name: string;
        element: JQuery;
        bindFn: (message: Message) => Promise<void>;
        option: Controller.Option;
    }
    const pool: Map<string, ViewLoader> = new Map();
    const apps: Map<string, AppConfig> = new Map();
    export class ViewLoader {
        private config: Config;
        private currentApp: Controller.ViewController | null = null;
        constructor(config: Config) {
            this.config = config;
            //this.config.option.Loader = this;
        }
        public GetCurrentApp() {
            return this.currentApp;
        }
        public async run(appName: string) {
            await this.stop();
            let config = apps.get(appName);
            if (config) {
                this.currentApp = await config.createFn(this.config.option);
                this.config.element.html(`<div id="${appName}"/>`)
                await this.config.bindFn(Message.Init);
                await this.currentApp.init(this.config.option);
                await this.config.bindFn(Message.Render);
                await this.currentApp.render(this.config.element);
                await this.config.bindFn(Message.Bind);
                await this.currentApp.bind(false);
                return this.config.bindFn(Message.Finish);
            }
        }
        public async stop() {
            if (this.currentApp) {
                await this.currentApp.unbind(false);
                await this.currentApp.clear();
                await this.currentApp.destroy();
                this.currentApp = null;
            }
        }
    }
    export function RegisterApp(app: AppConfig) {
        apps.set(app.name, app);
    }
    export function GetLoader(config: Config) {
        let key = config.name;
        if (pool.has(key)) { } else {
            pool.set(key, new ViewLoader(config));
        }
        return pool.get(key);
    }
}