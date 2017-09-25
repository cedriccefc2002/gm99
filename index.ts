import * as path from "path"
import { app, BrowserWindow } from "electron"

let pluginName: string = "";
switch (process.platform) {
    case 'win32':
        pluginName = 'pepflashplayer.dll'
        break;
    case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin'
        break;
    case 'linux':
        pluginName = 'libpepflashplayer.so'
        break;
}

app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, 'plugins', pluginName));
//app.commandLine.appendSwitch('ppapi-flash-version', '17.0.0.169')

app.on('ready', async () => {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            plugins: true
        }
    })
    win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();
})