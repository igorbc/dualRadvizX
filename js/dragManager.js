/**
 * Created by igorcorrea on 03/12/2015.
 */

setupDragBehaviour = function(rvInst, rvClass) {

    var dragInst = d3.behavior.drag()
        .origin(function(d) { return d; })

        .on("drag", function (d, i) {
            createDragBehaviour(rvInst, this, i);
        });

    var dragClass = d3.behavior.drag()
        .origin(function(d) { return d; })
        //.on("dragstart", dragstarted)
        .on("drag", function (d, i) {
            createDragBehaviour(rvClass, this, i);
        });
/*
    var dragRvInst = d3.behavior.drag()
        //.origin(function(d) { return d; })
        .on("drag", function () {
            //d3.event.delta
            var rv = {}
            rv = rvInst;

            var da = rv.da;

            var x = (d3.event.x - rv.x);
            var y = (d3.event.y - rv.y);

            var mag = Math.sqrt(x*x + y*y);
            x = x/mag;
            y = y/mag;


            if(!rv.dragging) {
                rv.dragging = true;
                dragStartArc = Math.atan2(x,y) - pi/2;
                rvOrigArc = rv.arc;
            }
            else {

                var arcIncrement =  (Math.atan2(x,y) - pi/2) - dragStartArc;

                rv.arc = rvOrigArc +  arcIncrement;

                for(var i = 0; i < da.length; i++) {
                    da[i].updateBasedOnNewArc(rv);
                }

                rvInst.updateInst(true);

                rv.daGroup.selectAll("circle")
                    .attr("cx", function(d, i) {return da[i].x;})
                    .attr("cy", function(d, i) {return da[i].y;});

                rv.daLabelGroup.selectAll("text")
                    .attr("x", function(d, i) {return da[i].labelX;})
                    .attr("y", function(d, i) {return da[i].labelY;});
            }
        });
*/
    rvInst.daGroup.selectAll("circle").call(dragInst);
    rvInst.daLabelGroup.selectAll("circle").call(dragInst);
    rvClass.daGroup.selectAll("circle").call(dragClass);
}

createDragBehaviour = function(rv, circle, i) {

    var da = rv.da;

    var x = da[i].x + d3.event.dx;
    var y = da[i].y + d3.event.dy;

    da[i].x = x;
    da[i].y = y;

    da[i].labelX = x;
    da[i].labelY = y - 15;

    var xFromCenter = x - rv.x;
    var yFromCenter = y - rv.y;

    var mag = Math.sqrt(Math.pow(xFromCenter, 2) +
        Math.pow(yFromCenter, 2));

    var arcDiff = (Math.atan2(xFromCenter/mag,yFromCenter/mag) - pi/2) - da[i].arc;

    if(shitfPressed) {
        //da[i].arc += arcDiff;
        //da[i].updateBasedOnNewArc(rv);

        d3.select(circle)
            .attr("cx", da[i].x)
            .attr("cy", da[i].y);
            //console.log(x + y)
    }

    else {
        for(var daCount = 0; daCount < da.length; daCount++) {
            da[daCount].arc += arcDiff;
            da[daCount].updateBasedOnNewArc(rv, mag);

        }

        rv.daGroup.selectAll("circle")
            .attr("cx", function(d, i) {return da[i].x;})
            .attr("cy", function(d, i) {return da[i].y;});
        console.log("move whole group")
    }


    rv.daLabelGroup.selectAll("text")
        .attr("x", function(d, i) {return da[i].labelX;})
        .attr("y", function(d, i) {return da[i].labelY;});

    rvInst.updateInst(true);
}
