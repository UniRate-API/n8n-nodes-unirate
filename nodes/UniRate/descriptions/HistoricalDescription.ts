import type { INodeProperties } from 'n8n-workflow';

const showOnlyForHistorical = {
	resource: ['historical'],
};

export const historicalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForHistorical },
		options: [
			{
				name: 'Get Rate',
				value: 'getRate',
				action: 'Get a historical exchange rate',
				description:
					'Get the exchange rate between two currencies on a specific date (Pro endpoint)',
				routing: {
					request: {
						method: 'GET',
						url: '/api/historical/rates',
						qs: {
							date: '={{$parameter.date}}',
							from: '={{$parameter.from.toString().toUpperCase()}}',
							to: '={{$parameter.to.toString().toUpperCase()}}',
						},
					},
				},
			},
			{
				name: 'Get Time Series',
				value: 'getTimeSeries',
				action: 'Get a historical time series',
				description:
					'Get daily exchange rates over a date range, max 5 years per request (Pro endpoint)',
				routing: {
					request: {
						method: 'GET',
						url: '/api/historical/timeseries',
						qs: {
							start_date: '={{$parameter.startDate}}',
							end_date: '={{$parameter.endDate}}',
							base: '={{$parameter.base.toString().toUpperCase()}}',
							currencies:
								'={{$parameter.currencies ? $parameter.currencies.toString().toUpperCase() : undefined}}',
						},
					},
				},
			},
			{
				name: 'Get Limits',
				value: 'getLimits',
				action: 'Get historical data availability',
				description:
					'Get earliest and latest available date per currency for historical rates (Pro endpoint)',
				routing: {
					request: {
						method: 'GET',
						url: '/api/historical/limits',
					},
				},
			},
		],
		default: 'getRate',
	},
];

export const historicalFields: INodeProperties[] = [
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2024-01-31',
		description: 'Historical date in YYYY-MM-DD format',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getRate'],
			},
		},
	},
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
				resource: ['historical'],
				operation: ['getRate'],
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
				resource: ['historical'],
				operation: ['getRate'],
			},
		},
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2024-01-01',
		description: 'First date in the range, YYYY-MM-DD',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getTimeSeries'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2024-01-31',
		description: 'Last date in the range, YYYY-MM-DD. Range may not exceed 5 years.',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getTimeSeries'],
			},
		},
	},
	{
		displayName: 'Base Currency',
		name: 'base',
		type: 'string',
		default: 'USD',
		required: true,
		placeholder: 'USD',
		description: 'Three-letter ISO 4217 base currency code',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getTimeSeries'],
			},
		},
	},
	{
		displayName: 'Currencies',
		name: 'currencies',
		type: 'string',
		default: '',
		placeholder: 'EUR,GBP,JPY',
		description:
			'Comma-separated list of target currency codes. Leave empty to return all supported currencies.',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getTimeSeries'],
			},
		},
	},
];
