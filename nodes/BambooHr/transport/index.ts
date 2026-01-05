/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make an authenticated request to the BambooHR API
 */
export async function bambooHrApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('bambooHrApi');
	const companyDomain = credentials.companyDomain as string;

	const options: IRequestOptions = {
		method,
		uri: uri || `https://api.bamboohr.com/api/gateway.php/${companyDomain}/v1${endpoint}`,
		qs,
		body,
		json: true,
		headers: {
			Accept: 'application/json',
			...headers,
		},
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'bambooHrApi',
			options,
		);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated request with rate limit handling and retry logic
 */
export async function bambooHrApiRequestWithRetry(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	maxRetries: number = 3,
): Promise<IDataObject | IDataObject[]> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await bambooHrApiRequest.call(this, method, endpoint, body, qs);
		} catch (error) {
			lastError = error as Error;
			const errorMessage = (error as Error).message || '';

			// Handle 503 rate limit response
			if (errorMessage.includes('503') || errorMessage.includes('rate')) {
				const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
				await new Promise((resolve) => setTimeout(resolve, waitTime));
				continue;
			}

			// Don't retry on other errors
			throw error;
		}
	}

	throw lastError;
}

/**
 * Make a request to upload a file to BambooHR
 */
export async function bambooHrApiRequestUpload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	formData: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('bambooHrApi');
	const companyDomain = credentials.companyDomain as string;

	const options: IRequestOptions = {
		method,
		uri: `https://api.bamboohr.com/api/gateway.php/${companyDomain}/v1${endpoint}`,
		formData,
		json: true,
		headers: {
			Accept: 'application/json',
		},
	};

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'bambooHrApi',
			options,
		);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a request to download a file from BambooHR
 */
export async function bambooHrApiRequestDownload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
): Promise<Buffer> {
	const credentials = await this.getCredentials('bambooHrApi');
	const companyDomain = credentials.companyDomain as string;

	const options: IRequestOptions = {
		method,
		uri: `https://api.bamboohr.com/api/gateway.php/${companyDomain}/v1${endpoint}`,
		encoding: null,
		headers: {
			Accept: '*/*',
		},
	};

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'bambooHrApi',
			options,
		);
		return response as unknown as Buffer;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Handle pagination for list operations (BambooHR uses date-based filtering)
 */
export async function bambooHrApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	propertyName?: string,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	const responseData = await bambooHrApiRequest.call(this, method, endpoint, body, qs);

	if (propertyName && !Array.isArray(responseData)) {
		const data = (responseData as IDataObject)[propertyName];
		if (Array.isArray(data)) {
			returnData.push(...(data as IDataObject[]));
		}
	} else if (Array.isArray(responseData)) {
		returnData.push(...responseData);
	} else {
		returnData.push(responseData);
	}

	return returnData;
}
