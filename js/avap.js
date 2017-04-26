/**
 * Created by igorcorrea on 03/12/2015.
 */

// Stands for Axis-Vector/Anchor-Point,
// as it can be used in Star Coordinates and RadViz, respectively.
function AvAp(){
    this.normalizedPos = []; // position relative to center. It will be between
                             // 0 and 1 if the DA is at the initial distance
                             // from the visualization's center
    this.normalizedPosFixedRadius = [];
    this.centeredPos = []; // position relative to center, in pixels
    this.pos = []; // actual position, in pixels
    this.labelPos = [];
    this.scale;
    this.key;
    this.arc;
    this.color;
    this.radiusSize;
    this.distFromCenter;
    this.vx;
    this.vy;
    this.avapContainer; // the AvApContainer which is parent of the AvAp.
    this.inverted = 0;

    this.rotate = function(angle, axis = "z"){
        this.setNewPos(rotate3around(angle, this.pos, this.avapContainer.vc.center, axis));
    }

    this.setNewPos = function(pos){
        this.pos = pos;
        this.labelPos = [this.pos[0], this.pos[1]-15];
        this.centeredPos = sub3(pos, this.avapContainer.vc.center);
        this.distFromCenter = mag3(this.centeredPos);
        this.normalizedPos = mul3(this.centeredPos, 1/this.avapContainer.vc.r);
        this.normalizedPosFixedRadius = mul3(this.centeredPos, 1/this.avapContainer.r);
    }

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.pos[0], this.pos[1]] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}
