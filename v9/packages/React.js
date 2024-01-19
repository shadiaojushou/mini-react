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
	wipRoot = {
		dom: container,
		props: {
			children: [el],
		},
	}

	nextUnitOfWork = wipRoot
}

/**
 * @description: update 对比新旧fiber更新DOM树
 * @return {*}
 */
function update() {
	let currentFiber = wipFiber
	return () => {
		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		}
		// wipRoot = {
		// 	dom: currentRoot.dom,
		// 	props: currentRoot.props,
		// 	alternate: currentRoot,
		// }

		nextUnitOfWork = wipRoot
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
function updateProps(dom, nextProps, prevProps = {}) {
	// 1.第一种情况：oldFiber有props({id:"1"})，newFiber没有props({}) -> 删除props
	Object.keys(prevProps).forEach((key) => {
		if (key !== 'children') {
			if (!(key in nextProps)) {
				dom.removeAttribute(key)
			}
		}
	})

	// 2.第二种情况：oldFiber没有props({})，newFiber有props({id:"1"}) -> 添加props

	// 3.第三种情况：oldFiber有props({id:"1"})，newFiber有props({id:"2"}) -> 更新props
	Object.keys(nextProps).forEach((key) => {
		if (key !== 'children') {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith('on')) {
					const eventType = key.slice(2).toLowerCase()
					// 因为是更新，所以需要先移除旧的事件，再添加新的事件
					dom.removeEventListener(eventType, prevProps[key])
					dom.addEventListener(eventType, nextProps[key])
				} else {
					dom[key] = nextProps[key]
				}
			}
		}
	})
}

let wipRoot = null // 根fiber work in progress root
let currentRoot = null // 当前根fiber
let nextUnitOfWork = null // 当前正在工作的fiber
let deletions = [] // 需要删除的fiber节点
let wipFiber = null // 当前正在工作的fiber

/**
 * @description: workLoop React任务调度器，目的是遍历DOM
 * @param {*} deadline
 * @return {*}
 */
function workLoop(deadline) {
	let shouldYield = false

	while (!shouldYield && nextUnitOfWork) {
		nextUnitOfWork = performWorkOfWork(nextUnitOfWork)

		if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
			console.log('hit', wipRoot, nextUnitOfWork)
			nextUnitOfWork = undefined
		}

		shouldYield = deadline.timeRemaining() < 1
	}

	// 5.统一提交 在链表遍历完成后,统一提交DOM更新，而不是在每个fiber更新完后提交
	if (!nextUnitOfWork && wipRoot) {
		commitRoot()
	}

	requestIdleCallback(workLoop)
}

/**
 * @description: commitRoot 提交更新 fiber -> dom
 * @return {*}
 */
function commitRoot() {
	deletions.forEach(commitDeletion)
	commitWork(wipRoot.child)
	currentRoot = wipRoot
	wipRoot = null
	deletions = []
}

/**
 * @description: commitWork
 * @return {*}
 */
function commitWork(fiber) {
	if (!fiber) return

	// 这里拿到函数组件的返回值后需要找到父节点
	let fiberParent = fiber.parent

	// 如果父节点不是DOM节点，就一直找父节点，直到找到DOM节点为止
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent
	}

	// 判断当前fiber的副作用标识
	if (fiber.effectTag === 'UPDATE') {
		// 更新DOM属性
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
	} else if (fiber.effectTag === 'PLACEMENT') {
		// 将当前fiber的DOM节点挂载到父节点上
		if (fiber.dom) {
			fiberParent.dom.appendChild(fiber.dom)
		}
	}

	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

/**
 * @description: commitDeletion 删除DOM节点
 * @return {*}
 */
function commitDeletion(fiber) {
	if (fiber.dom) {
		let fiberParent = fiber.parent
		while (!fiberParent.dom) {
			fiberParent = fiberParent.parent
		}
		fiberParent.dom.removeChild(fiber.dom)
	} else {
		commitDeletion(fiber.child)
	}
}

/**
 * @description: initChildren 初始化fiber
 * @return {*}
 */

function reconcileChildren(fiber, children) {
	let oldFiber = fiber.alternate?.child
	let prevChild = null
	children.forEach((child, index) => {
		// 判断是否是同一类型的节点
		const isSameType = oldFiber && oldFiber.type === child.type

		let newFiber

		// 如果是同一类型的节点，就复用节点，不是同一类型的节点，就创建新的节点
		if (isSameType) {
			// TODO 更新节点 update
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber.dom,
				effectTag: 'UPDATE', // 副作用标识 标记当前节点是更新的节点
				alternate: oldFiber, // 记录旧的fiber节点
			}
		} else {
			if (child) {
				newFiber = {
					type: child.type,
					props: child.props,
					child: null,
					parent: fiber,
					sibling: null,
					dom: null,
					effectTag: 'PLACEMENT', // 副作用标识 标记当前节点是新建的节点
				}
			}

			if (oldFiber) {
				deletions.push(oldFiber)
			}
		}

		// 如果旧节点存在，就让旧节点指向下一个节点（兄弟节点）
		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}

		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevChild.sibling = newFiber
		}
		if (newFiber) {
			prevChild = newFiber
		}
	})

	// 如果旧节点存在，就需要删除旧节点
	while (oldFiber) {
		deletions.push(oldFiber)

		oldFiber = oldFiber.sibling
	}
}

/**
 * @description: updateFunctionComponent 处理函数式组件
 * @return {*}
 */
function updateFunctionComponent(fiber) {
	wipFiber = fiber
	const children = [fiber.type(fiber.props)] // 执行函数组件，获取函数组件的返回值
	reconcileChildren(fiber, children)
}

/**
 * @description: updateHostComponent 处理DOM组件
 * @return {*}
 */
function updateHostComponent(fiber) {
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber))

		updateProps(dom, fiber.props, {})
	}

	const children = fiber.props.children
	reconcileChildren(fiber, children)
}

/**
 * @description: performWorkOfWork React任务执行器，目的是执行DOM操作
 * @return {*}
 */
function performWorkOfWork(fiber) {
	const isFunctionComponent = typeof fiber.type === 'function'
	if (isFunctionComponent) {
		updateFunctionComponent(fiber)
	} else {
		updateHostComponent(fiber)
	}

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
}

requestIdleCallback(workLoop)

const React = {
	createElement,
	render,
	update,
}

export default React
