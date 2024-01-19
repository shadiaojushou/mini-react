import React from '../packages/React.js'

let showBar = false
function Counter() {
	const bar = <div>bar</div>

	function handleShowBar() {
		showBar = !showBar
		React.update()
	}

	return (
		<div>
			Counter
			{showBar && bar}
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
