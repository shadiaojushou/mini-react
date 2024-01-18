/**
 * @description: 抽离main.js中的代码, 独立 ReactDom 中实现 render 方法
 * @return {*}
 */

function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				return typeof child === 'string' ? createTextNode(child) : child
			}),
		},
	}
}

function render(el, container) {
	const dom =
		el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

	Object.keys(el.props)
		.filter((key) => key !== 'children')
		.forEach((key) => {
			dom[key] = el.props[key]
		})

	const children = el.props.children
	children.forEach((child) => {
		render(child, dom)
	})

	container.append(dom)
}

const React = {
	createElement,
	render,
}

export default React
