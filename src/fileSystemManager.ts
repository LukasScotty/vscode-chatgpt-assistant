import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileSystemManager {
    async readFile(filePath: string): Promise<string> {
        try {
            const uri = vscode.Uri.file(filePath);
            const content = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(content).toString('utf-8');
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error(`Failed to read file: ${filePath}`);
        }
    }

    async modifyFile(filePath: string, content: string): Promise<void> {
        try {
            const uri = vscode.Uri.file(filePath);
            const encodedContent = Buffer.from(content, 'utf-8');
            await vscode.workspace.fs.writeFile(uri, encodedContent);
        } catch (error) {
            console.error('Error writing file:', error);
            throw new Error(`Failed to modify file: ${filePath}`);
        }
    }

    async listFiles(directoryPath: string): Promise<string[]> {
        try {
            const uri = vscode.Uri.file(directoryPath);
            const files = await vscode.workspace.fs.readDirectory(uri);
            return files.map(([name]) => path.join(directoryPath, name));
        } catch (error) {
            console.error('Error listing files:', error);
            throw new Error(`Failed to list files in directory: ${directoryPath}`);
        }
    }
}
