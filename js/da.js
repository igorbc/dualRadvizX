/**
 * Created by igorcorrea on 03/12/2015.
 */

function Da(){
    this.x;
    this.y;
    this.scaledX;
    this.scaledY;
    this.labelX;
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

    this.updateBasedOnNewArc = function(rv, mag) {
        //console.log(super);
        var arc = this.arc + rv.arc;

        //this.x = rv.x + Math.cos(arc) * (rv.r + this.r/2);
        //this.y = rv.y + Math.sin(arc) * -(rv.r + this.r/2);

        this.x = rv.x + Math.cos(arc) * (this.distFromOrigin + this.radiusSize/2);
        this.y = rv.y + Math.sin(arc) * -(this.distFromOrigin + this.radiusSize/2);


        this.labelX = rv.x +  Math.cos(arc) * (this.distFromOrigin + this.radiusSize);
        this.labelY = (rv.y - (Math.sin(arc) * (this.distFromOrigin + this.radiusSize))) - 15;

        //*/
        this.scaledX = rv.x + Math.cos(arc) * (rv.getScaledR() - this.radiusSize/2);
        this.scaledY = rv.y + (Math.sin(arc) * -(rv.getScaledR() - this.radiusSize/2));
        //console.log("updateBasedOnNewArc")
    }

    this.updateVirtualPosition = function(rv){
        var normalizedDistanceFromOrigin = this.distFromOrigin/rv.r;

        var max = 3;

        //var virtualScale = max / (1 + Math.exp(- max *(normalizedDistanceFromOrigin - (1/max * (max + Math.log(max-1))))));

        //var virtualScale = normalizedDistanceFromOrigin * normalizedDistanceFromOrigin;
        var virtualScale = normalizedDistanceFromOrigin

        //console.log(virtualScale);

        this.vx = rv.x + (this.x - rv.x) * virtualScale;
        this.vy = rv.y + (this.y - rv.y) * virtualScale;
    }

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.x, this.y] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}
