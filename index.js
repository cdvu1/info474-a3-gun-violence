d3.csv("gun_violence_data.csv", function(error, stocks) {
    //read in the data
      if (error) return console.warn(error);
         stocks.forEach(function(d) {
             d.price = +d.price;
             d.eValue = +d.eValue;
             d.vol = +d.vol;
             d.delta = +d.delta;
      });
    //dataset is the full dataset -- maintain a copy of this at all times
      dataset = stocks;
    //max of different variables for sliders
      maxVol = d3.max(dataset.map(function(d) {return d.vol;}));
      maxPrice = d3.max(dataset.map(function(d) {return d['price'];}));
      maxeValue = d3.max(dataset.map(function(d) {return d['eValue'];}));
    
      var type = [...new Set(dataset.map(function(d) { return d.type; }))];
    
        var options = d3.select("#type").selectAll("option")
                    .data(type)
                    .enter().append("option")
            .text(function(d) {return d;});
    
      var select = d3.select("#type")
        .on("change", function() {
          filterType(this.value)
        })
              
    
    //all the data is now loaded, so draw the initial vis
      drawVis(dataset, dataset);
    
    
    
});