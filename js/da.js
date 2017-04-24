/**
 * Created by igorcorrea on 03/12/2015.
 */

function Da(){
    this.centeredPos = []; // position relative to center, in pixels
    this.pos = []; // actual position, in pixels
    this.x; // center in pixels
    this.y;
    this.scaledX; // used only in the class circle
    this.scaledY;
    this.labelX; // in pixels
    this.labelY;
    this.scale;
    this.key;
    this.arc;
    this.color;
    this.radiusSize;
    this.distFromOrigin;
    this.vx;
    this.vy;
    this.inverted = 0;

    this.updateBasedOnNewArc = function(vc, arcDiff) {
        //console.log(super);
        var arc = this.arc + vc.arc;
        this.x = vc.x + Math.cos(arc) * (this.distFromOrigin);
        this.y = vc.y + Math.sin(arc) * -(this.distFromOrigin);
//*
        var origin = [vc.x, vc.y, 0];
        //console.log("origin:" + origin);

        var originalPos = [this.x, this.y, 0];
        //console.log("originalPos:" + originalPos);

        var centeredPos = numeric.sub(originalPos, origin);
        //console.log("centeredPos:" + centeredPos);
        //console.log("angle:" + arcDiff);

        var newPos = auxRotate(arcDiff, centeredPos);
        //var newPos = auxRotate((PI/180)*5, centeredPos);
        console.log("returned new pos");
        console.log(newPos);
        console.log("origin");
        console.log(origin);
        newPos = numeric.add(newPos, origin);

        //console.log("summed new pos");
        console.log(newPos);
        console.log("new x: " + newPos[X] + " and y: " + newPos[Y]);

        //this.x = newPos[0];
        //this.y = newPos[1];
//*/
        this.labelX = vc.x +  Math.cos(arc) * (this.distFromOrigin + this.radiusSize);
        this.labelY = (vc.y - (Math.sin(arc) * (this.distFromOrigin + this.radiusSize))) - 15;

        // not sure what this does. commented for now...
        this.scaledX = vc.x + Math.cos(arc) * (vc.getScaledR() - this.radiusSize/2);
        this.scaledY = vc.y + (Math.sin(arc) * -(vc.getScaledR() - this.radiusSize/2));

    }

    this.updateVirtualPosition = function(vc){
        var normalizedDistanceFromOrigin = this.distFromOrigin/vc.r;

        var max = 3;

        if(radviz)
            var virtualScale = max / (1 + Math.exp(- max *(normalizedDistanceFromOrigin - (1/max * (max + Math.log(max-1))))));
        else {
            var virtualScale = normalizedDistanceFromOrigin;
        }

        this.vx = vc.x + (this.x - vc.x) * virtualScale;
        this.vy = vc.y + (this.y - vc.y) * virtualScale;
    }

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.x, this.y] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}
