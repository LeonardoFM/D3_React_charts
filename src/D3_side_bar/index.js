import React, { Component } from 'react';
import D3SideBar from './D3SideBar';

export default class D3_side_bar extends Component{

    constructor(props){
        super()
        this.props = props;
    }

    componentDidMount(){
        this.chart = new D3SideBar(this.refs.chart)
    }

    render(){
        return(<div ref="chart"/>);
    }
    
}