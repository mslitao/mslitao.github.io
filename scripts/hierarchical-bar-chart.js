function drawchart_bar(chart_id ){
    var width = 960;
    var height = 500;
    margin = ({top: 30, right: 40, bottom: 30, left: 50})

    var svg = d3.select(chart_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("data.json", function(data) {
      data.sort(function(a, b) { return a.value - b.value; });
            
      x.domain([0, d3.max(data, function(d) { return d.value; })]);
      y.domain(data.map(function(d) { return d.area; })).padding(0.1);

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-height]));
          
      g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
          
      var bars = g.selectAll(".bar")
        .data(data)
        .enter()
        ;
      
      bars.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.area); })
        .attr("width", function(d) { return x(d.value); })
        .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.area) + "<br>" + "£" + (d.value));
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

        bars.append("text")
          .attr("class", "label")
          //y position of the label is halfway down the bar
          .attr("y", function (d) {
              return y(d.area) + y.bandwidth()/2;
          })
          //x position is 3 pixels to the right of the bar
          .attr("x", function (d) {
            if(x(d.value) >=width ){
             return x(d.value) - 20;
            }
            else
              return x(d.value) -10;
          })
          .style("text-anchor", "end")
          .text(function (d) {
              return d.value/1000 + "K";
          });

      });

}