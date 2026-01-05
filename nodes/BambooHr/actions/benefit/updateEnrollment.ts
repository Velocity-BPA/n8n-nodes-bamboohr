/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function updateEnrollment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const enrollmentId = this.getNodeParameter('enrollmentId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.benefitPlanId) {
		body.benefitPlanId = updateFields.benefitPlanId;
	}
	if (updateFields.startDate) {
		body.startDate = updateFields.startDate;
	}
	if (updateFields.endDate) {
		body.endDate = updateFields.endDate;
	}
	if (updateFields.amount) {
		body.amount = updateFields.amount;
	}
	if (updateFields.deductionEndDate) {
		body.deductionEndDate = updateFields.deductionEndDate;
	}

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		`/employees/${employeeId}/benefitenrollments/${enrollmentId}`,
		body,
	);

	return [{
		json: {
			success: true,
			employeeId,
			enrollmentId,
			...(response as IDataObject || {}),
		},
	}];
}
