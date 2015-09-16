/// <reference path="./../common.ts"/>

module TSP {
    Heuristics.push({
        name: "Nearest Neighbour, Alt",
        solve(vertices: Vector[]): Vector[] {
            function findNearest(vertex: Vector, pool: Vector[]): Vector {
                let lengths  = pool.map(match => vertex.to(match).lengthSquared)
                let shortest = Math.min.apply(null, lengths)
                let index    = lengths.indexOf(shortest)
                
                return pool[index]
            }
            
            if (vertices.length < 4) {
                return vertices
            }
            
            let ordered   = [vertices[0]]
            let unordered = vertices.slice(1)
            
            while (unordered.length !== 0) {
                let current = ordered[0]
                let nearest = findNearest(current, unordered)
                
                ordered.unshift(nearest)
                deleteFrom(unordered, nearest)
            }
            
            return ordered.reverse()
        }
    })
}
