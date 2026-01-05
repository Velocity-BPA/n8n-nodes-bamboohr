/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function updateFile(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const fileId = this.getNodeParameter('fileId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.fileName) {
		body.name = updateFields.fileName;
	}
	if (updateFields.categoryId) {
		body.categoryId = updateFields.categoryId;
	}
	if (updateFields.shareWithEmployee !== undefined) {
		body.shareWithEmployee = updateFields.shareWithEmployee ? 'yes' : 'no';
	}

	await bambooHrApiRequest.call(
		this,
		'POST',
		`/employees/${employeeId}/files/${fileId}`,
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			fileId,
			...body,
		},
	}];
}
