import * as d3 from 'd3';

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
        // colot scale
        this.fill = d3.scaleOrdinal()
            .range(['red','orange','yellow','blue']);
        //
        this.z = d3.scaleLinear()
            .range([5,25]);
        //
        this.x = d3.scaleLog()
            .range([0,WIDTH])
            .base(10);
        
        this.bottomAxis = d3.axisBottom(this.x);
        //
        this.y = d3.scaleLinear()
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

        d3.json("http://127.0.0.1:8080/data.json").then((data)=>{
            let time = 0;
            d3.interval(()=>{                
                this.update(data[time].countries, data[time].year);
                time=time+1;
            },10)  
            this.update(data[0].countries, data[0].year)
        })        
    }

    update(data, year){

        this.z.domain([0,d3.max(data.map((d)=>{return d.population}))]);
        this.x.domain([300,150000]);
        this.y.domain([0,90]);
        this.fill.domain(['europe','asia','africa','americas']);

        const circle = this.g.selectAll('circle').data(data);

        circle.exit()
        //     .attr('fill','red')
        // .transition(t)
        //     .attr("cy",this.y(0))
        // //     .attr("height",0)
            .remove();

        circle
            .attr('cx',(d)=>{ return this.x(d.income) })
            .attr('cy',(d)=>{ return this.y(d.life_exp) })
            .attr('r',(d)=>{ return this.z(d.population) })
        
        circle
            .enter()
            .append('circle')
                .attr('cx',(d)=>{ return this.x(d.income) })
                .attr('cy',(d)=>{ return this.y(d.life_exp) })
                .attr('r',(d)=>{ return this.z(d.population) })
                .attr('fill',(d)=>{ return this.fill(d.continent) })
                // .merge(circle)
            // .transition(t)
            //     .attr('cx',(d)=>{return this.x(d.month) + this.x.bandwidth()/2})
            //     .attr('cy',(d)=>{return this.y(d[value])})
            //     .attr('r',(d)=>{return (10)})

        this.yLabel.text("Life exp");
    }
}