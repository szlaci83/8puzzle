var aStar = require('a-star');

var start9 = [7,6,0,
             8,2,4,
             5,1,3];
var start14 = [ 8   6   3
    4   5   1
    7   0   2];

var start23 = [ 8   6   3
    5   1   2
    4   0   7]

var start4 =[   5   8   3
    0   6   7
    4   2   1]

var start10[  8   7   3
    0   6   5
    4   2   1]

var start16[
    7   6   3
    0   4   2
    8   5   1
]

var start13[
    8   7   6
    5   2   0
    4   1   3]

var start25[
    2   8   6
    7   0   3
    5   4   1
]

var start19[
    7   2   6
    8   4   0
    5   1   3
]
var start22[
    8   6   0
    4   7   3
    2   5   1
]


var start = [5,8,6,
             0,7,3,
             4,2,1];

var end = [1,2,3,
           8,0,4,
           7,6,5];

var opened = 0;
// shallow entry-wise comparison
function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

var isEnd = function(node){
    return arraysEqual(node, end);
}

var toTwoD = function(arr, a){
    var zeropos = arr.indexOf(a);
    //console.log(zeropos);
    var x = zeropos % 3;
    //console.log(x);
    var y = Math.floor(zeropos/3);
    //console.log(y);
    return [x,y];
}

var toOneD = function(x,y){
    return (y*3) + x;
}

var swap = function(arr, a, b){
    var newArray = arr.slice();
    var temp = newArray[a];
    newArray[a] = newArray[b];
    newArray[b] = temp;
    return newArray;
}

var manhattan = function (other) {
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for(var i = 0; i < 9; i++) {
        var thisCoord = toTwoD(other, i);
        var endCoord = toTwoD(end, i);
        if ((thisCoord[0] != endCoord[0]) && (thisCoord[1] != endCoord[1])){
            distance += Math.abs(endCoord[0] - thisCoord[0]);
            distance += Math.abs(endCoord[1] - thisCoord[1]);
        }
    }
    //console.log(distance);
    return distance;
}

//S(n) is the sequence score obtained by checking around the non-central squares in turn,
// allotting 2 for every tile not followed by its proper successor and 1 in case that the center is not empty.
var S = function (other){
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    if (other.indexOf(0) != end.indexOf(0)) { distance += 1;}
    for(var i = 0; i < 8; i++) {
         if(other[i+1] != end[i+1]){distance += 2;}
        }
    return distance;
}

var nilsson = function (other) {
    if (!other) {
        var other = end.slice();
    }
    return manhattan(other) + S(other);
}


var misplaced = function (other){
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for(var i = 0; i < 9; i++) {
        var thisCoord = toTwoD(other, i);
        var endCoord = toTwoD(end, i);
        if ((thisCoord[0] != endCoord[0]) || (thisCoord[1] != endCoord[1])){
            distance += 1;
        }
    }
    //console.log(distance);
    return distance;


}


var getNeighbors = function(node) {

    var newMoves = [];
  var coord = toTwoD(node, 0);
    //console.log(coord);
    var x= coord[0];
    var y= coord[1];
  if (x < 2) {
      var newx = x +1;
      newMoves.push(swap(node, toOneD(x,y), toOneD(newx,y)));
  };
    if (x > 0) {
        var newx = x - 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(newx, y)));
    };
    if (y < 2) {
        var newy = y + 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(x, newy)));
    };

    if (y > 0) {
        var newy = y - 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(x, newy)));
        };
    opened += 1;
    return newMoves;
};

var distance = function(a,b){
    return 1;
}

var results = aStar({
    start: start,
    isEnd: isEnd,
    neighbor: getNeighbors,
    distance: distance,
    heuristic: nilsson,
});

//var moves = getNeighbors(end);
//var path = aStar(options);
console.log(results);
console.log(opened);