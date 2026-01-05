/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildClockEntryPayload } from '../../utils';

export async function addClockEntry(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const date = this.getNodeParameter('date', index) as string;
	const start = this.getNodeParameter('start', index) as string;
	const end = this.getNodeParameter('end', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body = buildClockEntryPayload({
		employeeId,
		date,
		start,
		end,
		...additionalFields,
	});

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		'/timetracking/clockentries',
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			...(response as IDataObject || {}),
		},
	}];
}
