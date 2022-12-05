import React, { useState, useEffect } from 'react'
import "./Container.css"

const generate_cells_info = () => {
	const cellSide = window.innerWidth < 800 ? 30 : 15
	const windowHeight = Math.floor(window.innerHeight / cellSide)
	const windowWidth = Math.floor(window.innerWidth / cellSide)
	const cells = [...Array(windowHeight)].map(x => [...Array(windowWidth)].map(y => false ))
	return cells
}

const Container = () => {
	const [ cells, setCells ] = useState(generate_cells_info())
	const [ game, setGame ] = useState(false)
	const [ mouseState, setMouseState ] = useState(false)
	const [ mouseInBanner, setMouseInBanner ] = useState(false)
	
	useEffect(() => {
		setTimeout(() => game && setCells(nextStep(cells)), 300)
	}, [game, cells])
	
	const changeCell = (row, column, isMousePressed) => {
		if (!isMousePressed || game || mouseInBanner) return 
		const newCells = [...cells]
		const toChange = newCells[row][column]
		newCells[row][column] = !toChange
		setCells(newCells)
	}
	
	const getNeighbors = (cells, r, c) => {
		const positions = [[r - 1, c - 1], [r - 1, c], [r - 1, c + 1], [r, c - 1], [r, c + 1], [r + 1, c - 1], [r + 1, c], [r + 1, c + 1]]
		return positions.map((act) => {
			const minPosition = act[0] >= 0 && act[1] >= 0
			const maxPosition = act[0] < cells.length && act[1] < cells[0].length
			return minPosition && maxPosition ? cells[act[0]][act[1]] : false
		})
	}
	
	const nextStep = (cells) => {
		const prevCells = [...cells]
		const newCells = generate_cells_info()
		for (let r = 0; r < prevCells.length; r++){
			const row = prevCells[r]
			
			for(let c = 0; c < row.length; c++){
				const actCell = prevCells[r][c]
				const neighbors = getNeighbors(prevCells, r, c)
				const numNeighbors = neighbors.filter(act => act).length

				if (actCell) {
					if (numNeighbors <= 1 || 4 <= numNeighbors) {
						newCells[r][c] = false
					} else  {
						newCells[r][c] = true
					}
				} else if (!actCell && numNeighbors === 3) {
					newCells[r][c] = true
				}
			}
		}
		return newCells
	}
	
	return (
		<div className='container' onDragStart={(e) => e.preventDefault()} onMouseDown={() => setMouseState(true)} onMouseUp={() => setMouseState(false)}>
			<div className='container__banner' onMouseEnter={() => setMouseInBanner(true)} onMouseLeave={() => setMouseInBanner(false)}>
				<div className='container__title'>
					The Game Of Life
				</div>
				<div className='container__button' onClick={() => setGame(!game)}>
					{game ? "STOP" : "START"}
				</div>
				<div className='container__button' onClick={() => !game && setCells(generate_cells_info())}>
					{game ? "----" : "RESET"}
				</div>
				<div className='container__button' onClick={() => !game && setCells(nextStep(cells))}>
					{game ? "----" : "NEXT"}
				</div>
			</div>
			<div className='container__matrix'>
			{ cells.map((row, ir) => (
				<div className='container__row' key={ir}>
					{ row.map((alive, ic) => (
						<div className="container__cell" key={ic} style={{ backgroundColor: alive ? "#8A88AA" : "#242331"}} 
						onClick={() => changeCell(ir, ic, true)}  
						onMouseOver={() => changeCell(ir, ic, mouseState)}>
						</div>
					))}
				</div>
			))}
			</div>
		</div>
	)
}

export default Container