import React from '../packages/React.js'

let countFoo = 1
function Foo() {
	console.log('foo')
	const update = React.update()
	function handleClick() {
		countFoo++
		update()
		// React.update()
	}
	return (
		<div>
			foo:{countFoo}
			<button onClick={handleClick}>bar click</button>
		</div>
	)
}
let countBar = 1
function Bar() {
	console.log('bar')
	const update = React.update()
	function handleClick() {
		countBar++
		update()
		// React.update()
	}
	return (
		<div>
			bar:{countBar}
			<button onClick={handleClick}>bar click</button>
		</div>
	)
}

let countRoot = 1
function App() {
	console.log('app')
	const update = React.update()
	function handleClick() {
		countRoot++
		update()
		// React.update()
	}
	return (
		<div>
			hi mini-react count:{countRoot}
			<button onClick={handleClick}>click</button>
			<Foo></Foo>
			<Bar></Bar>
		</div>
	)
}

export default App
