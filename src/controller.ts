/// <reference path="./common.ts"/>
/// <reference path="/usr/local/lib/node_modules/typescript/bin/lib.es6.d.ts"/>

module TSP {
    "use strict"
    
    
    export interface ControllerOutlets {
        dimensions:   Size
        
        summary:      HTMLDivElement
        allResults:   HTMLDivElement
        
        algorithmPicker:    HTMLSelectElement
        optAlgorithmPicker: HTMLSelectElement
        testCount:          HTMLInputElement
        
        fileInput:       HTMLInputElement
        importButton:    HTMLButtonElement
        fiddleArea:      HTMLTextAreaElement
        importError:     HTMLDivElement
        updateButton:    HTMLButtonElement
        calculateButton: HTMLButtonElement
        
        exportInputButton:  HTMLButtonElement
        exportOutputButton: HTMLAnchorElement
        
        previewArea: HTMLCanvasElement
        resultArea:  HTMLCanvasElement
        
        randomCount:    HTMLInputElement
        generateButton: HTMLButtonElement
    }
    
    
    export let storageKey = 'yolo'
    
    
    export class Controller {
        ///////////////////////
        // "private" members //
        ///////////////////////
        
        outlets: ControllerOutlets
        
        vertices:   Vector[]
        iconicPath: Path
        
        previewContext: CanvasRenderingContext2D
        resultContext:  CanvasRenderingContext2D
        
        constructor(parameters: ControllerOutlets) {
            this.outlets    = parameters
            this.vertices   = null
            this.iconicPath = null
            
            this.previewContext = this.outlets.previewArea.getContext('2d')
            this.resultContext  = this.outlets.resultArea.getContext('2d')
            
            this.resizeCanvases()
            this.populatePickers()
            this.registerListeners()
        }
        
        ////////////////////
        // Initialization //
        ////////////////////
        
        resizeCanvases() {
            let {resultArea, previewArea, dimensions} = this.outlets
            
            resultArea.width  = previewArea.width  = dimensions.width
            resultArea.height = previewArea.height = dimensions.height
        }
        
        populatePickers() {
            TSP.Heuristics.forEach(algorithm => {
                let option = document.createElement('option')
                option.innerText = algorithm.name
                this.outlets.algorithmPicker.appendChild(option)
            })
            
            TSP.OptHeuristics.forEach(optAlgorithm => {
                let option = document.createElement('option')
                option.innerText = optAlgorithm.name
                this.outlets.optAlgorithmPicker.appendChild(option)
            })
        }
        
        registerListeners() {
            let {importButton, exportInputButton, exportOutputButton, updateButton, generateButton, calculateButton} = this.outlets
            
            importButton      .addEventListener('click', event => this.importContentFromFile() , false)
            exportInputButton .addEventListener('click', event => this.exportInputToFile()     , false)
            exportOutputButton.addEventListener('click', event => this.exportOutputToFile()    , false)
            updateButton      .addEventListener('click', event => this.updatePreview()         , false)
            generateButton    .addEventListener('click', event => this.generateRandomVertices(), false)
            calculateButton   .addEventListener('click', event => this.calculateResults()      , false)
            
            window.addEventListener('beforeunload', event => this.saveFiddle(), false)
            
            this.loadFiddle()
        }
        
        /////////////
        // Actions //
        /////////////
        
        generateRandomVertices() {
            let {randomCount, fiddleArea} = this.outlets
            
            let count    = parseIntSafe(randomCount.value, 1)
            let vertices = randomVertices(count)
            let pairs    = vertices.map(vertex => [Math.round(vertex.x) , Math.round(vertex.y)])
            
            fiddleArea.value = JSON.stringify(pairs, null, 4)
        }
        
        saveFiddle() {
            window.localStorage.setItem(storageKey, this.outlets.fiddleArea.value)
        }
        
        loadFiddle() {
            let value = window.localStorage.getItem(storageKey)
            if (value) {
                this.outlets.fiddleArea.value = value
            }
        }
        
        importContentFromFile() {
            let {fileInput, fiddleArea} = this.outlets
            
            let file   = fileInput.files[0]
            let reader = new FileReader()
            
            fiddleArea.value = ""
            
            reader.addEventListener('loadend', event => {
                fiddleArea.value = <string>reader.result
            }, false)
            reader.readAsText(file)
        }
        
        exportInputToFile() {
            if (this.vertices !== null) {
                downloadTextFile('input.txt', verticesToJSON(this.vertices))
            }
        }
        
        exportOutputToFile() {
            if (this.iconicPath !== null) {
                downloadTextFile('output.txt', verticesToJSON(this.iconicPath.vertices))
            }
        }
        
        updatePreview() {
            let {fiddleArea, importError} = this.outlets
            let error: boolean
            
            try {
                this.vertices = verticesFromJSON(fiddleArea.value)
                error = false
            } catch (e) {
                error = true
            }
            
            if (error) {
                importError.innerText = 'Malformed input'
            } else {
                importError.innerText = ''
                this.saveFiddle()
                
                display({
                    path: new Path(this.vertices),
                    context: this.previewContext,
                    dimensions: Size.default,
                    edgeWidth: 0,
                })
            }
        }
        
        calculateResults() {
            this.updatePreview()
            
            if (this.vertices !== null) {
                let {algorithmPicker, testCount, summary, allResults} = this.outlets
                
                let algorithm   = Heuristics.filter(algo => algo.name === algorithmPicker.value)[0]
                let count       = parseIntSafe(testCount.value, 1)
                let results     = <TestResult[]>[] 
                
                this.iconicPath = performTest(algorithm, this.vertices).path
                rangeTo(count).forEach(i => results.push(performTest(algorithm, this.vertices)))
                
                display({
                    path: this.iconicPath, 
                    context: this.resultContext, 
                    dimensions: this.outlets.dimensions,
                })
                
                let timings = results.map(result => result.time)
                
                summary.innerText  = 
                    `Lengte: ${         Math.round(this.iconicPath.length)}\n`   +
                    `Mediaan tijd: ${   Math.round(median(timings))   }ms\n` +
                    `Gemiddelde tijd: ${Math.round(average(timings))  }ms\n`
                
                allResults.innerText = `Tijden: ${results.map(result => Math.round(result.time)).join(', ')}\n` +
                    `Puntenset: ${this.iconicPath.vertices.join(', ')}`
            }
        }
    }
}