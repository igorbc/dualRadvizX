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

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.x, this.y] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}
