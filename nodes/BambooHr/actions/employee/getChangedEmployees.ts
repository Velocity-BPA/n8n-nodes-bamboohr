/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDateTime } from '../../utils';

export async function getChangedEmployees(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const since = this.getNodeParameter('since', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const qs: IDataObject = {
		since: formatDateTime(since),
	};

	if (options.type) {
		qs.type = options.type;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/employees/changed',
		{},
		qs,
	);

	const result = response as IDataObject;
	const employees = result.employees as IDataObject || {};

	// Convert object to array
	const employeeArray = Object.entries(employees).map(([id, data]) => ({
		id,
		...(data as IDataObject),
	}));

	return employeeArray.map((employee) => ({ json: employee }));
}
