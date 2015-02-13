// adds the circle container
var svgContainer = d3.select("body").append("svg")
  .attr("width", 800)
  .attr("height", 500);

// updates scores
var updateScoreboard = function(scores){
  d3.select('.scoreboard')
    .selectAll('span')
    .data(scores)
    .transition()
    .text(function(d){ return d; });
};

// adds a circle to the svgContainer at the xy coordinates.
var addCircle = function(x, y){
  var circle_data = [{
    "x_axis": x,
    "y_axis": y,
    "radius": 20,
    "color": "purple"
  }];

  var circle = svgContainer.append("circle")
    .data(circle_data);

  var circleAttributes = circle
    .attr("cx", function(d) {
      return d.x_axis;
    })
    .attr("cy", function(d) {
      return d.y_axis;
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .style("fill", function(d) {
      return d.color;
    });
};

addCircle(100,100);
addCircle(200,200);
addCircle(400,400);

