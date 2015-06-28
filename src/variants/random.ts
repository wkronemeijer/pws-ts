/// <reference path="./../common.ts"/>

module TSP {
    export module Heuristics {
        export function Random(xy_vertices: Vector[], dimensions: Size) {
            let length = xy_vertices.length
            
            /*
            let x_components = []
            let y_components = []
            
            xy_vertices.forEach((vertex) => x_components.push(vertex.x))
            xy_vertices.forEach((vertex) => y_components.push(vertex.y))
            
            let max_x = Math.max.apply(null, x_components)
            let max_y = Math.max.apply(null, y_components)
            */
            
            return Path.random(length, dimensions)
        }
    }
}
