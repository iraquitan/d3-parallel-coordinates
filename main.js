// const d3 = require('d3');

window.onload = function() {

    function preproc_data(dataset) {
        let attrs = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'];

        let scales = {};
        for (const attr of attrs) {
            if (isNaN(+d[attr])) {
                scales[attr] = d3.scalePoint().domain(d3.map(dataset, function(d){return d.species;}).keys()).range([480, 20])
            } else {
                scales[attr] = d3.scaleLinear().domain([0,d3.max(dataset)]).range([480, 20])
            }
        }

        function scaleX() {
            return d3.scaleOrdinal().domain(attrs).range([20, 580]);
        }

        function drawLine(d, i) {
            let str = "M "
            for (const attr of attrs) {
                str += scaleX(attr) + " " + scales[attr](d[attr]) + " L ";
            }
            return str.slice(0, -3);
        }

        d3.select('mysvg').selectAll("path")
        .data(dataset).enter()
        .append('path')
        .attr('d', drawLine(d, i))
        .style('fill', 'none')
        .style('stroke', 'lightblue')
    }

    function render(data){
        d3.select("body")
          .append("pre")
          .text(JSON.stringify(data, null, 2));
    }

    function type(d){
        d.sepal_length = +d.sepal_length;
        d.sepal_width  = +d.sepal_width;
        d.petal_length = +d.petal_length;
        d.petal_width  = +d.petal_width;
        d.species = d.species;
        return d;
    }

    d3.csv("iris.csv", type).then(
        
        preproc_data(dataset)
    );
};