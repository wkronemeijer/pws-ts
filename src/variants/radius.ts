/// <reference path="./../common.ts"/>

module TSP {
    export module Heuristics {
        export function Radius(vertices: Vector[]) {
            function findNearest(vertex: Vector, remainingVertices: Vector[]): Vector {
                let start = 1
                let stop = 2 * 100
                let step = stop / 10
                
                var radius = start
                let matches: Vector[] = []
                
                while (matches.length === 0) {
                    var circle = new Circle(vertex, radius)
                    remainingVertices.forEach((remainingVertex) => {
                        if (circle.contains(remainingVertex)) {
                            matches.push(remainingVertex)
                        }
                    })
                    
                    radius += step
                    if (radius >= stop) {return null}
                }
                
                // All lengths are actually lengthSquared; easier to type
                let lengths = matches.map((match: Vector) => vertex.to(match).lengthSquared)
                let minLength = Math.min.apply(null, lengths)
                let index = lengths.indexOf(minLength)
                
                return matches[index]
            }
            
            if (vertices.length < 3) {
                return new Path(vertices)
            }
            
            let result: Vector[] = []
            var current = vertices[0]
            var remaining = vertices.slice(1)
            
            result.push(current)
            while (remaining.length !== 0) {
                let nearest = findNearest(current, remaining)
                if (nearest === null) {break}
                
                result.push(nearest)
                
                current = nearest
                remaining = removeFrom(remaining, nearest)
            }
            
            return new Path(result)
        }
    }
}
