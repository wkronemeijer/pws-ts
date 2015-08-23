/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>

/// <reference path="./src/variants/nn.ts"/>
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
    
    export function run(params: GlobalOptions) {
        let {canvas, dimensions, picker, count, calculate} = params
        let context = <CanvasRenderingContext2D>canvas.getContext('2d')
        let timings: number[] = []
        
        canvas.width = dimensions.width
        canvas.height = dimensions.height


        function addOptionByName(name: string) {
            let option = document.createElement('option')
            option.innerText = name
            picker.appendChild(option)
        }

        TSP.Algorithms.forEach(algorithm => {
            addOptionByName(algorithm.name)
        })
        
        
        function deleteTimings() {timings.splice(0, timings.length)}
        
        picker.addEventListener('change', deleteTimings)
        count.addEventListener('change', deleteTimings)
        
        
        canvas.addEventListener('click', (event) => {
            console.log("Click:", new Vector(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop))
        })
        
        
        calculate.addEventListener('click', (event) => {
            let user_count     = count.valueAsNumber
            let algorithm_name = picker.value
            
            if (isNaN(user_count)) {
                return
            }
            
            let clamped_count = Math.min(Math.max(5, user_count), 1000)
            count.value = clamped_count.toString()
            
            let random_vertices = TSP.Path.random(clamped_count)
            let algorithm       = Algorithms.filter(algo => algo.name === algorithm_name)[0]
            
            let result = performTest(algorithm, random_vertices)
            
            timings.push(result.time)
            
            display(result.path, context, params.dimensions)
            
            let info = params.infoPanel
            info.length.innerText      = "Lengte: "          + Math.round(result.path.length).toString() +      "\n"
            info.time.innerText        = "Tijd: "            + result.time.toString()                    + "ms \n\n"
            info.averageTime.innerText = "Gemiddelde tijd: " + Math.round(average(timings)).toString()   + "ms   \n"
        }, false)
    }
}

TSP.run({
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
