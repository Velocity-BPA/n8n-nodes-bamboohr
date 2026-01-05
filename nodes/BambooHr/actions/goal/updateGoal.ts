/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildGoalPayload } from '../../utils';

export async function updateGoal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const goalId = this.getNodeParameter('goalId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body = buildGoalPayload(updateFields);

	const response = await bambooHrApiRequest.call(
		this,
		'PUT',
		`/employees/${employeeId}/goals/${goalId}`,
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			goalId,
			...(response as IDataObject || {}),
		},
	}];
}
