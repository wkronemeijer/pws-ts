/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    
    Optimizers.push({
        name: "2-Opt",
        solve(vertices: Vector[]): Vector[] {
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
