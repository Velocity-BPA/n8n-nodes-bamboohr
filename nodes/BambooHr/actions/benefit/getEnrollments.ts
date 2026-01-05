/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getEnrollments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const qs: IDataObject = {};

	if (options.enrollmentStatus) {
		qs.status = options.enrollmentStatus;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/benefitenrollments`,
		{},
		qs,
	);

	const enrollments = response as IDataObject[];

	return enrollments.map((enrollment) => ({
		json: {
			employeeId,
			...enrollment,
		},
	}));
}
