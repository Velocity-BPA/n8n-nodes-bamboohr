/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function estimateFutureBalance(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;

	const qs: IDataObject = {
		end: formatDate(endDate),
	};

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/time_off/calculator`,
		{},
		qs,
	);

	return [{
		json: {
			employeeId,
			endDate: formatDate(endDate),
			...(response as IDataObject),
		},
	}];
}
