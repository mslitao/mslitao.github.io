function drawchart_hierarchical_bar(chart_id ){
    var level = 0
    var margin = {top: 30, right: 50, bottom: 20, left: 250},
    width = 1100 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
    var x = d3.scaleLinear().range([0, width]);
    var barHeight = 25;
    var color = d3.scaleOrdinal().range(["#008000", "#6495ED"]);
    var duration = 750,
    delay = 25;
    var partition = d3.partition();
    var xAxis = d3.axisTop()
    .scale(x);

    indicatorInfo = ["Country Ranking with the most Companies", "Sector Ranking with the most Companies", "Company Ranking by Revenue"];
    var tooltipInfo = d3.select(chart_id).append("div").attr("class", "toolTip").attr("id", "toolTipInfo");
    tooltipInfo.style("right",  "10px").style("bottom", "10px")
    breakbyCountry = ""
    breakBySector = ""

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var svg = d3.select(chart_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", up)
        ;

    svg.append("g")
        .attr("class", "x axis");
    svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("y1", "100%");
    d3.json("Fortune-Global-2019.json", function(error, root) {
        if (error) throw error;
        console.log(root)
        root = d3.hierarchy(root)
                .sort((a,b) => b.data.value - a.data.value);
        partition(root);
        console.log(root)
        x.domain([0, 150]).nice();
        down(root, 0);
    });

    function down(d, i) {
        if (!d.children || this.__transition__) return;

        level = level + 1
        console.log(d)
        if(level == 1) breakbyCountry = ""
        if(level == 2) {
            breakbyCountry = "<hr/>Break by Country: " + d.data.name
            breakBySector = ""
        }
        if(level == 3) breakBySector = "<br/>Break by Sector: " + d.data.name


        tooltipInfo.html(indicatorInfo[level - 1]+ breakbyCountry + breakBySector)
        .style("display", "inline-block");

        for(var idx =1; idx <=3; idx++){
            if(idx == level){
                d3.select("#Insight"+ idx).style("display", "inline-block");
            }
            else{
                d3.select("#Insight"+ idx).style("display", "none");
            }
        }

        var end = duration + d.children.length * delay;
        // Mark any currently-displayed bars as exiting.
        var exit = svg.selectAll(".enter")
            .attr("class", "exit");
            // Entering nodes immediately obscure the clicked-on bar, so hide it.
            exit.selectAll("rect").filter(function(p) { return p === d; })
                .style("fill-opacity", 1e-6);
        
        // Enter the new bars for the clicked-on data.
        // Per above, entering bars are immediately visible.
        var enter = bar(d)
            .attr("transform", stack(i))
            .style("opacity", 1);
        
        // Have the text fade-in, even though the bars are visible.
        // Color the bars as parents; they will fade to children if appropriate.
        enter.select("text").style("fill-opacity", 1e-6);
        enter.select("rect").style("fill", color(true));
        
        // Update the x-scale domain.
        x.domain([0, d3.max(d.children, function(d) { return d.data.value; })]).nice();
        
        // Update the x-axis.
        svg.selectAll(".x.axis").transition()
            .duration(duration)
            .call(xAxis);
        
        // Transition entering bars to their new position.
        var enterTransition = enter.transition()
            .duration(duration)
            .delay(function(d, i) { return i * delay; })
            .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });
        
        // Transition entering text.
        enterTransition.select("text")
            .style("fill-opacity", 1);
        // Transition entering rects to the new x-scale.
        enterTransition.select("rect")
            .attr("width", function(d) { return x(d.data.value); })
            .style("fill", function(d) { return color(!!d.children); });
        
        // Transition exiting bars to fade out.
        var exitTransition = exit.transition()
            .duration(duration)
            .style("opacity", 1e-6)
            .remove();
        
        // Transition exiting bars to the new x-scale.
        exitTransition.selectAll("rect")
            .attr("width", function(d) { return x(d.data.value); });
        
        // Rebind the current node to the background.
        svg.select(".background")
            .datum(d)
            .transition()
            .duration(end);
        
        d.index = i;
    }


    function up(d) {
        if (!d.parent || this.__transition__) return;

        level = level - 1
        if(level == 1) breakbyCountry = ""
        if(level == 2) {
            breakBySector = ""
        }

        tooltipInfo.html(indicatorInfo[level - 1]+ breakbyCountry + breakBySector)
        .style("display", "inline-block");

        for(var idx =1; idx <=3; idx++){
            if(idx == level){
                d3.select("#Insight"+ idx).style("display", "inline-block");
            }
            else{
                d3.select("#Insight"+ idx).style("display", "none");
            }
        }

        var end = duration + d.children.length * delay;
        // Mark any currently-displayed bars as exiting.
        var exit = svg.selectAll(".enter")
            .attr("class", "exit");
        // Enter the new bars for the clicked-on data's parent.
        var enter = bar(d.parent)
            .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
            .style("opacity", 1e-6);
        // Color the bars as appropriate.
        // Exiting nodes will obscure the parent bar, so hide it.
        enter.select("rect")
            .style("fill", function(d) { return color(!!d.children); })
            .filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);
        // Update the x-scale domain.
        x.domain([0, d3.max(d.parent.children, function(d) { return d.data.value; })]).nice();
        // Update the x-axis.
        svg.selectAll(".x.axis").transition()
            .duration(duration)
            .call(xAxis);
        // Transition entering bars to fade in over the full duration.
        var enterTransition = enter.transition()
            .duration(end)
            .style("opacity", 1);
        // Transition entering rects to the new x-scale.
        // When the entering parent rect is done, make it visible!
        enterTransition.select("rect")
            .attr("width", function(d) {
                 return x(d.data.value);
            })
            .on("end",function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });
        // Transition exiting bars to the parent's position.
        var exitTransition = exit.selectAll("g").transition()
            .duration(duration)
            .delay(function(d, i) { return i * delay; })
            .attr("transform", stack(d.index));
        // Transition exiting text to fade out.
        exitTransition.select("text")
            .style("fill-opacity", 1e-6);
        // Transition exiting rects to the new scale and fade to parent color.
        exitTransition.select("rect")
            .attr("width", function(d) { return x(d.data.value); })
            .style("fill", color(true));
        // Remove exiting nodes when the last child has finished transitioning.
        exit.transition()
            .duration(end)
            .remove();
        // Rebind the current parent to the background.
        svg.select(".background")
            .datum(d.parent)
            .transition()
            .duration(end);
    }


    // Creates a set of bars for the given data node, at the specified index.
    function bar(d) {
        var bar = svg.insert("g", ".y.axis")
            .attr("class", "enter")
            .attr("transform", "translate(0,5)")
            .selectAll("g")
            .data(d.children)
            .enter().append("g")
            .style("cursor", function(d) { return !d.children ? null : "pointer"; })
            .on("click", down);
        bar.append("text")
            .attr("x", -6)
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.data.name; });
        bar.append("rect")
            .attr("width", function(d) { 
                return x(d.data.value); 
            })
            .attr("height", barHeight)
            .on("mousemove", function(d){
                var info = (d.data.name)
                if(level == 1 || level == 2){
                    info = info  + ": <br>" + (d.data.CompanyCount) + " Companies"
                }
                else
                {
                    info = "Company:" + info  + "<br> Global Ranking: " +(d.data.Rank) + "<br> Revenue: " +(d.data.Revenue) 
                }
                tooltip
                  .style("left", d3.event.pageX + 20 + "px")
                  .style("top", d3.event.pageY - 20 + "px")
                  .style("display", "inline-block")
                  .html(info);
              })
            .on("mouseout", function(d){ tooltip.style("display", "none");});;
        return bar;
    }

    // A stateful closure for stacking bars horizontally.
    function stack(i) {
        var x0 = 0;
        return function(d) {
            var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
            x0 += x(d.data.value);
            return tx;
        };
    }
}