import * as path from 'path';
import { ExtensionContext } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // Server side configurations
    let serverModule = context.asAbsolutePath(
        path.join('server', 'out', 'server.js')
    );

    let serverOptions: ServerOptions = {
        module: serverModule, transport: TransportKind.ipc
    };

    // Client side configurations
    let clientOptions: LanguageClientOptions = {
        // js is used to trigger things
        documentSelector: [{ scheme: 'file', language: 'asm' }],
    };

    client = new LanguageClient(
        'nesasmLS',
        'NESASM Language Server',
        serverOptions,
        clientOptions
    );

    // Start the client side, and at the same time also start the language server
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
