/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildEmployeePayload } from '../../utils';

export async function update(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body = buildEmployeePayload(updateFields);

	await bambooHrApiRequest.call(
		this,
		'POST',
		`/employees/${employeeId}`,
		body,
	);

	// BambooHR doesn't return the updated employee, so fetch it
	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}`,
		{},
		{ fields: 'firstName,lastName,workEmail,department,jobTitle,id' },
	);

	return [{ json: { success: true, ...(response as IDataObject) } }];
}
