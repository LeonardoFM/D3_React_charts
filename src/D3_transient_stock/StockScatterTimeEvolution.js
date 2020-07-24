import * as d3 from 'd3';

import '../style.css'

const MARGIN = {left:100, right:20, top:20, bottom:150};
const WIDTH = 600 - MARGIN.left - MARGIN.right;
const HEIGHT = 400 - MARGIN.top - MARGIN.bottom;
// const t = d3.transition().duration(750);


export default class StockScatterTimeEvolution {

    constructor(element){

        this.flag = false;
        this.g = d3.select(element).append('svg')
        .attr('width',WIDTH + MARGIN.left + MARGIN.right)
        .attr('height',HEIGHT + MARGIN.top + MARGIN.bottom)
        .append('g')
            .attr('transform',`translate(${MARGIN.left},${MARGIN.top})`);
        //x label
        this.xLabel = this.g.append("text")
            .attr("class","x_axis_label")
            .attr("x", WIDTH/2)
            .attr("y",HEIGHT + 140)
            .attr("font-size","20px")
            .attr("text-anchor","middle")
            .text("GPD per capita ($)")

        //y label
        this.yLabel = this.g.append("text")
            .attr("class","y_axis_label")
            .attr("x", -(HEIGHT/2))
            .attr("y",-60)
            .attr("font-size","20px")
            .attr("text-anchor","middle")
            .attr("transform","rotate(-90)")
            .text("Height in m")
        //
        this.z = d3.scaleLinear()
            .range([5,25]);
        //
        this.x = d3.scaleLog()
            .domain([300,150000])
            .range([0,WIDTH])
            .base(10);            
    
        this.bottomAxis = d3.axisBottom(this.x);
        //
        this.y = d3.scaleLinear()
            .domain([0,90])
            .range([HEIGHT,0]);
        
        this.leftAxis = d3.axisLeft(this.y);
        //
        this.xAxisGroup = this.g.append("g")
            .attr("class","x axis")
            .attr("transform",`translate(${0},${HEIGHT})`)    
            .call(this.bottomAxis);

        this.yAxisGroup = this.g.append("g")
            .attr("class","y axis")
            .call(this.leftAxis);
        
        this.continents = ['europe','asia','africa','americas'];

        this.legend = this.g.append('g')
            .attr('transform',`translate(${WIDTH-10},${HEIGHT - 120})`)

        this.continents.forEach((continent,i) => {
            let legend_row = this.legend.append('g')
                .attr('transform',`translate(${0},${i*20})`);
            
            legend_row.append('rect')
                .attr('width',10)
                .attr('height',10)
                .attr('fill',this.continentFill(continent))
            
            legend_row.append('text')
                .attr('x',-10)
                .attr('y',10)
                .attr('text-anchor','end')
                .style('text-transform','capitalize')
                .text(continent)
        });

        d3.json("http://127.0.0.1:8080/data.json").then((data)=>{
            let time = 0;
            d3.interval(()=>{  
                if (time < data.length ){
                    this.update(data[time].countries, data[time].year);
                    time=time+1;    
                }                
            },100)  
            this.update(data[0].countries, data[0].year)
        })        
    }

    continentFill(continent){
        if(continent == "asia"){
            return '#038cfc';
        }
        else if(continent == "africa"){
            return '#fab366';
        }
        else if(continent == "americas"){
            return '#866099';
        }
        else if(continent == "europe"){
            return '#65b88d';
        }
    }

    update(data, year){

        this.z.domain([0,d3.max(data.map((d)=>{return d.population}))]);
        
        const circle = this.g.selectAll('circle').data(data);

        circle.exit().remove();

        circle
            .attr('cx',(d)=>{                 
                if (isNaN(this.x(d.income)) ){
                    return 1000000;
                }
                return this.x(d.income)
             })
            .attr('cy',(d)=>{
                if(d.life_exp === null){ return 100000}
                return this.y(d.life_exp)
            })
            .attr('r',(d)=>{ return this.z(d.population) })
            .attr('fill',(d)=>{ return this.continentFill(d.continent) })
                    
        circle
            .enter()
            .append('circle')
                .attr('cx',(d)=>{ 
                    if (isNaN(this.x(d.income))){
                        return 1000000;
                    }
                    console.log(this.x(d.income),d.income)
                    return this.x(d.income)
                })
                .attr('cy',(d)=>{ 
                    if(d.life_exp === null){ return 100000}
                    return this.y(d.life_exp)
                })

        this.yLabel.text("Life exp");
    }
}