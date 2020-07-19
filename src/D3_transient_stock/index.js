import React, { Component } from 'react';
// import D3_testes from './D3_testes';
// import D3_stock_2 from './D3_stock_2';
// import D3_all_stocks from './D3_all_stocks';
// import StockScatter from './StockScatter';
import StockScatterTimeEvolution from './StockScatterTimeEvolution';

class D3_transient_stock extends Component {
    constructor(props){
        super()
        this.props = props;
    }
    componentDidMount(){
      // this.chart = new D3_stock_2(this.refs.chart,this.props.selected,this.props.value);
      // new D3_all_stocks(this.refs.chart);
      // new StockScatter(this.refs.chart);
      new StockScatterTimeEvolution(this.refs.chart);
    }

    componentWillUpdate(){
      // this.chart.changeSelection(this.props.selected)
    }

    render(){
      return (<div ref="chart"></div>)
    }
  };

export default D3_transient_stock;