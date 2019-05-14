var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// Parse the date / time
// var parseDate = d3.time.format("%Y-%m").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg
  .axis()
  .scale(x)
  .orient("bottom")
  .ticks(10);

var yAxis = d3.svg
  .axis()
  .scale(y)
  .orient("left")
  .ticks(10);

var svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("gun_violence_data.csv", function(error, data) {
  // Aggregate Function
  data = d3
    .nest()
    .key(function(d) {
      // Summing by firearm type
      return d["Firearm Type"];
    })
    .rollup(function(leaves) {
      return d3.sum(leaves, function(d) {
        return 1;
      });
    })
    .entries(data)
    .map(function(d) {
      return { Type: d.key, Value: d.values };
    });

  x.domain(
    data.map(function(d) {
      return d.Type;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.Value;
    })
  ]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value ($)");

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) {
      return x(d.Type);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      console.log(d);
      return y(+d.Value);
    })
    .attr("height", function(d) {
      return height - y(+d.Value);
    });
});

// d3.csv("gun_violence_data.csv", function(error, stocks) {
//     //read in the data
//       if (error) return console.warn(error);
//          stocks.forEach(function(d) {
//              d.price = +d.price;
//              d.eValue = +d.eValue;
//              d.vol = +d.vol;
//              d.delta = +d.delta;
//       });
//     //dataset is the full dataset -- maintain a copy of this at all times
//       dataset = stocks;
//     //max of different variables for sliders
//       maxVol = d3.max(dataset.map(function(d) {return d.vol;}));
//       maxPrice = d3.max(dataset.map(function(d) {return d['price'];}));
//       maxeValue = d3.max(dataset.map(function(d) {return d['eValue'];}));

//       var type = [...new Set(dataset.map(function(d) { return d.type; }))];

//         var options = d3.select("#type").selectAll("option")
//                     .data(type)
//                     .enter().append("option")
//             .text(function(d) {return d;});

//       var select = d3.select("#type")
//         .on("change", function() {
//           filterType(this.value)
//         })

//     //all the data is now loaded, so draw the initial vis
//       drawVis(dataset, dataset);

// });
