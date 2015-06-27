/// <reference path="../tsp.ts"/>

module TSP {
    export interface DisplayParams {
        infoPanel: HTMLDivElement
        context: CanvasRenderingContext2D
        dimensions: Size
        time: number
        radius: number
    }
    
    let π = Math.PI
    let radius = 2
    
    export function display(path: Path, ctx: CanvasRenderingContext2D, dimensions: Size) {
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height)
            
            //Edges
            ctx.beginPath()
            path.vertices.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y))
            ctx.closePath()
            ctx.stroke()
            
            //Vertices
            path.vertices.forEach((vertex) => {
                ctx.beginPath()
                ctx.arc(vertex.x, vertex.y, radius, 0, 2 * π)
                ctx.closePath()
                ctx.fill()
            })
            
        })
    }
} 