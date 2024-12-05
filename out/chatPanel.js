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
exports.ChatPanel = void 0;
const vscode = __importStar(require("vscode"));
class ChatPanel {
    constructor(panel, extensionUri, openaiService, fileSystemManager) {
        this.openaiService = openaiService;
        this.fileSystemManager = fileSystemManager;
        this._disposables = [];
        this._panel = panel;
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._setupWebviewMessageListener();
    }
    static createOrShow(extensionUri, openaiService, fileSystemManager, initialText) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            if (initialText) {
                ChatPanel.currentPanel._panel.webview.postMessage({
                    type: 'setInitialText',
                    text: initialText
                });
            }
            return;
        }
        const panel = vscode.window.createWebviewPanel('chatGPTAssistant', 'ChatGPT Assistant', column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [extensionUri]
        });
        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri, openaiService, fileSystemManager);
    }
    _setupWebviewMessageListener() {
        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'sendMessage':
                    try {
                        const response = await this.openaiService.sendMessage(message.text);
                        this._panel.webview.postMessage({
                            type: 'response',
                            text: response
                        });
                    }
                    catch (error) {
                        vscode.window.showErrorMessage('Failed to get response from ChatGPT');
                    }
                    break;
                case 'modifyFile':
                    try {
                        await this.fileSystemManager.modifyFile(message.filePath, message.content);
                        vscode.window.showInformationMessage('File modified successfully');
                    }
                    catch (error) {
                        vscode.window.showErrorMessage('Failed to modify file');
                    }
                    break;
            }
        }, undefined, this._disposables);
    }
    _getWebviewContent(webview, extensionUri) {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'styles.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'chatView.js'));
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${styleUri}">
                <title>ChatGPT Assistant</title>
            </head>
            <body>
                <div id="chat-container">
                    <div id="messages"></div>
                    <div id="input-container">
                        <textarea id="message-input" placeholder="Type your message..."></textarea>
                        <button id="send-button">Send</button>
                    </div>
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }
}
exports.ChatPanel = ChatPanel;
//# sourceMappingURL=chatPanel.js.map