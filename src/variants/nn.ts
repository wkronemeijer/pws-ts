/// <reference path="./../common.ts"/>

module TSP {
    export module Heuristics {
        export function Nearest(vertices: Point[], dimensions: Size) {
            function findNearest(vertex: Point, remainingVertices: Point[]): Point {
                let lengths = remainingVertices.map((match: Point) => {
                    let matchVector = Vector.fromPoint(match)
                    let basis = Vector.fromPoint(vertex)  // i.e. what is being searched for, for lack of a better term
                    
                    return basis.to(matchVector).lengthSquared
                })
                let maxLength = Math.max.apply(null, lengths)
                let index = lengths.indexOf(maxLength)
                
                return remainingVertices[index]
            }
            
            if (vertices.length < 3) {
                return new Path(vertices)
            }
            
            let result: Point[] = []
            var current = vertices[0]
            var remaining = vertices.slice(1)
            
            result.push(current)
            while (remaining.length !== 0) {
                let nearest = findNearest(current, remaining)
                if (nearest === null) {break}
                
                result.push(nearest)
                
                current = nearest
                remaining = remove(remaining, nearest)
            }
            
            return new Path(result)
        }
    }
}
