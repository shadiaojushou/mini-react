import { it, expect, describe } from 'vitest'
import React from '../packages/React'

describe('createElement', () => {
	it('should create a  element', () => {
		const el = React.createElement('div', null, 'hello world')
		expect(el).toEqual({
			type: 'div',
			props: {
				children: [
					{
						type: 'TEXT_ELEMENT',
						props: {
							nodeValue: 'hello world',
							children: [],
						},
					},
				],
			},
		})
	})

	it('should create a  element with props', () => {
		const el = React.createElement('div', { id: 'app' }, 'hello world')

		// expect(el).toEqual({
		// 	type: 'div',
		// 	props: {
		// 		id: 'app',
		// 		children: [
		// 			{
		// 				type: 'TEXT_ELEMENT',
		// 				props: {
		// 					nodeValue: 'hello world',
		// 					children: [],
		// 				},
		// 			},
		// 		],
		// 	},
		// })
		expect(el).toMatchInlineSnapshot(`
			{
			  "props": {
			    "children": [
			      {
			        "props": {
			          "children": [],
			          "nodeValue": "hello world",
			        },
			        "type": "TEXT_ELEMENT",
			      },
			    ],
			    "id": "app",
			  },
			  "type": "div",
			}
		`)
	})
})
