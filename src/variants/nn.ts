/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    Heuristics.push({
        name: "Naaste Buur",
        solve(vertices: Vector[]): Vector[] {
            function findNearest(vertex: Vector, pool: Vector[]): Vector {
                let lengths  = pool.map(match => vertex.to(match).length);
                let shortest = Math.min.apply(null, lengths);
                let index    = lengths.indexOf(shortest);
                
                return pool[index];
            }
            
            let route   = [vertices[0]];
            let remaining = vertices.slice(1);
            
            while (remaining.length > 0) {
                let current = lastOf(route);
                let nearest = findNearest(current, remaining);
                
                route.push(nearest);
                deleteFrom(remaining, nearest);
            }
            
            return route
        }
    })
}
