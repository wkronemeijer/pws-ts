/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    
    Heuristics.push({
        name: "Straal",
        solve(vertices: Vector[]): Vector[] {
            function findNearest(vertex: Vector, pool: Vector[]): Vector {
                let start = 1
                let stop  = 2 * 1000
                let step  = stop / 10
                
                let radius  = start
                let matches = <Vector[]>[]
                
                while (matches.length === 0) {
                    var circle = new Circle(vertex, radius)
                    pool.forEach((remainingVertex) => {
                        if (circle.contains(remainingVertex)) {
                            matches.push(remainingVertex)
                        }
                    })
                    
                    radius += step
                    if (radius >= stop) {return null}
                }
                
                let lengths  = matches.map(match => vertex.to(match).lengthSquared)
                let shortest = Math.min.apply(null, lengths)
                let index    = lengths.indexOf(shortest)
                
                return matches[index]
            }
            
            let result    = <Vector[]>[]
            var current   = vertices[0]
            var remaining = vertices.slice(1)
            
            result.push(current)
            while (remaining.length !== 0) {
                let nearest = findNearest(current, remaining)
                if (nearest === null) {
                    break
                }
                
                result.push(nearest)
                
                current = nearest
                remaining = removeFrom(remaining, nearest)
            }
            
            return result
        }
    })
}
