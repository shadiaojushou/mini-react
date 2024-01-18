import React from '../packages/React.js'

/* 函数式组件 */
function Counter({ num }) {
	return <div>Counter:{num}</div>
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
			<Counter num={20} />
			{/* <CounterContainer /> */}
		</div>
	)
}

export default App
