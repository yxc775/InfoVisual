
var tick = 0
var stateIncrement = 2

var stop = function(){
	stateIncrement = 0
}

var start = function(){
	stateIncrement = 2
}

var reset = function(){
	tick = 0
}


;(function() {

	var margin = { top: 10, right: 10, bottom: 100, left: 50 };
	var width = 600;
	var height = 300;
	var duration = 250;
	var globalx = 0;
	var size = 60
	var t;

	var dataXRange = { min: -60, max:0 };
	var dataYRange = { min: 0, max: 100 };
	var xAxisLabelHeader = "X Header";
	var yAxisLabelHeader = "Y Header";
	var circleRadius = 4;


	var data;
	var chart;
	var chartWidth;
	var chartHeight;

	init();

	function init() {

		console.log("initiating!")

		chartWidth = width - margin.left - margin.right;
		chartHeight = height - margin.top - margin.bottom;

		// load data from json
		d3.json("./data/stream_1.json").then(function(json){

			data = json;
			console.log("JSON loaded");
			initializeChart();
			createAxes();
			t = d3.interval(drawDots,200)



		})

	}//end init

	function initializeChart() {
		chart = d3.select("#chartDiv").append("svg")
			.attr("width", width)
			.attr("height", height);

		chart.plotArea = chart.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}



	function createAxes() {

		// x axis
		chart.xScale = d3.scaleLinear()
			.domain([dataXRange.min,dataXRange.max])
			.range([0, chartWidth]);

		chart.xAxis = d3.axisBottom().scale(chart.xScale);
		chart.xAxisContainer = chart.append("g")
			.attr("class", "x axis scatter-xaxis")
			.attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
			.call(chart.xAxis);

		chart.append("text")
				.attr("class", "x axis scatter-xaxis")
				.style("font-size", "12px")
				.attr("text-anchor", "middle")
				.attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
				.text(xAxisLabelHeader);

				chart.yScale = d3.scaleLinear()
					.domain([dataYRange.min, dataYRange.max])
					.range([chartHeight, 0]);

				chart.yAxis = d3.axisLeft()
					.scale(chart.yScale);

				chart.yAxisContainer = chart.append("g")
					.attr("class", "y axis scatter-yaxis")
					.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
					.call(chart.yAxis);


							// y axis header label
							chart.append('text')
								.style("font-size", "12px")
								.attr("class", "heatmap-yaxis")
								.attr("text-anchor", "middle")
								.attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
								.text(yAxisLabelHeader);
	}

	function updateChart(offset){
		chart.xScale.domain([dataXRange.min + offset,dataXRange.max + offset])
		chart.xAxisContainer.transition()
		     .duration(duration)
		     .ease(d3.easeLinear,.100)
		     .call(chart.xAxis);
 		var dots = chart.plotArea.selectAll(".dot").data(data)
		dots.enter().append("circle").on("click", function(d) {
		 							console.log("circle: ", d.xVal, ", ", d.yVal);
		 						}).merge(dots)
						.transition().duration(duration)
	 		      .ease(d3.easeLinear,.100)
 						.attr("class", "dot")
 						.attr("cx", function(d) { return chart.xScale(d.xVal); })
 						.attr("cy", function(d) { return chart.yScale(d.yVal); })
 						.attr("r",  function(d){
							if(chart.xScale(d.xVal) > 10 && chart.xScale(d.xVal) < chartWidth){
								 return circleRadius
							 }
							 else{
								 return 0
							 }
						 })
 						.attr("fill", "red")

		dots.exit().attr("fill","blue")
	}


	function drawDots(timestamp) {
		// do something with the data here!
		tick += stateIncrement
		updateChart(tick)
	}


})();
