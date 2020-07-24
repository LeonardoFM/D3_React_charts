import React, { Component } from 'react';
import Plot from './Plot';

class D3_histogram_slice extends Component {

    constructor(props){
        super()
        this.props = props;        
    }

    componentDidMount(){
        this.chart = new Plot(this.refs.chart);
    }

    render(){
        return(
            <div ref="chart">
                <button id="play-button">Play</button>
            </div>
        );
    }

}

export default D3_histogram_slice;