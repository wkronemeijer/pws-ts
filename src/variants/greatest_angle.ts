/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    export function findLeftmostPoint(point: Vector, candidates: Vector[]): Vector {
        let basis = randomElementFrom(candidates)
        
        console.log(candidates.indexOf(basis))
        
        let angles = candidates.map(candidate => {
            let basis_edge     = point.to(basis)
            let candidate_edge = point.to(candidate)
            
            return basis_edge.signedAngleWith(candidate_edge)
        })
        
        let leftmost_angle = Math.min(...(angles))
        let leftmost_point = candidates[angles.indexOf(leftmost_angle)]
        
        return leftmost_point
    }
    
    export function convexHull(vertices: Vector[]): Vector[] {
        {
            let x_vertices = vertices.map(vertex => vertex.x)
            let minimum_x  = Math.min(...x_vertices)
            var start      = vertices[x_vertices.indexOf(minimum_x)]
        }
        
        let accumulator = [start]
        
        while (true) {
            var cursor    = accumulator[accumulator.length - 1]
            let remaining = removeFrom(vertices, cursor)
            
            let chosen_candidate = findLeftmostPoint(cursor, remaining)
            
            if (chosen_candidate === start) {
                break
            } else {
                accumulator.push(chosen_candidate)
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
