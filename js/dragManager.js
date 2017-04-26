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

    vizClass.daGroup.selectAll("circle").call(dragClass);
    vizClass.daLabelGroup.selectAll("circle").call(dragClass);
}

createDragBehaviour = function(vc, circle, i) {
    var avap = vc.avap;

    var previousCenteredPos = avap[i].centeredPos;
    var newPos = [avap[i].pos[0] + d3.event.dx, avap[i].pos[1] + d3.event.dy, avap[i].pos[2]];
    var arcDiff = getAngle2(sub3(newPos, vc.center), previousCenteredPos);

    //TODO: this will have to change once RadViz is re-implemented
    avap[i].setNewPos(newPos);

    if(!shitfPressed) {

    }
    else {
        for(var daCount = 0; daCount < avap.length; daCount++) {
            if(avap[daCount].key != avap[i].key)
                avap[daCount].rotate(arcDiff);
        }
    }

    vc.updateDaPositionOnScreen();
    vizInst.updateInst();
}
