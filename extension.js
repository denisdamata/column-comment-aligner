// extension.js
// DIRECTION: Denis da Mata
// AUTHORS: DeepSeek [1]
// DATE: 29-01-2025
/* 
   DESCRIPTION: 
   extension made using the VS Codium extension developer and DeepSeek. 
   The extension for the Python-like languages was created by DeepSeek. 
*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('column-comment-aligner.align', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const languageId = document.languageId;

        // Verifica se é um arquivo Python-like
        const interestingItems = new Set([
            "gdscript",
            "python",
            "ruby",
            "ini",
            "makefile",
            "r",
            "elixir",
            "julia"
        ])
        const isItemInSet = interestingItems.has(languageId)                    // https://stackoverflow.com/a/2555311/5175660 
        if (!isItemInSet) {
            vscode.window.showErrorMessage(
                'Only Python-like files are supported.'
            );
            return;
        }

        // Obter a configuração do usuário para a coluna de alinhamento
        const config = vscode.workspace.getConfiguration('ColumnCommentAligner');
        const targetColumn = config.get('targetColumn', 80); // Valor padrão é 80

        editor.edit((editBuilder) => {
            let isInMultiLineString = false;
            let multiLineStringChar = '';
            let isInSingleLineString = false;
            let stringChar = '';

            for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
                const line = document.lineAt(lineNumber);
                let text = line.text;

                // Resetar estados de string para a nova linha
                let commentIndex = -1;
                isInSingleLineString = false;
                stringChar = '';

                // Verificar strings multi-line
                if (isInMultiLineString) {
                    const closingIndex = text.indexOf(multiLineStringChar);
                    if (closingIndex !== -1) {
                        // Fecha a string multi-line e processa o restante da linha
                        isInMultiLineString = false;
                        const remainingText = text.slice(closingIndex + multiLineStringChar.length);
                        const commentMatch = remainingText.indexOf('#');
                        if (commentMatch !== -1) {
                            commentIndex = closingIndex + multiLineStringChar.length + commentMatch;
                        }
                    } else {
                        continue; // Ainda dentro da string multi-line
                    }
                } else {
                    // Verificar se a linha inicia uma string multi-line
                    const multiLineMatch = text.match(/("""|''')/);
                    if (multiLineMatch) {
                        isInMultiLineString = true;
                        multiLineStringChar = multiLineMatch[0];
                        const remainingText = text.slice(multiLineMatch.index + multiLineStringChar.length);
                        const commentMatch = remainingText.indexOf('#');
                        if (commentMatch !== -1) {
                            commentIndex = multiLineMatch.index + multiLineStringChar.length + commentMatch;
                        }
                        continue;
                    }
                }

                // Processar strings simples e comentários
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];

                    // Verificar strings simples
                    if (!isInMultiLineString && (char === '"' || char === "'")) {
                        if (!isInSingleLineString) {
                            isInSingleLineString = true;
                            stringChar = char;
                        } else if (char === stringChar && text[i - 1] !== '\\') {
                            isInSingleLineString = false;
                            stringChar = '';
                        }
                    }

                    // Encontrar comentário fora de strings
                    if (!isInMultiLineString && !isInSingleLineString && char === '#' && commentIndex === -1) {
                        commentIndex = i;
                        break;
                    }
                }

                // Alinhar comentário se encontrado
                if (commentIndex !== -1) {
                    const code = text.slice(0, commentIndex).trimEnd();
                    const comment = text.slice(commentIndex).trim();
                    const padding = Math.max(targetColumn - code.length, 1);
                    const alignedLine = code + ' '.repeat(padding) + comment; // Usar espaços em branco

                    const lineRange = new vscode.Range(lineNumber, 0, lineNumber, text.length);
                    editBuilder.replace(lineRange, alignedLine);
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
};

// [1] https://chat.deepseek.com/a/chat/s/735fac5d-cf11-43ec-b93f-de401f962f4c
