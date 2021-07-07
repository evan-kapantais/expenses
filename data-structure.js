// transactions collection
[
	{
		name: 'String',
		date: 'Date',
		amount: 'Number',
		category: 'String',
		type: 'String',
		account: 'String',
		user: 'ref Object',
	},
	{
		name: 'String',
		date: 'Date',
		amount: 'Number',
		category: 'String',
		type: 'String',
		account: 'String',
		user: 'ref Object',
	},
][
	// history collection (stores all months' data)
	({
		user: 'Object',
		data: [
			{
				month: 'February 2021',
				transactions: 'Array',
				savings: 'Number',
				totalBalance: 'Number',
				fixed: 'Object',
			},
			{
				month: 'March 2021',
				transactions: 'Array',
				savings: 'Number',
				totalBalance: 'Number',
				fixed: 'Object',
			},
		],
	},
	{
		month: 'Date',
		user: 'Object',
		transactions: 'Array',
		savings: 'Number',
		totalBalance: 'Number',
		fixed: 'Object',
	})
][
	// users collection
	({
		username: 'user-name',
		name: 'Name',
		passwordHash: 'passwordHash',
		transactions: 'ref transactions',
	},
	{
		username: 'user-name',
		name: 'Name',
		passwordHash: 'passwordHash',
		transactions: 'ref transactions array',
	})
];
