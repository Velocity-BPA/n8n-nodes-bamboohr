/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function getRequests(
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

	if (options.status) {
		qs.status = options.status;
	}
	if (options.employeeId) {
		qs.employeeId = options.employeeId;
	}
	if (options.type) {
		qs.type = options.type;
	}
	if (options.action) {
		qs.action = options.action;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/time_off/requests',
		{},
		qs,
	);

	const requests = response as IDataObject[];

	return requests.map((request) => ({ json: request }));
}
