export default {
	sections: [
		{
			elements: [
				`This is some data`,
				`This is some data, too`,
				
				{
					elements: [
						`This is some data`,
						`This is some data, too`,
					],
					meta: {
						id: 12345,
						name: `Test Section`,
					},
				},
			],
			meta: {
				id: 12345,
				name: `Test Section`,
				description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ex adipisci dolores nostrum officiis iste ratione magnam sit temporibus delectus in quidem quia quod animi inventore, maxime vitae ullam soluta?`,
			},
		},
		{
			elements: [
				`This is some data`,
				`This is some data, too`,
				
				{
					elements: [
						`This is some data`,
						`This is some data, too`,
						
						{
							elements: [
								`This is some data`,
								`This is some data, too`,
								
								{
									elements: [
										`This is some data`,
										`This is some data, too`,
									],
									meta: {
										id: 12345,
										name: `Test Section`,
										description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ex adipisci dolores nostrum officiis iste ratione magnam sit temporibus delectus in quidem quia quod animi inventore, maxime vitae ullam soluta?`,
									},
								},
							],
							meta: {
								id: 12345,
								name: `Test Section`,
							},
						},
					],
					meta: {
						id: 12345,
						name: `Test Section`,
					},
				},
				`This is data`,
				`This is data, too`,
			],
			meta: {
				id: 12345,
				name: `Test Section`,
				description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ex adipisci dolores nostrum officiis iste ratione magnam sit temporibus delectus in quidem quia quod animi inventore, maxime vitae ullam soluta?`,
			},
		},
	],
	meta: {
		id: 12345,
		name: `Test Form`,
		description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ex adipisci dolores nostrum officiis iste ratione magnam sit temporibus delectus in quidem quia quod animi inventore, maxime vitae ullam soluta?`,
	},
};