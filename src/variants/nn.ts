/// <reference path="./../common.ts"/>

module TSP {
    Heuristics.push({
        name: "Nearest Neighbour",
        solve(vertices: Vector[]): Vector[] {
            function findNearest(vertex: Vector, pool: Vector[]): Vector {
                let lengths  = pool.map(match => vertex.to(match).lengthSquared)
                let shortest = Math.min.apply(null, lengths)
                let index    = lengths.indexOf(shortest)
                
                return pool[index]
            }
            
            let result: Vector[] = []
            var current   = vertices[0]
            var remaining = vertices.slice(1)
            
            result.push(current)
            while (remaining.length !== 0) {
                let nearest = findNearest(current, remaining)
                if (nearest === null) {break}
                
                current = nearest
                deleteFrom(remaining, nearest)
                
                result.push(current)
            }
            return result
        }
    })
}
