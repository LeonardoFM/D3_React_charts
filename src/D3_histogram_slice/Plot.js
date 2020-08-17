import * as d3 from 'd3';

import './style.css';

const margin = {top:50, right:50, bottom:0, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

let timer = 0;

export default class Plot{
    
    dataset;

    constructor(element){

        this.formatDateIntoYear = d3.timeFormat("%Y");
        this.formatDate = d3.timeFormat("%b %Y");
        this.parseDate = d3.timeParse("%m/%d/%y");

        this.startDate = new Date("2004-11-01");
        this.endDate = new Date("2017-04-01");
        
        this.svg = d3.select(element)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);  

        ////////// slider //////////

        this.moving = false;
        this.currentValue = 0;
        this.targetValue = width;

        this.playButton = d3.select("#play-button");
            
        this.x = d3.scaleTime()
            .domain([this.startDate, this.endDate])
            .range([0, this.targetValue])
            .clamp(true);

        this.slider = this.svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

        this.slider.append("line")
            .attr("class", "track")
            .attr("x1", this.x.range()[0])
            .attr("x2", this.x.range()[1])
        .select(() => { 
            const sis = this.slider._groups[0][0].childNodes[0];
            return sis.parentNode.appendChild(sis.cloneNode(true)); })
            .attr("class", "track-inset")
        .select(() => { 
            const sis = this.slider._groups[0][0].childNodes[0];
            return sis.parentNode.appendChild(sis.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", () => { this.slider.interrupt(); })
                .on("start drag", () => {
                    this.currentValue = d3.event.x;
                    this.update(this.x.invert(this.currentValue)); 
                })
            );

        this.slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
            .data(this.x.ticks(10))
            .enter()
            .append("text")
            .attr("x", this.x)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .text((d) => { return this.formatDateIntoYear(d); });

        this.handle = this.slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        this.label = this.slider.append("text")  
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .text(this.formatDate(this.startDate))
            .attr("transform", "translate(0," + (-25) + ")")

        
        ////////// plot //////////

        this.plot = this.svg.append("g")
            .attr("class", "plot")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("http://127.0.0.1:8080/Curso_D3/circles.csv").then((data) => {
            data.forEach((d)=>{
                d.id = d.id;
                d.date = this.parseDate(d.date);
            })
            this.dataset = data;
            this.drawPlot(data);

            const step = () => {
                this.update(this.x.invert(this.currentValue));
                this.currentValue = this.currentValue + (this.targetValue/151);
                if (this.currentValue > this.targetValue) {
                    this.moving = false;
                    this.currentValue = 0;
                    clearInterval(timer);
                    // timer = 0;
                    this.playButton.text("Play");
                    console.log("Slider moving: " + this.moving);
                }
            }

            this.playButton
                .on("click", () => {
                    const button = d3.select(this.playButton._groups[0][0]);
                    if (button.text() === "Pause") {
                        this.moving = false;
                        clearInterval(timer);
                        // timer = 0;
                        button.text("Play");
                    } else {
                        this.moving = true;
                        timer = setInterval(step, 100);
                        button.text("Pause");
                    }
                    console.log("Slider moving: " + this.moving);
                })
        })        
    }
    

    drawPlot(data) {
        
        this.locations = this.plot.selectAll(".location")
            .data(data);
        
        // if filtered dataset has more circles than already existing, transition new ones in
        this.locations.enter()
            .append("circle")
            .attr("class", "location")
            .attr("cx", (d) => { return this.x(d.date); })
            .attr("cy", height/2)
            .style("fill", (d) => { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
            .style("stroke", (d) => { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
            .style("opacity", 0.5)
            .attr("r", 8)
            .transition()
            .duration(400)
            .attr("r", 25)
                .transition()
                .attr("r", 8);

        // if filtered dataset has less circles than already existing, remove excess
        this.locations.exit()
            .remove();
    }

    update(h) {        
        // update position and text of label according to slider scale
        this.handle.attr("cx", this.x(h));
        this.label
            .attr("x", this.x(h))
            .text(this.formatDate(h));
 
        // filter data set and redraw plot
        const dataset = this.dataset.filter((d) => {
            return d.date < h;
        })
        this.drawPlot(dataset);
        this.datase = dataset;
    }

}