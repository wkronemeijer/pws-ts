/// <reference path="../tsp.ts"/>

module TSP {
    "use strict"
    
    
    export interface DisplayParameters {
        path: Path;
        context: CanvasRenderingContext2D;
        dimensions: Size;
        edgeWidth?: number;
        vertexSize?: number;
    }
    
    
    let tau = 2 * Math.PI;
    
    
    export function display(parameters: DisplayParameters) {
        let {
            path, 
            context: ctx, 
            dimensions: {width, height}, 
            edgeWidth  = 2, 
            vertexSize = 5,
        } = parameters;
        
        let {closed} = path;
        
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, width, height);
            
            if (edgeWidth > 0) {
                ctx.lineWidth = edgeWidth;
                ctx.beginPath();
                path.vertices.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y));
                
                if (closed) {
                    ctx.closePath();
                }
                
                ctx.stroke();
            }
            
            if (vertexSize > 0) {
                path.vertices.forEach((vertex) => {;
                    ctx.beginPath();
                    ctx.arc(vertex.x, vertex.y, vertexSize, 0, tau);
                    ctx.closePath();
                    ctx.fill();
                })
            }
        })
    }
} 
