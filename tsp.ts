/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>
/// <reference path="./src/controller.ts"/>

/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>

module TSP {
    "use strict"
    
    
    export interface GlobalOptions {
        dimensions: Size
        canvas:     HTMLCanvasElement
        infoPanel:  HTMLDivElement
        allResults: HTMLDivElement
        
        controllerArguments: ControllerConstructorArguments
        
        picker:    HTMLSelectElement
        testCount: HTMLInputElement
        calculate: HTMLButtonElement
    }
    
    
    export function run(params: GlobalOptions) {
        let {dimensions, picker, calculate, controllerArguments, infoPanel, allResults, testCount, canvas} = params
        let {previewArea} = controllerArguments
        
        canvas.width  = previewArea.width  = dimensions.width
        canvas.height = previewArea.height = dimensions.height
        
        let context    = <CanvasRenderingContext2D>canvas.getContext('2d')
        let controller = new Controller(controllerArguments)
        
        function addOptionByName(name: string) {
            let option = document.createElement('option')
            option.innerText = name
            picker.appendChild(option)
        }
        
        TSP.Heuristics.forEach(algorithm => addOptionByName(algorithm.name))
        
        calculate.addEventListener('click', (event) => {
            controller.updatePreview()
            
            let algorithm   = Heuristics.filter(algo => algo.name === picker.value)[0]
            let count       = parseIntSafe(testCount.value, 1)
            let results     = <TestResult[]>[]
            let iconic_path = performTest(algorithm, controller.vertices).path
            
            rangeTo(count).forEach(i => results.push(performTest(algorithm, controller.vertices)))
            
            display({
                path: iconic_path, 
                context: context, 
                dimensions,
            })
            
            let timings = results.map(result => result.time)
            
            infoPanel.innerText  = 
                `Lengte: ${         Math.round(iconic_path.length)}\n`   +
                `Mediaan tijd: ${   Math.round(median(timings))   }ms\n` +
                `Gemiddelde tijd: ${Math.round(average(timings))  }ms\n`
            
            allResults.innerText = `Tijden: ${results.map(result => Math.round(result.time)).join(', ')}`
            
        }, false)
    }
}

TSP.run({
    dimensions: new TSP.Size(1000, 1000),
    infoPanel:  <HTMLDivElement>    document.getElementById('InfoPanel'), 
    allResults: <HTMLDivElement>   document.getElementById('AllResults'),
    canvas:     <HTMLCanvasElement>document.getElementById('Viewport'),
    controllerArguments: {
        exportButton:   <HTMLButtonElement>  document.getElementById("ControllerExport"),
        importButton:   <HTMLButtonElement>  document.getElementById("ControllerImport"),
        importError:    <HTMLDivElement>     document.getElementById("InputError"),
        previewArea:    <HTMLCanvasElement>  document.getElementById("ControllerPreview"),
        fiddleArea:     <HTMLTextAreaElement>document.getElementById("ControllerFiddleArea"),
        fileInput:      <HTMLInputElement>   document.getElementById("ControllerFiles"),
        updateButton:   <HTMLButtonElement>  document.getElementById("ControllerUpdate"),
        randomCount:    <HTMLInputElement>   document.getElementById("RandomCount"),
        generateButton: <HTMLButtonElement>  document.getElementById("RandomGenerate"),
    },
    picker:    <HTMLSelectElement>document.getElementById('Picker'),
    calculate: <HTMLButtonElement>document.getElementById('Calculate'),
    testCount: <HTMLInputElement> document.getElementById('TestCount'),
});
