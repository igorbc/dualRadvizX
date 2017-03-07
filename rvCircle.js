/**
 * Created by igorcorrea on 03/12/2015.
 */

function RvCircle(){
    this.path;
    this.x;
    this.y;
    this.r;
    this.instanceRadius;
    this.thickness;
    this.color;
    this.da = [];
    this.daGroup;
    this.daLabelGroup;
    this.contribution;
    this.dragging = false;
    this. arc = 0;
    this.createPath = function() {
        arc = d3.svg.arc()
            .innerRadius(this.r)
            .outerRadius(this.r + this.thickness)
            .startAngle(0)
            .endAngle(twoPi);

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
            thisDa.arc = i/daCount * twoPi;

            unscaledX = Math.cos(thisDa.arc);
            unscaledY = -Math.sin(thisDa.arc);

            thisDa.key = headers[i].key.toString();
            thisDa.r = 7;

            thisDa.x = this.x + unscaledX * (this.r + thisDa.r/2);
            thisDa.y = this.y + unscaledY * (this.r + thisDa.r/2);

            thisDa.labelX = this.x + unscaledX * (this.r + thisDa.r);
            thisDa.labelY = (this.y + unscaledY * (this.r + thisDa.r)) - 15;

            //console.log(this.instanceRadius);

            if (this.instanceRadius !== undefined) {
                thisDa.scaledX = this.x + unscaledX * (this.instanceRadius - thisDa.r/2);
                thisDa.scaledY = this.y + unscaledY * (this.instanceRadius - thisDa.r/2);
            }
            else {
                thisDa.scaledX = this.x + unscaledX * (this.r - thisDa.r/2);
                thisDa.scaledY = this.y + unscaledY * (this.r - thisDa.r/2);
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

        if (this.instanceRadius !== undefined) {

            return this.instanceRadius;
        }

        return this.r;
    }
    this.createDaGroup = function() {
        this.daGroup = svgContainer.append("g");
        this.daGroup.selectAll("circle")
            .data(this.da)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return d.x;})
            .attr("cy", function(d){ return d.y;})
            .attr("r", function(d){ return d.r;})
            .attr("fill",function(d){ return d.color;})
            .attr("stroke","black")
            .attr("stroke-width", 2);

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
            .attr("cy", function(d, i){return getInstancePosition(d)[1];
            })
            .attr("opacity",.7)
            .attr("r", 3.5)
            //.style("opacity",function(d){return o(+d.sepal_width);});
            .attr("fill",function(d){return color(d.class);});
    }

}

getInstancePosition = function(d) {

    var somaX = 0;
    var somaY = 0;
    var somaDenominador = 0;

    var rv = rvInst;
    var da = rv.da;

    for (var i = 0; i < da.length; i++) {
        var val = da[i].scale(+d[da[i].key]);
        //var val = +d[da[i].key];
        //console.log(val);
        somaX = somaX + da[i].x * val * rv.contribution;
        somaY = somaY + da[i].y * val * rv.contribution;
        somaDenominador = somaDenominador + val * rv.contribution;
    }

    var rv = rvClass;
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
}