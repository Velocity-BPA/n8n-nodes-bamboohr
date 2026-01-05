/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function updateRequestStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const requestId = this.getNodeParameter('requestId', index) as string;
	const status = this.getNodeParameter('status', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const body: IDataObject = {
		status,
	};

	if (options.note) {
		body.note = options.note;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'PUT',
		`/time_off/requests/${requestId}/status`,
		body,
	);

	return [{
		json: {
			success: true,
			requestId,
			status,
			...(response as IDataObject || {}),
		},
	}];
}
