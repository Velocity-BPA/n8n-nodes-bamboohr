/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequestDownload } from '../../transport';

export async function getFile(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const fileId = this.getNodeParameter('fileId', index) as string;
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;

	const buffer = await bambooHrApiRequestDownload.call(
		this,
		'GET',
		`/employees/${employeeId}/files/${fileId}`,
	);

	return [{
		json: {
			employeeId,
			fileId,
		},
		binary: {
			[binaryPropertyName]: await this.helpers.prepareBinaryData(
				buffer,
				`file_${fileId}`,
			),
		},
	}];
}
