import React, { Component } from 'react';
import Game from './Game';

export default class D3_game extends Component{

    constructor(props){
        super()
        this.props = props;
    }

    componentDidMount(){this.chart = new Game(this.refs.chart);}

    render(){return(<div ref="chart"/>);}

}