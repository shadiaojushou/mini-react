import React from '../packages/React.js'

let showBar = false
function Counter() {
	const foo = (
		<div>
			foo
			<div>foo child1</div>
			<div>foo child2</div>
		</div>
	)

	const bar = <div>bar</div>

	function handleShowBar() {
		showBar = !showBar
		React.update()
	}

	return (
		<div>
			Counter
			<button onclick={handleShowBar}>showBar</button>
			<div>{showBar ? bar : foo}</div>
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
