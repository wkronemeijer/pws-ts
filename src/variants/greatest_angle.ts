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
    
    /**Returns insertion point: [item_before, item] */
    function findGreatestAngle(hull: Vector[], candidates: Vector[]): Vector[] {
        let chosen         = [hull[0], randomElementFrom(candidates)]
        let greatest_angle = 0
        let pairs          = sequentialPairs(hull)
        
        pairs.forEach(pair => {
            let [v, w] = pair
            
            candidates.forEach(candidate => {
                let angle = candidate.to(v).angleWith(candidate.to(w))
                
                if (angle > greatest_angle) {
                    greatest_angle = angle
                    chosen = [v, candidate]
                }
            })
        })
        
        return chosen
    }
    
    
    Heuristics.push({
        name: "Grootste Hoek",
        solve(vertices: Vector[]): Vector[] {
            let route      = convexHull(vertices)
            let candidates = complement(vertices, route)
            
            while (candidates.length > 0) {
                let [position, item] = findGreatestAngle(route, candidates)
                insertElementIntoAfter(item, route, position)
                
                candidates = complement(vertices, route)
            }
            
            return route
        }
    })
}
