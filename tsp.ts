/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>
/// <reference path="./src/controller.ts"/>

/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/nn_alt.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>

/// <reference path="./src/opt-variants/none.ts"/>
/// <reference path="./src/opt-variants/2-opt.ts"/>


module TSP {
    "use strict"
    
    
    let controller = new Controller({
        dimensions: Size.default,
        summary:            <HTMLDivElement>     document.getElementById("InfoPanel"), 
        allResults:         <HTMLDivElement>     document.getElementById("AllResults"),
        resultArea:         <HTMLCanvasElement>  document.getElementById("Viewport"),
        exportOutputButton: <HTMLAnchorElement>  document.getElementById("ExportResults"),
        exportInputButton:  <HTMLButtonElement>  document.getElementById("ControllerExport"),
        importButton:       <HTMLButtonElement>  document.getElementById("ControllerImport"),
        importError:        <HTMLDivElement>     document.getElementById("InputError"),
        previewArea:        <HTMLCanvasElement>  document.getElementById("ControllerPreview"),
        fiddleArea:         <HTMLTextAreaElement>document.getElementById("ControllerFiddleArea"),
        fileInput:          <HTMLInputElement>   document.getElementById("ControllerFiles"),
        updateButton:       <HTMLButtonElement>  document.getElementById("ControllerUpdate"),
        randomCount:        <HTMLInputElement>   document.getElementById("RandomCount"),
        generateButton:     <HTMLButtonElement>  document.getElementById("RandomGenerate"),
        algorithmPicker:    <HTMLSelectElement>  document.getElementById("Picker"),
        optimizationPicker: <HTMLSelectElement>  document.getElementById("OptPicker"),
        calculateButton:    <HTMLButtonElement>  document.getElementById("Calculate"),
        testCount:          <HTMLInputElement>   document.getElementById("TestCount"),
    })
}
