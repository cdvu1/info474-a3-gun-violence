// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// // set the ranges
// var x = d3.scaleTime().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);

// // define the line
// var valueline = d3.line()
// .x(function(d) { return x(d.Year); })
// .y(function(d) { return y(d.Total_Shootings); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

function drawGraph(xText, yText) {
  $('svg').remove();
  
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
  

  // add the graph canvas to the body of the webpage
  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("gun_violence_data.csv", function(error, data) {
    if (error) throw error;

   // change string (from CSV) into number format
	  data.forEach(function(d) {
      d[yText] = +d[yText];
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
    
      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
      yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

      // x-axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text(xText);

      
        
      // y-axis
      svg.append("g")
        .call(yAxis)
      svg.append("text")
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

    // // format the data
    // data.forEach(function(d) {
    //     d.Year = +d.Year;
    //     d.Total_Shootings = +d.Total_Shootings;
    // });

    // // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.Year; }));
    // y.domain([0, d3.max(data, function(d) { return d.Total_Shootings; })]);

    // // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline);

    // // Add the scatterplot
    // svg.selectAll("dot")	
    // .data(data)			
    // .enter().append("circle")								
    // .attr("r", 3)		
    // .attr("cx", function(d) { return x(d.Year); })		 
    // .attr("cy", function(d) { return y(d.Total_Shootings); })		
    // .on("mouseover", function(d) {		
    //     div.transition()		
    //         .duration(200)		
    //         .style("opacity", 5);		
    //     div.html("<div>Year:</div>" + d.Year + "<br/>" +
    //     "<div>Total Shootings:</div>" + d.Total_Shootings)
    //         .style("left", (d3.event.pageX) + "px")		
    //         .style("top", (d3.event.pageY - 28) + "px");	
    //     })					
    // .on("mouseout", function(d) {		
    //     div.transition()		
    //         .duration(500)		
    //         .style("opacity", 0);	
    // });

    // // Add the X Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));

    // // Add the Y Axis
    // svg.append("g")
    //     .call(d3.axisLeft(y));

  });
}

drawGraph("Random Victims", "Wounded");

//  Second Graph 
function setGraph() {
	drawGraph($('#x-value').val(), $('#y-value').val());
}

