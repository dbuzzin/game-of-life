import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { World } from './App';


class App extends Component {

    render() {

        return (

            <Fragment>
                <World />
            </Fragment>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));
