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
                vc.instPos.push(getInstancePosition(d));
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
}

getInstancePosition = function(d) {

    var sum = [0, 0, 0];
    var denominatorSum = 0;

    var ac = vc.acAttr;
    var avap = ac.avap;

    if(vc.isRadviz) {
        var cContr = vc.acClass.normalizedContribution;
        var aContr = vc.acAttr.normalizedContribution;

        for (var i = 0; i < avap.length; i++) {
            var val = (avap[i].inverted)? 1 - avap[i].scale(+d[avap[i].key]) : avap[i].scale(+d[avap[i].key]);

            sum = add3(sum, mul3(avap[i].normalizedPosFixedRadius, val * aContr));
            denominatorSum += val * aContr;
        }

        var ac = vc.acClass;
        var avap = ac.avap;

        for (var i = 0; i < avap.length; i++) {
            var val = avap[i].scale(+d[avap[i].key]);

            sum = add3(sum, mul3(avap[i].normalizedPosFixedRadius, val * cContr));
            denominatorSum += val * cContr;

        }

        if (denominatorSum == 0) {
            console.log("denom: " + denominatorSum + " ... " + [sum[0] / denominatorSum, sum[1] / denominatorSum])
        }

        //console.log("soma x: " + somaX + " ac.r: " + ac.r + " ac.x: " + ac.x + " somax*r: " + somaX*ac.r);
        return add3(mul3(mul3(sum, vc.r),1/denominatorSum), vc.center);
/*
        for (var i = 0; i < avap.length; i++) {
            var val = avap[i].scale(+d[avap[i].key]);
            //var val = +d[avap[i].key];

            somaX = somaX + avap[i].scaledX * val * ac.contribution;
            somaY = somaY + avap[i].scaledY * val * ac.contribution;
            somaDenominador = somaDenominador + val * ac.contribution;
        }

        if (somaDenominador == 0) {

            console.log("denom: " + somaDenominador + " ... " + [somaX / somaDenominador, somaY / somaDenominador])
        }

        return [sum[0]/denominatorSum, sum[1]/denominatorSum, 0];

        //return [somaX, somaY];
*/
    }
    else {
        var cContr = vc.acClass.normalizedContribution;
        var aContr = vc.acAttr.normalizedContribution;

        for (var i = 0; i < avap.length; i++) {
            var val = (avap[i].inverted)? 1 - avap[i].scale(+d[avap[i].key]) : avap[i].scale(+d[avap[i].key]);

            sum = add3(sum, mul3(avap[i].normalizedPos, val * aContr));
        }

        var ac = vc.acClass;
        var avap = ac.avap;

        for (var i = 0; i < avap.length; i++) {
            var val = avap[i].scale(+d[avap[i].key]);

            sum = add3(sum, mul3(avap[i].normalizedPos, val * cContr));
        }

        //console.log("soma x: " + somaX + " ac.r: " + ac.r + " ac.x: " + ac.x + " somax*r: " + somaX*ac.r);
        return add3(mul3(sum, vc.r), vc.center);
    }
}
