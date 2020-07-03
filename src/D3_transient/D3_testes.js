import * as d3 from 'd3';

const MARGIN = {TOP:10, BOTTOM:40, LEFT:70, RIGHT:10};
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGTH = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3_testes {
    
    constructor(element){
        
        const svg = d3.select(element).append('svg')
            .attr('width',WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height',HEIGTH + MARGIN.TOP + MARGIN.BOTTOM)
            
        const circle = svg.append("circle")
            .attr('cx',125)
            .attr('cy',300)
            .attr('r',200)
            .attr('fill','blue')

        
    }
}