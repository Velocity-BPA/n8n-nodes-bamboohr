/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function addHistory(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const date = this.getNodeParameter('date', index) as string;
	const timeOffTypeId = this.getNodeParameter('timeOffTypeId', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const body: IDataObject = {
		date: formatDate(date),
		timeOffTypeId,
		amount,
	};

	if (options.note) {
		body.note = options.note;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'PUT',
		`/employees/${employeeId}/time_off/history`,
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			...body,
			...(response as IDataObject || {}),
		},
	}];
}
