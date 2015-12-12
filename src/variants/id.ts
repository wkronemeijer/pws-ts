/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    Heuristics.push({
        name: identityOptimizerName,
        solve: vertices => vertices
    });
}
