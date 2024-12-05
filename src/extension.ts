import * as vscode from 'vscode';
import { ChatPanel } from './chatPanel';
import { OpenAIService } from './openaiService';
import { FileSystemManager } from './fileSystemManager';

export function activate(context: vscode.ExtensionContext) {
    const openaiService = new OpenAIService();
    const fileSystemManager = new FileSystemManager();

    let disposable = vscode.commands.registerCommand('vscode-chatgpt-assistant.openChat', () => {
        ChatPanel.createOrShow(context.extensionUri, openaiService, fileSystemManager);
    });

    context.subscriptions.push(disposable);

    // Register context menu command
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('vscode-chatgpt-assistant.openChat', (editor) => {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            ChatPanel.createOrShow(context.extensionUri, openaiService, fileSystemManager, text);
        })
    );
}

export function deactivate() {}
