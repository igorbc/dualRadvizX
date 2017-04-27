var PI = Math.PI;
var TWO_PI = PI * 2;

function deg2rad(deg){
    return deg*(PI/180);
}

function add3(vec1, vec2){
    return [vec1[0] + vec2[0],
            vec1[1] + vec2[1],
            vec1[2] + vec2[2]];

}

function sub3(vec1, vec2){
    return [vec1[0] - vec2[0],
            vec1[1] - vec2[1],
            vec1[2] - vec2[2]];

}

// returns an angle between -PI and PI between arrays
// considering only 2 elements
function getAngle2(vec1, vec2){
    var x1, x2, y1, y2;
    x1 = vec1[0];
    x2 = vec2[0];
    y1 = vec1[1];
    y2 = vec2[1];
    return Math.atan2(x1*y2 - x2*y1, x1*x2 + y1*y2);
}

// returns the normalized (unit vector) from a 3 element array
function normalized3(vec3){
    var mag = mag3(vec3);
    return [vec3[0]/mag, vec3[1]/mag, vec3[2]/mag];
}

// returns the magnitude of a 3 element array
function mag3(vec3){
    return Math.sqrt(vec3[0]*vec3[0] + vec3[1]*vec3[1] + vec3[2]*vec3[2]);
}

// multiplies a 3 element array by n
function mul3(vec3, n){
    return [vec3[0]*n, vec3[1]*n, vec3[2]*n]
}

// multiplies a 9 element array (considered a 3x3 matrix)
// by a 3 element array (considered as a column array)
function matMul3(mat3x3, vec3){
    return [mat3x3[0]*vec3[0] + mat3x3[1]*vec3[1] + mat3x3[2]*vec3[2],
            mat3x3[3]*vec3[0] + mat3x3[4]*vec3[1] + mat3x3[5]*vec3[2],
            mat3x3[6]*vec3[0] + mat3x3[7]*vec3[1] + mat3x3[8]*vec3[2]];
}

// rotates 'point' by 'angle' around 'axis' considering the origin as [0, 0]
function rotate3(angle, point, axis = "z"){
        var a = {"x": 0, "y": 1, "z": 2}
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        var rotationMatrix = [[1, 0, 0,
                               0, c, s,
                               0,-s, c],
                              [c, 0,-s,
                               0, 1, 0,
                               s, 0, c],
                              [c, s, 0,
                              -s, c, 0,
                               0, 0, 1]
                            ];

        return matMul3(rotationMatrix[a[axis]], point);
}

// rotates 'point' by 'angle' around 'axis' considering 'origin'
function rotate3around(angle, point, origin, axis = "z"){
    return add3(rotate3(angle, sub3(point, origin), axis), origin);
}

function getPointDistRFromC(point, center, r){
    return add3(mul3(normalized3(sub3(point, center)),r),center);
}
