/// <reference path="./../common.ts"/>

module TSP {
    Heuristics.push({
        name: "Willekeurig",
        solve: vertices => shuffle(vertices)
    })
}
