/// <reference path="./../common.ts"/>

module TSP {
    export module Heuristics {
        export function Random(xy_vertices: Vector[]) {
            return Path.random(xy_vertices.length)
        }
    }
}
