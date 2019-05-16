// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function drawGraph(xText, yText) {
  // Get the data
  d3.csv("gun_violence_data.csv", function(error, data) {
    if (error) throw error;

   // change string (from CSV) into number format
	  data.forEach(function(d) {
      d[yText] = +d[yText]
      if (d[xText] == "N") {
        d[xText] = 0
      } else if (d[xText] == "Y"){
        d[xText] = 1
      } else if (d[xText] == "Unknown") {
        d[xText] = 2
      } else {
        d[xText] = 3
      }
    });

      // setup x 
      var xValue = function(d) { return d[xText];}, // data -> value
      xScale = d3.scaleLinear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.axisBottom().scale(xScale);

      // setup y
      var yValue = function(d) { return d[yText];}, // data -> value
      yScale = d3.scaleLinear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.axisLeft().scale(yScale);
        
      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
      yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

      // x-axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(xAxis)
      svg.append("text")   
        .attr("class", "text")          
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text(xText);

      // y-axis
      svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
      svg.append("text")
      .attr("class", "text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .style("text-anchor", "middle")
      .text(yText);
        
      // draw dots
      svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      .transition().duration(750)
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)

      var select = d3.select("#x-value")
					.on("change", function() {
            var newX = d3.select("#x-value").property("value");
            var newY = d3.select("#y-value").property("value");
						redraw(newX, newY);
      })

      var select = d3.select("#y-value")
					.on("change", function() {
            var newX = d3.select("#x-value").property("value");
            var newY = d3.select("#y-value").property("value");
						redraw(newX, newY);
      })

      function redraw(xText, yText) {
        data.forEach(function(d) {
          d[yText] = +d[yText];
          d[xText] = +d[xText]
          // if (d[xText] == "N") {
          //   d[xText] = 0
          // } else if (d[xText] == "Y"){
          //   d[xText] = 1
          // } else if (d[xText] == "Unknown") {
          //   d[xText] = 2
          // } else {
          //   d[xText] = 3
          // }
        });

        var x = d3.scalePoint()
          .domain(["N", "Y", "Unknown", "Officer Involved"])
          .range([0, width])
          // .domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
   

        // setup x 
        var xValue = function(d) { return d[xText];}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);
        console.log(xScale)
  
        // setup y
        var yValue = function(d) { return d[yText];}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);
          
        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
        
        // re-render axis based on the new data
        // svg.selectAll(".axis").remove()

				svg.selectAll(".x-axis")
          .transition()
          .duration(10)
          .call(xAxis)
          // .remove(text)
          
        svg.selectAll(".y-axis")
          .transition()
          .duration(10)
          .call(yAxis)
           
        svg.selectAll("circle")
        .data(data)
        .remove()
        
        svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .transition().duration(750)
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", xMap)
          .attr("cy", yMap)
      }
  });
}

drawGraph("Random Victims", "Wounded");
 
