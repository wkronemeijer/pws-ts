/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    Optimizers.push({
        name: "2-Opt",
        solve(vertices: Vector[]): Vector[] {
            let length     = vertices.length;
            let best_route = vertices.slice();
            let optimal = false;
            
            again:
            do {
                optimal = true;
                
                for (let i = 0; i < length; i++ ) {
                    for (let j = i + 1; j < length; j++) {
                        let new_route = swapIndices(best_route, i, j);
                        
                        let before = totalLength(best_route);
                        let after  = totalLength(new_route);
                        
                        if (after < before) {
                            best_route = new_route;
                            optimal = false;
                            continue again;
                        }
                    }
                }
            } while (!optimal)
            
            return best_route;
        }
    })
}
