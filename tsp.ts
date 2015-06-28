/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>

/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>

module TSP {
    export interface InfoPanel {
        length: HTMLSpanElement
        time: HTMLSpanElement
        averageTime: HTMLSpanElement
    }
    
    export interface GlobalOptions {
        dimensions: Size
        picker: HTMLSelectElement
        count: HTMLInputElement
        canvas: HTMLCanvasElement
        infoPanel: InfoPanel
        calculate: HTMLButtonElement
    }
    
    export function init(params: GlobalOptions) {
        let canvas = params.canvas
        let context = <CanvasRenderingContext2D>canvas.getContext('2d')
        let reverseMap = {}
        let timings: number[] = []
        
        canvas.width = params.dimensions.width
        canvas.height = params.dimensions.height


        Object.keys(TSP.Heuristics).forEach((algorithm_function_key) => {
            let algorithm_function = TSP.Heuristics[algorithm_function_key]
            let name = algorithm_function.name
            let option = document.createElement('option')
            
            reverseMap[name] = algorithm_function
            
            option.innerText = name
            params.picker.appendChild(option)
        })
        
        
        function deleteTimings() {timings.splice(0, timings.length)}
        
        params.picker.addEventListener('change', deleteTimings)
        params.count.addEventListener('change', deleteTimings)
        
        
        canvas.addEventListener('click', (event) => {
            console.log("Click:", new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop))
        })
        
        
        params.calculate.addEventListener('click', (event) => {
            let user_count = params.count.valueAsNumber
            let algorithm_name = params.picker.value
            
            if (isNaN(user_count)) {return}
            
            let clamped_count = Math.min(Math.max(2, user_count), 1000)
            params.count.value = clamped_count.toString()
            
            let random_path = TSP.Path.random(clamped_count, params.dimensions)
            
            let before = Date.now()
            let shortest_path = <Path>reverseMap[algorithm_name](random_path.vertices, params.dimensions)
            let after = Date.now()
            
            let dt = after - before
            timings.push(dt)
            
            display(shortest_path, context, params.dimensions)
            
            let info = params.infoPanel
            info.length.innerText      = "Lengte: "         + Math.round(shortest_path.length).toString() +      "\n"
            info.time.innerText        = "Tijd: "           + dt.toString()                               + "ms \n\n"
            info.averageTime.innerText = "Gemiddelde tijd: "+ Math.round(average(timings)).toString()     + "ms   \n"
        }, false)
    }
}

TSP.init({
    dimensions: new TSP.Size(500, 500),
    canvas: <HTMLCanvasElement>document.getElementById('Viewport'),
    picker: <HTMLSelectElement>document.getElementById('Picker'),
    count: <HTMLInputElement>document.getElementById('Count'),
    infoPanel: {
        length: <HTMLDivElement>document.getElementById('Length'),
        time: <HTMLDivElement>document.getElementById('Time'),
        averageTime: <HTMLDivElement>document.getElementById('AverageTime')
    },
    calculate: <HTMLButtonElement>document.getElementById('Calculate')
})
