/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function closeGoal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const goalId = this.getNodeParameter('goalId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const body: IDataObject = {
		status: 'closed',
	};

	if (options.comment) {
		body.comment = options.comment;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'PUT',
		`/employees/${employeeId}/goals/${goalId}/close`,
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			goalId,
			status: 'closed',
			...(response as IDataObject || {}),
		},
	}];
}
