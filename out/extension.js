"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const chatPanel_1 = require("./chatPanel");
const openaiService_1 = require("./openaiService");
const fileSystemManager_1 = require("./fileSystemManager");
function activate(context) {
    const openaiService = new openaiService_1.OpenAIService();
    const fileSystemManager = new fileSystemManager_1.FileSystemManager();
    let disposable = vscode.commands.registerCommand('vscode-chatgpt-assistant.openChat', () => {
        chatPanel_1.ChatPanel.createOrShow(context.extensionUri, openaiService, fileSystemManager);
    });
    context.subscriptions.push(disposable);
    // Register context menu command
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-chatgpt-assistant.openChat', (editor) => {
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        chatPanel_1.ChatPanel.createOrShow(context.extensionUri, openaiService, fileSystemManager, text);
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map