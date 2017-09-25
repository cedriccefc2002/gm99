
import * as $ from "jquery"
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

$(async () => {
    const Default_Url = "https://passport.gm99.com/";
    //"https://www.gm99.com/play_games/play/server/naruto/id/57"
    const webview = $('#gm99').get(0) as Electron.WebviewTag;
    webview.addEventListener('new-window', (event) => {
        webview.loadURL(event.url)
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
});


