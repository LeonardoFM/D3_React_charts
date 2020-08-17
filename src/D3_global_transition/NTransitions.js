import * as d3 from 'd3';

const margin = {top:50, right:50, bottom:0, left:50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

export default class NTransition{

    constructor(element){
        var geojson = {}

        this.svg = d3.select(element)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);  

        var context = this.svg
            .node()
            // .getContext('2d');

        var projection = d3.geoOrthographic()
            .scale(500)
            .rotate([30, -45]);

        var geoGenerator = d3.geoPath()
            .projection(projection)
            .pointRadius(4)
            .context(context);

        var londonLonLat = [0.1278, 51.5074];
        var newYorkLonLat = [-74.0059, 40.7128];
        var geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);
        var u = 0;

        function update() {
            context.clearRect(0, 0, 800, 600);

            context.lineWidth = 0.5;
            context.strokeStyle = '#333';

            context.beginPath();
            geoGenerator({type: 'FeatureCollection', features: geojson.features})
            context.stroke();

            // Graticule
            var graticule = d3.geoGraticule();
            context.beginPath();
            context.strokeStyle = '#ccc';
            geoGenerator(graticule());
            context.stroke();

            // London - New York
            context.beginPath();
            context.strokeStyle = 'red';
            geoGenerator({type: 'Feature', geometry: {type: 'LineString', coordinates: [londonLonLat, newYorkLonLat]}});
            context.stroke();

            // Point
            context.beginPath();
            context.fillStyle = 'red';
            geoGenerator({type: 'Feature', geometry: {type: 'Point', coordinates: geoInterpolator(u)}});
            context.fill();

            u += 0.01
            if(u > 1) u = 0
        }
        // REQUEST DATA
        d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json', function(err, json) {
            geojson = json;
            window.setInterval(update, 50);
            // update(json);
        })

    }

}