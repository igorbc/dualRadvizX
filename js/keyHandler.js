// saves the state of Shift key
handleKeys = function(){
    d3.select("body")
        .on("keydown", function () {
            sa.shitfPressed = d3.event.shiftKey;
            d3.event.preventDefault();
            switch(d3.event.code){
                case "KeyC":
                    vc.acAttr.instGroup.selectAll(".selected").classed("selected", false);
                    console.log("c");
                    break;

                case "ArrowLeft":
                    rotateBasedOnKey(vc, "y");
                    break;

                case "ArrowRight":
                    rotateBasedOnKey(vc, "y", -1);
                    break;
                case "ArrowUp":
                    rotateBasedOnKey(vc, "x");
                    /*
                    else{
                        vc.acAttr.r+=2;
                        vc.acAttr.updatePath();
                        vc.acAttr.alignAvApsWithRadviz();
                        vc.acAttr.updateAvApPositionOnScreen();
                        vc.updateInst();
                    }
                    */
                    break;

                case "ArrowDown":
                    rotateBasedOnKey(vc, "x", -1);
                    break;
                case "KeyR":
                    vc.toggleRvSc(sa.delay);
                    break;
                /*
                case "":
                    rotAngle+=5;
                    console.log("rot angle: " + rotAngle);

                case "":
                    rotAngle-=5;
                    console.log("rot angle: " + rotAngle);
                */
            }
        })
        .on("keyup", function () {
            sa.shitfPressed = d3.event.shiftKey;
        });
}

// axis is one letter ("x", "y" or "z")
// multiplyer multiplies the angle before rotation.
// Should be -1 to invert rotation.
rotateBasedOnKey = function(vc, axis, multiplyer = 1){
    if(!vc.isRadviz){
        if(!d3.event.altKey)
            vc.acAttr.rotate(deg2rad(multiplyer * sa.rotAngle), axis);
        if(!d3.event.shiftKey)
            vc.acClass.rotate(deg2rad(multiplyer * sa.rotAngle), axis);
    }
}
