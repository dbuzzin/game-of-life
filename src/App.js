import React, { Component, Fragment } from 'react';



class World extends Component {

	constructor() {

		super();

		this.width		= 800;
		this.height		= 600;
		this.cellSize	= 10;
		this.cols 		= (this.width / (this.cellSize / 10));
		this.rows 		= (this.height / (this.cellSize / 10));
		this.fullGrid 	= (this.cols * this.rows);

		this.world		= this.createWorld(false);
	}

	state = {

		cells		: [],

		aliveCells	: 0,
		deadCells	: 0,

		generation	: 1,
		speed		: 25,
		
		isPlaying	: false,

		isDrawing	: false,
		isErasing	: false,

		inspecting	: false
	}



	getRandomNum = () => Math.floor(Math.random() * this.fullGrid);



	createWorld = (cells = [], random = false) => {

		let world = [];

		for(let y = 0; y < this.rows; y++) {

			world[y] = [];

			for(let x = 0; x < this.cols; x++) {

				if(random) {

					world[y][x] = this.getRandomNum() > (this.fullGrid / 2) ? true : false;
				} else {

					world[y][x] = cells;
				}
			}
		}
		
		return world;
	}



	createCells = () => {

		let cells = [];

		for(let y = 0; y < this.rows; y++) {

			for(let x = 0; x < this.cols; x++) {

				if(this.world[y][x]) {

					cells.push({ x, y });
				}
			}
		}
		
		return cells;

	}



	getElemOffset = () => {
		
		const doc = document.documentElement

		const getRect = this.worldRef.getBoundingClientRect();

		return {

			x: (getRect.left + window.pageXOffset) - doc.clientLeft,
			y: (getRect.top + window.pageYOffset) - doc.clientTop
		}
	}



	getMousePoint = (e) => {

		const { cellSize } = this;
		
		const elemOffset 	= this.getElemOffset();

		const offsetX		= e.clientX - elemOffset.x;
		const offsetY		= e.clientY - elemOffset.y;

		return {

			x: Math.floor(offsetX / cellSize),
			y: Math.floor(offsetY / cellSize)
		}
	}



	handleMouseMove = (e) => {

		const { rows, cols, world } = this;
		const { x, y } = this.getMousePoint(e);

		if(x >= 0 && x <= cols && y >= 0 && y <= rows) {

			if(this.state.isDrawing) {

				this.state.isErasing ? world[y][x] = false : world[y][x] = true;

				this.setState({cells: this.createCells()});

			}
		}	
	}



	handleMouseDown = (e) => {

		const { world, cols, rows } = this;
		const { x, y } = this.getMousePoint(e);

		this.setState({isDrawing: true});

		if(x >= 0 && x <= cols && y >= 0 && y <= rows) {

			// if(this.state.isDrawing) {

				this.state.isErasing ? world[y][x] = false : world[y][x] = true;

				this.setState({cells: this.createCells()});

			// }
		}	
	}



	handleMouseUp = () => this.setState({isDrawing: false});



	zoomOnScroll = (e) => {

		console.log(window);
		console.log(e);
	}



	inspectCell = (e) => {

		const { x, y } = this.getMousePoint(e);

		if(this.state.inspecting) {

			// return console.log(this.checkNeighbours(this.world, x, y));
		}
	}



	toggleErasing = () => this.setState(prevState => ({isErasing: prevState.isErasing ? false : true}));



	toggleStart = () => {

		this.setState(prevState => ({isPlaying: prevState.isPlaying ? false : true}));

		if(!this.state.isPlaying) {

			this.nextGeneration();

		} else {

			// console.log("Stopped");

			if(this.timeoutHandler) {

				window.clearTimeout(this.timeoutHandler);

				this.timeoutHandler = null;
			}
		}
	}



	checkNeighbours = (arr, x, y) => {

		// console.log(arr);

		let counter = 0;

		for(let dY = -1; dY <= 1; dY++) {

			for(let dX = -1; dX <= 1; dX++) {

				if(dX !== 0 || dY !== 0) {

					let nX = (x + dX);
					let nY = (y + dY);

					if(nX >= 0 && nX < this.cols && nY >= 0 && nY < this.rows) {

						if(arr[nY][nX]) {

							counter++;
						}

					}
				}

			}
		}

		return counter;
		
	}



	nextGeneration = () => {

		// console.log("Started");

		let newWorld = this.createWorld(false);

		for(let y = 0; y < this.rows; y++) {

			for(let x = 0; x < this.cols; x++) {

				let neighbours = this.checkNeighbours(this.world, x, y);

				if(this.world[y][x]) {

					if(neighbours === 2 || neighbours === 3) {

						newWorld[y][x] = true;
					} else {

						newWorld[y][x] = false;
					}
					
				} else {

					if(!this.world[y][x] && neighbours === 3) {

						newWorld[y][x] = true;
					}
				}

			}
		}

		this.world = newWorld;

		this.setState({cells: this.createCells()});

		this.setState(prevState => ({generation: prevState.generation++}));

		this.timeoutHandler = window.setTimeout(() => this.nextGeneration() , this.state.speed);
	}



	handleSpeed = (speed) => {

		this.setState({speed: speed});
	}



	endWorld = () => {

		this.setState({cells: []});
		this.world = this.createWorld(false);
	}



	zoomOut = () => {

		this.cellSize = 5;
	}



	render() {

		const { width, height, cellSize } = this;
		const { cells } = this.state;

		this.createCells();

		return (

			<Fragment>
				<div id="world" onMouseDown={ this.handleMouseDown } 
								onMouseUp={ this.handleMouseUp } 
								onMouseMove={ this.handleMouseMove } 
								onMouseLeave={ this.handleMouseUp } 
								onClick={ this.inspectCell }
								onScroll={ this.zoomOnScroll }
								ref={(n) => { this.worldRef = n }} 
								style={{ width: width, height: height, backgroundSize: `${ cellSize }px ${ cellSize }px` }}>
					
					{ cells.map(cell => (
					
						<Cell x={ cell.x } y={ cell.y } size={ cellSize } key={`${ cell.x }, ${ cell.y }`} />
					
					))}

				</div>

				<button onClick={ this.toggleStart }> { this.state.isPlaying ? "Stop" : "Start" } </button>
				<button onClick={ this.toggleErasing }> { this.state.isErasing ? "Draw" : "Erase" } </button>
				<button onClick={ this.endWorld }> Clear </button>
				<button onClick={ this.zoomOut }> Change Size </button>
				<button> Inspect Cell </button>
			</Fragment>
		);
	}

}



class Cell extends Component {

	state = {

		
	}

	render() {

		const { x, y, size } = this.props;

		return (

			<Fragment>

				<div className="cell" style={{

					left	: `${size * x + 1}px`, 
					top		: `${size * y + 1}px`, 
					width	: `${size - 1}px`, 
					height	: `${size - 1}px`

				}}>	

				</div>
			</Fragment>
		);
	}
}



export { World, Cell };
