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
				const isTextNode = typeof child === 'string' || typeof child === 'number'
				return isTextNode ? createTextNode(child) : child
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

	root = nextUnitOfWork
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

let root = null // 根fiber
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

	// 5.统一提交 在链表遍历完成后,统一提交DOM更新，而不是在每个fiber更新完后提交
	if (!nextUnitOfWork && root) {
		commitRoot()
	}

	requestIdleCallback(workLoop)
}

/**
 * @description: commitRoot 提交更新 fiber -> dom
 * @return {*}
 */
function commitRoot() {
	commitWork(root.child)
	root = null
}

/**
 * @description: commitWork
 * @return {*}
 */
function commitWork(fiber) {
	if (!fiber) {
		return
	}

	// 这里拿到函数组件的返回值后需要找到父节点
	let fiberParent = fiber.parent

	// 如果父节点不是DOM节点，就一直找父节点，直到找到DOM节点为止
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent
	}

	if (fiber.dom) {
		fiberParent.dom.appendChild(fiber.dom)
	}
	// fiber.parent.dom.append(fiber.dom)
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

/**
 * @description: initChildren 初始化fiber
 * @return {*}
 */

function initChildren(fiber, children) {
	// const children = fiber.props.children
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
 * @description: updateFunctionComponent 处理函数式组件
 * @return {*}
 */
function updateFunctionComponent(fiber) {
	const children = [fiber.type(fiber.props)] // 执行函数组件，获取函数组件的返回值
	initChildren(fiber, children)
}

/**
 * @description: updateHostComponent 处理DOM组件
 * @return {*}
 */
function updateHostComponent(fiber) {
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber))

		updateProps(dom, fiber)
	}

	const children = fiber.props.children
	initChildren(fiber, children)
}

/**
 * @description: performWorkOfWork React任务执行器，目的是执行DOM操作
 * @return {*}
 */
function performWorkOfWork(fiber) {
	/* 重构前 	
	// 判断是否是函数组件
	const isFunctionComponent = typeof fiber.type === 'function'

	// 判断fiber是否是函数组件，如果是函数组件，执行函数组件，返回子元素，如果不是函数组件，就需要创建DOM
	if (!isFunctionComponent) {
		if (!fiber.dom) {
			const dom = (fiber.dom = createDom(fiber))

			updateProps(dom, fiber)
		}
	} */

	//  重构后
	const isFunctionComponent = typeof fiber.type === 'function'
	if (isFunctionComponent) {
		updateFunctionComponent(fiber)
	} else {
		updateHostComponent(fiber)
	}

	// 如果是函数组件，就需要执行函数组件就需要做开箱处理，获取函数的返回值，然后再进行处理；反之不是函数组件，就需要正常处理子元素
	const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children
	initChildren(fiber, children)

	// 4.返回下一个工作单元
	if (fiber.child) {
		return fiber.child
	}

	// 如果没有子元素，也没有兄弟元素，就需要找到父元素的兄弟元素
	let nextFiber = fiber
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling
		}
		nextFiber = nextFiber.parent
	}

	// return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
	createElement,
	render,
}

export default React
