/// <reference path="./../common.ts"/>

module TSP {
    Algorithms.push({
        name: "Random",
        solve(xy_vertices: Vector[]): Vector[] {
            return Path.random(xy_vertices.length)
        }
    })
}
