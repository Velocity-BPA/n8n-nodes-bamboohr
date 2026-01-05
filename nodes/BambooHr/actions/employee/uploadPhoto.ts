/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequestUpload } from '../../transport';

export async function uploadPhoto(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;

	const items = this.getInputData();
	const binaryData = items[index].binary;

	if (!binaryData || !binaryData[binaryPropertyName]) {
		throw new Error(`No binary data found with property name "${binaryPropertyName}"`);
	}

	const binary = binaryData[binaryPropertyName];
	const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

	const formData: IDataObject = {
		file: {
			value: buffer,
			options: {
				filename: binary.fileName || 'photo.jpg',
				contentType: binary.mimeType || 'image/jpeg',
			},
		},
	};

	const response = await bambooHrApiRequestUpload.call(
		this,
		'POST',
		`/employees/${employeeId}/photo`,
		formData,
	);

	return [{
		json: {
			success: true,
			employeeId,
			message: 'Photo uploaded successfully',
			...(response || {}),
		},
	}];
}
