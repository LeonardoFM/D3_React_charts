import * as d3 from 'd3';

const MARGIN = {TOP:50, BOTTOM:180, LEFT:50, RIGHT:150};
const WIDTH = 1100 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3_testes {

    flag = false;    

    constructor(element){

        const svg = d3.select(element).append('svg')
            .attr("width",WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height",HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

        const g = svg.append('g')
            .attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`);

        // Time parser for x-scale
        const parseTime = d3.timeParse("%Y");
        
        // For tooltip
        const bisectDate = d3.bisector(function(d) { return d.year; }).left;

        // Scales
        const x = d3.scaleTime().range([0, WIDTH]);
        const y = d3.scaleLinear().range([HEIGHT, 0]);

        // Axis generators
        const xAxisCall = d3.axisBottom()
        const yAxisCall = d3.axisLeft()
            .ticks(6)
            .tickFormat((d) => { return parseInt(d / 1000) + "k"; });

        // Axis groups
        const xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + HEIGHT + ")");
        const yAxis = g.append("g")
            .attr("class", "y axis")
            
        // Y-Axis label
        yAxis.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Population");

        // Line path generator
        var line = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.value); });

        d3.json("http://127.0.0.1:8080/example.json").then((data) => {
            // Data cleaning
            data.forEach(function(d) {
                d.year = parseTime(d.year);
                d.value = +d.value;
            });

            // Set scale domains
            x.domain(d3.extent(data, function(d) { return d.year; }));
            y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, 
                d3.max(data, function(d) { return d.value; }) * 1.005]);

            // Generate axes once scales have been set
            xAxis.call(xAxisCall.scale(x))
            yAxis.call(yAxisCall.scale(y))

            // Add line to chart
            g.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "grey")
                .attr("stroke-with", "3px")
                .attr("d", line(data));

            /******************************** Tooltip Code ********************************/

            var focus = g.append("g")
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
                .attr("r", 7.5);

            focus.append("text")
                .attr("x", 15)
                .attr("dy", ".31em");

            g.append("rect")
                .attr("class", "overlay")
                .attr("width", WIDTH)
                .attr("height", HEIGHT)
                .attr('fill','transparent')
                // .attr('opacity','0.3')
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", 'none'); })
                .on("mousemove", mousemove);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
                focus.select("text").text(d.value);
                focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value));
                focus.select(".y-hover-line").attr("x2", -x(d.year));
            }
        //     d3.interval(()=>{
        //         this.update(data)
        //         this.flag =! this.flag;
        //     },1000)
        //     this.update(data)
        // })
        // .catch(e => { console.log(e) })  
        })
    }

    // update(data){
    //     console.log(data)
    // }
}