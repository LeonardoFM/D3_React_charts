import * as d3 from 'd3';

const MARGIN = {TOP:50, BOTTOM:180, LEFT:150, RIGHT:150};
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3_stock_2 {

    flag = true;    
    data_ = [];
    
    constructor(element,selection,data, window){
        this.element = element;

        this.svg = d3.select(this.element).append('svg')
        .attr("width",WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height",HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);
        
        this.g = this.svg.append('g')
            .attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`);

        // Time parser for x-scale
        this.parseTime = d3.timeParse("%d/%m/%Y");
        this.formatTime = d3.timeFormat("%d/%m/%Y");
        
        // For tooltip
        this.bisectDate = d3.bisector((d)=>{ return d.date; }).left;

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

        // Line path generator
        this.line = d3.line()
            .x( (d) => { return this.x(d.date); })
            .y( (d) => { return this.y(d.value); });
        
        // Add line to chart        
        this.line_chart = this.g.selectAll('line').data([null]);
        this.line_chart_enter_path = this.line_chart.enter().append('path');
        
        this.update(data,selection, window)
    }

    changeSelection(data,selected, window){this.update(data,selected, window)}

    update(data_,selection, window){
        const vis = this;
        // const key = "market_cap";        
        // const key = "price_usd";
        // const key = "24h_vol"
        const key = selection;

        // Data cleaning and update
        vis.data_ = []
        data_.forEach( (d) => {
            vis.data_.push({
                date : vis.parseTime(d.date),
                value: +d[key]
            })
        });
        // Set scale domains
        console.log(window)
        vis.x.domain(window);
        vis.y.domain([d3.min(vis.data_,(d)=>{return d.value}) / 1.005, 
                    d3.max(vis.data_,(d)=>{return d.value}) * 1.005]);

        // Generate axes once scales have been set
        vis.xAxis.call(vis.xAxisCall)
        vis.yAxis.call(vis.yAxisCall)
        
        vis.line_chart.exit().remove()
        
        this.line_chart_enter_path
            .attr("class", "line_enter")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-with", 1.5)
            .attr("d", vis.line(vis.data_))
            .merge(vis.line_chart);

    //     /******************************** Tooltip Code ********************************/

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
            
            const x0 = vis.x.invert(d3.mouse(this)[0]);
            const i = vis.bisectDate(vis.data_, x0, 1);
            
            const d0 = vis.data_[i-1];
            const d1 = vis.data_[i];
            const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus.attr("transform", "translate(" + vis.x(d.date) + "," + vis.y(d.value) + ")");
            focus.select("text").text(`${d.value} ${vis.formatTime(d.date)}`);
            focus.select(".x-hover-line").attr("y2", HEIGHT - vis.y(d.value));
            focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
        }
    }
}