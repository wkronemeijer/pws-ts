/// <reference path="./../common.ts"/>

module TSP {
    "use strict"
    
    Optimizers.push({
        name: identityOptimizerName,
        solve: vertices => vertices
    })
}
