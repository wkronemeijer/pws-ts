/// <reference path="./common.ts"/>
/// <reference path="/usr/local/lib/node_modules/typescript/bin/lib.es6.d.ts"/>

module TSP {
    "use strict"
    
    
    export interface ControllerConstructorArguments {
        fileInput:      HTMLInputElement
        importButton:   HTMLButtonElement
        fiddleArea:     HTMLTextAreaElement
        importError:    HTMLDivElement
        updateButton:   HTMLButtonElement
        exportButton:   HTMLButtonElement
        previewArea:    HTMLCanvasElement
        randomCount:    HTMLInputElement
        generateButton: HTMLButtonElement
    }
    
    
    export let storageKey = 'yolo'
    
    
    export class Controller implements ControllerConstructorArguments {
        fileInput:      HTMLInputElement
        importButton:   HTMLButtonElement
        fiddleArea:     HTMLTextAreaElement
        importError:    HTMLDivElement
        updateButton:   HTMLButtonElement
        exportButton:   HTMLButtonElement
        previewArea:    HTMLCanvasElement
        randomCount:    HTMLInputElement
        generateButton: HTMLButtonElement
        
        ///////////////////////
        // "private" members //
        ///////////////////////
        
        vertices:       Vector[]
        previewContext: CanvasRenderingContext2D
        
        constructor(parameters: ControllerConstructorArguments) {
            Object.assign(this, parameters)
            
            this.vertices       = null
            this.previewContext = this.previewArea.getContext('2d')
            
            this.registerListeners()
            
            Object.seal(this)
        }
        
        /////////////
        // Actions //
        /////////////
        
        registerListeners() {
            this.importButton.addEventListener('click',   event => this.importContentFromFile(),  false)
            this.exportButton.addEventListener('click',   event => this.exportContentToFile(),    false)
            this.updateButton.addEventListener('click',   event => this.updatePreview(),          false)
            this.generateButton.addEventListener('click', event => this.generateRandomVertices(), false)
            
            window.addEventListener('beforeunload', event => this.saveFiddle(), false)
            
            this.loadFiddle()
        }
        
        generateRandomVertices() {
            let count    = parseIntSafe(this.randomCount.value, 1)
            let vertices = Path.random(count)
            let pairs    = vertices.map(vertex => [Math.round(vertex.x) , Math.round(vertex.y)])
            
            this.fiddleArea.value = JSON.stringify(pairs, null, 4)
        }
        
        saveFiddle() {
            window.localStorage.setItem(storageKey, this.fiddleArea.value)
        }
        
        loadFiddle() {
            let value = window.localStorage.getItem(storageKey)
            
            if (value) {
                this.fiddleArea.value = value
            }
        }
        
        importContentFromFile() {
            let file   = this.fileInput.files[0]
            let reader = new FileReader()
            
            this.fiddleArea.value = ""
            
            reader.readAsText(file)
            reader.addEventListener('loadend', event => {
                let {result} = reader
                
                this.fiddleArea.value = <string>result
            }, false)
        }
        
        exportContentToFile() {
            downloadTextFile(this.fiddleArea.value)
        }
        
        updatePreview() {
            let error: boolean
            
            try {
                this.vertices = verticesFromJSON(this.fiddleArea.value)
                error = false
            } catch (e) {
                error = true
            }
            
            if (error) {
                this.importError.innerText = 'Malformed input'
            } else {
                this.importError.innerText = ''
                this.saveFiddle()
                
                display({
                    path: new Path(this.vertices),
                    context: this.previewContext,
                    dimensions: Size.default,
                    edgeWidth: 0,
                })
            }
        }
    }
}