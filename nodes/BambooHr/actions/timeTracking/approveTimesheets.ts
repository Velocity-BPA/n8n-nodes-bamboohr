/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { formatDate } from '../../utils';

export async function approveTimesheets(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const timesheetIds = this.getNodeParameter('timesheetIds', index) as string;
	const lastChanged = this.getNodeParameter('lastChanged', index) as string;

	// Parse timesheet IDs - can be comma-separated
	const ids = timesheetIds.split(',').map((id) => id.trim());

	const body: IDataObject = {
		timesheets: ids.map((id) => ({
			timesheetId: id,
			lastChanged: formatDate(lastChanged),
		})),
	};

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		'/timetracking/timesheets/approve',
		body,
	);

	return [{
		json: {
			success: true,
			approvedTimesheets: ids,
			...(response as IDataObject || {}),
		},
	}];
}
