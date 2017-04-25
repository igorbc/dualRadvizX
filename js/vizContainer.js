/**
 * Created by igorcorrea on 03/12/2015.
 */

// This used to be called RvCircle, but now, as it's not always a circle
// (radviz and star coordinates are being used,) it's called VizContainer.
// The application will have two of these: one to contain the visualization
// based on the data attributes, and one for the visualization based on the
// classification results.
function VizContainer(){
    this.path;
    this.center = [];
    this.x;
    this.y;
    this.r;
    this.innerRadvizRadius; //
    this.pxThickness;
    this.color;
    this.da = [];
    this.daGroup;
    this.daLabelGroup;
    this.contribution;
    this.dragging = false;
    this.arc = 0;
    this.dataPointRadius;
    this.dataPointOpacity;
    this.createPath = function() {
        arc = d3.svg.arc()
            .innerRadius(this.r)
            .outerRadius(this.r + this.thickness)
            .startAngle(0)
            .endAngle(TWO_PI);

        this.path = svgContainer.append("path")
            .attr("d", arc)
            .attr("fill", this.color)
            .attr("transform","translate(" + this.center[0] + ", " + this.center[1] + ")");
    }

    this.initializeDaInfo = function(headers, data) {
        var normalizedPos = [];
        var daCount = headers.length;
        for (var i = 0; i < daCount; i++) {
            var thisDa = new Da();
            thisDa.arc = i/daCount * TWO_PI;

            thisDa.vizContainer = this;
            thisDa.key = headers[i].key.toString();
            thisDa.radiusSize = 7;
            thisDa.distFromOrigin = vizInst.r;

            normalizedPos = [Math.cos(thisDa.arc),
                            -Math.sin(thisDa.arc),
                             0];

            thisDa.setNewPos(add3(mul3(normalizedPos,thisDa.vizContainer.r),
                                  thisDa.vizContainer.center));

            if (this.innerRadvizRadius !== undefined) {
            }
            else {
            }

            thisDa.color = "white";

            thisDa.scale = d3.scale.linear()
                .domain([
                    d3.min(data,function(d) {return +d[thisDa.key]}),
                    d3.max(data,function(d) {return +d[thisDa.key]})
                ])
                .range([0, 1]);

            this.da[i] = thisDa;

        }
    }

    this.getScaledR = function(){

        if (this.innerRadvizRadius !== undefined) {
            return this.innerRadvizRadius;
        }

        return this.r;
    }

    this.createDaGroup = function() {
        this.daGroup = svgContainer.append("g");

        this.daGroup.selectAll("line")
            .data(this.da)
            .enter()
            .append("line")          // attach a line
            .style("stroke", "gray")  // colour the line
            .attr("x1", this.center[0])     // x position of the first end of the line
            .attr("y1", this.center[1])      // y position of the first end of the line
            .attr("x2", function(d){ return d.pos[0];})     // x position of the second end of the line
            .attr("y2", function(d){ return d.pos[1];});

        this.daGroup.selectAll("circle")
            .data(this.da)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return d.pos[0];})
            .attr("cy", function(d){ return d.pos[1];})
            .attr("r", function(d){ return d.radiusSize;})
            .attr("stroke","black")
            .attr("stroke-width", 2)
            .attr("fill", function(d){ return d.color;})
            .on("dblclick", function(d) {
                if(d.color == "white") d.color = "gray";
                else d.color = "white";
                d.inverted = !d.inverted;
                console.log(d.color + " " + d.inverted + " " + d.key);
                d3.select(this).style("fill", d.color);
                vizInst.updateInst(1000);
            });

        this.daLabelGroup = svgContainer.append("g");
        this.daLabelGroup.selectAll("text")
            .data(this.da)
            .enter()
            .append("text")
            .attr("x", function(d){ return d.labelPos[0];})
            .attr("y", function(d){ return d.labelPos[1];})
            .text(function(d){ return d.key;})
            .attr("fill", "black")
            .style("font-family", "verdana")
            .style("font-size", 12)
            .attr("text-anchor", "middle")
        ;
    }

    this.initializeInstGroup = function(data) {
        this.instGroup = svgContainer.append("g");
        this.instGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", this.center[0])
            .attr("cy", this.center[1])
            .attr("r", 1)
            //.attr("stroke", "black")
            .attr("fill",function(d){return color(d.class);});
    }

    this.updateInst = function(delay = 0) {
        var selection;

        if (delay) {
            selection = this.instGroup.selectAll("circle").transition().duration(delay);
        }
        else {
            selection = this.instGroup.selectAll("circle");
        }

        selection
            .attr("cx", function(d, i){
                return getInstancePosition(d)[0];
            })
            .attr("cy", function(d, i){
                return getInstancePosition(d)[1];
            })
            .attr("opacity", this.dataPointOpacity)
            .attr("r", this.dataPointRadius)
            //.style("opacity",function(d){return o(+d.sepal_width);});
            .attr("fill", function(d){return color(d.class);});
            //console.log("inst update")
    }

    this.updateDaPosition = function(delay = 0){
        var circles, text, lines;

        if(delay){
            circles = this.daGroup.selectAll("circle").transition().duration(delay);
            text = this.daLabelGroup.selectAll("text").transition().duration(delay);
            lines = this.daGroup.selectAll("line").transition().duration(delay);
        }
        else{
            circles = this.daGroup.selectAll("circle");
            text = this.daLabelGroup.selectAll("text");
            lines = this.daGroup.selectAll("line");
        }

        circles
            .attr("cx", function(d) {return d.pos[0];})
            .attr("cy", function(d) {return d.pos[1];});

        text
            .attr("x", function(d) {return d.labelPos[0];})
            .attr("y", function(d) {return d.labelPos[1];});

        lines
            .attr("x2", function(d){ return d.pos[0];})     // x position of the second end of the line
            .attr("y2", function(d){ return d.pos[1];});
    }

    this.rotate = function(angle, axis = "z"){
        var da = this.da;
        for(var daCount = 0; daCount < da.length; daCount++) {
            da[daCount].rotate(angle, axis);
        }
        this.updateDaPosition();
        this.updateInst();
    }
}

getInstancePosition = function(d) {

    var sum = [0, 0];
    var denominatorSum = 0;

    var vc = vizInst;
    var da = vc.da;

    if(radviz) {
        for (var i = 0; i < da.length; i++) {
            var val = (da[i].inverted)? 1 - da[i].scale(+d[da[i].key]) : da[i].scale(+d[da[i].key]);



            //var val = +d[da[i].key];
            //console.log(val);
            //console.log(da[i].vx - vc.x);
            sum[0] += da[i].vx * val * vc.contribution;
            sum[1] += da[i].vy * val * vc.contribution;
            denominatorSum += val * vc.contribution;
        }

        var vc = vizClass;
        var da = vc.da;

        for (var i = 0; i < da.length; i++) {
            var val = da[i].scale(+d[da[i].key]);
            //var val = +d[da[i].key];

            somaX = somaX + da[i].scaledX * val * vc.contribution;
            somaY = somaY + da[i].scaledY * val * vc.contribution;
            somaDenominador = somaDenominador + val * vc.contribution;
        }

        if (somaDenominador == 0) {

            console.log("denom: " + somaDenominador + " ... " + [somaX / somaDenominador, somaY / somaDenominador])
        }
        return [somaX/somaDenominador, somaY/somaDenominador];
        //return [somaX, somaY];
    }
    else {

        var cContr = vizClass.contribution / (vizClass.contribution + vizInst.contribution);
        var aContr = vizInst.contribution / (vizClass.contribution + vizInst.contribution);
        //console.log("class: " + cContr + " inst " + aContr);

        for (var i = 0; i < da.length; i++) {
            var val = (da[i].inverted)? 1 - da[i].scale(+d[da[i].key]) : da[i].scale(+d[da[i].key]);

            sum = add3(sum, mul3(da[i].normalizedPos, val * aContr));
            denominatorSum += val * aContr;
        }

        var vc = vizClass;
        var da = vc.da;

        for (var i = 0; i < da.length; i++) {
            var val = da[i].scale(+d[da[i].key]);

            sum = add3(sum, mul3(da[i].normalizedPos, val * cContr));
            denominatorSum += val * cContr;

        }

        if (denominatorSum == 0) {

            console.log("denom: " + denominatorSum + " ... " + [sum[0] / denominatorSum, sum[1] / denominatorSum])
        }

        //console.log("soma x: " + somaX + " vc.r: " + vc.r + " vc.x: " + vc.x + " somax*r: " + somaX*vc.r);
        return add3(mul3(sum, vc.r), vc.center);
    }
}
