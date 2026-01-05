/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function updateClockEntry(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const entryId = this.getNodeParameter('entryId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.start) {
		body.start = updateFields.start;
	}
	if (updateFields.end) {
		body.end = updateFields.end;
	}
	if (updateFields.projectId) {
		body.projectId = updateFields.projectId;
	}
	if (updateFields.taskId) {
		body.taskId = updateFields.taskId;
	}
	if (updateFields.note) {
		body.note = updateFields.note;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'PUT',
		`/timetracking/clockentries/${entryId}`,
		body,
	);

	return [{
		json: {
			success: true,
			entryId,
			...(response as IDataObject || {}),
		},
	}];
}
