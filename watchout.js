// start slingin' some d3 here.

// update scores
var updateScoreboard = function(scores){
  d3.select('.scoreboard')
    .selectAll('span')
    .data(scores)
    .text(function(d){ return d; });
};

