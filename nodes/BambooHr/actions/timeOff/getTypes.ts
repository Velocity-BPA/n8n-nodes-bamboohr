/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getTypes(
	this: IExecuteFunctions,
	_index: number,
): Promise<INodeExecutionData[]> {
	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		'/meta/time_off/types',
	);

	const result = response as IDataObject;
	const types = result.timeOffTypes as IDataObject[] || [];

	return types.map((type) => ({ json: type }));
}
