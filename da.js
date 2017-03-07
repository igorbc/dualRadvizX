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
    this.r;

    this.updateBasedOnNewArc = function(rv) {
        //console.log(super);
        var arc = this.arc + rv.arc;

        this.x = rv.x + Math.cos(arc) * (rv.r + this.r/2);
        this.y = rv.y + Math.sin(arc) * -(rv.r + this.r/2);

        this.labelX = rv.x +  Math.cos(arc) * (rv.r + this.r);
        this.labelY = (rv.y - (Math.sin(arc) * (rv.r + this.r))) - 15;

        //*/
        this.scaledX = rv.x + Math.cos(arc) * (rv.getScaledR() - this.r/2);
        this.scaledY = rv.y + (Math.sin(arc) * -(rv.getScaledR() - this.r/2));

    }

    this.getInfo = function(){
        return "key: " + this.key + "\n" +
            "pos: " + [this.x, this.y] + "\n" +
            "labelPos: " + [this.labelX, this.labelY] + "\n"; }
}

