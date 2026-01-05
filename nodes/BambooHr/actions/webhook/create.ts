/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const url = this.getNodeParameter('url', index) as string;
	const monitorFields = this.getNodeParameter('monitorFields', index) as string[];
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		name,
		url,
		monitorFields,
		format: 'json',
	};

	if (additionalFields.postFields) {
		body.postFields = additionalFields.postFields;
	}
	if (additionalFields.includeCompanyDomain !== undefined) {
		body.includeCompanyDomain = additionalFields.includeCompanyDomain;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		'/webhooks/add_webhook',
		body,
	);

	return [{
		json: {
			success: true,
			...(response as IDataObject || {}),
		},
	}];
}
