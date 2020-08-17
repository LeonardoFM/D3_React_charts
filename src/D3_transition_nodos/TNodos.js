import * as d3 from 'd3';

const margin = {top:50, right:50, bottom:0, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


export default class TNodos{
 
    constructor(element){
 
        this.data = [];
        this.numCircles = 20;
        this.maxRadius = 50;

        this.svg = d3.select(element)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);  
        
        this.update();
    }
    
    update() {
        
        function rnd(x) {return Math.floor(Math.random() * x);}

        const randomise = () => {
            const data = [];
            const numCircles = 10;
            for(var i=0; i<numCircles; i++) {
                data.push({
                    x: rnd(width) + 70,
                    y: rnd(height) + 70,
                    r: rnd(this.maxRadius) + 20,
                    fill: d3.rgb(rnd(255), rnd(255), rnd(255))
                });
            }
            return data;
        }

        this.data = randomise();

        var u = this.svg
            .selectAll('circle')
            .data(this.data);

        // Enter
        u.enter()
            .append('circle')
            .attr('r', 0)
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .style('fill', 'white')
            .merge(u)
        .transition()
            .duration(1500)
            .attr('cx', (d) => {return d.x;})
            .attr('cy', (d) => {return d.y;})
            .attr('r', (d) => {return d.r;})
            .style('fill', (d) => {return d.fill;});

        // Exit
        u.exit()
            .transition()
            .duration(1500)
            .attr('r', 0)
        .style('opacity', 0)
            .each('end', () => {d3.select(this).remove();});
    }
}