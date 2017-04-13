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
            .attr("transform","translate(" + this.x + ", " + this.y + ")");
    }

    this.initializeDaInfo = function(headers, data) {
        var unscaledX;
        var unscaledY;
        var daCount = headers.length;
        for (var i = 0; i < daCount; i++) {
            var thisDa = new Da();
            thisDa.arc = i/daCount * TWO_PI;

            unscaledX = Math.cos(thisDa.arc);
            unscaledY = -Math.sin(thisDa.arc);

            thisDa.key = headers[i].key.toString();
            thisDa.radiusSize = 7;
            thisDa.distFromOrigin = vizInst.r;

            thisDa.vx = thisDa.x = this.x + unscaledX * (this.r + thisDa.radiusSize/2);
            thisDa.vy = thisDa.y = this.y + unscaledY * (this.r + thisDa.radiusSize/2);


            thisDa.labelX = this.x + unscaledX * (this.r + thisDa.radiusSize);
            thisDa.labelY = (this.y + unscaledY * (this.r + thisDa.radiusSize)) - 15;

            //console.log(this.instanceRadius);

            if (this.innerRadvizRadius !== undefined) {
                thisDa.scaledX = this.x + unscaledX * (this.innerRadvizRadius - thisDa.radiusSize/2);
                thisDa.scaledY = this.y + unscaledY * (this.innerRadvizRadius - thisDa.radiusSize/2);
            }
            else {
                thisDa.scaledX = this.x + unscaledX * (this.r - thisDa.radiusSize/2);
                thisDa.scaledY = this.y + unscaledY * (this.r - thisDa.radiusSize/2);
            }

            thisDa.color = "white";

            thisDa.scale = d3.scale.linear()
                .domain([
                    d3.min(data,function(d) {return +d[thisDa.key]}),
                    d3.max(data,function(d) {return +d[thisDa.key]})
                ])
                .range([0, 1]);

            //console.log(thisDa.getInfo());
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
            .attr("x1", this.x)     // x position of the first end of the line
            .attr("y1", this.y)      // y position of the first end of the line
            .attr("x2", function(d){ return d.x;})     // x position of the second end of the line
            .attr("y2", function(d){ return d.y;});

        this.daGroup.selectAll("circle")
            .data(this.da)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return d.x;})
            .attr("cy", function(d){ return d.y;})
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
                vizInst.updateInst(false);
            });

        this.daLabelGroup = svgContainer.append("g");
        this.daLabelGroup.selectAll("text")
            .data(this.da)
            .enter()
            .append("text")
            .attr("x", function(d){ return d.labelX;})
            .attr("y", function(d){ return d.labelY;})
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
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", 1)
            //.attr("stroke", "black")
            .attr("fill",function(d){return color(d.class);});
    }

    this.updateInst = function(instantly) {
        var selection;

        //console.log("starting inst update")

        if (!instantly) {
            selection = this.instGroup.selectAll("circle").transition().duration(1000);
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
            .attr("fill",function(d){return color(d.class);});
            //console.log("inst update")
    }

}

getInstancePosition = function(d) {

    var somaX = 0;
    var somaY = 0;
    var somaDenominador = 0;

    var rv = vizInst;
    var da = rv.da;

    if(radviz) {
        for (var i = 0; i < da.length; i++) {
            var val = (da[i].inverted)? 1 - da[i].scale(+d[da[i].key]) : da[i].scale(+d[da[i].key]);



            //var val = +d[da[i].key];
            //console.log(val);
            //console.log(da[i].vx - rv.x);
            somaX = somaX + da[i].vx * val * rv.contribution;
            somaY = somaY + da[i].vy * val * rv.contribution;
            somaDenominador = somaDenominador + val * rv.contribution;
        }

        var rv = vizClass;
        var da = rv.da;

        for (var i = 0; i < da.length; i++) {
            var val = da[i].scale(+d[da[i].key]);
            //var val = +d[da[i].key];

            somaX = somaX + da[i].scaledX * val * rv.contribution;
            somaY = somaY + da[i].scaledY * val * rv.contribution;
            somaDenominador = somaDenominador + val * rv.contribution;
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

            //var val = +d[da[i].key];
            //console.log(val);

            //console.log((da[i].vx - rv.x)/rv.r);

            //da[i].vx = (da[i].vx - rv.x)/rv.r;
            //da[i].vy = (da[i].vy - rv.y)/rv.r;



            somaX = somaX + ((da[i].vx - rv.x)/rv.r) * val * aContr;
            somaY = somaY + ((da[i].vy - rv.y)/rv.r) * val * aContr;
            somaDenominador = somaDenominador + val * aContr;
        }
//*
        var rv = vizClass;
        var da = rv.da;

        for (var i = 0; i < da.length; i++) {
            var val = da[i].scale(+d[da[i].key]);
            //var val = +d[da[i].key];


            somaX = somaX + ((da[i].scaledX - rv.x)/rv.r) * val * cContr;
            somaY = somaY + ((da[i].scaledY - rv.y)/rv.r)* val * cContr;
            somaDenominador = somaDenominador + val * cContr;

        }

      //  somaX = somaX/2;
      //  somaY = somaY/2;
//*/
        if (somaDenominador == 0) {

            console.log("denom: " + somaDenominador + " ... " + [somaX / somaDenominador, somaY / somaDenominador])
        }

        //console.log("soma x: " + somaX + " rv.r: " + rv.r + " rv.x: " + rv.x + " somax*r: " + somaX*rv.r);
        return [somaX*rv.r + rv.x, somaY*rv.r + rv.y];
    }
}
