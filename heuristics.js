/**
 * Created by Laszlo Szoboszlai on 02/05/2017.
 *
 *  Module with the implemented heuristic functions, and helper functions.
 *
 *  uses the a-star search module.
 */

var aStar = require('a-star');

//Goal state of the problem
var end = [1, 2, 3,
           8, 0, 4,
           7, 6, 5];

//Clockwise mapping of the node
//             0  1  2  3  4  5  6  7  8
var mapping = [0, 1, 2, 5, 8, 7, 6, 3];
var getClockwiseIndex = function (index) {
    return mapping[index];
}

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

var to2D = function (arr, a) {
    var zeropos = arr.indexOf(a);
    //console.log(zeropos);
    var x = zeropos % 3;
    //console.log(x);
    var y = Math.floor(zeropos / 3);
    //console.log(y);
    return [x, y];
}

var to1D = function (x, y) {
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
        var thisCoord = to2D(other, i);
        var endCoord = to2D(end, i);
        if ((thisCoord[0] != endCoord[0]) || (thisCoord[1] != endCoord[1])) {
            distance += Math.abs(endCoord[0] - thisCoord[0]);
            distance += Math.abs(endCoord[1] - thisCoord[1]);
        }
    }
    return distance;
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
    for (var i = 0; i < 7; i++) {
        if (other[getClockwiseIndex(i + 1)] != (other[getClockwiseIndex(i)] + 1)) {
            distance += 2;
        }
    }
    return distance;
}

//Nilson's Sequence Score
var NSS = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    return manhattan(other) + (3 * S(other));
}

//Number of tiles that are not in the final position (not counting the blank)
var misplaced = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for (var i = 0; i < 9; i++) {
        //(not counting the blank)
        if (i == other.indexOf(0)) {
            continue;
        }
        //Check if tile in the final position
        if (other.indexOf(i) != end.indexOf(i)) {
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
var linearConflict = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var distance = 0;
    for (var i = 0; i < 9; i++) {
        var Tj = to2D(other, i);
        var TjEnd = to2D(end, i);
        for (var j = 0; j < 9; j++) {
            if (i != j) {
                var Tk = to2D(other, j);
                var TkEnd = to2D(end, j);
                //if they are in the same row or column
                if ((Tj[0] != Tk[0]) || (Tj[1] != Tk[1])) {
                    continue;
                }
                //if their goal coord in same row
                if (TjEnd[0] == TkEnd[0]) {
                    //if Tj is to the right of Tk and goal of Tk is to the right of the goal of Tj
                    if ((Tj[0] > Tkp[0] ) && (TjEnd[0] < TkEnd[0])) {
                        distance += 1;
                    }
                }
                //if their goal coord in same row
                if (TjEnd[1] == TkEnd[1]) {
                    //if Tj is to the right of Tk and goal of Tk is to the right of the goal of Tj
                    if ((Tj[1] > Tkp[1] ) && (TjEnd[1] < TkEnd[1])) {
                        distance += 1;
                    }
                }
            }
        }
    }
    var MD = manhattan(other);
    return MD + distance;
}

//h = Number of tiles out of row + number of tiles out of column
var outOfRowAndColumn = function (other) {
    opened += 1;
    if (!other) {
        var other = end.slice();
    }
    var row = 0;
    var column = 0;
    for (var i = 0; i < 9; i++) {
        //not counting 0
        if (i == other.indexOf(0)) {
            continue;
        }
        var thisCoord = to2D(other, i);
        var endCoord = to2D(end, i);
        //Different row
        if (thisCoord[0] != endCoord[0]) {
            row += 1;
        }
        //Different column
        if (thisCoord[1] != endCoord[1]) {
            column += 1;
        }
    }
    return row + column;
}

//function to generate neighbors
var getNeighbors = function (node) {

    var newMoves = [];
    var coord = to2D(node, 0);
    //console.log(coord);
    var x = coord[0];
    var y = coord[1];
    if (x < 2) {
        var newx = x + 1;
        newMoves.push(swap(node, to1D(x, y), to1D(newx, y)));
    }

    if (x > 0) {
        var newx = x - 1;
        newMoves.push(swap(node, to1D(x, y), to1D(newx, y)));
    }

    if (y < 2) {
        var newy = y + 1;
        newMoves.push(swap(node, to1D(x, y), to1D(x, newy)));
    }

    if (y > 0) {
        var newy = y - 1;
        newMoves.push(swap(node, to1D(x, y), to1D(x, newy)));
    }

    return newMoves;
};

var distance = function (a, b) {
    return 1;
}

module.exports = {
    manhattan: manhattan,
    NSS: NSS,
    NMaxSwap: NMaxSwap,
    getNeighbors: getNeighbors,
    isEnd: isEnd,
    linearConflict: linearConflict,
    outOfRowAndColumn: outOfRowAndColumn,
    misplaced: misplaced,
    end: end,
    distance: distance
};