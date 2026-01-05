/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getGoals(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const qs: IDataObject = {};

	if (options.filter) {
		qs.filter = options.filter;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/goals`,
		{},
		qs,
	);

	const result = response as IDataObject;
	const goals = result.goals as IDataObject[] || [];

	return goals.map((goal) => ({
		json: {
			employeeId,
			...goal,
		},
	}));
}
