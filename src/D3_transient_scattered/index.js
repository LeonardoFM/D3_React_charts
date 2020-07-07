import React, {Component} from 'react'
import D3_testes from './D3_testes';

export default class D3_transient_scattered extends Component {
    componentDidMount(){
      new D3_testes(this.refs.chart);
                              // Basically this is just reacts way of really simply allowing us
                              // to target a particular element on the
                              //page without using the usual idea or classic Xs.
                              // refers to line with "ref='chart"
    }
    render(){
      return (<div ref="chart"></div>)
    }
  };