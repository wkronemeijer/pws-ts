/// <reference path="./../common.ts"/>

module TSP {
    Heuristics.push({
        name: "Random",
        solve: vertices => shuffle(vertices)
    })
}
