import * as d3 from 'd3';

const MARGIN = {TOP:50, BOTTOM:180, LEFT:150, RIGHT:150};
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3_stock_2 {

    flag = false;    

    constructor(element,selection,value){
        this.selection = selection;
        this.element = element;
        this.value = value;
        
        this.svg = d3.select(this.element).append('svg')
        .attr("width",WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height",HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

        this.g = this.svg.append('g')
            .attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`);

        // Time parser for x-scale
        this.parseTime = d3.timeParse("%d/%m/%Y");
        this.formatTime = d3.timeFormat("%d/%m/%Y");
        
        // For tooltip
        this.bisectDate = d3.bisector(function(d) { return d.date; }).left;

        // Scales
        this.x = d3.scaleTime().range([0, WIDTH]);
        this.y = d3.scaleLinear().range([HEIGHT, 0]);

        // Axis generators
        this.xAxisCall = d3.axisBottom(this.x)
        this.yAxisCall = d3.axisLeft(this.y)
            .ticks(6)
            .tickFormat((d) => { return parseInt(d / 1000) + "k"; });

        // Axis groups
        this.xAxis = this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + HEIGHT + ")");
        this.yAxis = this.g.append("g")
            .attr("class", "y axis")
            
        // Y-Axis label
        this.yAxis.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Population");

        d3.json("http://127.0.0.1:8080/coins.json").then((data)=>{
            // d3.interval(()=>{
                this.data = data;                
                this.update()
            // },1)
        })
    }

    changeSelection(selection){
        this.selection = selection;
        this.update()
    }

    update(){
        const vis = this;
        const data_ = vis.data[vis.selection];
        console.log(this.selection,this.value)
        console.log(data_)
        const key = vis.value;
        // Data cleaning
        data_.forEach( (d) => {
            d.date = vis.parseTime(d.date);
            d[key] = +d[key];
        });
        
        // Line path generator
        const line = d3.line()
            .x( (d) => { return vis.x(d.date); })
            .y( (d) => { return vis.y(d[key]); });
        
        // Set scale domains
        vis.x.domain([d3.min(data_, (d) => { return d.date; }),
                  d3.max(data_, (d) => { return d.date; })]);

        vis.y.domain([d3.min(data_, (d) => { return d[key]; }) / 1.005, 
                  d3.max(data_, (d) => { return d[key]; }) * 1.005]);

        // Generate axes once scales have been set
        vis.xAxis.call(vis.xAxisCall)
        vis.yAxis.call(vis.yAxisCall)
        
        // Add line to chart        
        const line_chart = vis.g.selectAll('line').data(data_.map(d=>{return d[key]}));
        
        line_chart.exit().remove()
                
        line_chart
            .enter()
            .append("path")
            .attr("class", "line_enter")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-with", "3px")
            .attr("d", line(data_))
            .merge(line_chart);

        /******************************** Tooltip Code ********************************/

        const focus = vis.g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", HEIGHT);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0)
            .attr("x2", WIDTH);

        focus.append("circle")
            .attr("r", 3.5);

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");

        vis.g.append("rect")
            .attr("class", "overlay")
            .attr("width", WIDTH)
            .attr("height", HEIGHT)
            .attr('fill','transparent')
            // .attr('opacity','0.3')
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", 'none'); })
            .on("mousemove", mousemove);

        function mousemove() {
            let x0 = vis.x.invert(d3.mouse(this)[0]),
                i = vis.bisectDate(data_, x0, 1),
                d0 = data_[i - 1],
                d1 = data_[i],                    
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + vis.x(d.date) + "," + vis.y(d.value) + ")");
            focus.select("text").text(`${d.value} ${vis.formatTime(d.date)}`);
            focus.select(".x-hover-line").attr("y2", HEIGHT - vis.y(d.value));
            focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
        }
    }
}