// const d3 = require('d3');

window.onload = function() {

    function preproc_data(dataset) {
        // let attrs = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'];
        let attrs = dataset.columns;

        let d1 = dataset[0];
        let scales = {};
        for (const attr of attrs) {
            if (isNaN(+d1[attr])) {
                // scales[attr] = d3.scalePoint().domain(d3.map(dataset, function(d){return d[attr];}).keys()).range([480, 20]);
                scales[attr] = d3.scalePoint().domain(d3.map(dataset, function(d){return d[attr];}).keys()).range([480, 20]);
            } else {
                // scales[attr] = d3.scaleLinear().domain([0,d3.max(dataset[attr])]).range([480, 20]);
                scales[attr] = d3.scaleLinear().domain(d3.extent(dataset, (d) => {return d[attr];})).range([480, 20]);
            }
        }

        let scaleX = d3.scalePoint().domain(attrs).range([30, 580]);

        function drawLine(d) {
            let str = 'M ';
            for (const attr of attrs) {
                str += scaleX(attr) + ' ' + scales[attr](d[attr]) + ' L ';
            }
            return str.slice(0, -3);
        }
        
        function handleMouseOver(d) {
            d3.select(this)
                .style('stroke', 'orange')
                .style('stroke-width', '3');
            
        }

        function handleMouseOut(d) {
            d3.select(this)
                .style('stroke', 'lightsteelblue')
                .style('stroke-width', '1');
        }

        let paths = d3.select('#mysvg').selectAll('path.dataPath')
            .data(dataset)
            .enter()
            .append('path')
            .attr('class', 'dataPath')
            .attr('d', drawLine)
            .attr('pointer-events', 'visibleStroke');

        paths
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
        
        // d3.axisLeft(scales.sepal_width)
        // console.log(scales['sepal_width']);
        // console.log(scaleX);
        // d3.select('#mysvg').selectAll('g')
        //     .data(attrs).enter()
        //     .append('g')
        //     // .call()
        //     // .attr('class', 'axisGroup')
        //     .attr('transform', function(d){
        //         console.log(scales[d]);
        //         return 'translate('+scaleX(d)+',20)';
        //     })
        //     .call(scales[d]);

        d3.select('#mysvg').append('g')
            .call(d3.axisBottom(scaleX))
            .attr("transform", "translate(0,483)");

        d3.select('#mysvg').append('g')
            .call(d3.axisRight(scales.species))
            .attr('transform', function(){
                return 'translate(' + (scaleX('species') + 3) + ',0)';
            });

        // d3.select('#mysvg').append('g')
        //     .data(attrs).enter()
        //     .call(d3.axisLeft(scales[d]))
        //     // .append("text")
        //     // .attr("transform", "rotate(-90)")
        //     .attr('transform', function(d){
        //         console.log(d);
        //         return 'translate('+scaleX(d)+',20)';
        //     })
        //     // .attr("y", 0 - /margin.left)
        //     // .attr("x",0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Value");
    }

    function render(data){
        d3.select('body')
            .append('pre')
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

    d3.csv('iris.csv', type)
        .then(preproc_data);
};