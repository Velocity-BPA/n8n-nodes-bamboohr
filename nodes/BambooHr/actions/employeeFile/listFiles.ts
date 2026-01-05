/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function listFiles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/files/view`,
	);

	const result = response as IDataObject;
	const categories = result.categories as IDataObject[] || [];

	// Flatten files from all categories
	const files: IDataObject[] = [];
	for (const category of categories) {
		const categoryFiles = category.files as IDataObject[] || [];
		for (const file of categoryFiles) {
			files.push({
				...file,
				categoryId: category.id,
				categoryName: category.name,
			});
		}
	}

	return files.map((file) => ({ json: file }));
}
