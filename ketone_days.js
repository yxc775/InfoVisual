(function (d3) {
  'use strict';

  var lineset;
  var brush;
  var brushy;
  var e;
  var e2;
  var data;
  const svg = d3.select('#svg_ketone_days');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const colorValue = d => d.Patient_ID;

  //
  const render = data => {
      svg.append("rect")
          .attr("class", "rect_ketone_days")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "white");

    const title = 'B: Ketone vs Days on PKT';
    var margin = {
        top: 50,
        right: 20,
        bottom: 160,
        left: 150
    }
    var margin2 = {
        top: 560,
        right: 20,
        bottom: 70,
        left: 150
    }

    var margin3 = {
        top: 50,
        right: 860,
        bottom: 160,
        left: 80
    }
    const innerWidth = width - margin.left - margin.right;
    const innerWidth2 = width - margin3.left - margin3.right;
    const innerHeight = height - margin.top - margin.bottom;
    const innerHeight2 = height - margin2.top - margin2.bottom;
    const g = svg.append('g')
            .attr("class","plot")
            .attr('transform',  "translate(" + margin.left + "," + margin.top + ")");
    g.append('text')
              .attr('class', 'title')
              .attr('y', -10)
              // .attr('x',100)
              .text(title);
    const slider = svg.append('g')
        .attr("class","slider")
        .attr('transform', "translate(" + margin2.left + "," + margin2.top + ")");
    const slidery = svg.append('g')
        .attr("class","slider2")
        .attr('transform', "translate(" + margin3.left + "," + margin3.top + ")");

    // axis
    const xValue = d => d.Days_on_PKT;
    const xAxisLabel = 'Days on PKT';

    const yValue = d => d.Blood_ketones_mg_per_dL;
    const yAxisLabel = 'Ketone (mg/dL)';

    var xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth]);

    const xScale2 = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([0,innerHeight]);

    const yScale2 = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);

    const xAxis2 = d3.axisBottom(xScale2)
        .tickSize(-innerHeight2)
        .tickPadding(15);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);

    const yAxis2 = d3.axisLeft(yScale2)
        .tickSize(-innerWidth2)
        .tickPadding(10);

      const yAxisG = g.append('g')
            .attr('class','axis--y')
            .call(yAxis)

      const yAxisG2 = slidery.append('g')
                  .call(yAxis2)

    yAxisG.select('.domain').remove();
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -50)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
//        .text(yAxisLabel);

    yAxisG2.select('.domain').remove();
    yAxisG2.append('text')
        .attr('class', 'axis-label')
        .attr('y', -50)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);



    const xAxisG = g.append('g')
      .attr('class','axis--x').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);

    const xAxisG2 = slider.append('g').call(xAxis2)
      .attr('transform', `translate(0,${innerHeight2})`);

    xAxisG.select('.domain').remove();
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
    xAxisG2.select('.domain').remove();
    xAxisG2.append('text')
        .attr('class', 'axis-label')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    brush = d3.brushX().extent([[0,0],[innerWidth,innerHeight2]]).on("brush end",brushed);
    brushy = d3.brushY().extent([[0,0],[innerWidth2,innerHeight]]).on("brush end",brushedy);

    slider.append("g")
          .attr("class","brush")
          .call(brush)
          .call(brush.move,xScale.range())

    slidery.append("g")
           .attr("class","brushy")
           .call(brushy)
           .call(brushy.move,[0,440])



    // line-for plot
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const lastYValue = d =>
      yValue(d.values[d.values.length - 1]);

    var nested = d3.nest()
      .key(colorValue)
      .entries(data)
      .sort((a, b) =>
        d3.descending(lastYValue(a), lastYValue(b))
      );

    colorScale.domain(nested.map(d => d.key));

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

        var clipPath = g.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)

    var tootip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", -1);

    lineset = g.selectAll('.line-path').data(nested).enter().append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key))
        .on("mouseover", function(d){
          if(zoomed){
           tootip.transition()
               .duration(200)
               .style("height","112px")
               .style("width","240px")
               .style("font-size", "48px")
               .style("opacity", .9)
           tootip.html("Patient " + d.key)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
             }
            else{
              tootip.transition()
                  .duration(200)
                  .style("height","56px")
                  .style("width","120px")
                  .style("font-size", "24px")
                  .style("opacity", .9)
              tootip.html("Patient " + d.key)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
            }
           })
        .on("mouseout", function(d) {
          tootip.transition()
                     .duration(500)
                     .style("opacity", 0);
        })
        .attr("clip-path", "url(#clip)")

    //brush function
    //create brush function redraw scatterplot with selectiodn
   function brushed() {
       var selection = d3.event.selection;
       if (selection !== null) {
           e = d3.event.selection.map(xScale2.invert, xScale2);
           xScale.domain(e);
           g.selectAll(".line-path").attr("d", d => lineGenerator(d.values));
           g.selectAll(".axis--x").call(xAxis);
       }
   }

   function brushedy() {
       var selection = d3.event.selection;
       if (selection !== null) {
           e2 = d3.event.selection.map(yScale2.invert,yScale2);
           yScale.domain(e2);
           g.selectAll(".line-path").attr("d", d => lineGenerator(d.values));
           g.selectAll(".axis--y").call(yAxis);
       }

   }

    // zoom
    var zoomed = false;
    svg.on("dblclick", function () {
      if (!zoomed) {
        svg.transition().duration(900)
            .attr("transform", "translate(" + -width/2 + "," + height/2 + ") scale(" + 2 + ")" );
        zoomed = true;
        svg.raise();
      } else {
        svg.transition().duration(900)
            .attr("transform", "scale(" + 1 + ") translate(" + 0 + "," + 0 + ")");
        zoomed = false;
      }
    })

      // filter part
      var submit = d3.select(".submit_ketone_days");
      submit.on("click", handleFilters)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

      function handleFilters() {
          // get formula from input as string & delete spaces
          var id = +$(this).attr("id") + 32;
          var str = $("#"+id).val().replace(/\s/g, '');
          // split into formulas
          var formulas = str.split(/\&/);
          console.log("=======================================");
          console.log("Filter:" + ""+$("#"+id).val());
          console.log("id sex age days glucose ketone GKI")
          lineset.filter(function (f) {
              for (var i = 0; i < formulas.length; i++) {
                  var formula = formulas[i];
                  if (handleSingleFormula(formula, f)) {
                      return true;
                  }
              }
              var vals = f.values[0];
              console.log("id: " + vals.Patient_ID + ", sex: " + vals.Sex + ", age: " + Math.round(vals.Day_of_Life/365*100)/100);
              for (let i = 0; i < f.values.length; i++) {
                  vals = f.values[i];
                  console.log(vals.Patient_ID + " " + vals.Sex + " " + vals.Day_of_Life + " " + vals.Days_on_PKT + " " + vals.Blood_glucose_mg_per_dL + " " + vals.Blood_ketones_mg_per_dL + " " + vals.GKI)
              }

              return false;
          })
              .attr("opacity", 0.1);
      }

      function handleSingleFormula(formula, f) {

          if (formula.startsWith("up")||formula.startsWith("down")
              ||formula.startsWith("neither")||formula.startsWith("both")
              ||formula.startsWith("either")) {
              return !handleRange(formula, f);

          }
          if (formula.startsWith("increase")||formula.startsWith("decrease")
              ||formula.startsWith("stable")||formula.startsWith("notincrease")) {
              return !handleRange2(formula, f);
          }
          var arr = formula.split(/[\>=\>\<=\<\!=\=]/);
          var left = arr[0];
          var leftArr = left.split(/[\*\+\/\-\(\)]/);
          var right = arr[arr.length - 1];
          var rightArr = right.split(/[\*\+\/\-\(\)]/);
          for (var i = 0; i < leftArr.length; i++) {
              if (hasLetter(leftArr[i])) {
                  var abbr = leftArr[i].match(/^[a-z|A-Z]+/gi);
                  var index = leftArr[i].match(/\d+$/gi);
                  if (index == null) {index = 0}
                  if (index >= f.values.length) {return true}
                  left = left.replace(new RegExp(leftArr[i], 'g'), strToVal(f, index, abbr));
              }
          }
          for (let i = 0; i < rightArr.length; i++) {
              if (hasLetter(rightArr[i])) {
                  var abbr = rightArr[i].match(/^[a-z|A-Z]+/gi);
                  var index = rightArr[i].match(/\d+$/gi);
                  if (index == null) {index = 0}
                  if (index >= f.values.length) {return true}
                  right = right.replace(new RegExp(rightArr[i], 'g'), strToVal(f, index, abbr));
              }
          }

          return !showFiltered(formula, left, right);
      }

      // up(sex, 5, 0, 100)
      function handleRange(formula, f) {
          var up = false;
          var down = false;

          var symbols = formula.split(/[\(\)\,]/);
          var type = symbols[0];
          var variable = symbols[1];
          var gap = symbols[2];
          var start = symbols[3];
          var end = symbols[4];

          // get appropriate range
          var startIndex = Number.MAX_SAFE_INTEGER;
          var endIndex = Number.MIN_SAFE_INTEGER;
          for (var i = 0; i < f.values.length; i++) {
              var d = f.values[i].Days_on_PKT;
              if (start <= d && d <= end) {
                  startIndex = Math.min(startIndex, i);
                  endIndex = Math.max(endIndex, i);
              }
          }

          if (startIndex >= endIndex) {
              return false;
          }

          if (variable == "g") {
              for (var i = startIndex; i < endIndex; i++) {
                  var former = f.values[i].Blood_glucose_mg_per_dL;
                  var later = f.values[i + 1].Blood_glucose_mg_per_dL;
                  if (later - former >= gap) {
                      up = true;
                  }
                  if (later - former <= -gap) {
                      down = true;
                  }
              }
          }

          if (variable == "k") {
              for (var i = startIndex; i < endIndex; i++) {
                  var former = f.values[i].Blood_ketones_mg_per_dL;
                  var later = f.values[i + 1].Blood_ketones_mg_per_dL;
                  if (later - former >= gap) {
                      up = true;
                  }
                  if (later - former <= -gap) {
                      down = true;
                  }
              }
          }

          // get neither and both
          var neither = !up && !down;
          var both = up && down;
          var either = up || down;
          if (type == "up") {
              return up;
          }
          if (type == "down") {
              return down;
          }
          if (type == "neither") {
              return neither;
          }
          if (type == "both") {
              return both;
          }
          if (type == "either") {
              return either;
          }

          return false;
      }

      function handleRange2(formula, f) {
          var increase = false;
          var decrease = false;
          var stable = false;
          var notincrease = false;

          var symbols = formula.split(/[\(\)\,]/);
          var type = symbols[0];
          var variable = symbols[1];
          var gap = symbols[2];
          var start = symbols[3];
          var end = symbols[4];

          // get appropriate range
          var startIndex = Number.MAX_SAFE_INTEGER;
          var endIndex = Number.MIN_SAFE_INTEGER;
          for (var i = 0; i < f.values.length; i++) {
              var d = f.values[i].Days_on_PKT;
              if (start <= d && d <= end) {
                  startIndex = Math.min(startIndex, i);
                  endIndex = Math.max(endIndex, i);
              }
          }

          if (startIndex >= endIndex) {
              return false;
          }

          if (variable == "g") {
              var former = f.values[startIndex].Blood_glucose_mg_per_dL;
              var later = f.values[endIndex].Blood_glucose_mg_per_dL;
              increase = (later - former >= gap);
              decrease = (former - later >= gap);
              stable = (Math.abs(later - former) < gap);
              notincrease = (later - former < gap);
          }

          if (variable == "k") {
              var former = f.values[startIndex].Blood_ketones_mg_per_dL;
              var later = f.values[endIndex].Blood_ketones_mg_per_dL;
              increase = (later - former >= gap);
              decrease = (former - later >= gap);
              stable = (Math.abs(later - former) < gap);
              notincrease = (later - former < gap);
          }

          if (type == "increase") {
              return increase;
          }
          if (type == "decrease") {
              return decrease;
          }
          if (type == "stable") {
              return stable;
          }
          if (type == "notincrease") {
              return notincrease;
          }
          return false;
      }

      function showFiltered(str, left, right) {
          if (str.match(">=") != null) {
              return eval(left) >= eval(right);
          }
          if (str.match("<=") != null) {
              return eval(left) <= eval(right);
          }
          if (str.match(">") != null) {
              return eval(left) > eval(right);
          }
          if (str.match("<") != null) {
              return eval(left) < eval(right);
          }
          if (str.match("!=") != null) {
              return eval(left) !== eval(right);
          }
          if (str.match("=") != null) {
              return eval(left) === eval(right);
          }
          return false;
      }

      function strToVal(patient, index, abbr) {
          var vals = patient.values[index];
          if (abbr == "id") {
              return +Number(vals.Patient_ID.match(/\d+$/gi));
          } else if (abbr == "sex") {
              if (vals.Sex == "female") {
                  return 0;
              }
              return 1;
          } else if (abbr == "age") {
              return vals.Day_of_Life;
          } else if (abbr == "day") {
              return vals.Days_on_PKT;
          } else if (abbr == "g") {
              return vals.Blood_glucose_mg_per_dL;
          } else if (abbr == "k") {
              return vals.Blood_ketones_mg_per_dL;
          } else if (abbr == "index") {
              return vals.GKI;
          } else {
              return null;
          }
      }

      function hasLetter(str) {
          for (var i in str) {
              var asc = str.charCodeAt(i);
              if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
                  return true;
              }
          }
          return false;
      }

      // reset button
      var reset = d3.select(".reset_ketone_days");
      reset.on("click", handleReset)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

      function handleReset() {
          lineset.attr("opacity", 1);
      }

      function handleMouseOver() {
          d3.selectAll(".rect_ketone_days").attr("fill", "silver");
      }

      function handleMouseOut() {
          d3.selectAll(".rect_ketone_days").attr("fill", "white");
      }

      d3.select("#newFilter").on("mouseout", function(){
          d3.selectAll(".submit_ketone_days")
              .on("click", handleFilters)
              .on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);
          d3.selectAll(".reset_ketone_days")
              .on("click", handleReset)
              .on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut);
      })
  }

  d3.csv("./test.csv")
    .then(
      data => {
      data.forEach(d => {
        d.Days_on_PKT = +d.Days_on_PKT;
        d.Blood_ketones_mg_per_dL = +d.Blood_ketones_mg_per_dL;
      });
      render(data);
    });

    var fileInput = document.getElementById("xlf"),
        readFile = function () {
            var reader = new FileReader();

            reader.onload = function(e) {
                var url1 = e.target.result;
                //console.log(url1);
                d3.csv(url1)
                    .then(data => {
                        data.forEach(d => {
                            d.Days_on_PKT = +d.Days_on_PKT;
                            d.Blood_ketones_mg_per_dL = +d.Blood_ketones_mg_per_dL;
                        });
                        render(data);
                    });
            };
            reader.readAsDataURL(fileInput.files[0]);
        };
    fileInput.addEventListener('change', function(){
        readFile();
        //console.log('The data was changed!');
    });

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2NvbG9yTGVnZW5kLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGNvbG9yTGVnZW5kID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbG9yU2NhbGUsXG4gICAgY2lyY2xlUmFkaXVzLFxuICAgIHNwYWNpbmcsXG4gICAgdGV4dE9mZnNldFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgZ3JvdXBzID0gc2VsZWN0aW9uLnNlbGVjdEFsbCgnZycpXG4gICAgLmRhdGEoY29sb3JTY2FsZS5kb21haW4oKSk7XG4gIGNvbnN0IGdyb3Vwc0VudGVyID0gZ3JvdXBzXG4gICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aWNrJyk7XG4gIGdyb3Vwc0VudGVyXG4gICAgLm1lcmdlKGdyb3VwcylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT5cbiAgICAgICAgYHRyYW5zbGF0ZSgwLCAke2kgKiBzcGFjaW5nfSlgXG4gICAgICApO1xuICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIGdyb3Vwc0VudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgnY2lyY2xlJykpXG4gICAgICAuYXR0cigncicsIGNpcmNsZVJhZGl1cylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3JTY2FsZSk7XG5cbiAgZ3JvdXBzRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgndGV4dCcpKVxuICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAuYXR0cigneCcsIHRleHRPZmZzZXQpO1xufSIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgY3N2LFxuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVUaW1lLFxuICBzY2FsZU9yZGluYWwsXG4gIGV4dGVudCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIGxpbmUsXG4gIGN1cnZlQmFzaXMsXG4gIG5lc3QsXG4gIHNjaGVtZUNhdGVnb3J5MTAsXG4gIGRlc2NlbmRpbmdcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBjb2xvckxlZ2VuZCB9IGZyb20gJy4vY29sb3JMZWdlbmQnO1xuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcblxuY29uc3Qgd2lkdGggPSArc3ZnLmF0dHIoJ3dpZHRoJyk7XG5jb25zdCBoZWlnaHQgPSArc3ZnLmF0dHIoJ2hlaWdodCcpO1xuXG5jb25zdCByZW5kZXIgPSBkYXRhID0+IHtcbiAgY29uc3QgdGl0bGUgPSAnQSBXZWVrIG9mIFRlbXBlcmF0dXJlIEFyb3VuZCB0aGUgV29ybGQnO1xuICBcbiAgY29uc3QgeFZhbHVlID0gZCA9PiBkLnRpbWVzdGFtcDtcbiAgY29uc3QgeEF4aXNMYWJlbCA9ICdUaW1lJztcbiAgXG4gIGNvbnN0IHlWYWx1ZSA9IGQgPT4gZC50ZW1wZXJhdHVyZTtcbiAgY29uc3QgY2lyY2xlUmFkaXVzID0gNjtcbiAgY29uc3QgeUF4aXNMYWJlbCA9ICdUZW1wZXJhdHVyZSc7XG4gIFxuICBjb25zdCBjb2xvclZhbHVlID0gZCA9PiBkLmNpdHk7XG4gIFxuICBjb25zdCBtYXJnaW4gPSB7IHRvcDogNjAsIHJpZ2h0OiAxNjAsIGJvdHRvbTogODgsIGxlZnQ6IDEwNSB9O1xuICBjb25zdCBpbm5lcldpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgY29uc3QgaW5uZXJIZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgXG4gIGNvbnN0IHhTY2FsZSA9IHNjYWxlVGltZSgpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICAgIC5uaWNlKCk7XG4gIFxuICBjb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeVZhbHVlKSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSlcbiAgICAubmljZSgpO1xuICBcbiAgY29uc3QgY29sb3JTY2FsZSA9IHNjYWxlT3JkaW5hbChzY2hlbWVDYXRlZ29yeTEwKTtcbiAgXG4gIGNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuICBcbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVySGVpZ2h0KVxuICAgIC50aWNrUGFkZGluZygxNSk7XG4gIFxuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVyV2lkdGgpXG4gICAgLnRpY2tQYWRkaW5nKDEwKTtcbiAgXG4gIGNvbnN0IHlBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh5QXhpcyk7XG4gIHlBeGlzRy5zZWxlY3RBbGwoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHlBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCAtNjApXG4gICAgICAuYXR0cigneCcsIC1pbm5lckhlaWdodCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHJvdGF0ZSgtOTApYClcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnRleHQoeUF4aXNMYWJlbCk7XG4gIFxuICBjb25zdCB4QXhpc0cgPSBnLmFwcGVuZCgnZycpLmNhbGwoeEF4aXMpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke2lubmVySGVpZ2h0fSlgKTtcbiAgXG4gIHhBeGlzRy5zZWxlY3QoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHhBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCA4MClcbiAgICAgIC5hdHRyKCd4JywgaW5uZXJXaWR0aCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAudGV4dCh4QXhpc0xhYmVsKTtcbiAgXG4gIGNvbnN0IGxpbmVHZW5lcmF0b3IgPSBsaW5lKClcbiAgICAueChkID0+IHhTY2FsZSh4VmFsdWUoZCkpKVxuICAgIC55KGQgPT4geVNjYWxlKHlWYWx1ZShkKSkpXG4gICAgLmN1cnZlKGN1cnZlQmFzaXMpO1xuICBcbiAgY29uc3QgbGFzdFlWYWx1ZSA9IGQgPT5cbiAgICB5VmFsdWUoZC52YWx1ZXNbZC52YWx1ZXMubGVuZ3RoIC0gMV0pO1xuICBcbiAgY29uc3QgbmVzdGVkID0gbmVzdCgpXG4gICAgLmtleShjb2xvclZhbHVlKVxuICAgIC5lbnRyaWVzKGRhdGEpXG4gICAgLnNvcnQoKGEsIGIpID0+XG4gICAgICBkZXNjZW5kaW5nKGxhc3RZVmFsdWUoYSksIGxhc3RZVmFsdWUoYikpXG4gICAgKTtcbiAgXG4gIGNvbnNvbGUubG9nKG5lc3RlZCk7XG4gIFxuICBjb2xvclNjYWxlLmRvbWFpbihuZXN0ZWQubWFwKGQgPT4gZC5rZXkpKTtcbiAgXG4gIGcuc2VsZWN0QWxsKCcubGluZS1wYXRoJykuZGF0YShuZXN0ZWQpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLXBhdGgnKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IGxpbmVHZW5lcmF0b3IoZC52YWx1ZXMpKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsIGQgPT4gY29sb3JTY2FsZShkLmtleSkpO1xuICBcbiAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlJylcbiAgICAgIC5hdHRyKCd5JywgLTEwKVxuICAgICAgLnRleHQodGl0bGUpO1xuICBcbiAgc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoNzkwLDEyMSlgKVxuICAgIC5jYWxsKGNvbG9yTGVnZW5kLCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY2lyY2xlUmFkaXVzOiAxMyxcbiAgICAgIHNwYWNpbmc6IDMwLFxuICAgICAgdGV4dE9mZnNldDogMTVcbiAgICB9KTtcbn07XG5cbmNzdignaHR0cHM6Ly92aXpodWIuY29tL2N1cnJhbi9kYXRhc2V0cy9kYXRhLWNhbnZhcy1zZW5zZS15b3VyLWNpdHktb25lLXdlZWsuY3N2JylcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgZGF0YS5mb3JFYWNoKGQgPT4ge1xuICAgICAgZC50ZW1wZXJhdHVyZSA9ICtkLnRlbXBlcmF0dXJlO1xuICAgICAgZC50aW1lc3RhbXAgPSBuZXcgRGF0ZShkLnRpbWVzdGFtcCk7XG4gICAgfSk7XG4gICAgcmVuZGVyKGRhdGEpO1xuICB9KTsiXSwibmFtZXMiOlsic2VsZWN0Iiwic2NhbGVUaW1lIiwiZXh0ZW50Iiwic2NhbGVMaW5lYXIiLCJzY2FsZU9yZGluYWwiLCJzY2hlbWVDYXRlZ29yeTEwIiwiYXhpc0JvdHRvbSIsImF4aXNMZWZ0IiwibGluZSIsImN1cnZlQmFzaXMiLCJuZXN0IiwiZGVzY2VuZGluZyIsImNzdiJdLCJtYXBwaW5ncyI6Ijs7O0VBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ2pELEVBQUUsTUFBTTtFQUNSLElBQUksVUFBVTtFQUNkLElBQUksWUFBWTtFQUNoQixJQUFJLE9BQU87RUFDWCxJQUFJLFVBQVU7RUFDZCxHQUFHLEdBQUcsS0FBSyxDQUFDOztFQUVaLEVBQUUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFDekMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLE1B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
