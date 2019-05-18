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
      if (d[xText] == "Y") {
        d[xText] = 0
      } else if (d[xText] == "N") {
        d[xText] = 1
      } else {
        d[xText] = 2
      }
    });
    
    // Get all Data
    var xName = d3.nest()
    .key(function(d) { 
      return d[xText]; 
    })
    .rollup(function(v) { return v.length; })
    .entries(data);
    
    var yName = d3.nest()
    .key(function(d) { return d[yText]; })
    .rollup(function(v) { return v.length; })
    .entries(data);

    let test = (Object.values(xName[0]))

    // Get all of the unique bin buckets 
    let keys = []
    for (i=0; i<yName.length; i++) {
      keys.push(parseInt(yName[i].key))
    }

    // Get array of objects of all objects
    let allData = []
    for (j=0; j<xName.length; j++) {
      for (i=0; i<keys.length; i++) {
        let temp = (Object.values(xName[j]))
        let temp2 = (temp.filter((obj) => obj[yText] === keys[i]).length)
        var object = {outcome : Object.values(xName[j])[0],  bin:keys[i], count : temp2}
        allData.push(object)
      }
    }

    console.log(allData)
     //setup x 
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
        .attr("class", "xaxisText")      
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
        .attr("class", "yaxisText")        
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
        .attr("r", 5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("stroke", "red")    // set the line colour
        .style("fill", "none");    // set the fill colour 

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

        d3.csv("gun_violence_data.csv", function(error, data) {
          if (error) throw error;
      
          data.forEach(function(d) {
            d[yText] = +d[yText]
            if (d[xText] == "Y") {
              d[xText] = 0
            } else if (d[xText] == "N") {
              d[xText] = 1
            } else {
              d[xText] = 2
            }
          });
    
        var xName = d3.nest()
          .key(function(d) { return d[xText]; })
          .rollup(function(v) { return v.length; })
          .entries(data);
          console.log(xName)
          
        var yName = d3.nest()
          .key(function(d) { return d[yText]; })
          .rollup(function(v) { return v.length; })
          .entries(data);
          console.log(yName)
       
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
        
        // re-render axis based on the new data
        svg.selectAll(".xaxisText")
          .text(xText)
        svg.selectAll(".yaxisText")
          .text(yText)

        svg.selectAll(".x-axis")
          .transition()
          .duration(10)
          .call(xAxis)
          
        svg.selectAll(".y-axis")
          .transition()
          .duration(10)
          .call(yAxis)

        svg.selectAll("circle").remove()
           
        svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .transition().duration(750)
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("stroke", "red")    // set the line colour
          .style("fill", "none");    // set the fill colour 

      }
        )}
  
  });
}

drawGraph("Random Victims", "Wounded");
 
