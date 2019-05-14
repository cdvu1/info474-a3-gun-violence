// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// parse year
//var parseYear = d3.time.format("%Y").parse;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3
  .line()
  .x(function(d) {
    return x(d.Year);
  })
  .y(function(d) {
    return y(d.Total_Shootings);
  });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create Tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Get the data
d3.csv("clean_data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.Year = +d.Year;
    d.Total_Shootings = +d.Total_Shootings;
  });

  // Scale the range of the data
  x.domain(
    d3.extent(data, function(d) {
      return d.Year;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.Total_Shootings;
    })
  ]);

  // Add the valueline path.
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

  // Add the scatterplot
  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.Total_Shootings);
    })
    .on("mouseover", function(d) {
      div
        .transition()
        .duration(200)
        .style("opacity", 5);
      div
        .html(
          "<div><b>Year</b>: " +
            d.Year +
            "</div><br/>" +
            "<div><b>Total Shootings</b>: " +
            d.Total_Shootings +
            "</div>"
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 65 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Add the X Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g").call(d3.axisLeft(y));
});
