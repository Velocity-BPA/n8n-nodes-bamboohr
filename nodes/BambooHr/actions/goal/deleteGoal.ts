/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function deleteGoal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const goalId = this.getNodeParameter('goalId', index) as string;

	await bambooHrApiRequest.call(
		this,
		'DELETE',
		`/employees/${employeeId}/goals/${goalId}`,
	);

	return [{
		json: {
			success: true,
			employeeId,
			goalId,
			message: 'Goal deleted successfully',
		},
	}];
}
