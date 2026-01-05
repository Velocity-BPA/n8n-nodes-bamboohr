/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function deleteFile(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const fileId = this.getNodeParameter('fileId', index) as string;

	await bambooHrApiRequest.call(
		this,
		'DELETE',
		`/employees/${employeeId}/files/${fileId}`,
	);

	return [{
		json: {
			success: true,
			employeeId,
			fileId,
			message: 'File deleted successfully',
		},
	}];
}
