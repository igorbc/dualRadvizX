
function SetupAssistent(){
    this.defaultFile = "db/iris.csv";
    //this.defaultFile = "db/ecoli.csv";

    this.dataPointOpacity = 0.8;
    this.dataPointRadius = 2.5;

    this.svgWidth = 800;
    this.svgHeight = 620;

    this.innerRadvizRadius = 130;
    this.radvizClassRadius = 130;
    this.circlePxThickness = 2;

    this.useClass = true;
    this.arc;

    this.vizInstColor = "mediumSlateBlue";
    this.vizClassColor = "coral";

    this.setBasicVizContainerInfo = function(vizContainer){
        vizContainer.x = this.svgWidth / 2;
        vizContainer.y = this.svgHeight / 2;
        vizContainer.pxThickness = this.circlePxThickness;
        vizContainer.dataPointOpacity = this.dataPointOpacity;
        vizContainer.dataPointRadius = this.dataPointRadius;
        return vizContainer;
    }

    this.setVizInstInfo = function(vizInst){
        vizInst.contribution = 1;
        vizInst.color = this.vizInstColor;
        vizInst.r = this.innerRadvizRadius;
        return vizInst;
    }

    this.setVizClassInfo = function(vizClass){
        vizClass.contribution = 0;
        vizClass.color = this.vizClassColor;
        vizClass.r = this.radvizClassRadius;
        vizClass.innerRadvizRadius = this.innerRadvizRadius;
        return vizClass;
    }

    this.getSvgContainer = function(){
        return d3.select("#chart")
            .append("svg:svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .style("border", "1px solid black")
            .attr("transform", "translate(0,0)");
    }

    this.setupBrush = function(csv, svgContainer, vizInst) {
        var brush = d3.svg.polybrush()
                .x(d3.scale.linear().range([0, this.svgWidth]))
                .y(d3.scale.linear().range([0, this.svgHeight]))

                .on("brush", function () {
                    // set the 'selected' class for the circle

                    vizInst.instGroup.selectAll("circle").classed("selected", function (d) {

                        var x = d3.select(this).attr("cx");
                        var y = d3.select(this).attr("cy");

                        if (brush.isWithinExtent(x, y)) {
                            d3.select(this).classed("selected", true);
                            d.mouseOver = 1;

                            return true;
                        } else {
                            d3.select(this).classed("selected", false);
                            d.mouseOver = 0;

                        }

                    });
                    colorAll = false;
                    parcoords.data(csv).alpha(1).render();
                });

        svgContainer.append("g")
                .attr("class", "brush")
                .call(brush);
    }

    this.getClassColorScheme = function(){
        return d3.scale.category10();

        // TODO: Change the application to accomodate a better color scheme.
        /*
        function color(n) {
            var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6",
            "#3b3eac"];
            return colores_g[n % colores_g.length];
        }
        */
        }

}
