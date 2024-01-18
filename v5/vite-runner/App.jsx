import React from '../packages/React.js'

let count = 10
let props = { id: '1234' }
/* 函数式组件 */
function Counter() {
	const handleClick = () => {
		console.log('click')
		count++
		props = { id: '12345' }
		React.update()
	}
	return (
		<div {...props}>
			Counter:{count}
			<button onClick={handleClick}>click</button>
		</div>
	)
}

function CounterContainer() {
	return <Counter />
}

// const App = (
// 	<div>
// 		<h1>hello mini-react</h1>
// 		{/* <Counter /> */}
// 		<CounterContainer />
// 	</div>
// )

/* 将App换成函数式组件 */
function App() {
	return (
		<div>
			<h1>hello mini-react</h1>
			<Counter num={10} />
			{/* <Counter num={20} /> */}
			{/* <CounterContainer /> */}
		</div>
	)
}

export default App
