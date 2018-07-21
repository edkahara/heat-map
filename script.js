d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
  if (error) throw error;
  var baseTemperature = data["baseTemperature"];
  var monthlyVariance = data["monthlyVariance"];
  var colors = ["rgb(49, 54, 149)","rgb(69, 117, 180)","rgb(116, 173, 209)","rgb(171, 217, 233)","rgb(224, 243, 248)","rgb(255, 255, 191)","rgb(254, 224, 144)","rgb(253, 174, 97)","rgb(244, 109, 67)","rgb(215, 48, 39)","rgb(165, 0, 38)"]//set colors
  var colorScale = d3.scaleQuantile()
    .domain([1.7, 13.9])
    .range(colors);//set color scale
  var barWidth = 1300/(d3.max(monthlyVariance, function (d) { return d["year"]+0.5; }) - d3.min(monthlyVariance, function (d) { return d["year"]; }));//set bar width
  var barHeight = 400/12;//set bar height
  var tooltip = d3.select("body").append("div")
    .style('width', '150px')
    .style('position', 'relative')
    .style('background', 'black')
    .style('border', '1px solid grey')
    .style('border-radius', '5px')
    .style('opacity', '0');//create tooltip div
  var canvas = d3.select("#main").append("svg")
    .attr("width", 1400)
    .attr("height", 600)
    .attr("transform", "translate(50, 0)");//create canvas
  var bars = canvas.append("g").selectAll("rect").data(monthlyVariance).enter().append("rect")
    .attr("transform", "translate(70, 0)")
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("x", function(d) { return barWidth*(d["year"]-monthlyVariance[0]["year"]+1); })
    .attr("y", function(d) { return barHeight*(d["month"]); })
    .attr("fill", function(d) { return colorScale(baseTemperature+d["variance"]); })
    .on('mouseover', function(d) {
      tooltip.transition()
        .style('opacity', '1')
      tooltip.html(d["year"] + " - " + (d3.timeFormat("%B")(new Date(d["year"], d["month"]-1))) + "<br/ >" + (baseTemperature+d["variance"]).toFixed(1) + "℃" + "<br />" + d["variance"].toFixed(1) + "℃")
        .style('left', ((d3.event.pageX+7)+'px'))
        .style('top', ((d3.event.pageY-70)+'px'))
        .style("color", "white")
        .attr("class", "text-center")
      d3.select(this).attr("stroke", "black")
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .style('opacity', '0')
      d3.select(this).attr("stroke", "none")
    });//draw bars
  var yScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([0, 400]);//create y-axis scale
  var yAxis = d3.axisLeft(yScale).tickFormat(function(d){ return d3.timeFormat("%B")((new Date(0)).setUTCMonth(d)); });//create y-axis
  canvas.append("g")
    .attr("transform", "translate(75, 32)")
    .call(yAxis);//display y-axis
  canvas.append("text")
    .attr("transform", "translate(10, 200) rotate(-90)")
    .style("text-anchor", "middle")
    .text("Months");//label y-axis
  var xScale = d3.scaleLinear()
    .domain([d3.min(monthlyVariance, function(d) { return d["year"]-0.5 ;}), d3.max(monthlyVariance, function(d) { return d["year"] ;})])
    .range([0, 1300]);//create x-axis scale
  var xAxis = d3.axisBottom(xScale).tickArguments([19]).tickFormat(d3.format("d"));//create x-axis
  canvas.append("g")
    .attr("transform", "translate(75, 432)")
    .call(xAxis);//display x-axis
  canvas.append("text")
    .attr("transform", "translate(700, 472)")
    .style("text-anchor", "middle")
    .text("Years");//label y-axis
  var legend = canvas.selectAll(".legend").data([1.7].concat(colorScale.quantiles()), function(d) { return d; }).enter().append("g")
    .attr("class", "legend");//create a legend
  legend.append("rect")
    .attr("x", function(d, i) { return 55 * i; })
    .attr("y", 500)
    .attr("width", 55)
    .attr("height", barHeight)
    .style("fill", function(d, i) { return colors[i]; });//create the legend's rectangles
  legend.append("text")
    .text(function(d) { return "≥ " + d.toFixed(1); })
    .attr("x", function(d, i) { return 55 * i; })
    .attr("y", 550);//label the legend's rectangless
});
