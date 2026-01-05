/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { STANDARD_EMPLOYEE_FIELDS } from '../../utils';

export async function get(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	let fields = STANDARD_EMPLOYEE_FIELDS.join(',');
	if (options.fields) {
		fields = Array.isArray(options.fields) 
			? (options.fields as string[]).join(',')
			: options.fields as string;
	}

	const qs: IDataObject = { fields };

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}`,
		{},
		qs,
	);

	return [{ json: response as IDataObject }];
}
