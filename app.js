/**
 * Created by Laszlo Szoboszlai on 09/05/2017.
 *
 * Main program to generate the report on stdout, and as textfiles into cwd as well.
 * Uses the 8puzzle module with the implemented heuristic functions,
 * and the states module with the given sequence of initial states.
 *
 */
var heuristics = require('./heuristics');
var states = require('./states');

var aStar = require('a-star');

var heuristicFunctions = [heuristics.manhattan, heuristics.NSS, heuristics.misplaced, heuristics.outOfRowAndColumn, heuristics.linearConflict];

var run = function (start, heuristic, file) {
    opened = 0;
    console.log("Running " + heuristic.name + " heuristics");
    console.log("On: " + start);
    var hrstart = process.hrtime();
    var results = aStar({
        start: start,
        isEnd: heuristics.isEnd,
        neighbor: heuristics.getNeighbors,
        distance: heuristics.distance,
        heuristic: heuristic,
    });
    hrend = process.hrtime(hrstart);
    console.info("Execution time: %ds %dms", hrend[0], hrend[1] / 1000000);
    console.log("Visited nodes: " + opened);
    console.log(results);
    file += "Start node: " + start + "\n" +
        "Nodes opened: " + opened + "\n" +
        "Cost: " + results.cost + "\n" +
        ("Execution time: " + hrend[0] + " sec " + hrend[1] / 1000000 + "ms." ) + "\n" +
        "###############################################" + "\n";
    return file;
}


var runAll = function (starts, heurs) {
    var toFile = "###############################################" + "\n";
    toFile += "#  " + heurs[0].name + " Heuristics                    #\n";
    toFile += "###############################################" + "\n";
    ;

    for (var i = 0; i < heurs.length; i++) {
        for (var j = 0; j < starts.length; j++) {
            toFile = run(starts[j], heurs[i], toFile);
        }

        if (i < heurs.length - 1) {
            var header = heurs[i + 1].name;
        }
        else {
            var header = "All Done!";
        }

        toFile += "###############################################" + "\n";
        toFile += "#  " + header + " Heuristics                    #\n";
        toFile += "###############################################" + "\n";
        var fs = require('fs');


        fs.writeFile(process.cwd() + "\\" + header + ".txt", toFile, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("file has been saved successfully");
            }
        });


    }
    console.log("All algorithms tested!");
}

runAll(states.sequence, heuristicFunctions)