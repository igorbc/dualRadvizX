/**
 * Created by igorcorrea on 03/12/2015.
 */

setupDragBehaviour = function(vizInst, vizClass) {

    var dragInst = d3.behavior.drag()
        .origin(function(d) { return d; })

        .on("drag", function (d, i) {
            createDragBehaviour(vizInst, this, i);
        });

    var dragClass = d3.behavior.drag()
        .origin(function(d) { return d; })
        //.on("dragstart", dragstarted)
        .on("drag", function (d, i) {
            createDragBehaviour(vizClass, this, i);
        });
/*
    var dragvizInst = d3.behavior.drag()
        //.origin(function(d) { return d; })
        .on("drag", function () {
            //d3.event.delta
            var vc = {}
            vc = vizInst;

            var da = vc.da;

            var x = (d3.event.x - vc.x);
            var y = (d3.event.y - vc.y);

            var mag = Math.sqrt(x*x + y*y);
            x = x/mag;
            y = y/mag;


            if(!vc.dragging) {
                vc.dragging = true;
                dragStartArc = Math.atan2(x,y) - pi/2;
                rvOrigArc = vc.arc;
            }
            else {

                var arcIncrement =  (Math.atan2(x,y) - pi/2) - dragStartArc;

                vc.arc = rvOrigArc +  arcIncrement;

                for(var i = 0; i < da.length; i++) {
                    da[i].updateBasedOnNewArc(vc);
                }

                vizInst.updateInst(true);

                vc.daGroup.selectAll("circle")
                    .attr("cx", function(d, i) {return da[i].x;})
                    .attr("cy", function(d, i) {return da[i].y;});

                vc.daLabelGroup.selectAll("text")
                    .attr("x", function(d, i) {return da[i].labelX;})
                    .attr("y", function(d, i) {return da[i].labelY;});
            }
        });
*/
    vizInst.daGroup.selectAll("circle").call(dragInst);
    vizInst.daLabelGroup.selectAll("circle").call(dragInst);

    //vizClass.daGroup.selectAll("circle").call(dragClass);
}

createDragBehaviour = function(vc, circle, i) {

    var da = vc.da;

    var x = da[i].x + d3.event.dx;
    var y = da[i].y + d3.event.dy;

    da[i].x = x;
    da[i].y = y;

    da[i].labelX = x;
    da[i].labelY = y - 15;

    var xFromCenter = x - vc.x;
    var yFromCenter = y - vc.y;

    var mag = Math.sqrt(Math.pow(xFromCenter, 2) +
        Math.pow(yFromCenter, 2));

    var arcDiff = (Math.atan2(xFromCenter/mag,yFromCenter/mag) - PI/2) - da[i].arc;

    //console.log("arcDiff: " + arcDiff);

    if(!shitfPressed) {
        //da[i].arc += arcDiff;
        //da[i].updateBasedOnNewArc(vc);

        da[i].distFromOrigin = mag;
        da[i].arc += arcDiff;
        da[i].updateVirtualPosition(vc, arcDiff);
        //console.log(da[i].distFromOrigin);
        d3.select(circle)
            .attr("cx", da[i].x)
            .attr("cy", da[i].y);

    }

    else {
        for(var daCount = 0; daCount < da.length; daCount++) {
            da[daCount].arc += arcDiff;
            da[daCount].updateBasedOnNewArc(vc, arcDiff);
            da[daCount].updateVirtualPosition(vc);

        }

        vc.daGroup.selectAll("circle")
            .attr("cx", function(d, i) {return da[i].x;})
            .attr("cy", function(d, i) {return da[i].y;});
        //console.log("move whole group")
    }

    vc.daGroup.selectAll("line")
        .attr("x2", function(d, i) {return da[i].x;})
        .attr("y2", function(d, i) {return da[i].y;})

    vc.daLabelGroup.selectAll("text")
        .attr("x", function(d, i) {return da[i].labelX;})
        .attr("y", function(d, i) {return da[i].labelY;});

    vizInst.updateInst(true);
}
