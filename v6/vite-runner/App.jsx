import React from '../packages/React.js'

let showBar = false
function Counter() {
	// const foo = <div>foo</div>
	function Foo() {
		return <div>foo</div>
	}
	const bar = <p>bar</p>

	function handleShowBar() {
		showBar = !showBar
		React.update()
	}

	return (
		<div>
			Counter
			{/* <div>{showBar ? bar : foo}</div> */}
			<div>{showBar ? bar : <Foo></Foo>}</div>
			<button onclick={handleShowBar}>showBar</button>
		</div>
	)
}

function App() {
	return (
		<div>
			hi mini-react
			<Counter />
		</div>
	)
}

export default App
