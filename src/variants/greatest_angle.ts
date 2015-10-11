/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    
    function findLeftmostTurn(point: Vector, candidates: Vector[]): Vector {
        let chosen = randomElementFrom(candidates)
        
        candidates.forEach(candidate => {
            let chosen_edge    = point.to(chosen)
            let candidate_edge = point.to(candidate)
            
            if (chosen_edge.signedAngleWith(candidate_edge) > 0) {  // i.e. farther counter-clockwise
                chosen = candidate
            } 
        })
        
        return chosen
    }
    
    
    function convexHull(vertices: Vector[]): Vector[] {
        let x_vertices = vertices.map(vertex => vertex.x)
        let minimum_x  = Math.min(...x_vertices)
        
        let start       = vertices[x_vertices.indexOf(minimum_x)]
        let accumulator = [start]
        
        while (true) {
            var cursor    = accumulator[accumulator.length - 1]
            let remaining = removeFrom(vertices, cursor)
            
            let candidate = findLeftmostTurn(cursor, remaining)
            
            if (candidate === start) {
                break
            } else {
                accumulator.push(candidate)
            }
        }
        
        return accumulator
    }
    
    
    Heuristics.push({
        name: "Grootste Hoek",
        solve(vertices: Vector[]): Vector[] {
            let hull = convexHull(vertices)
            
            
            
            
            
            
            // stub
            
            return hull
        }
    })
}
