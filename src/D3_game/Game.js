import * as d3 from 'd3';

const margin = {top:50, right:50, bottom:0, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

class Game{

    constructor(element){
        
        this.obstacles = [];

        this.node = [{
            x:100,
            y:100,
            r:10,
            color:'black',
            circle: null
        },
        {
            x:30,
            y:400,
            r:13,
            color:'red',
            circle: null
        }]

        this.svg = d3.select(element)
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("background","lightgray");         
        
        this.g = this.svg.append('g');

        this.viewNode();
        this.loop();
    }

    obstacleDraw(){
        this.obstacles.push({
            x:10,
            y:50,
            width:5,
            reight:10
        })
    }

    viewNode(){
        // condições iniciais 
        this.node.forEach((d) => {
            d.circle = this.g
                .append('circle')
                    .attr('cx',d.x)
                    .attr('cy',d.y)
                    .attr('r',d.r)
                    .attr('fiil',d.color)
        })
        
    }
    
    drawGroup(d){
        const circ = d.circle
        circ.exit().remove()
        circ
            .attr('cx',d.x)
            .attr('cy',d.y)
            .attr('r',d.r)
            .attr('fiil',d.color)            
    }

    move_x(d){
        d.x = d.x*(1.2);
    }

    move_y(d){
        d.y = d.y*(1.01);
    }

    loop(){

        d3.interval((i) => {
            
            
            this.node.forEach((d) => {
                this.move_x(d);
                this.move_y(d);
                this.drawGroup(d);
            })            
        },2500)
    }
}

export default Game;