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
    vizInst.daGroup.selectAll("circle").call(dragInst);
    vizInst.daLabelGroup.selectAll("circle").call(dragInst);

    //vizClass.daGroup.selectAll("circle").call(dragClass);
}

createDragBehaviour = function(vc, circle, i) {
    var da = vc.da;

    var previousPos = da[i].pos;
    var newPos = [da[i].pos[0] + d3.event.dx, da[i].pos[1] + d3.event.dy, da[i].pos[2]];
    var arcDiff = getAngle2(sub3(newPos, vc.center), sub3(previousPos, vc.center));

    //TODO: this will have to change once RadViz is re-implemented
    da[i].pos = newPos;

    if(!shitfPressed) {
        da[i].distFromOrigin = mag3(da[i].pos);
        da[i].updateVirtualPosition(vc, arcDiff);
        console.log("pos: " + da[i].pos);
    }
    else {
        for(var daCount = 0; daCount < da.length; daCount++) {
            if(da[daCount].key != da[i].key)
                da[daCount].rotate(arcDiff);
        }
    }

    vc.updateDaPosition();

    vizInst.updateInst(true);
}
