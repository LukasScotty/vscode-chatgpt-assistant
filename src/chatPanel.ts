import * as vscode from 'vscode';
import { OpenAIService } from './openaiService';
import { FileSystemManager } from './fileSystemManager';

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        private readonly openaiService: OpenAIService,
        private readonly fileSystemManager: FileSystemManager
    ) {
        this._panel = panel;
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._setupWebviewMessageListener();
    }

    public static createOrShow(
        extensionUri: vscode.Uri,
        openaiService: OpenAIService,
        fileSystemManager: FileSystemManager,
        initialText?: string
    ) {
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

        const panel = vscode.window.createWebviewPanel(
            'chatGPTAssistant',
            'ChatGPT Assistant',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri, openaiService, fileSystemManager);
    }

    private _setupWebviewMessageListener() {
        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.type) {
                    case 'sendMessage':
                        try {
                            const response = await this.openaiService.sendMessage(message.text);
                            this._panel.webview.postMessage({
                                type: 'response',
                                text: response
                            });
                        } catch (error) {
                            vscode.window.showErrorMessage('Failed to get response from ChatGPT');
                        }
                        break;

                    case 'modifyFile':
                        try {
                            await this.fileSystemManager.modifyFile(
                                message.filePath,
                                message.content
                            );
                            vscode.window.showInformationMessage('File modified successfully');
                        } catch (error) {
                            vscode.window.showErrorMessage('Failed to modify file');
                        }
                        break;
                }
            },
            undefined,
            this._disposables
        );
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'styles.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'chatView.js')
        );

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
