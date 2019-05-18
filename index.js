// set the dimensions and margins of the graph
var margin_2 = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 1000 - margin_2.left - margin_2.right,
  height = 500 - margin_2.top - margin_2.bottom;

var svg_2 = d3
  .select("#graph-d")
  .append("svg")
  .attr("width", width + margin_2.left + margin_2.right)
  .attr("height", height + margin_2.top + margin_2.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_2.left + "," + margin_2.top + ")");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var margin = { top: 40, right: 100, bottom: 50, left: 100 },
  width = 1020 - margin.left - margin.right,
  height = 531.25 - margin.top - margin.bottom;

function drawGraph(xText, yText) {
  // Get the data
  d3.csv("gun_violence_data.csv", function(error, data) {
    if (error) throw error;

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d[yText] = +d[yText];
      if (d[xText] == "Y") {
        d[xText] = 0;
      } else if (d[xText] == "N") {
        d[xText] = 1;
      } else {
        d[xText] = 2;
      }
    });

    // Get all Data
    var xName = d3
      .nest()
      .key(function(d) {
        return d[xText];
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(data);

    var yName = d3
      .nest()
      .key(function(d) {
        return d[yText];
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(data);

    let test = Object.values(xName[0]);

    // Get all of the unique bin buckets
    let keys = [];
    for (i = 0; i < yName.length; i++) {
      keys.push(parseInt(yName[i].key));
    }

    // Get array of objects of all objects
    let allData = [];
    for (j = 0; j < xName.length; j++) {
      for (i = 0; i < keys.length; i++) {
        let temp = Object.values(xName[j]);
        let temp2 = temp.filter(obj => obj[yText] === keys[i]).length;
        var object = {
          outcome: Object.values(xName[j])[0],
          bin: keys[i],
          count: temp2
        };
        allData.push(object);
      }
    }

    console.log(allData);
    //setup x
    var xValue = function(d) {
        return d[xText];
      }, // data -> value
      xScale = d3.scaleLinear().range([0, width]), // value -> display
      xMap = function(d) {
        return xScale(xValue(d));
      }, // data -> display
      xAxis = d3.axisBottom().scale(xScale);

    // setup y
    var yValue = function(d) {
        return d[yText];
      }, // data -> value
      yScale = d3.scaleLinear().range([height, 0]), // value -> display
      yMap = function(d) {
        return yScale(yValue(d));
      }, // data -> display
      yAxis = d3.axisLeft().scale(yScale);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    // x-axis
    svg_2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x-axis")
      .call(xAxis);
    svg_2
      .append("text")
      .attr("class", "xaxisText")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin_2.top + 10) + ")"
      )
      .style("text-anchor", "middle")
      .text(xText);

    // y-axis
    svg_2
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis);
    svg_2
      .append("text")
      .attr("class", "yaxisText")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_2.left + 20)
      .attr("x", 0 - height / 2)
      .style("text-anchor", "middle")
      .text(yText);

    // draw dots
    svg_2
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .transition()
      .duration(750)
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("stroke", "red") // set the line colour
      .style("fill", "none"); // set the fill colour

    var select = d3.select("#x-value").on("change", function() {
      var newX = d3.select("#x-value").property("value");
      var newY = d3.select("#y-value").property("value");
      redraw(newX, newY);
    });

    var select = d3.select("#y-value").on("change", function() {
      var newX = d3.select("#x-value").property("value");
      var newY = d3.select("#y-value").property("value");
      redraw(newX, newY);
    });

    function redraw(xText, yText) {
      d3.csv("gun_violence_data.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
          d[yText] = +d[yText];
          if (d[xText] == "Y") {
            d[xText] = 0;
          } else if (d[xText] == "N") {
            d[xText] = 1;
          } else {
            d[xText] = 2;
          }
        });

        var xName = d3
          .nest()
          .key(function(d) {
            return d[xText];
          })
          .rollup(function(v) {
            return v.length;
          })
          .entries(data);
        console.log(xName);

        var yName = d3
          .nest()
          .key(function(d) {
            return d[yText];
          })
          .rollup(function(v) {
            return v.length;
          })
          .entries(data);
        console.log(yName);

        // setup x
        var xValue = function(d) {
            return d[xText];
          }, // data -> value
          xScale = d3.scaleLinear().range([0, width]), // value -> display
          xMap = function(d) {
            return xScale(xValue(d));
          }, // data -> display
          xAxis = d3.axisBottom().scale(xScale);

        // setup y
        var yValue = function(d) {
            return d[yText];
          }, // data -> value
          yScale = d3.scaleLinear().range([height, 0]), // value -> display
          yMap = function(d) {
            return yScale(yValue(d));
          }, // data -> display
          yAxis = d3.axisLeft().scale(yScale);

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
        yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

        // re-render axis based on the new data
        svg_2.selectAll(".xaxisText").text(xText);
        svg_2.selectAll(".yaxisText").text(yText);

        svg_2
          .selectAll(".x-axis")
          .transition()
          .duration(10)
          .call(xAxis);

        svg_2
          .selectAll(".y-axis")
          .transition()
          .duration(10)
          .call(yAxis);

        svg_2.selectAll("circle").remove();

        svg_2
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .transition()
          .duration(750)
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("stroke", "red") // set the line colour
          .style("fill", "none"); // set the fill colour
      });
    }
  });
}

drawGraph("Random Victims", "Wounded");

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
