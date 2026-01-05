/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function getDailyEntries(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const start = this.getNodeParameter('start', index) as string;
	const end = this.getNodeParameter('end', index) as string;

	const qs: IDataObject = {
		start: formatDate(start),
		end: formatDate(end),
	};

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/timetracking/employee/${employeeId}/daily`,
		{},
		qs,
	);

	const entries = response as IDataObject[];

	return entries.map((entry) => ({
		json: {
			employeeId,
			...entry,
		},
	}));
}
