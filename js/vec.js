
function auxRotate(angle, point){
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var rotationMatrix = [
                              [ c, 0,  s],
                              [ 0, 1,  0],
                              [-s, 0,  c],
                             ];

        var rotationMatrix = [
                              [1, 0,  0],
                              [0, c, -s],
                              [0, s,  c],
                             ];

        var rotationMatrix = [
                              [c, -s, 0],
                              [s,  c, 0],
                              [0,  0, 1],
                             ];

        console.log("--after matrix. c and s and angle:");
        console.log(c);
        console.log(s);
        console.log(angle + "in deg: " + (angle/PI)*180);
        //console.log(rotationMatrix);
        //console.log(point);
        var tv = numeric.transpose([point]);
        //console.log(tv);
        var res = numeric.mul(rotationMatrix, tv);
        //console.log("res: " + res + "vvv res inside function");
        //console.log(res);
        res = numeric.transpose(res);
        console.log(res);
        return res[0];
}
