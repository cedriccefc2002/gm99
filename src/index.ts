import * as url from "url";
import * as $ from "jquery"
import 'bootstrap';

async function ready(webview: Electron.WebviewTag) {
    return new Promise<void>((resolve, reject) => {
        let removeEventFn = () => {
            webview.removeEventListener('dom-ready', readyFn);
        }
        let readyFn = (event: Electron.Event, ) => {
            removeEventFn();
            //console.info(`dom-ready`);
            resolve();
        }
        webview.addEventListener('dom-ready', readyFn);
    });
}
async function loadURL(webview: Electron.WebviewTag, url: string) {
    return new Promise<void>((resolve, reject) => {
        let removeEventFn = () => {
            webview.removeEventListener('did-finish-load', resolveFn);
            webview.removeEventListener('did-fail-load', rejectFn);
        }
        let resolveFn = (event: Electron.Event) => {
            removeEventFn();
            //console.dir(event);
            resolve();
        }
        let rejectFn = (event: Electron.Event) => {
            removeEventFn();
            //console.dir(event);
            reject(event);
        }
        webview.addEventListener('did-finish-load', resolveFn);
        webview.addEventListener('did-fail-load', rejectFn);
        webview.loadURL(url);
    });
}

const Default_Url = "https://passport.gm99.com/";
async function Init(webview: Electron.WebviewTag) {
    webview.addEventListener('load-commit', (event) => {
        console.log(`[event][load-commit`);
    })
    // webview.addEventListener('update-target-url', (event) => {
    //     console.log(`[event][update-target-url][${event.url}]`);
    // })
    webview.addEventListener('new-window', async (event) => {
        console.log(`[event][new-window][${event.url}]`);
        const new_url = url.parse(event.url)
        if (new_url.hostname === "www.facebook.com") {
            /**
             * facebook plugins error
             */
            return;
        }
        try {
            await loadURL(webview, event.url);
        } catch (error) {
            console.error(error);
        }
        // const protocol = require('url').parse(e.url).protocol
        // if (protocol === 'http:' || protocol === 'https:') {
        //   shell.openExternal(e.url)
        // }
    })
    await ready(webview);
    await loadURL(webview, Default_Url);
    // webview.openDevTools();
    // webview.getWebContents().executeJavaScript(`
    //     $('#login-username').val('');
    //     $('#login-password').val('');
    // `)
}

$(async () => {
    //"https://www.gm99.com/play_games/play/server/naruto/id/57"
    $('.gm99').each((index, element) => {
        Init(element as Electron.WebviewTag)
    })
});


