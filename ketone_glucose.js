(function (d3) {
    'use strict';
    var circleset;
    const svg = d3.select('#svg_ketone_glucose');
    const width = +svg.attr('width');
    var e;
    var e2;
    var brushx;
    var brushy;
    const height = +svg.attr('height');
    const defaultColor = "steelblue";
    const norm = "norm";
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


    //
    const render = data => {
        svg.append("rect")
            .attr("class", "rect_Glucose_Ketone")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white")
            .property("value", []);

        const title = 'D: Glucose vs Ketone';

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
        const xValue = d => d.Blood_ketones_mg_per_dL;
        const xAxisLabel = 'Ketone (mg/dL)';

        const yValue = d => d.Blood_glucose_mg_per_dL;
        const yAxisLabel = 'Glucose (mg/dL)';

        var domainx = d3.extent(data, xValue)
        domainx[0] -= 2
        domainx[1] += 2

        var xScale = d3.scaleLinear()
          .domain(domainx)
          .range([0, innerWidth]);

        const xScale2 = d3.scaleLinear()
            .domain(domainx)
            .range([0, innerWidth]);

        var domainy = d3.extent(data, yValue)
        domainy[0] -= 2
        domainy[1] += 2
        const yScale = d3.scaleLinear()
          .domain(domainy)
          .range([0,innerHeight]);

        const yScale2 = d3.scaleLinear()
            .domain(domainy)
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
        brushx = d3.brushX().extent([[0,0],[innerWidth,innerHeight2]]).on("brush end",brushed);
        brushy = d3.brushY().extent([[0,0],[innerWidth2,innerHeight]]).on("brush end",brushedy);
        // circle

        var clipPath = g.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)


        var clipPathBrush = g.append("defs")
                            .append("clipPath")
                            .attr("id", "clipb")
                            .append("rect")
                            .attr("width", innerWidth+10)
                            .attr("height", innerHeight)
                            .attr('transform', `translate(${145},${50})`);

         circleset = g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('class','circle')
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .attr("r", 5)
            .attr("class", "non_brushed")
            .attr("fill", defaultColor)
            .attr("stroke", 0.5)
            .attr("stroke", "black")
            .attr("clip-path", "url(#clip)")

            slider.append("g")
                  .attr("class","brushx")
                  .call(brushx)
                  .call(brushx.move,xScale.range())

            slidery.append("g")
                   .attr("class","brushy")
                   .call(brushy)
                   .call(brushy.move,[0,440])

                   function brushed() {
                       var selection = d3.event.selection;
                       if (selection !== null) {
                           e = d3.event.selection.map(xScale2.invert, xScale2);
                           xScale.domain(e);
                           g.selectAll("circle")
                           .attr("cx", d => xScale(xValue(d)))
                           .attr("cy", d => yScale(yValue(d)));
                           g.selectAll(".axis--x").call(xAxis);
                       }
                   }

                   function brushedy() {
                       var selection = d3.event.selection;
                       if (selection !== null) {
                           e2 = d3.event.selection.map(yScale2.invert,yScale2);
                           yScale.domain(e2);
                           g.selectAll("circle")
                           .attr("cx", d => xScale(xValue(d)))
                           .attr("cy", d => yScale(yValue(d)));
                           g.selectAll(".axis--y").call(yAxis);
                       }

                   }

        // zoom
        let zoomed = false;
        svg.on("dblclick", function () {
            if (!zoomed) {
                svg.transition().duration(900)
                    .attr("transform", "translate(" + -width/2 + "," + -height/2 + ") scale(" + 2 + ")" );
                zoomed = true;
                svg.raise();
            } else {
                svg.transition().duration(900)
                    .attr("transform", "scale(" + 1 + ") translate(" + 0 + "," + 0 + ")");
                zoomed = false;
            }
        })

        // filter part
        var submit = d3.select(".submit_Glucose_Ketone");
        submit.on("click", handleClick)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

         //
        function handleClick() {
            handleReset();
            var gl = $(glucoseLower).val();
            if (gl == "") {
                gl = Number.MIN_SAFE_INTEGER;
            }
            var gu = $(glucoseUpper).val();
            if (gu == "") {
                gu = Number.MAX_SAFE_INTEGER;
            }
            var kl = $(ketoneLower).val();
            if (kl == "") {
                kl = Number.MIN_SAFE_INTEGER;
            }
            var ku = $(ketoneUpper).val();
            if (ku == "") {
                ku = Number.MAX_SAFE_INTEGER;
            }
            var dl = $(dayLower).val();
            if (dl == "") {
                dl = Number.MIN_SAFE_INTEGER;
            }
            var du = $(dayUpper).val();
            if (du == "") {
                du = Number.MAX_SAFE_INTEGER;
            }

            console.log(dl)
            console.log(du)
            circleset.filter(function(f) {
                var g = f.Blood_glucose_mg_per_dL;
                var k = f.Blood_ketones_mg_per_dL;
                var d = Number(f.Days_on_PKT);
                var res = gl<=g && g<=gu && kl<=k && k<=ku && dl<=d && d<=du;
                return !res;
            }).attr("r", 0);
            // console.log(str);
        }

        var reset = d3.select(".reset_Glucose_Ketone");
        reset.on("click", handleReset)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        function handleReset() {
            circleset.attr("r", 5);
        }

        function handleMouseOver() {
            d3.selectAll(".rect_Glucose_Ketone").attr("fill", "silver");
        }

        function handleMouseOut() {
            d3.selectAll(".rect_Glucose_Ketone").attr("fill", "white");
        }

    };


    d3.csv("./test.csv").then(function(data) {
        data.forEach(function(d) {
                d.Blood_ketones_mg_per_dL = +d.Blood_ketones_mg_per_dL;
                d.Blood_glucose_mg_per_dL = +d.Blood_glucose_mg_per_dL;
            });
            render(data);
        function highlightBrushedCircles() {

            if (d3.event.selection != null) {

                // revert circles to initial style
                circleset.attr("class", "non_brushed");

                var brush_coords = d3.brushSelection(this);

                // style brushed circles
                circleset.filter(function (){

                    var cx1 = d3.select(this).attr("cx"),
                        cy1 = d3.select(this).attr("cy");

                    return isBrushed(brush_coords, cx1, cy1);
                })
                    .attr("class", "brushed");
            }
        }


        function displayTable() {

            // disregard brushes w/o selections
            // ref: http://bl.ocks.org/mbostock/6232537
            if (!d3.event.selection) return;

            // programmed clearing of brush after mouse-up
            // ref: https://github.com/d3/d3-brush/issues/10
            d3.select(this).call(brush.move, null);

            var d_brushed = d3.selectAll(".brushed").data();

            // populate table if one or more elements is brushed
            if (d_brushed.length > 0) {
                clearTableRows();
                d_brushed.forEach(d_row => populateTableRow(d_row))
            } else {
                clearTableRows();
            }
        }

        var brush = d3.brush()
            .on("brush", highlightBrushedCircles)
            .on("end", displayTable);

            svg.append("g")
            .call(brush)
            .attr("clip-path", "url(#clipb)")
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
                                d.Blood_ketones_mg_per_dL = +d.Blood_ketones_mg_per_dL;
                                d.Blood_glucose_mg_per_dL = +d.Blood_glucose_mg_per_dL;
                            });
                            render(data);
                            function highlightBrushedCircles() {

                                if (d3.event.selection != null) {

                                    // revert circles to initial style
                                    circleset.attr("class", "non_brushed");

                                    var brush_coords = d3.brushSelection(this);

                                    // style brushed circles
                                    circleset.filter(function (){

                                        var cx1 = d3.select(this).attr("cx"),
                                            cy1 = d3.select(this).attr("cy");

                                        return isBrushed(brush_coords, cx1, cy1);
                                    })
                                        .attr("class", "brushed");
                                }
                            }


                            function displayTable() {

                                // disregard brushes w/o selections
                                // ref: http://bl.ocks.org/mbostock/6232537
                                if (!d3.event.selection) return;

                                // programmed clearing of brush after mouse-up
                                // ref: https://github.com/d3/d3-brush/issues/10
                                d3.select(this).call(brush.move, null);

                                var d_brushed = d3.selectAll(".brushed").data();

                                // populate table if one or more elements is brushed
                                if (d_brushed.length > 0) {
                                    clearTableRows();
                                    d_brushed.forEach(d_row => populateTableRow(d_row))
                                } else {
                                    clearTableRows();
                                }
                            }

                            var brush = d3.brush()
                                .on("brush", highlightBrushedCircles)
                                .on("end", displayTable);

                            svg.append("g")
                                .call(brush);
                        });
                };
                reader.readAsDataURL(fileInput.files[0]);
            };
        fileInput.addEventListener('change', function(){
            readFile();
            //console.log('The data was changed!');
        });


        function clearTableRows() {

            hideTableColNames();
            d3.selectAll(".row_data").remove();
        }

        function isBrushed(brush_coords, cx, cy) {
            var x0 = brush_coords[0][0]-margin.left,
                x1 = brush_coords[1][0]-margin.left,
                y0 = brush_coords[0][1]-margin.top,
                y1 = brush_coords[1][1]-margin.top;
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

        function hideTableColNames() {
            d3.select("table").style("visibility", "hidden");
            d3.select(".scrollit").style("visibility", "hidden");
        }

        function showTableColNames() {
            d3.select("table").style("visibility", "visible");
            d3.select(".scrollit").style("visibility", "visible");
        }

        function populateTableRow(d_row) {

            showTableColNames();

            var d_row_filter = [d_row.Patient_ID,
                d_row.Days_on_PKT,
                d_row.Blood_ketones_mg_per_dL,
                d_row.Blood_glucose_mg_per_dL];

            d3.select("table")
                .append("tr")
                .attr("class", "row_data")
                .selectAll("td")
                .data(d_row_filter)
                .enter()
                .append("td")
                .attr("align", (d, i) => i === 0 ? "left" : "right")
                .text(d => d);
        }

    }(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2NvbG9yTGVnZW5kLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGNvbG9yTGVnZW5kID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbG9yU2NhbGUsXG4gICAgY2lyY2xlUmFkaXVzLFxuICAgIHNwYWNpbmcsXG4gICAgdGV4dE9mZnNldFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgZ3JvdXBzID0gc2VsZWN0aW9uLnNlbGVjdEFsbCgnZycpXG4gICAgLmRhdGEoY29sb3JTY2FsZS5kb21haW4oKSk7XG4gIGNvbnN0IGdyb3Vwc0VudGVyID0gZ3JvdXBzXG4gICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aWNrJyk7XG4gIGdyb3Vwc0VudGVyXG4gICAgLm1lcmdlKGdyb3VwcylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT5cbiAgICAgICAgYHRyYW5zbGF0ZSgwLCAke2kgKiBzcGFjaW5nfSlgXG4gICAgICApO1xuICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIGdyb3Vwc0VudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgnY2lyY2xlJykpXG4gICAgICAuYXR0cigncicsIGNpcmNsZVJhZGl1cylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3JTY2FsZSk7XG5cbiAgZ3JvdXBzRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgndGV4dCcpKVxuICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAuYXR0cigneCcsIHRleHRPZmZzZXQpO1xufSIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgY3N2LFxuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVUaW1lLFxuICBzY2FsZU9yZGluYWwsXG4gIGV4dGVudCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIGxpbmUsXG4gIGN1cnZlQmFzaXMsXG4gIG5lc3QsXG4gIHNjaGVtZUNhdGVnb3J5MTAsXG4gIGRlc2NlbmRpbmdcbn0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBjb2xvckxlZ2VuZCB9IGZyb20gJy4vY29sb3JMZWdlbmQnO1xuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcblxuY29uc3Qgd2lkdGggPSArc3ZnLmF0dHIoJ3dpZHRoJyk7XG5jb25zdCBoZWlnaHQgPSArc3ZnLmF0dHIoJ2hlaWdodCcpO1xuXG5jb25zdCByZW5kZXIgPSBkYXRhID0+IHtcbiAgY29uc3QgdGl0bGUgPSAnQSBXZWVrIG9mIFRlbXBlcmF0dXJlIEFyb3VuZCB0aGUgV29ybGQnO1xuICBcbiAgY29uc3QgeFZhbHVlID0gZCA9PiBkLnRpbWVzdGFtcDtcbiAgY29uc3QgeEF4aXNMYWJlbCA9ICdUaW1lJztcbiAgXG4gIGNvbnN0IHlWYWx1ZSA9IGQgPT4gZC50ZW1wZXJhdHVyZTtcbiAgY29uc3QgY2lyY2xlUmFkaXVzID0gNjtcbiAgY29uc3QgeUF4aXNMYWJlbCA9ICdUZW1wZXJhdHVyZSc7XG4gIFxuICBjb25zdCBjb2xvclZhbHVlID0gZCA9PiBkLmNpdHk7XG4gIFxuICBjb25zdCBtYXJnaW4gPSB7IHRvcDogNjAsIHJpZ2h0OiAxNjAsIGJvdHRvbTogODgsIGxlZnQ6IDEwNSB9O1xuICBjb25zdCBpbm5lcldpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgY29uc3QgaW5uZXJIZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgXG4gIGNvbnN0IHhTY2FsZSA9IHNjYWxlVGltZSgpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICAgIC5uaWNlKCk7XG4gIFxuICBjb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeVZhbHVlKSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSlcbiAgICAubmljZSgpO1xuICBcbiAgY29uc3QgY29sb3JTY2FsZSA9IHNjYWxlT3JkaW5hbChzY2hlbWVDYXRlZ29yeTEwKTtcbiAgXG4gIGNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuICBcbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVySGVpZ2h0KVxuICAgIC50aWNrUGFkZGluZygxNSk7XG4gIFxuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVyV2lkdGgpXG4gICAgLnRpY2tQYWRkaW5nKDEwKTtcbiAgXG4gIGNvbnN0IHlBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh5QXhpcyk7XG4gIHlBeGlzRy5zZWxlY3RBbGwoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHlBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCAtNjApXG4gICAgICAuYXR0cigneCcsIC1pbm5lckhlaWdodCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHJvdGF0ZSgtOTApYClcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnRleHQoeUF4aXNMYWJlbCk7XG4gIFxuICBjb25zdCB4QXhpc0cgPSBnLmFwcGVuZCgnZycpLmNhbGwoeEF4aXMpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke2lubmVySGVpZ2h0fSlgKTtcbiAgXG4gIHhBeGlzRy5zZWxlY3QoJy5kb21haW4nKS5yZW1vdmUoKTtcbiAgXG4gIHhBeGlzRy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCA4MClcbiAgICAgIC5hdHRyKCd4JywgaW5uZXJXaWR0aCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAudGV4dCh4QXhpc0xhYmVsKTtcbiAgXG4gIGNvbnN0IGxpbmVHZW5lcmF0b3IgPSBsaW5lKClcbiAgICAueChkID0+IHhTY2FsZSh4VmFsdWUoZCkpKVxuICAgIC55KGQgPT4geVNjYWxlKHlWYWx1ZShkKSkpXG4gICAgLmN1cnZlKGN1cnZlQmFzaXMpO1xuICBcbiAgY29uc3QgbGFzdFlWYWx1ZSA9IGQgPT5cbiAgICB5VmFsdWUoZC52YWx1ZXNbZC52YWx1ZXMubGVuZ3RoIC0gMV0pO1xuICBcbiAgY29uc3QgbmVzdGVkID0gbmVzdCgpXG4gICAgLmtleShjb2xvclZhbHVlKVxuICAgIC5lbnRyaWVzKGRhdGEpXG4gICAgLnNvcnQoKGEsIGIpID0+XG4gICAgICBkZXNjZW5kaW5nKGxhc3RZVmFsdWUoYSksIGxhc3RZVmFsdWUoYikpXG4gICAgKTtcbiAgXG4gIGNvbnNvbGUubG9nKG5lc3RlZCk7XG4gIFxuICBjb2xvclNjYWxlLmRvbWFpbihuZXN0ZWQubWFwKGQgPT4gZC5rZXkpKTtcbiAgXG4gIGcuc2VsZWN0QWxsKCcubGluZS1wYXRoJykuZGF0YShuZXN0ZWQpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLXBhdGgnKVxuICAgICAgLmF0dHIoJ2QnLCBkID0+IGxpbmVHZW5lcmF0b3IoZC52YWx1ZXMpKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsIGQgPT4gY29sb3JTY2FsZShkLmtleSkpO1xuICBcbiAgZy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlJylcbiAgICAgIC5hdHRyKCd5JywgLTEwKVxuICAgICAgLnRleHQodGl0bGUpO1xuICBcbiAgc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoNzkwLDEyMSlgKVxuICAgIC5jYWxsKGNvbG9yTGVnZW5kLCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY2lyY2xlUmFkaXVzOiAxMyxcbiAgICAgIHNwYWNpbmc6IDMwLFxuICAgICAgdGV4dE9mZnNldDogMTVcbiAgICB9KTtcbn07XG5cbmNzdignaHR0cHM6Ly92aXpodWIuY29tL2N1cnJhbi9kYXRhc2V0cy9kYXRhLWNhbnZhcy1zZW5zZS15b3VyLWNpdHktb25lLXdlZWsuY3N2JylcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgZGF0YS5mb3JFYWNoKGQgPT4ge1xuICAgICAgZC50ZW1wZXJhdHVyZSA9ICtkLnRlbXBlcmF0dXJlO1xuICAgICAgZC50aW1lc3RhbXAgPSBuZXcgRGF0ZShkLnRpbWVzdGFtcCk7XG4gICAgfSk7XG4gICAgcmVuZGVyKGRhdGEpO1xuICB9KTsiXSwibmFtZXMiOlsic2VsZWN0Iiwic2NhbGVUaW1lIiwiZXh0ZW50Iiwic2NhbGVMaW5lYXIiLCJzY2FsZU9yZGluYWwiLCJzY2hlbWVDYXRlZ29yeTEwIiwiYXhpc0JvdHRvbSIsImF4aXNMZWZ0IiwibGluZSIsImN1cnZlQmFzaXMiLCJuZXN0IiwiZGVzY2VuZGluZyIsImNzdiJdLCJtYXBwaW5ncyI6Ijs7O0VBQU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxLQUFLO0VBQ2pELEVBQUUsTUFBTTtFQUNSLElBQUksVUFBVTtFQUNkLElBQUksWUFBWTtFQUNoQixJQUFJLE9BQU87RUFDWCxJQUFJLFVBQVU7RUFDZCxHQUFHLEdBQUcsS0FBSyxDQUFDOztFQUVaLEVBQUUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7RUFDekMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLE1B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
