import React from '../packages/React.js'

// 实现useEffect
// cleanup 在调用 useEffect 之前进行调用，当deps为空的时候不会调用返回的 cleanup
function Foo() {
	console.log('res foo')
	const [count, setCount] = React.useState(10)
	const [bar, setBar] = React.useState('bar')
	function handleClick() {
		setCount(count + 1)
		setBar(() => 'setBar')
	}

	/* effect 没有依赖项 的情况 */
	// React.useEffect(() => {
	// 	console.log('effect init')
	// }, [])

	/* effect 依赖项有变化 的情况 */
	// React.useEffect(() => {
	// 	console.log('count update', count)
	// }, [count])

	/* effect cleanup 的情况 */
	React.useEffect(() => {
		console.log('init')
		return () => {
			console.log('effect cleanup')
		}
	}, [])

	React.useEffect(() => {
		console.log('count update', count)
		return () => {
			console.log('count update cleanup', count)
		}
	}, [count])

	return (
		<div>
			<h1>foo</h1>
			{count}
			<div>{bar}</div>
			<button onClick={handleClick}>click</button>
		</div>
	)
}

function App() {
	return (
		<div>
			hi mini-react
			<Foo></Foo>
		</div>
	)
}

export default App
