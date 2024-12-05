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
exports.FileSystemManager = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class FileSystemManager {
    async readFile(filePath) {
        try {
            const uri = vscode.Uri.file(filePath);
            const content = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(content).toString('utf-8');
        }
        catch (error) {
            console.error('Error reading file:', error);
            throw new Error(`Failed to read file: ${filePath}`);
        }
    }
    async modifyFile(filePath, content) {
        try {
            const uri = vscode.Uri.file(filePath);
            const encodedContent = Buffer.from(content, 'utf-8');
            await vscode.workspace.fs.writeFile(uri, encodedContent);
        }
        catch (error) {
            console.error('Error writing file:', error);
            throw new Error(`Failed to modify file: ${filePath}`);
        }
    }
    async listFiles(directoryPath) {
        try {
            const uri = vscode.Uri.file(directoryPath);
            const files = await vscode.workspace.fs.readDirectory(uri);
            return files.map(([name]) => path.join(directoryPath, name));
        }
        catch (error) {
            console.error('Error listing files:', error);
            throw new Error(`Failed to list files in directory: ${directoryPath}`);
        }
    }
}
exports.FileSystemManager = FileSystemManager;
//# sourceMappingURL=fileSystemManager.js.map