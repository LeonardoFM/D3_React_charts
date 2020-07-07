import * as d3 from 'd3';
const MARGIN = {TOP:50, BOTTOM:180, LEFT:50, RIGHT:150};
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGTH = 600 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3_testes {
    flag = false;    
    
    constructor(element){

        d3.json("data/data.json").then(function(data){
            console.log(data);
        })        

        const svg = d3.select(element).append('svg')
            .attr('width',WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height',HEIGTH + MARGIN.TOP + MARGIN.BOTTOM);

   }
}