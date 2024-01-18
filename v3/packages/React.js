/**
 * @description: createTextNode 创建文本节点
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

/**
 * @description: createElement 创建元素
 * @return {*}
 */
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

/**
 * @description: render 渲染函数
 * @param {*} el
 * @param {*} container
 * @return {*}
 */
function render(el, container) {
	nextUnitOfWork = {
		dom: container,
		props: {
			children: [el],
		},
	}
}

/**
 * @description: createDom 创建DOM
 * @return {*}
 */
function createDom(fiber) {
	const dom =
		fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

	return dom
}

/**
 * @description: updateProps 处理DOM属性
 * @param {*} dom
 * @param {*} fiber
 * @return {*}
 */
function updateProps(dom, fiber) {
	Object.keys(fiber.props).forEach((key) => {
		if (key !== 'children') {
			dom[key] = fiber.props[key]
		}
	})
}

let nextUnitOfWork = null // 当前正在工作的fiber

/**
 * @description: workLoop React任务调度器，目的是遍历DOM
 * @param {*} deadline
 * @return {*}
 */
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextUnitOfWork) {
		nextUnitOfWork = performWorkOfWork(nextUnitOfWork)
		shouldYield = deadline.timeRemaining() < 1
	}

	requestIdleCallback(workLoop)
}

/**
 * @description: initChildren 初始化fiber
 * @return {*}
 */

function initChildren(fiber) {
	const children = fiber.props.children
	let prevChild = null
	children.forEach((child, index) => {
		const newWork = {
			type: child.type,
			props: child.props,
			child: null,
			parent: fiber,
			sibling: null,
			dom: null,
		}

		if (index === 0) {
			fiber.child = newWork
		} else {
			prevChild.sibling = newWork
		}
		prevChild = newWork
	})
}

/**
 * @description: performWorkOfWork React任务执行器，目的是执行DOM操作
 * @return {*}
 */

function performWorkOfWork(fiber) {
	if (!fiber.dom) {
		/* 	重构前
		// 1.创建DOM node
		// const dom = (work.dom =
		// 	work.type === 'TEXT_ELEMENT'
		// 		? document.createTextNode('')
		// 		: document.createElement(work.type))

		
		// 2.处理DOM属性 props
		// Object.keys(work.props).forEach((key) => {
		// 	if (key !== 'children') {
		// 		dom[key] = work.props[key]
		// 	}
		// })
		
	 // 3.转换链表，设置好指针
		const children = work.props.children
		let prevChild = null
		children.forEach((child, index) => {
		const newWork = {
			type: child.type,
			props: child.props,
			child: null,
			parent: work,
			sibling: null,
			dom: null,
		}

		if (index === 0) {
			work.child = newWork
		} else {
			prevChild.sibling = newWork
		}
		prevChild = newWork
		}) 
    */

		// 重构后
		const dom = (fiber.dom = createDom(fiber))

		fiber.parent.dom.append(dom)

		updateProps(dom, fiber)
	}

	initChildren(fiber)

	// 4.返回下一个工作单元
	if (fiber.child) {
		return fiber.child
	}

	if (fiber.sibling) {
		return fiber.sibling
	}
	return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
	createElement,
	render,
}

export default React
