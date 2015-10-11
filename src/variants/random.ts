/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    
    Heuristics.push({
        name: "Willekeurig",
        solve: vertices => shuffle(vertices)
    })
}
