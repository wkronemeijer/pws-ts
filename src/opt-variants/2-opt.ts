/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    function $(vertices: Vector[]): Path {
        return new Path(vertices)
    }
    
    
    Optimizers.push({
        name: "2-Opt",
        solve(vertices: Vector[]): Vector[] {
            /*let length     = vertices.length
            let best_route = vertices.slice()
            
            again:
            for (let i = 1; i < length - 3; i++ ) {
                for (let j = i + 2; j < length - 1; j++) {
                    let a = best_route[i]
                    let b = best_route[i + 1]
                    let c = best_route[j]
                    let d = best_route[j + 1]
                    
                    let before = a.to(b).lengthSquared + c.to(d).lengthSquared
                    let after  = a.to(c).lengthSquared + b.to(d).lengthSquared
                    
                    if (after < before) {
                        best_route = swap(best_route, i+1, j)
                        continue again
                    }
                }
            }
            
            return best_route*/
            
            let length     = vertices.length
            let best_route = vertices.slice()
            let stale = true
            
            again:
            do {
                stale = true
                
                for (let i = 0; i < length; i++ ) {
                    for (let j = i + 1; j < length; j++) {
                        let new_route = <Vector[]>[].concat(best_route.slice(0, i), best_route.slice(i, j).reverse(), best_route.slice(j))
                        
                        let before = totalLength(best_route)
                        let after  = totalLength(new_route)
                        
                        if (after < before) {
                            best_route = new_route
                            stale = false
                            continue again
                        }
                    }
                }
            } while (!stale)
            
            
            return best_route
        }
    })
    
    
}