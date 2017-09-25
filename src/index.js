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
const url = require("url");
const $ = require("jquery");
require("bootstrap");
function ready(webview) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let removeEventFn = () => {
                webview.removeEventListener('dom-ready', readyFn);
            };
            let readyFn = (event) => {
                removeEventFn();
                //console.info(`dom-ready`);
                resolve();
            };
            webview.addEventListener('dom-ready', readyFn);
        });
    });
}
function loadURL(webview, url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let removeEventFn = () => {
                webview.removeEventListener('did-finish-load', resolveFn);
                webview.removeEventListener('did-fail-load', rejectFn);
            };
            let resolveFn = (event) => {
                removeEventFn();
                //console.dir(event);
                resolve();
            };
            let rejectFn = (event) => {
                removeEventFn();
                //console.dir(event);
                reject(event);
            };
            webview.addEventListener('did-finish-load', resolveFn);
            webview.addEventListener('did-fail-load', rejectFn);
            webview.loadURL(url);
        });
    });
}
$(() => __awaiter(this, void 0, void 0, function* () {
    const Default_Url = "https://passport.gm99.com/";
    //"https://www.gm99.com/play_games/play/server/naruto/id/57"
    const webview = $('#gm99').get(0);
    webview.addEventListener('load-commit', (event) => {
        console.log(`[event][load-commit`);
    });
    // webview.addEventListener('update-target-url', (event) => {
    //     console.log(`[event][update-target-url][${event.url}]`);
    // })
    webview.addEventListener('new-window', (event) => __awaiter(this, void 0, void 0, function* () {
        console.log(`[event][new-window][${event.url}]`);
        const new_url = url.parse(event.url);
        if (new_url.hostname === "www.facebook.com") {
            /**
             * facebook plugins error
             */
            return;
        }
        try {
            yield loadURL(webview, event.url);
        }
        catch (error) {
            console.error(error);
        }
        // const protocol = require('url').parse(e.url).protocol
        // if (protocol === 'http:' || protocol === 'https:') {
        //   shell.openExternal(e.url)
        // }
    }));
    yield ready(webview);
    yield loadURL(webview, Default_Url);
    // webview.openDevTools();
    // webview.getWebContents().executeJavaScript(`
    //     $('#login-username').val('');
    //     $('#login-password').val('');
    // `)
}));
