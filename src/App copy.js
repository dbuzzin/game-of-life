import React, { Component, Fragment } from 'react';





class World extends Component {

	constructor() {

		super();

		this.width		= 500;
		this.height		= 500;
		this.cols 		= 5;
		this.rows 		= 5;
		this.fullGrid 	= (this.cols * this.rows);

		this.world		= [];
	}

	state = {

		cells		: [],

		aliveCells	: 0,
		deadCells	: 0,

		generation	: 1,
		speed		: 500,
		
		living		: true
	}

	createWorld = (cells = [], random = false) => {

		let world = [];

		for(let x = 0; x < this.cols; x++) {
			world[x] = [];
            for(let y = 0; y < this.rows; y++) {
				if(random) {
					world[x][y] = this.getRandomNum() > (this.fullGrid - (this.fullGrid / 4)) ? true : false;
				} else {
					world[x][y] = cells;
				}
			}
		}

		return world;
	}

	createCells = () => {

		let cells = [];

		for(let x = 0; x < this.cols; x++) {
            for(let y = 0; y < this.rows; y++) {
				// if(this.world[x][y]) {
				// 	cells.push({x, y})
				// }
				cells.push({x, y});
			}
		}

		return cells;
	}

	checkNeighbours = (arr, x, y) => {

		let counter = 0;

		let xPos, yPos, belowZero, aboveLength;
		
		for(let dx = -1; dx <= 1; dx++) {
            for(let dy = -1; dy <= 1; dy++) {

                if(dx !== 0 || dy !== 0) {

					xPos = (x + dx);
					yPos = (y + dy);

					belowZero 	= (xPos === -1 || yPos === -1);
					aboveLength = (xPos === arr.length || yPos === arr[x].length);

					if(!belowZero && !aboveLength) {

						if(arr[xPos][yPos] === true) {

							counter++;
						}
					}   
                }
            }
		}

		return counter;
	}

	getRandomNum = () => Math.floor(Math.random() * this.fullGrid);

	nextGeneration = (neighbours, x, y, cell) => {


		const { alive } = cell.state;

		// console.log(this.checkNeighbours(this.world, x, y));

		// let initWorld = this.createWorld(alive);

		// console.log(initWorld)

		this.world[x][y] = alive;

		// this.setState({cells: this.createCells()});

		// console.log(this.world);

		setTimeout(() => { 			

			if(alive && neighbours < 2) {

				cell.setState({alive: false});	
			} 
			else if(alive && neighbours > 3) {
	
				cell.setState({alive: false});
			} else if(!alive && neighbours === 3) {
	
				cell.setState({alive: true});
			} else if(alive && (neighbours > 1 || neighbours < 4)) {
	
			} else {
				cell.setState({alive: false});
			}

			let newNeighbours = this.checkNeighbours(cell.props.world, x, y);

			setTimeout(this.nextGeneration(newNeighbours, x, y, cell), 10);

		}, this.state.speed);	

	}

	startWorld = () => {
		
		// let timeout = this.setTimeout();
		// clearTimeout(timeout);
	}

	destroyWorld = () => {

		this.setState({living: false});

		this.world = false;
	}

	componentDidMount = () => {

		// let randomLife = () => this.worldLoop(() => this.getRandomNum() > (this.fullGrid - (this.fullGrid / 4)) ? true : false);

		// console.log(randomLife());

		this.world = this.createWorld([], true);

		this.setState({cells: this.createCells()});

		// console.log(this.world, "Hew");
	}

	componentDidUpdate = () => {

		console.log("World Changed!");

		// clearTimeout(iterate);
	}

	render() {

		const { checkNeighbours, nextGeneration, width, height, cols, rows, world } = this;

		return (

			<Fragment>
				<div id="world">

					{this.state.cells.map(cell => (
					
						<Cell nextGen={nextGeneration} check={checkNeighbours} width ={width / cols} height={height / rows} x={cell.x} y={cell.y} world={world} key={`${cell.x}, ${cell.y}`} />
					
					))}
				</div>
				<button onClick={this.destroyWorld}> Clear </button>
			</Fragment>
		);
	}

}



class Cell extends Component {

	state = {

		alive		: this.props.world[this.props.x][this.props.y],
		neighbours 	: this.props.check(this.props.world, this.props.x, this.props.y)
	}

	cellStyle = {

		width	: `${this.props.width}px`,
		height	: `${this.props.height}px`,
		outline	: "1px solid #000000"
	}
	
	componentDidMount = () => {

		// this.setState({alive: this.props.world[this.props.x][this.props.y], neighbours: this.props.check(this.props.world, this.props.x, this.props.y)});

		// this.setState({neighbours: this.props.check(this.props.world, this.props.x, this.props.y)});

		// console.log(this.state.alive);

		// console.log(this.state.neighbours, this.props.x, this.props.y);

		// this.setState({neighbours: this.props.check(this.props.world, this.props.x, this.props.y)});

		// this.setState({alive: this.props.world[this.props.x][this.props.y]});

		this.props.nextGen(this.state.neighbours, this.props.x, this.props.y, this);

	}

	componentDidUpdate = (prevProps, prevState) => {

		let deltaAlive 		= prevState.alive 		!== this.state.alive;
		let deltaNeighbours = prevState.neighbours 	!== this.state.neighbours;

		if(deltaNeighbours) {

			// this.setState({neighbours: this.props.check(this.props.world, this.props.x, this.props.y)});

			// console.log("Neighbours Changed!");
		}

		if(deltaAlive) {

			// console.log(this.state.neighbours, this.state.alive);

			// this.setState({neighbours: this.props.check(this.props.world, this.props.x, this.props.y)});

			// console.log(this.state.alive, this.state.neighbours);

			// console.log("Alive Changed!");
		}

		return deltaAlive || deltaNeighbours;
	}

	render() {

		return (

			<Fragment>
				<div className={`cell ${this.state.alive ? "alive" : "dead"}`} style={this.cellStyle}>
					
				</div>
			</Fragment>
		);
	}
}





export { World, Cell };
