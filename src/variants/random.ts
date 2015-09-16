/// <reference path="./../common.ts"/>

module TSP {
    Heuristics.push({
        name: "Random",
        solve(xy_vertices: Vector[]): Vector[] {
            return shuffle(xy_vertices)
        }
    })
}
