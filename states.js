/**
 * Created by Laszlo Szoboszlai on 09/05/2017.
 *
 *  Module containing the given sequence of states to examine.
 */

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

//hard initial state
var hard = [0, 2, 1,
            7, 4, 5,
            6, 3, 8];
//testcase
var start = [5, 8, 6,
             0, 7, 3,
             4, 2, 1];
//Goal state
var end = [1, 2, 3,
           8, 0, 4,
           7, 6, 5];

module.exports = {
    sequence: sequence,
    hard: hard,
    start: start,
    end: end
}