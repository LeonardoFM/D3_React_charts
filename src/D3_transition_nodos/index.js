import React, { Component } from 'react';
import TNodos from './TNodos';

export default class D3_transition_nodos extends Component {

    constructor(props){
        super()
        this.props = props
    }

    componentDidMount(){
        this.chart = new TNodos(this.refs.chart);
    }

    render(){
        const handle = () => {return this.chart.update()}
        return (
            <div ref="chart">
                <button onClick={handle}>Do transition</button>
            </div>
        );
    }

}