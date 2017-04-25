/**
 * Created by igorcorrea on 03/12/2015.
 */

function Da(){
    this.centeredPos = []; // position relative to center, in pixels
    this.pos = []; // actual position, in pixels
    //this.x; // center in pixels
    //this.y;
    this.scaledX; // used only in the class circle
    this.scaledY;
    this.labelPos = [];
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
    this.vizContainer;
    this.inverted = 0;

    this.rotate = function(angle, axis = "z"){
        this.pos = rotate3around(angle, this.pos, this.vizContainer.center, axis);
        this.labelPos = [this.pos[0], this.pos[1]-15];
    }

    this.updateVirtualPosition = function(vc){
        var normalizedDistanceFromOrigin = this.distFromOrigin/vc.r;

        var max = 3;

        if(radviz)
            var virtualScale = max / (1 + Math.exp(- max *(normalizedDistanceFromOrigin - (1/max * (max + Math.log(max-1))))));
        else {
            var virtualScale = normalizedDistanceFromOrigin;
        }

        this.vx = vc.center[0] + (this.pos[0] - vc.center[0]) * virtualScale;
        this.vy = vc.center[1] + (this.pos[1] - vc.center[1]) * virtualScale;
    }

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.pos[0], this.pos[1]] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}
