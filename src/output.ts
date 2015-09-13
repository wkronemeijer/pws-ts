/// <reference path="../tsp.ts"/>

module TSP {
    export interface DisplayParams {
        infoPanel: HTMLDivElement
        context: CanvasRenderingContext2D
        dimensions: Size
        time: number
        radius: number
    }
    
    
    export interface DisplayParameters {
        path: Path
        context: CanvasRenderingContext2D
        dimensions: Size
        edgeWidth?: number
        vertexSize?: number
    }
    
    
    let τ = 2 * Math.PI
    
    export function display(parameters: DisplayParameters) {
        let {
            path, 
            context: ctx, 
            dimensions: {width, height}, 
            edgeWidth = 2, 
            vertexSize = 5,
        } = parameters
        
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, width, height)
            
            if (edgeWidth > 0) {
                ctx.lineWidth = edgeWidth
                ctx.beginPath()
                path.vertices.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y))
                ctx.closePath()
                ctx.stroke()
            }
            
            if (vertexSize > 0) {
                path.vertices.forEach((vertex) => {
                    ctx.beginPath()
                    ctx.arc(vertex.x, vertex.y, vertexSize, 0, τ)
                    ctx.closePath()
                    ctx.fill()
                })
            }
        })
    }
} 