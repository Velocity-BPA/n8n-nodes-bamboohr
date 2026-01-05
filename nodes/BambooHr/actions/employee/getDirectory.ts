/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getDirectory(
	this: IExecuteFunctions,
	_index: number,
): Promise<INodeExecutionData[]> {
	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/employees/directory',
	);

	const directory = response as IDataObject;
	const employees = directory.employees as IDataObject[] || [];
	const fields = directory.fields as IDataObject[] || [];

	return [{
		json: {
			fields,
			employees,
			employeeCount: employees.length,
		},
	}];
}
