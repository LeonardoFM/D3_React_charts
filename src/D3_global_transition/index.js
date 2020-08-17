import React, { Component } from 'react';
import NTransitions from './NTransitions';

export default class D3_global_transition extends Component{

    constructor(props){
        super()
        this.props = props;
    }

    componentDidMount(){this.chart = new NTransitions(this.refs.chart);}

    render(){return(<div ref="chart"/>);}

}