function VizContainer(){
    this.isRadviz = true;
    this.center = []; // center in pixel coordinates.
                      // Shared by the AV-AP Containers
    this.r; // initial radius from center to AV-APs in pixel.
            // Shared by the AV-AP Containers while calculating instances'
            // positions.
    this.acClass;
    this.acAttr;

    this.center;
    this.dataPointOpacity;
    this.dataPointRadius;
    this.instGroup; // svg group containing the data points
    this.instPos = []; // holds the position in screen coordinates
                       //(pixels in the SVG) of every data point.

    this.createAcApContainers = function(){
        this.acAttr = new AvApContainer();
        this.acClass = new AvApContainer();

        sa.setBasicVizContainerInfo(this);
        sa.setAvApContainerAttrInfo(this.acAttr, vc);
        sa.setAvApContainerClassInfo(this.acClass, vc);
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
            .attr("fill",function(d){return color(d.class);});
    }

    this.updateInst = function(delay = 0) {
        this.instPos = [];
        var selection;

        if (delay) {
            selection = this.instGroup.selectAll("circle").transition().duration(delay);
        }
        else {
            selection = this.instGroup.selectAll("circle");
        }

        selection
            .each(function(d,i){
                vc.instPos.push(vc.getInstancePosition(d));
            })
            .attr("cx", function(d, i){
                return vc.instPos[i][0];
            })
            .attr("cy", function(d, i){
                return vc.instPos[i][1];
            })
            .attr("opacity", this.dataPointOpacity)
            .attr("r", this.dataPointRadius)
            /*
            .attr("opacity", function(d, i){
                //console.log(vc.acAttr.instPos[i][2]);
                return  vc.acAttr.zOpacityScale(this.instPos[i][2]);
            })
            .attr("r", function(d, i){
                return vc.acAttr.zSizeScale(this.instPos[i][2])
            })
            */
            .attr("fill", function(d){return color(d.class);});
    }

    this.getInstancePosition = function(d) {

        var sum = [0, 0, 0];
        var denominatorSum = 0;

        var contributions = [vc.acAttr.normalizedContribution,
                             vc.acClass.normalizedContribution];

        var avaps = [vc.acAttr.avap,
                     vc.acClass.avap];

        // RadViz
        if(vc.isRadviz) {
            for(var j = 0; j < contributions.length; j++){
                var avap = avaps[j];
                for(var i = 0; i < avap.length; i++) {
                    var val = (avap[i].inverted)?
                              1 - avap[i].scale(+d[avap[i].key]) :
                                  avap[i].scale(+d[avap[i].key]);

                    sum = add3(sum, mul3(avap[i].normalizedPosFixedRadius, val * contributions[j]));
                    denominatorSum += val * contributions[j];
                }
            }
            if (denominatorSum == 0)
                console.log("denom: " + denominatorSum);
            return add3(mul3(mul3(sum, vc.r),1/denominatorSum), vc.center);
        }

        // Star Coordinates
        else {
            for(var j = 0; j < contributions.length; j++){
                var avap = avaps[j];
                for(var i = 0; i < avap.length; i++) {
                    var val = (avap[i].inverted)?
                              1 - avap[i].scale(+d[avap[i].key]) :
                                  avap[i].scale(+d[avap[i].key]);

                    sum = add3(sum, mul3(avap[i].normalizedPos, val * contributions[j]));
                }
            }
            return add3(mul3(sum, vc.r), vc.center);
        }
    }

    this.toggleRvSc = function(){
        this.isRadviz = !this.isRadviz;
        if(this.isRadviz){
            vc.acAttr.avapLineGroup.selectAll("line")
                .transition()
                .duration(delay)
                .attr("opacity",0).remove();

            vc.acClass.avapLineGroup.selectAll("line")
                .transition()
                .duration(delay)
                .attr("opacity",0).remove();

            vc.acAttr.createPath(delay);
            vc.acClass.createPath(delay);
            vc.acAttr.alignAvApsWithRadviz();
            vc.acClass.alignAvApsWithRadviz();
        }
        else{
            vc.acAttr.path
                .transition()
                .duration(delay)
                .attr("opacity",0)
                .remove();

            vc.acClass.path
                .transition()
                .duration(delay)
                .attr("opacity",0)
                .remove();

            vc.acAttr.createStarCoordLines(delay);
            vc.acClass.createStarCoordLines(delay);
        }
        vc.acAttr.updateAvApPositionOnScreen(delay);
        vc.acClass.updateAvApPositionOnScreen(delay);
        vc.updateInst(delay);
        //onD3TransitionsEnd(t1,t2,cb);
    }
}
