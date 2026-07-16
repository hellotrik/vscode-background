import fs from 'fs';
import path from 'path';

import { _ } from './index';
import { vsc } from './vsc';

// 基础目录
const base = (() => {
    const mainFilename = require.main?.filename;
    const vscodeInstallPath = vsc?.env.appRoot;
    const base = mainFilename?.length ? path.dirname(mainFilename) : path.join(vscodeInstallPath!, 'out');
    return base;
})();

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath('workbench.desktop.main.css');
    // https://github.com/microsoft/vscode/pull/141263
    const webPath = getCssPath('workbench.web.main.css');

    if (_.isDesktop) {
        return defPath;
    }
    return webPath;
})();

const workbenchDir = path.join(base, 'vs', 'workbench');
const desktopJsPath = path.join(workbenchDir, 'workbench.desktop.main.js');
const glassJsPath = path.join(workbenchDir, 'workbench.glass.main.js');

const jsPaths = (() => {
    // See https://code.visualstudio.com/api/references/vscode-api#env

    // desktop
    // /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
    if (_.isDesktop) {
        const paths = [desktopJsPath];
        // Cursor Agents Window (Glass workbench)
        if (fs.existsSync(glassJsPath)) {
            paths.push(glassJsPath);
        }
        return paths;
    }

    // code-server
    // /usr/lib/code-server/lib/vscode/out/vs/code/browser/workbench/workbench.js
    return [path.join(base, 'vs/code/browser/workbench/workbench.js')];
})();

export const vscodePath = {
    /**
     * 基础目录
     */
    base,
    extensionRoot: path.join(__dirname, '../../'),
    /**
     * css文件路径
     */
    cssPath,
    /**
     * js 文件地址（主 workbench，兼容旧逻辑）
     */
    jsPath: jsPaths[0],
    /**
     * 需要 patch 的 workbench js（desktop + Cursor glass）
     */
    jsPaths,
    /**
     * Cursor Agents Window workbench（不存在则为 undefined）
     */
    glassJsPath: fs.existsSync(glassJsPath) ? glassJsPath : undefined
};
