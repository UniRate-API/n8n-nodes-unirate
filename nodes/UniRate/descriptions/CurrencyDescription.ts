import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCurrency = {
	resource: ['currency'],
};

export const currencyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCurrency },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get the list of supported currencies',
				description: 'Returns the full list of ISO 4217 currency codes UniRate supports',
				routing: {
					request: {
						method: 'GET',
						url: '/api/currencies',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const currencyFields: INodeProperties[] = [];
