/// <reference path="./common.ts"/>

module TSP {
    "use strict"
    
    
    export interface PortControllerConstructorArguments {
        fileInput:    HTMLInputElement
        importButton: HTMLButtonElement
        exportButton: HTMLButtonElement
        fiddleArea:   HTMLTextAreaElement
    }
    
    
    let storageKey = "willy2k16"
    
    export class PortController {
        fileInput:    HTMLInputElement
        importButton: HTMLButtonElement
        exportButton: HTMLButtonElement
        fiddleArea:   HTMLTextAreaElement
        
        vertices: Vector[]
        
        constructor(params: PortControllerConstructorArguments) {
            let {fileInput, importButton, exportButton, fiddleArea} = params
            
            this.fileInput    = fileInput
            this.importButton = importButton
            this.exportButton = exportButton
            this.fiddleArea   = fiddleArea
            
            this.vertices = null
            
            Object.seal(this)
        }
        
        saveContent() {
            localStorage.setItem(storageKey, this.fiddleArea.innerText)
        }
        
        loadContent() {
            let stored = localStorage.getItem(storageKey)
            
            if (stored !== null) {
                this.fiddleArea.value = stored
            }
        }
        
        importContentFromFile() {
            let file   = this.fileInput.files[0]
            let reader = new FileReader()
            
            reader.readAsText(file)
            reader.addEventListener('loadend', event => {
                let json_text = reader.result
                this.fiddleArea.innerText = json_text
            }, false)
        }
        
    }
    
}