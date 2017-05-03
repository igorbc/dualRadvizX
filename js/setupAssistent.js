// used to make all seemingly arbitrary attribuitions.

function SetupAssistent(){
    //this.defaultFile = "db/ecoli.csv";
    //this.defaultFile = "db/iris.csv";
    this.defaultFile = "db/iris naive bayes.csv"

    this.dataPointOpacity = 0.8;
    this.dataPointRadius = 2.5;

    this.svgWidth = 620;
    this.svgHeight = 620;

    // used for some experimental things regarding opacity and size
    // of circles representing instances.
    this.svgHalfDiagonal = Math.sqrt(
            this.svgHeight*this.svgHeight + this.svgWidth*this.svgWidth)/2;

    this.innerRadvizRadius = 200;
    this.radvizClassRadius = 200;
    this.circlePxThickness = 2;
    this.opacity = 1;

    this.useClass = true;
    this.arc;

    this.vizAttrColor = "mediumSlateBlue";
    this.vizClassColor = "coral";

    this.shitfPressed = false;
    this.rotAngle = 5;
    this.delay = 600;

    this.setBasicVizContainerInfo = function(vc){
        vc.center = [this.svgWidth/2, this.svgHeight/2, 0];
        vc.r = this.innerRadvizRadius;
        vc.dataPointOpacity = this.dataPointOpacity;
        vc.dataPointRadius = this.dataPointRadius;
        vc.zOpacityScale = d3.scale.linear()
            .domain([-this.svgHalfDiagonal, this.svgHalfDiagonal])
            .range([0.5, 0.8]);
        vc.zSizeScale = d3.scale.linear()
                .domain([-this.svgHalfDiagonal, this.svgHalfDiagonal])
                .range([0.5, 8]);
        return vc;
    }

    this.setAvApContainerAttrInfo = function(acAttr, vc){
        acAttr.vc = vc;
        acAttr.pxThickness = this.circlePxThickness;
        acAttr.opacity = this.opacity;
        acAttr.contribution = 1;
        acAttr.normalizedContribution = 1;
        acAttr.color = this.vizAttrColor;
        acAttr.r = this.innerRadvizRadius;
        return acAttr;
    }

    this.setAvApContainerClassInfo = function(acClass, vc){
        acClass.vc = vc;
        acClass.pxThickness = this.circlePxThickness;
        acClass.opacity = this.opacity;
        acClass.contribution = 0;
        acClass.normalizedContribution = 0;
        acClass.color = this.vizClassColor;
        acClass.r = this.radvizClassRadius;
        return acClass;
    }

    this.getSvgContainer = function(){
        return d3.select("#chart")
            .append("svg:svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .style("border", "1px solid black")
            .attr("transform", "translate(0,0)")
            ;
    }

    // returns arrays where
    // [0] is an array with the headers for the Attirbute columns
    // [1] is an array with the headers for the Class Probabiliies columns
    this.getAttrAndClassHeaders = function(data){
        var firstLine = d3.entries(data[0]);
        var allHeaders = [];
        var allHeaderLines = [];

        // what will be returned
        var headerAttr = [];
        var headerClass = [];
        var headerLineAttr = [];

        // gets the index of where the Class Probabiliies columns start

        for (var i = 0; i < firstLine.length; i++) {
            allHeaders.push(firstLine[i].key.toString());
            if (allHeaders[i] == "class") {
                classIndex = i;
            }
        }

        headerAttr = allHeaders.slice(0, classIndex);
        headerClass = allHeaders.slice(classIndex + 1, allHeaders.length - 1);

        return [headerAttr, headerClass];
    }

    this.getClassNames = function(headerClass){
        var classNames = [];

        for (var i = 0; i < headerClass.length; i++) {
            var keyName =  headerClass[i].replace("confidence(", "").replace(")", "");
            console.log(keyName);
            classNames.push(keyName);
        }
        return classNames;
    }

    this.setupBrush = function(csv, svgContainer, acAttr) {
        var brush = d3.svg.polybrush()
                .x(d3.scale.linear().range([0, this.svgWidth]))
                .y(d3.scale.linear().range([0, this.svgHeight]))

                .on("brush", function () {
                    // set the 'selected' class for the circle

                    vc.instGroup.selectAll("circle").classed("selected", function (d) {

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

    this.destroyCurrent = function(){
        svgContainer.selectAll("*").remove();

        color = this.getClassColorScheme();

        d3.selectAll("#parc").remove();
        d3.selectAll("#sliderContainer").append("div")
                .attr("id", "parc")
                .attr("class", "parcoords")
                .style("width","650px")
                .style("height","350px");
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
