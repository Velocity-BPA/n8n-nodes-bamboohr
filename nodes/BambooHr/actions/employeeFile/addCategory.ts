/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function addCategory(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const categoryName = this.getNodeParameter('categoryName', index) as string;

	const body: IDataObject = {
		name: categoryName,
	};

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		'/employees/files/categories',
		body,
	);

	return [{
		json: {
			success: true,
			name: categoryName,
			...(response as IDataObject || {}),
		},
	}];
}
