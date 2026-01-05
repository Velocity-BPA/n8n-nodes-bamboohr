/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getAll(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const options = this.getNodeParameter('options', index) as IDataObject;

	// BambooHR uses the directory endpoint for listing employees
	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/employees/directory',
	);

	let employees = (response as IDataObject).employees as IDataObject[];

	// Apply onlyCurrent filter
	if (options.onlyCurrent === true) {
		employees = employees.filter((emp) => emp.status !== 'Inactive');
	}

	// Apply limit if not returning all
	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index) as number;
		employees = employees.slice(0, limit);
	}

	return employees.map((employee) => ({ json: employee }));
}
