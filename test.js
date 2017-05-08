var aStar = require('a-star');
var Eightpuzzle = require('8puzzle');



var start = [0, 2, 1,
             7, 4, 5,
             6, 3, 8];

var other = [1, 2, 3,
             8, 0, 5,
             7, 6, 4];



         //  0  1  2  3  4  5  6  7  8
var mapping = [0, 1, 2, 5, 8, 7, 6, 3];

//Clockwise mapping of the node
var getClockwiseIndex=function (index) {
    return mapping[index];
}

for (var i = 0; i < 7; i++) {
    console.log(other[getClockwiseIndex(i)])  ;
    //if(i==4){continue;}
   if (other[getClockwiseIndex(i+1)] != (other[getClockwiseIndex(i)] +1)) {
       console.log("nemjo itt");
      console.log(i);
       console.log("ezek ni:")
       console.log(getClockwiseIndex(i));
       console.log(other[getClockwiseIndex(i+1)]);

}
}


