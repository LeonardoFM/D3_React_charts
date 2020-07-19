import * as d3 from 'd3';

const MARGIN = {left:100, right:20, top:20, bottom:150};
const WIDTH = 600 - MARGIN.left - MARGIN.right;
const HEIGHT = 400 - MARGIN.top - MARGIN.bottom;
const t = d3.transition().duration(750);

export default class StockScatter {
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
            .text("The world's tallest buildings")

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
        this.x = d3.scaleBand()
            .range([0,WIDTH])
            .paddingInner(0.3)
            .paddingOuter(0.3)

        this.bottomAxis = d3.axisBottom(this.x);
        //
        this.y = d3.scaleLinear()        
            .range([HEIGHT,0])
        //
        this.leftAxis = d3.axisLeft(this.y);
        //
        this.xAxisGroup = this.g.append("g")
            .attr("class","x axis")
            .attr("transform",`translate(${0},${HEIGHT})`)            

        this.yAxisGroup = this.g.append("g")
            .attr("class","y axis")
            .call(this.leftAxis)

        d3.json("http://127.0.0.1:8081/revenues.json").then((data)=>{
            d3.interval(()=>{
                const newData = this.flag?data:data.slice(1)
                this.update(newData)
                this.flag =! this.flag;
            },1000)  
            this.update(data)
        })        
    }

    update(data){
        const value = this.flag?"revenue":"profit";
        this.x.domain(data.map((d)=>{return d.month}))
        this.y.domain([0,d3.max(data.map((d)=>{return +d[value]}))])
        
        this.xAxisGroup.transition(t).call(this.bottomAxis)
            .selectAll("text")
                .attr("y","10")
                .attr("x","-5")
                .attr("text-anchor","end")
                .attr("transform","rotate(-40)");

        this.yAxisGroup.transition(t).call(this.leftAxis)

        const circle = this.g.selectAll('circle').data(data,(d)=>{return d.month})

        circle.exit()
            .attr('fill','red')
        .transition(t)
            .attr("cy",this.y(0))
        //     .attr("height",0)
            .remove();

        // circle
        //     .attr('x',(d)=>{return this.x(d.month)})
        //     .attr('y',(d)=>{return this.y(d[value])})
        //     .attr('width',this.x.bandwidth)
        //     .attr('height',(d)=>{return HEIGHT - this.y(d[value])})
            // .attr('fill','red')
        circle
            .enter()
            .append('circle')
            .attr('cx',(d)=>{return this.x(d.month) + this.x.bandwidth()/2})
            .attr('cy',this.y(0))
            .attr('r',0)
            .attr('fill','gray')
            .merge(circle)
            .transition(t)
                .attr('cx',(d)=>{return this.x(d.month) + this.x.bandwidth()/2})
                .attr('cy',(d)=>{return this.y(d[value])})
                .attr('r',(d)=>{return (10)})

        this.yLabel.text(value);
    }
}
// const circle = svg.append('circle')
//     .attr('cx', 200)
//     .attr('cy', 200)
//     .attr('r', 20)
//     .attr('fill', 'gray')    

// const text = svg.append('text')
//     .attr('x',250)
//     .attr('y',200)
//     .text('círculo')
//     .attr('fill', 'orange') 
//     .attr('font-size',"20px")

// const rect = svg.append('rect')
//     .attr('x',250)
//     .attr('y',200)
//     .attr('width',40)
//     .attr('height',40);

// const line = svg.append('line')
//     .attr('x1',250)
//     .attr('y1',200)
//     .attr('x1',255)
//     .attr('y1',205)
//     .attr('stroke','blue')
//     .attr('stroke-width',5)