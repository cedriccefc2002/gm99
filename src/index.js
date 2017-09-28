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
                status(`dom-ready`);
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
                resolve();
            };
            let rejectFn = (event) => {
                removeEventFn();
                reject(event);
            };
            webview.addEventListener('did-finish-load', resolveFn);
            webview.addEventListener('did-fail-load', rejectFn);
            webview.loadURL(url);
        });
    });
}
const Default_Url = "https://passport.gm99.com/";
function Init(webview) {
    return __awaiter(this, void 0, void 0, function* () {
        webview.addEventListener('load-commit', (event) => {
            status(`[event][load-commit`);
        });
        webview.addEventListener('update-target-url', (event) => {
            status(`[event][update-target-url][${event.url}]`);
        });
        webview.addEventListener('new-window', (event) => __awaiter(this, void 0, void 0, function* () {
            status(`[event][new-window][${event.url}]`);
            const new_url = url.parse(event.url);
            if (new_url.hostname === "www.facebook.com") {
                return;
            }
            try {
                yield loadURL(webview, event.url);
            }
            catch (error) {
                console.error(error);
            }
        }));
        yield ready(webview);
        yield loadURL(webview, Default_Url);
    });
}
function status(message) {
    return __awaiter(this, void 0, void 0, function* () {
        $("#status").text(message);
    });
}
function resize() {
    return __awaiter(this, void 0, void 0, function* () {
        let content = $('#content').height();
        let content_part_1 = $('#content_part_1').height();
        let content_part_3 = $('#content_part_3').height();
        if (content && content_part_1 && content_part_3) {
            $('#content_part_2').height(content - content_part_1 - content_part_3);
        }
    });
}
$(() => __awaiter(this, void 0, void 0, function* () {
    window.addEventListener('resize', resize);
    yield resize();
    $('.gm99').each((index, element) => {
        Init(element);
    });
}));
