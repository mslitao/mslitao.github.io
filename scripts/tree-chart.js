var treeData1 = 
    {
      "name": "Root: Country",
      "children": [
        {
          "name": "Node: Sector A",
          "children": [
            {
              "name": "Leaf: Company A"
            },
            {
              "name": "Leaf: Company B"
            }
          ]
        },
        {
          "name": "Node: Sector B"
        }
      ]
    };

var treeData2 = 
    {
      "name": "Level 1: Industry",
      "children": [
        {
          "name": "Level 2: Country A",
          "children": [
            {
              "name": "Level 3: Company A"
            },
            {
              "name": "Level 3: Company B"
            }
          ]
        },
        {
          "name": "Level 2: Country B"
        }
      ]
    };

function drawchart_tree(chart_id ){
    drawchart_tree_core(chart_id + "_1", treeData1);
    //drawchart_tree_core(chart_id + "_2", treeData2);
}

function drawchart_tree_core(chart_id, treeData){
        // set the dimensions and margins of the diagram
    var margin = {top: 20, right: 5, bottom: 70, left: 5},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
    .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    var svg = d3.select(chart_id).append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
       .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
        .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + d.parent.y;
            });

    // adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function(d) { 
        return "node" + 
            (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });

    // adds the circle to the node
    node.append("circle").attr("r", 10);

    // adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        .attr("y", function(d) { return d.children ? -20 : 20; })
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.name; });
}