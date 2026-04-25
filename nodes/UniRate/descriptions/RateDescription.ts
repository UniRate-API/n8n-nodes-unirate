import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRate = {
	resource: ['rate'],
};

export const rateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForRate },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a single exchange rate',
				description: 'Get the current exchange rate between two currencies',
				routing: {
					request: {
						method: 'GET',
						url: '/api/rates',
						qs: {
							from: '={{$parameter.from.toString().toUpperCase()}}',
							to: '={{$parameter.to.toString().toUpperCase()}}',
						},
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many exchange rates',
				description: 'Get current rates for many supported currencies against a base',
				routing: {
					request: {
						method: 'GET',
						url: '/api/rates',
						qs: {
							from: '={{$parameter.from.toString().toUpperCase()}}',
						},
					},
				},
			},
		],
		default: 'get',
	},
];

export const rateFields: INodeProperties[] = [
	{
		displayName: 'From Currency',
		name: 'from',
		type: 'string',
		default: 'USD',
		required: true,
		placeholder: 'USD',
		description: 'Three-letter ISO 4217 currency code of the base currency',
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['get', 'getAll'],
			},
		},
	},
	{
		displayName: 'To Currency',
		name: 'to',
		type: 'string',
		default: 'EUR',
		required: true,
		placeholder: 'EUR',
		description: 'Three-letter ISO 4217 currency code of the target currency',
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['get'],
			},
		},
	},
];
