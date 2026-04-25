import type { INodeProperties } from 'n8n-workflow';

const showOnlyForConversion = {
	resource: ['conversion'],
};

export const conversionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForConversion },
		options: [
			{
				name: 'Convert',
				value: 'convert',
				action: 'Convert an amount at the current rate',
				description: 'Convert an amount from one currency to another using current rates',
				routing: {
					request: {
						method: 'GET',
						url: '/api/convert',
						qs: {
							from: '={{$parameter.from.toString().toUpperCase()}}',
							to: '={{$parameter.to.toString().toUpperCase()}}',
							amount: '={{$parameter.amount}}',
						},
					},
				},
			},
			{
				name: 'Convert Historical',
				value: 'convertHistorical',
				action: 'Convert an amount at a historical rate',
				description:
					'Convert an amount using the exchange rate from a specific date (Pro endpoint)',
				routing: {
					request: {
						method: 'GET',
						url: '/api/historical/rates',
						qs: {
							from: '={{$parameter.from.toString().toUpperCase()}}',
							to: '={{$parameter.to.toString().toUpperCase()}}',
							amount: '={{$parameter.amount}}',
							date: '={{$parameter.date}}',
						},
					},
				},
			},
		],
		default: 'convert',
	},
];

export const conversionFields: INodeProperties[] = [
	{
		displayName: 'From Currency',
		name: 'from',
		type: 'string',
		default: 'USD',
		required: true,
		placeholder: 'USD',
		description: 'Three-letter ISO 4217 source currency code',
		displayOptions: {
			show: {
				resource: ['conversion'],
				operation: ['convert', 'convertHistorical'],
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
		description: 'Three-letter ISO 4217 target currency code',
		displayOptions: {
			show: {
				resource: ['conversion'],
				operation: ['convert', 'convertHistorical'],
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 1,
		required: true,
		typeOptions: {
			minValue: 0,
			numberPrecision: 8,
		},
		description: 'Amount to convert from the source currency',
		displayOptions: {
			show: {
				resource: ['conversion'],
				operation: ['convert', 'convertHistorical'],
			},
		},
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2024-01-31',
		description: 'Historical date in YYYY-MM-DD format. Requires a Pro API key.',
		displayOptions: {
			show: {
				resource: ['conversion'],
				operation: ['convertHistorical'],
			},
		},
	},
];
