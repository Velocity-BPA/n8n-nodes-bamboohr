/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function deleteWebhook(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter('webhookId', index) as string;

	const body: IDataObject = {
		id: webhookId,
	};

	await bambooHrApiRequest.call(
		this,
		'POST',
		'/webhooks/delete_webhook',
		body,
	);

	return [{
		json: {
			success: true,
			webhookId,
			message: 'Webhook deleted successfully',
		},
	}];
}
