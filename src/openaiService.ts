import OpenAI from 'openai';
import * as vscode from 'vscode';

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('OpenAI API key not found in environment variables');
        }

        this.openai = new OpenAI({ apiKey });
    }

    async sendMessage(message: string): Promise<string> {
        try {
            // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",  // Using gpt-4 as it's currently available
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful coding assistant with access to the VS Code workspace. Please provide responses in JSON format with 'message' and 'type' fields."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            if (!content) {
                return 'No response generated';
            }
            const parsedResponse = JSON.parse(content);
            return parsedResponse.message || 'No response generated';
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to get response from OpenAI');
        }
    }
}
