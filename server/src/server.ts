import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    SymbolInformation,
    WorkspaceSymbolParams,
    WorkspaceEdit,
    WorkspaceFolder,
    TextDocumentSyncKind
} from 'vscode-languageserver/node';
//import { HandlerResult } from 'vscode-jsonrpc';
import { TextDocument } from 'vscode-languageserver-textdocument';

//we can call createConnection to create a connection:
let connection = createConnection();
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
//let parsedFiles = new ParsedFiles(documents);
const openedDocuments = new Set<string>();

//Initialize the connection and pass along our type of sync and what we provide as a LSP
connection.onInitialize((_: InitializeParams) => {
	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			definitionProvider: false,
			referencesProvider: false,
			hoverProvider: false,
			completionProvider: { resolveProvider: true }
		}
	};
});

//Demonstrate that the server is connected to the Client
/*connection.onInitialized(() => {
    connection.window.showInformationMessage('Hello World! form server side');
});*/

connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {

        return [
            {
                label: 'TextView' + _textDocumentPosition.position.character,
                kind: CompletionItemKind.Text,
                data: 1
            },
            {
                label: 'Button' + _textDocumentPosition.position.line,
                kind: CompletionItemKind.Text,
                data: 2
            },
            {
                label: 'ListView',
                kind: CompletionItemKind.Text,
                data: 3
            }
        ];
    }
);

connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {
        if (item.data === 1) {
            item.detail = 'TextView';
            item.documentation = 'TextView documentation';
        } else if (item.data === 2) {
            item.detail = 'Button';
            item.documentation = 'JavaScript documentation';
        } else if (item.data === 3) {
            item.detail = 'ListView';
            item.documentation = 'ListView documentation';
        }
        return item;
    }
);




documents.onDidOpen(event => {
	openedDocuments.add(event.document.uri);
	rescanDocuments();
});

documents.onDidChangeContent(_ => {
	rescanDocuments();
});

documents.onDidClose(change => {
	openedDocuments.delete(change.document.uri);
	rescanDocuments();
});


function rescanDocuments() {
//Do Nothing
}





documents.listen(connection);
connection.listen();