/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function deleteClockEntry(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const entryId = this.getNodeParameter('entryId', index) as string;

	await bambooHrApiRequest.call(
		this,
		'DELETE',
		`/timetracking/clockentries/${entryId}`,
	);

	return [{
		json: {
			success: true,
			entryId,
			message: 'Clock entry deleted successfully',
		},
	}];
}
