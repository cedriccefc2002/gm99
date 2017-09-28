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
var Loader;
(function (Loader) {
    const pool = new Map();
    const apps = new Map();
    class ViewLoader {
        constructor(config) {
            this.currentApp = null;
            this.config = config;
        }
        GetCurrentApp() {
            return this.currentApp;
        }
        run(appName) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.stop();
                let config = apps.get(appName);
                if (config) {
                    this.currentApp = yield config.createFn(this.config.option);
                    this.config.element.html(`<div id="${appName}"/>`);
                    yield this.config.bindFn("Init");
                    yield this.currentApp.init(this.config.option);
                    yield this.config.bindFn("Render");
                    yield this.currentApp.render(this.config.element);
                    yield this.config.bindFn("Bind");
                    yield this.currentApp.bind(false);
                    return this.config.bindFn("Finish");
                }
            });
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.currentApp) {
                    yield this.currentApp.unbind(false);
                    yield this.currentApp.clear();
                    yield this.currentApp.destroy();
                    this.currentApp = null;
                }
            });
        }
    }
    Loader.ViewLoader = ViewLoader;
    function RegisterApp(app) {
        apps.set(app.name, app);
    }
    Loader.RegisterApp = RegisterApp;
    function GetLoader(config) {
        let key = config.name;
        if (pool.has(key)) { }
        else {
            pool.set(key, new ViewLoader(config));
        }
        let loader = pool.get(key);
        if (loader) {
            return loader;
        }
        else {
            throw new Error(`can't find loader ${key}`);
        }
    }
    Loader.GetLoader = GetLoader;
})(Loader = exports.Loader || (exports.Loader = {}));
