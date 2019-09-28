;(function() {
	var margin = { top: 10, right: 10, bottom: 100, left: 50 };
	var width = 600;
	var height = 300;
	var GKIRange = {min: 0, max:10}

	var circleRadius = 4;
	var data;
	init();

	function init() {

		console.log("initiating!")

		// load data from json

		d3.json("./data/PKTDataset.json").then(function(json){

			data = json;
			console.log("JSON loaded");
			div1 ="#KvGandKvT";
			div2 = "#GvTandKGvT";

			initializeChart(div1,"KvG",margin);
			initializeChart(div1,"KGvT",margin);
			initializeChart(div2,"KvT",margin);
			initializeChart(div2,"GvT",margin);
		//load data from xlsx
		})

	}//end init

	function initializeChart(selector,mode,margin) {
		var xAxisLabelHeader = "X Header";
		var yAxisLabelHeader = "Y Header";
		if(mode == "KvG"){
			xAxisLabelHeader = "Blood glucose mg per dL"
			yAxisLabelHeader = "Blood ketones mg per dL"
		}
		else if(mode == "KvT"){
			xAxisLabelHeader = "Days on PKT"
			yAxisLabelHeader = "Blood ketones mg per dL"
		}
		else if(mode == "GvT"){
			xAxisLabelHeader = "Days on PKT"
			yAxisLabelHeader = "Blood glucose mg per dL"
		}
		else if(mode == "KGvT"){
			xAxisLabelHeader = "Days on PKT"
			yAxisLabelHeader = "Glucose Ketone Index"
		}
		else{
			console.log("Invalid mode selected");
		}

		var chart;
		var chartWidth = width - margin.left - margin.right;
		var chartHeight = height - margin.top - margin.bottom;
		chart = d3.select(selector).append("svg")
			.attr("width", width)
			.attr("height", height);
		chart.plotArea = chart.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			dataRangePair = getDataRange(mode);
			createAxes(chart,mode,chartWidth,chartHeight,xAxisLabelHeader,yAxisLabelHeader,dataRangePair[0],dataRangePair[1]);
			drawDots(chart,mode,chartWidth,chartHeight,dataRangePair[0],dataRangePair[1]);
	}

	function getDataRange(mode){

					var dataXRange;
					var dataYRange;
					var minx;
					var miny;
					var maxx;
					var maxy;
					if(mode == "KvG"){
						minx = d3.min(data, function(d) { return +d.Blood_glucose_mg_per_dL});
						miny = d3.min(data, function(d) { return +d.Blood_ketones_mg_per_dL});
						maxx = d3.max(data, function(d) { return +d.Blood_glucose_mg_per_dL});
						maxy = d3.max(data, function(d) { return +d.Blood_ketones_mg_per_dL});
					}
					else if(mode == "KvT"){
						minx = d3.min(data, function(d) { return +d.Days_on_PKT});
						miny = d3.min(data, function(d) { return +d.Blood_ketones_mg_per_dL});
						maxx = d3.max(data, function(d) { return +d.Days_on_PKT});
						maxy = d3.max(data, function(d) { return +d.Blood_ketones_mg_per_dL});
					}
					else if(mode == "GvT"){
						minx = d3.min(data, function(d) { return +d.Days_on_PKT});
						miny = d3.min(data, function(d) { return +d.Blood_glucose_mg_per_dL});
						maxx = d3.max(data, function(d) { return +d.Days_on_PKT});
						maxy = d3.max(data, function(d) { return +d.Blood_glucose_mg_per_dL});
					}
					else if(mode == "KGvT"){
						minx = d3.min(data, function(d) { return +d.Days_on_PKT});
						miny = GKIRange.min
						maxx = d3.max(data, function(d) { return +d.Days_on_PKT});
						maxy = GKIRange.max
					}
					else{
						console.log("Invalid mode selected");
					}

					dataXRange = { min: minx, max: maxx };
					dataYRange = { min: miny, max: maxy };
					return [dataXRange, dataYRange];
	}



	function createAxes(chart,mode,chartWidth,chartHeight,xAxisLabelHeader,yAxisLabelHeader,dataXRange,dataYRange) {
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

	function drawDots(chart,mode,chartWidth,chartHeight,dataXRange,dataYRange) {
		var dots = chart.plotArea.selectAll(".dots").data(data)
		dots.enter().append("circle").on("click", function(d) {
								if(mode == "KvG"){
									console.log("circle: ", d.Blood_glucose_mg_per_dL, ", ", d.Blood_ketones_mg_per_dL);
								}
								else if(mode == "KvT"){
									console.log("circle: ", d.Days_on_PKT, ", ", d.Blood_ketones_mg_per_dL);
								}
								else if(mode == "GvT"){
									console.log("circle: ", d.Days_on_PKT, ", ", d.Blood_glucose_mg_per_dL);
								}
								else if(mode == "KGvT"){
									console.log("circle: ", d.Days_on_PKT, ", ", getGKI(d));
								}
		 						})
 						.attr("class", "dot")
 						.attr("cx", function(d) {
							if(mode == "KvG"){
								return chart.xScale(d.Blood_glucose_mg_per_dL);
						  }
							else if(mode == "KvT" || mode == "GvT" || mode == "KGvT"){
								return chart.xScale(d.Days_on_PKT);
							}
							else{
								console.log("Error: unexpected datatype on x-axis?");
							}
						}
						)
 						.attr("cy", function(d) {
							if(mode == "KvG" || mode == "KvT"){
								return chart.yScale(d.Blood_ketones_mg_per_dL);
							}
							else if(mode == "GvT"){
								return chart.yScale(d.Blood_glucose_mg_per_dL);
							}
							else if(mode == "KGvT"){
								if(getGKI(d) < dataYRange.max && getGKI(d) > dataYRange.min ){
									return chart.yScale(getGKI(d));
								}
								else if(getGKI(d) >= dataYRange.max){
									return chart.yScale(dataYRange.max);
								}
								else{
									return chart.yScale(dataYRange.min);
								}
							}
							else{
								console.log("Error: unexpeceted datatype on y-axis?")
							}
						 })
 						.attr("r",  circleRadius)
 						.attr("fill", "red")
		// do something with the data here!
	}

	function getGKI(d){
		var a = +d.Blood_glucose_mg_per_dL/18.016;
		var b = +d.Blood_ketones_mg_per_dL/10.41;
		return a/b;
	}


})();
