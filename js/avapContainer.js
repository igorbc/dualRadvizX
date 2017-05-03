/**
 * Created by igorcorrea on 03/12/2015.
 */

// Changed in 26/April/2017
//  This used to be called VizContainer, but now it's called AvApContainer,
//  standing for Axis-Vector-/Anchor-Point- Container. This was done because
//  it's function is mainly to control these groups of elements (in this
//  application there are two groups, one for AV/AP concerning data attributes
//  and one classification results.) The actual data points and classification
//  probabilities will be stored in the new VizContainer (yeah, it got a bit
//  confusing while refactoring,) which will also contain both AV/AP Containers.

// Changed in March/2017
//  This used to be called RvCircle, but now, as it's not always a circle
//  (radviz and star coordinates are being used,) it's called VizContainer.
//  The application will have two of these: one to contain the visualization
//  based on the data attributes, and one for the visualization based on the
//  classification results.
function AvApContainer(){
    this.path;
    this.r;
    this.innerRadvizRadius; //
    this.pxThickness;
    this.color;
    this.avap = [];
    this.avapGroup;
    this.avapLabelGroup;
    this.avapLineGroup;
    this.contribution;
    this.normalizedContribution;
    this.opacity;
    this.dragging = false;
    this.arc = 0;
    this.vc; // the VizContainer which is parent of the AvApContainer.
    this.createPath = function(delay = 0) {
        /*
        var data = [];

        for(var i = 0; i < this.avap.length+3; i++){
            data.push(this.avap[i%this.avap.length].pos);
        }

        this.path = svgContainer.append("path")
            .attr("d", lineFunction(data))
            .attr("stroke", this.color)
            .attr("stroke-width", this.pxThickness)
            .attr("fill", "none")
            ;

        */
        if(this.vc.isRadviz){
/*
            arcFunction = d3.svg.arc()
                .innerRadius(this.r)
                .outerRadius(this.r + this.pxThickness)
                .startAngle(0)
                .endAngle(TWO_PI);
                */
            this.path = svgContainer.append("path");
            this.path.attr("class", "arc")
                .attr("d", this.arcFunction())
                .attr("fill", this.color)
                .attr("opacity", 0)
                .attr("transform", "translate(" + this.vc.center[0] + ", " + this.vc.center[1] + ")");
            this.path
                .transition()
                .duration(delay)
                .attr("opacity", this.normalizedContribution)
                ;
            this.path.moveToBack();

        }
    }

    this.updatePath = function(delay = 0) {
        /*
        var data = [];

        for(var i = 0; i < this.avap.length+3; i++){
            data.push(this.avap[i%this.avap.length].pos);
        }
        */
        this.path.attr("d", this.arcFunction());

        this.path
        .transition()
        .duration(delay)
        .attr("opacity", this.normalizedContribution);
        //*/
    }

    this.initializeAvApInfo = function(headers, data, colorKeys = 0, colorScheme = 0) {
        var normalizedPos = [];
        var avapCount = headers.length;
        for (var i = 0; i < avapCount; i++) {
            var thisAvAp = new AvAp();
            thisAvAp.arc = i/avapCount * TWO_PI;

            thisAvAp.avapContainer = this;
            thisAvAp.key = headers[i];
            thisAvAp.radiusSize = 7;
            thisAvAp.distFromOrigin = vc.acAttr.r;

            normalizedPos = [Math.cos(thisAvAp.arc),
                            -Math.sin(thisAvAp.arc),
                             0];

            thisAvAp.setNewPos(add3(mul3(normalizedPos,thisAvAp.avapContainer.r),
                                  thisAvAp.avapContainer.vc.center));

            if(colorKeys){
                thisAvAp.color = colorScheme(colorKeys[i]);
            }
            else{
                thisAvAp.color = "white";
            }

            thisAvAp.scale = d3.scale.linear()
                .domain([
                    d3.min(data,function(d) {return +d[thisAvAp.key]}),
                    d3.max(data,function(d) {return +d[thisAvAp.key]})
                ])
                .range([0, 1]);

            this.avap[i] = thisAvAp;

        }
    }

    this.createStarCoordLines = function(delay = 0){
        this.avapLineGroup = svgContainer.append("g");
        this.avapLineGroup.selectAll("line")
            .data(this.avap)
            .enter()
            .append("line")          // attach a line
            .style("stroke", "gray")  // colour the line
            .attr("x1", this.vc.center[0])     // x position of the first end of the line
            .attr("y1", this.vc.center[1])      // y position of the first end of the line
            .attr("x2", function(d){ return d.pos[0];})     // x position of the second end of the line
            .attr("y2", function(d){ return d.pos[1];})
            .attr("opacity", 0)
            .transition()
            .duration(delay)
            .attr("opacity", this.contribution)
            ;
        this.avapLineGroup.moveToBack();

    }

    this.createAvApGroup = function() {
        this.avapGroup = svgContainer.append("g");
        this.avapGroup.selectAll("circle")
            .data(this.avap)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return d.pos[0];})
            .attr("cy", function(d){ return d.pos[1];})
            .attr("r", function(d){ return d.radiusSize;})
            .attr("stroke","black")
            .attr("stroke-width", 2)
            .attr("fill", function(d){ return d.color;})
            .attr("opacity", this.contribution);

        this.avapLabelGroup = svgContainer.append("g");
        this.avapLabelGroup.selectAll("text")
            .data(this.avap)
            .enter()
            .append("text")
            .attr("x", function(d){ return d.labelPos[0];})
            .attr("y", function(d){ return d.labelPos[1];})
            .text(function(d){ return d.key;})
            .attr("fill", "black")
            .attr("opacity", this.contribution)
            .style("font-family", "verdana")
            .style("font-size", 12)
            .attr("text-anchor", "middle")
        ;
    }

    // right now this behaviour is to make the AV-APs invertible
    this.addDoubleClickBehaviour = function(delay = 0){
        this.avapGroup.selectAll("circle")
        .on("dblclick", function(d) {
            if(d.color == "white") d.color = "gray";
            else d.color = "white";
            d.inverted = !d.inverted;
            console.log(d.color + " " + d.inverted + " " + d.key);
            d3.select(this).style("fill", d.color);
            vc.updateInst(delay);
        }); 
    }

    this.updateAvApPositionOnScreen = function(delay = 0){
        var circles, text, lines;

        circles = this.avapGroup.selectAll("circle").transition().duration(delay);
        text = this.avapLabelGroup.selectAll("text").transition().duration(delay);

        circles
            .attr("opacity", this.contribution)
            .attr("cx", function(d) {return d.pos[0];})
            .attr("cy", function(d) {return d.pos[1];});

        text
            .attr("opacity", this.contribution)
            .attr("x", function(d) {return d.labelPos[0];})
            .attr("y", function(d) {return d.labelPos[1];});

        if(this.vc.isRadviz){
            this.updatePath(delay);
        }
        else{
            lines = this.avapLineGroup.selectAll("line").transition().duration(delay);
            lines
                .attr("opacity", this.contribution)
                .attr("x2", function(d){ return d.pos[0];})     // x position of the second end of the line
                .attr("y2", function(d){ return d.pos[1];});
        }

    }

    this.rotate = function(angle, axis = "z", updateInstantly = true){
        var avap = this.avap;
        for(var avapCount = 0; avapCount < avap.length; avapCount++) {
            avap[avapCount].rotate(angle, axis);
        }
        this.updateAvApPositionOnScreen();
        if(updateInstantly)
            this.vc.updateInst();
    }

    this.bringAvApsToFront = function(){
        this.avapGroup.selectAll("circle").moveToFront();
        this.avapLabelGroup.selectAll("text").moveToFront();
    }

    this.alignAvApsWithRadviz = function(){
        var avaps = this.avap;
        for(var avapCount = 0; avapCount < avaps.length; avapCount++) {
            var avap = avaps[avapCount];
            avap.pos = [avap.pos[0], avap.pos[1], 0];
            avap.setNewPos(getPointDistRFromC(avap.pos,
                                                  this.vc.center,
                                                  this.r));
        }
    }

    this.arcFunction = function(){
        return d3.svg.arc()
        .innerRadius(this.r)
        .outerRadius(this.r + this.pxThickness)
        .startAngle(0)
        .endAngle(TWO_PI);
    }
}



lineFunction = d3.svg.line()
     .x(function(d) { return d[0]; })
     .y(function(d) { return d[1]; })
     .interpolate("cardinal-open");
