import React, { Component } from 'react';
import {json, max, min, timeParse} from 'd3';
// import D3_testes from './D3_testes';
import D3_stock_2 from './D3_stock_2';
// import D3_all_stocks from './D3_all_stocks';
// import StockScatter from './StockScatter';
// import StockScatterTimeEvolution from './StockScatterTimeEvolution';
import SMenu from '../Menu';
import SMenu2 from '../Menu2';
import SliderView from '../SliderView';

class D3_transient_stock extends Component {
    
    selected = "bitcoin";
    yselected = "market_cap";
    window = [];
    data=[];
    data_length = 0;
    timeparse = timeParse("%d/%m/%Y");

    constructor(props){
        super()
        this.props = props;        
    }
    componentDidMount(){
        json("http://127.0.0.1:8080/Curso_D3/6.10.0/data/coins.json").then((data)=>{
            this.data = data;                
            const inf = min(data[this.selected],(d)=>{return this.timeparse(d.date)});
            const sup = max(data[this.selected],(d)=>{return this.timeparse(d.date)});
            this.window = [inf,sup];
            console.log('->->',this.window)
            this.data_length = this.data[this.selected].length;
            console.log(this.data_length)
            this.chart = new D3_stock_2(
                this.refs.chart,
                this.yselected,
                this.data[this.selected],
                this.window);
        })
      // new D3_all_stocks(this.refs.chart);
      // new StockScatter(this.refs.chart);
      // new StockScatterTimeEvolution(this.refs.chart);
    }

    handleYSelected = (value) => { 
        this.yselected = value ;
        this.chart.changeSelection(this.data[this.selected],this.yselected,this.window);
    }
    handleSelected = (value) => { 
        this.selected = value ;
        this.chart.changeSelection(this.data[this.selected],this.yselected,this.window);
    }
    handleWindow = (value) => { 
        this.window = value ;
        this.chart.changeSelection(this.data[this.selected],this.yselected,this.window);
    }
    getDataLength = () => {return this.data_length}
    getWindow = () => {return this.window}
    render(){
      return (
        <div>
            <SMenu handleSelected={this.handleSelected}/>
            <SMenu2 handleYSelected={this.handleYSelected}/>
            <SliderView dataLengh={this.getDataLength} window={this.getWindow} handleWindow={this.handleWindow}/>
            <div ref="chart"></div>
        </div>
      )
    }
  };

export default D3_transient_stock;