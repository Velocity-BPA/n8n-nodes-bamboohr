/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildEmployeePayload } from '../../utils';

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const firstName = this.getNodeParameter('firstName', index) as string;
	const lastName = this.getNodeParameter('lastName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body = buildEmployeePayload({
		firstName,
		lastName,
		...additionalFields,
	});

	const response = await bambooHrApiRequest.call(this, 'POST', '/employees', body);

	return [{ json: response as IDataObject }];
}
