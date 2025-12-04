import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type { IWebhookFunctions } from 'n8n-workflow';

type WebhookResponse = ReturnType<IWebhookFunctions['getResponseObject']>;

export type CompressionResponse = WebhookResponse & {
	flush?: () => void;
};

export type TransportType = 'sse' | 'streamableHttp';

export interface McpTransport {
	readonly transportType: TransportType;
	readonly sessionId: string | undefined;

	send(message: JSONRPCMessage): Promise<void>;
	handleRequest(req: IncomingMessage, resp: ServerResponse, body?: unknown): Promise<void>;
	close?(): Promise<void>;

	onclose?: () => void | Promise<void>;
}
