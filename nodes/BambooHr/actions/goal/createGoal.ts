/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildGoalPayload } from '../../utils';

export async function createGoal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body = buildGoalPayload({
		title,
		...additionalFields,
	});

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		`/employees/${employeeId}/goals`,
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
