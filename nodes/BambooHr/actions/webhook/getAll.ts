/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getAll(
	this: IExecuteFunctions,
	_index: number,
): Promise<INodeExecutionData[]> {
	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/webhooks/get_webhook_list',
	);

	const result = response as IDataObject;
	const webhooks = result.webhooks as IDataObject[] || [];

	return webhooks.map((webhook) => ({ json: webhook }));
}
