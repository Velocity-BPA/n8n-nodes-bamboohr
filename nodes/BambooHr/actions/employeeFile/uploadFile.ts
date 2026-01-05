/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequestUpload } from '../../transport';

export async function uploadFile(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const categoryId = this.getNodeParameter('categoryId', index) as string;
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const items = this.getInputData();
	const binaryData = items[index].binary;

	if (!binaryData || !binaryData[binaryPropertyName]) {
		throw new Error(`No binary data found with property name "${binaryPropertyName}"`);
	}

	const binary = binaryData[binaryPropertyName];
	const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

	const fileName = (options.fileName as string) || binary.fileName || 'file';

	const formData: IDataObject = {
		file: {
			value: buffer,
			options: {
				filename: fileName,
				contentType: binary.mimeType || 'application/octet-stream',
			},
		},
		category: categoryId,
		fileName,
	};

	if (options.shareWithEmployee !== undefined) {
		formData.share = options.shareWithEmployee ? 'yes' : 'no';
	}

	const response = await bambooHrApiRequestUpload.call(
		this,
		'POST',
		`/employees/${employeeId}/files`,
		formData,
	);

	return [{
		json: {
			success: true,
			employeeId,
			categoryId,
			fileName,
			...(response || {}),
		},
	}];
}
