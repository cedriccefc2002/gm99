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
const path = require("path");
const electron_1 = require("electron");
let pluginName = "";
switch (process.platform) {
    case 'win32':
        pluginName = 'pepflashplayer.dll';
        break;
    case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin';
        break;
    case 'linux':
        pluginName = 'libpepflashplayer.so';
        break;
}
electron_1.app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, 'plugins', pluginName));
//app.commandLine.appendSwitch('ppapi-flash-version', '17.0.0.169')
electron_1.app.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    let win = new electron_1.BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            plugins: true
        }
    });
    win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();
}));
