/**
 * @description: 整体目标：在页面呈现 hello mini-react
 */

/**
 * @description: 0.0.1 版本 -> 利用原生 js 在页面呈现 hello mini-react
 */

// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)

// const text = document.createTextNode('hello mini-react')

// dom.append(text)

/**
 * @description: 0.0.2 版本 -> 实现类似 React 利用 虚拟 DOM 的方式 将js 对象 在页面呈现 hello mini-react
 * @param {*} element (DOM节点) -> js 对象
 * @return {*}
 */

/* 
const textNode = {
	type: 'TEXT_ELEMENT',
	props: {
		nodeValue: 'hello mini-react',
		children: [],
	},
} 

const element = {
	type: 'div',
	props: {
		id: 'app',
		children: ['hello mini-react'],
	},
}

const dom = document.createElement(element.type)
dom.id = element.props.id
document.querySelector('#root').append(dom)

const text = document.createTextNode(textNode.props.nodeValue)
dom.append(text)
*/

/* 
// 将 textNode 对象重构成 createTextNode 函数 
function createTextNode(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

// 将 element 对象重构成 createElement 函数 
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children,
		},
	}
}

// const textEl = createTextNode('hello mini-react')
// const App = createElement('div', { id: 'app' }, textEl)

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').append(dom)

// const text = document.createTextNode('')
// text.nodeValue = textEl.props.nodeValue
// dom.append(text)

// 将JS原生操作DOM 重构成 render函数
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

const textEl = createTextNode('hello mini-react')
const App = createElement('div', { id: 'app' }, textEl)

render(App, document.querySelector('#root'))
 */

/* 
// 将上述代码再进行优化,目的是实现createElement函数第三个参数可以直接传入文本节点
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

const App = createElement('div', { id: 'app' }, 'hello',' mini-react')
console.log(App)

render(App, document.querySelector('#root')) */

/**
 * @description: 0.0.3 版本 -> 将0.0.2版本的代码进行重构,对齐React的代码风格,实现ReactDom.createApp().render()的形式
 * @param {*} element (DOM节点) -> js 对象
 * @return {*}
 */

/* function createTextNode(text) {
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

const ReactDom = {
	createRoot: function (container) {
		return {
			render: function (el) {
				render(el, container)
			},
		}
	}, 
}

const App = createElement('div', { id: 'app' }, 'hello',' mini-react')

ReactDom.createRoot(document.querySelector('#root')).render(App) */


/* 测试抽离后的代码是否能正常运行 
import React from './packages/React.js'
import ReactDom from './packages/ReactDom.js'

const App = React.createElement('div', { id: 'app' }, 'hello',' mini-react')

ReactDom.createRoot(document.querySelector('#root')).render(App) */

// 对齐React的代码风格,将App作为单独的文件实现。
import ReactDom from './packages/ReactDom.js'
import App from './App.js'

ReactDom.createRoot(document.querySelector('#root')).render(App) 


