/**
 * Created by igorcorrea on 03/12/2015.
 */

setupDragBehaviour = function(acAttr, acClass) {

    var dragInst = d3.behavior.drag()
        .origin(function(d) { return d; })

        .on("drag", function (d, i) {
            createDragBehaviour(acAttr, this, i);
        });

    var dragClass = d3.behavior.drag()
        .origin(function(d) { return d; })
        //.on("dragstart", dragstarted)
        .on("drag", function (d, i) {
            createDragBehaviour(acClass, this, i);
        });

    acAttr.avapGroup.selectAll("circle").call(dragInst);
    acAttr.avapLabelGroup.selectAll("circle").call(dragInst);

    acClass.avapGroup.selectAll("circle").call(dragClass);
    acClass.avapLabelGroup.selectAll("circle").call(dragClass);
}

createDragBehaviour = function(ac, circle, i) {
    var avap = ac.avap;
    var arcDiff;
    var newPos;

    var centeredPrevPos = avap[i].centeredPos;

    if(ac.vc.isRadviz){
        newPos = [d3.event.sourceEvent.layerX, d3.event.sourceEvent.layerY, avap[i].pos[2]];
        var centeredNewPos = sub3(newPos, ac.vc.center);
        var circleBoundNewPos = mul3(normalized3(centeredNewPos), ac.r);
        arcDiff = getAngle2(circleBoundNewPos, centeredPrevPos);
        newPos = add3(circleBoundNewPos, ac.vc.center);
    }
    else{
        newPos = [avap[i].pos[0] + d3.event.dx, avap[i].pos[1] + d3.event.dy, avap[i].pos[2]];
        var centeredNewPos = sub3(newPos, ac.vc.center);
        arcDiff = getAngle2(centeredNewPos, centeredPrevPos);
    }

    avap[i].setNewPos(newPos);

    if(shitfPressed) {
        for(var avapCount = 0; avapCount < avap.length; avapCount++) {
            if(avap[avapCount].key != avap[i].key)
                avap[avapCount].rotate(arcDiff);
        }
    }

    ac.updateAvApPositionOnScreen();
    ac.vc.updateInst();
}
