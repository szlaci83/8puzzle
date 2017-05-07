var aStar = require('a-star');
var sequence = [

    //var start9 =
    [7, 6, 0,
        8, 2, 4,
        5, 1, 3],

    //var start14 =
    [8, 6, 3,
        4, 5, 1,
        7, 0, 2],

    //var start23 =
    [8, 6, 3,
        5, 1, 2,
        4, 0, 7],

    //var start4 =
    [5, 8, 3,
        0, 6, 7,
        4, 2, 1],

    //var start10 =
    [8, 7, 3,
        0, 6, 5,
        4, 2, 1],

    //var start16 =
    [7, 6, 3,
        0, 4, 2,
        8, 5, 1],

    //var start13 =
    [8, 7, 6,
        5, 2, 0,
        4, 1, 3],

    //var start25 =
    [2, 8, 6,
        7, 0, 3,
        5, 4, 1],

    //var start19 =
    [7, 2, 6,
        8, 4, 0,
        5, 1, 3],

    //var start22 =
    [8, 6, 0,
        4, 7, 3,
        2, 5, 1]
]


var start =
       [5, 8, 6,
        0, 7, 3,
        4, 2, 1];


var opened = 0;

// shallow entry-wise comparison
function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

var isEnd = function (node) {
    return arraysEqual(node, end);
}

var toTwoD = function (arr, a) {
    var zeropos = arr.indexOf(a);
    //console.log(zeropos);
    var x = zeropos % 3;
    //console.log(x);
    var y = Math.floor(zeropos / 3);
    //console.log(y);
    return [x, y];
}

var toOneD = function (x, y) {
    return (y * 3) + x;
}

var swap = function (arr, a, b) {
    var newArray = arr.slice();
    var temp = newArray[a];
    newArray[a] = newArray[b];
    newArray[b] = temp;
    return newArray;
}

var manhattan = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for (var i = 0; i < 9; i++) {
        var thisCoord = toTwoD(other, i);
        var endCoord = toTwoD(end, i);
        if ((thisCoord[0] != endCoord[0]) && (thisCoord[1] != endCoord[1])) {
            distance += Math.abs(endCoord[0] - thisCoord[0]);
            distance += Math.abs(endCoord[1] - thisCoord[1]);
        }
    }
    //console.log(distance);
    return distance;
}


var end = [1, 2, 3,
           8, 0, 4,
           7, 6, 5];


           //  0  1  2  3  4  5  6  7  8
var mapping = [0, 1, 2, 5, 8, 7, 6, 3];
//var mapping = [0, 1, 2, 8, -1, 3, 7, 6, 5]

//Clockwise mapping of the node
var getClockwiseIndex=function (index) {
    return mapping[index];
}


//S(n) is the sequence score obtained by checking around the non-central squares in turn,
// allotting 2 for every tile not followed by its proper successor and 1 in case that the center is not empty.
var S = function (other) {
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    if (other.indexOf(0) != end.indexOf(0)) {
        distance += 1;
    }
    for (var i = 0; i < 8; i++) {
        if(i==4){continue;}
        if (other[getClockwiseIndex(i+1)] != other[getClockwiseIndex(i)] +1) {
            //console.log(other[i] + "   " +other[i+1]);
            distance += 2;
        }
    }
    return distance;
}

var nilsson = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    return manhattan(other)+  S(other);
}


var misplaced = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for (var i = 0; i < 9; i++) {
        var thisCoord = toTwoD(other, i);
        var endCoord = toTwoD(end, i);
        if ((thisCoord[0] != endCoord[0]) || (thisCoord[1] != endCoord[1])) {
            distance += 1;
        }
    }
    //console.log(distance);
    return distance;
}


var getNeighborsMaxSwap = function (node) {
    var newMoves = [];
    var zeroIndex = node.indexOf(0);
    //console.log(coord);
    for (var i = 0; i < 9; i++) {
        if (node.indexOf(i) != zeroIndex) {
            newMoves.push(swap(node, zeroIndex, i));
        }

    }
    //console.log(newMoves);
    return newMoves;
}


/*
var getPermutations= function (other){
    var temp = other.slice();
    while(!(arraysEqual(temp, end))){
        for (var i = 0; i < 9; i++) {
            if ((temp.indexOf(i) != end.indexOf(i)) && (i != temp.indexOf(0))) {
                swap(temp, temp.indexOf(0),i);
            }
        }
        console.log(temp);

    }

}

getPermutations();
*/





//n-MaxSwap: assume you can swap any tile with the "space". Use the number of steps it takes to solve this problem
// as the heuristic value.
var NMaxSwap = function (other) {
    opened += 1;
    var results = aStar({
        start: start,
        isEnd: isEnd,
        neighbor: getNeighborsMaxSwap,
        distance: distance,
        heuristic: manhattan,
    });
    //console.log(results.cost);
    return results.cost;
}

//Linear Conflict Tiles Definition: Two tiles tj and tk are in a linear conflict if tj and tk are in the same line,
// the goal positions of tj and tk are both in //that line, tj is to the right of tk and goal position of tj is to
// the left of //the goal position of tk.

//TODO: convert ot 1D
var linearConflict = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for (var i = 0; i < 9; i++) {
        //console.log("inloop");
        var Tj = toTwoD(other, i);
        var TjEnd = toTwoD(end, i);
        for (var j = 0; j < 9; j++) {
            if (i != j) {
                var Tk = toTwoD(other, j);
                var TkEnd = toTwoD(end, j);
                //if they are in the same row or column
                if ((Tj[0] != Tk[0]) || (Tj[1] != Tk[1])){
                    continue;
                }
                //if their goal coord in same row
                if (TjEnd[0] == TkEnd[0]){
                    //if Tj is to the right of Tk and goal of Tk is to the right of the goal of Tj
                    if ((Tj[0] > Tkp[0] ) && (TjEnd[0] < TkEnd[0])){
                        distance += 1;
                    }
                }
                //if their goal coord in same row
                if (TjEnd[1] == TkEnd[1]){
                    //if Tj is to the right of Tk and goal of Tk is to the right of the goal of Tj
                    if ((Tj[1] > Tkp[1] ) && (TjEnd[1] < TkEnd[1])){
                        distance += 1;
                    }
                }

            }
        }
    }
    return distance;
}

//X-Y: decompose the problem into two one dimensional problems where the "space" can swap with any tile in an adjacent
//row/column. Add the number of steps from the two subproblems. Number of tiles out of row plus number of tiles out of
//column.
var outOfRowAndColumn = function (other) {
     opened += 1;
        if (!other) {
            var other = end.slice();
        }
        var distance = 0;
        for (var i = 0; i < 9; i++) {
            //console.log("inloop");
            var thisCoord = toTwoD(other, i);
            var endCoord = toTwoD(end, i);
            if (thisCoord[0] != endCoord[0]) {
                distance += 1;
            }
            if (thisCoord[1] != endCoord[1]) {
                distance += 1;
            }
        }
        return distance;
    }


var getNeighbors = function (node) {

    var newMoves = [];
    var coord = toTwoD(node, 0);
    //console.log(coord);
    var x = coord[0];
    var y = coord[1];
    if (x < 2) {
        var newx = x + 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(newx, y)));
    }

    if (x > 0) {
        var newx = x - 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(newx, y)));
    }

    if (y < 2) {
        var newy = y + 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(x, newy)));
    }

    if (y > 0) {
        var newy = y - 1;
        newMoves.push(swap(node, toOneD(x, y), toOneD(x, newy)));
    }

    return newMoves;
};

var distance = function (a, b) {
    return 1;
}

var heuristicFunctions = [manhattan, nilsson, misplaced, outOfRowAndColumn, linearConflict, NMaxSwap ];

var run = function (start, heuristic, file) {
    console.log("Running " + heuristic.name +" heuristics");
    console.log("On: " +start);
    var hrstart = process.hrtime();
    var results = aStar({
        start: start,
        isEnd: isEnd,
        neighbor: getNeighbors,
        distance: distance,
        heuristic: heuristic,
    });
    hrend = process.hrtime(hrstart);
    console.info("Execution time: %ds %dms", hrend[0], hrend[1]/1000000);
    console.log("Visited nodes: "+ opened);
    console.log(results);
    file += "Start node: " + start + "\n" +
                 "Nodes opened: " + opened + "\n" +
                 "Cost: " + results.cost + "\n" +
                 ("Execution time: "+ hrend[0] + " sec " + hrend[1]/1000000 + "ms." ) +"\n"+
                 "###############################################" + "\n";
    return file;
}


var runAll = function (starts, heurs){
    var toFile = "";
    for(var i=0; i < 1; i ++){
        for (var j=0; j < starts.length; j ++) {
            toFile = run(starts[j], heurs[i], toFile );
        }
        var fs = require('fs');
        fs.writeFile(process.cwd()+ "\\" + heurs[i].name + ".txt", toFile, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("file has been saved successfully");
            }
        });


    }
    console.log("All algorithms tested!");
}

runAll(sequence, heuristicFunctions)
run(start, manhattan);