/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportId = this.getNodeParameter('reportId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const qs: IDataObject = {
		format: options.format || 'JSON',
		fd: 'yes',
	};

	if (options.onlyCurrent !== undefined) {
		qs.onlyCurrent = options.onlyCurrent ? 'true' : 'false';
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/reports/${reportId}`,
		{},
		qs,
	);

	const result = response as IDataObject;
	const employees = result.employees as IDataObject[] || [];

	if (employees.length > 0) {
		return employees.map((employee) => ({ json: employee }));
	}

	return [{ json: result }];
}
