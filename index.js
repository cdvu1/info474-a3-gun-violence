// set the dimensions and margins of the graph
var margin = { top: 40, right: 100, bottom: 50, left: 100 },
  width = 1020 - margin.left - margin.right,
  height = 531.25 - margin.top - margin.bottom;

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

d3.csv("gun_violence_data.csv", function(error, data) {
  var ag_data = agregateData(data);
  // Scale the range of the data

  // draw the initial visualization
  drawVis_1(ag_data);

  // Adding the dropdown
  var select = d3.select("#weapon-type");

  select.on("change", function(d) {
    var value = d3.select(this).property("value");
    filterType(value, data);
  });

  select
    .append("option")
    .attr("value", "All")
    .text("All");

  select
    .selectAll("option")
    .data(
      d3
        .map(data, function(d) {
          return d["Firearm Type"];
        })
        .keys()
    )
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d;
    })
    .text(function(d) {
      return d;
    });
});

agregateData = data => {
  data = data.filter(function(d) {
    return +d.Date.split("/")[2] >= 2008;
  });
  data = data.filter(function(d) {
    return +d.Date.split("/")[2] <= 2018;
  });
  data = d3
    .nest()
    .key(function(d) {
      // Summing by firearm type
      return d.Date.split("/")[2];
    })
    .rollup(function(leaves) {
      return leaves.length;
    })
    .entries(data)
    .map(function(d) {
      return { Year: d.key, Total_Shootings: d.value };
    });
  return data;
};

filterType = (value, data) => {
  if (value == "All") {
    data = data.filter(function(d) {
      return d["Firearm Type"] != "";
    });
  } else {
    data = data.filter(function(d) {
      return d["Firearm Type"] == value;
    });
  }
  var ag_data = agregateData(data);

  // UPDATE THE VISUALIZATION
  y.domain([
    0,
    d3.max(ag_data, function(d) {
      return d.Total_Shootings;
    })
  ]);

  // Make the changes
  svg
    .select(".line")
    .transition() // change the line
    .duration(750)
    .attr("d", valueline(ag_data));

  svg
    .select(".y.axis")
    .transition() // change the y axis
    .duration(750)
    .call(d3.axisLeft(y).ticks(4));

  svg
    .selectAll("circle")
    .data(ag_data)
    .transition()
    .duration(750)
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.Total_Shootings);
    });

  //Enter new circles
  d3.selectAll("circle")
    .data(ag_data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.Total_Shootings);
    })
    .attr("r", 3);

  // Remove old
  d3.selectAll("circle")
    .data(ag_data)
    .exit()
    .remove();
};

drawVis_1 = data => {
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
    .attr("class", "x axis")
    .call(
      d3.axisBottom(x).tickFormat(function(n) {
        return n * 1;
      })
    );

  // X Axis Label
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 0) + ")"
    )
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Year");
  // Add the Y Axis
  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y).ticks(4));

  // Y Axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left / 2)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Number of Shootings");
};
