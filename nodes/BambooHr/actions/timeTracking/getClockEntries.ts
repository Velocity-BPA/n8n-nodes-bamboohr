/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function getClockEntries(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const start = this.getNodeParameter('start', index) as string;
	const end = this.getNodeParameter('end', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const qs: IDataObject = {
		start: formatDate(start),
		end: formatDate(end),
	};

	if (options.employeeId) {
		qs.employeeId = options.employeeId;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/timetracking/clockentries',
		{},
		qs,
	);

	const entries = response as IDataObject[];

	return entries.map((entry) => ({ json: entry }));
}
