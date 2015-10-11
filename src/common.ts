interface HTMLAnchorElement {
    download: string
}


module TSP {
    "use strict"
    
    
    export class Vector {
        constructor(public x: number, public y: number) {}
        
        
        get copy() {
            return new Vector(this.x, this.y)
        }
        
        get length(): number {
            let {x, y} = this
            return Math.sqrt(x*x + y*y)
        }
        
        
        toString(): string {
            return `(${this.x}, ${this.y})`
        }
        
        to(target: Vector): Vector {
            let dx = target.x - this.x
            let dy = target.y - this.y
            
            return new Vector(dx, dy)
        }
        
        dot(operand: Vector) {
             return this.x * operand.x + this.y * operand.y
        }
        
        angleWith(operand: Vector): number {
            let dot_product    = this.dot(operand)
            let length_product = this.length * operand.length
            
            return Math.acos(dot_product / length_product)
        }
        
        /**Clockwise is negative, counterclockwise is positive */
        signedAngleWith(point: Vector): number {
            return this.angleWith(point) * Math.sign(point.y * this.x - point.x * this.y )  // negated determinant matrix
        }
    }
    
    
    export class Circle {
        constructor(public center: Vector, public radius: number) {}
        
        contains(point: Vector) {
            let {center, radius} = this
            let relative_length  = center.to(point).length
            
            return relative_length < radius
        }
        
        toString(): string {
            return `(${this.center}, ${this.radius})`
        }
    }
    
    
    export class Size {
        constructor(public width: number, public height: number) {}
        
        static default = Object.freeze(new Size(1000, 1000))
        
        toString(): string {
            return `(${this.width}, ${this.height})`
        }
    }
    
    
    export class Path {
        constructor(public vertices: Vector[], public closed = true) {}
        
        get length(): number {
            return totalLength(this.vertices, this.closed)
        }
    }
    
    
    export interface TSPAlgorithm {
        name: string
        solve(vertices: Vector[]): Vector[]
    }
    
    
    export interface TestResult {
        algorithm: TSPAlgorithm
        path: Path
        time: number 
    }
    
    
    export function performTest(algo: TSPAlgorithm, vertices: Vector[]): TestResult {
        let before = Date.now()
        let solved = algo.solve(vertices)
        let after  = Date.now()
        
        return {
            algorithm: algo,
            path: new Path(solved),
            time: after - before
        }
    }
    
    
    export let Heuristics: TSPAlgorithm[] = []
    export let Optimizers: TSPAlgorithm[] = []
    
    export let identityOptimizerName = "-Geen-"
    
    
    export function verticesFromJSON(json: string): Vector[] {
        return JSON.parse(json)
            .map(([x, y]) => (x !== undefined && y !== undefined) ? new Vector(x, y) : null)
            .filter(perhaps => perhaps !== null)
    }
    
    
    export function verticesToJSON(vertices: Vector[]): string {
        return JSON.stringify(vertices.map(vertex => [vertex.x, vertex.y]))
    }
    
    
    function encodeAsDataURL(text: string) {
        let content = encodeURIComponent(text)
        return `data:text;charset=utf-8,${content}`
    }
    
    
    export function downloadTextFile(name: string, content: string) {
        let a = document.createElement('a')
        
        a.href     = encodeAsDataURL(content)
        a.download = name
        
        a.click()
    }
    
    
    export function removeFrom<T>(array: T[], item: T): Array<T> {
        let index = array.indexOf(item)
        if (index !== -1) {
            let before = array.slice(0, index)
            let after  = array.slice(index + 1, array.length)
            
            return before.concat(after)
        } else {
            return array
        }
    }
    
    
    export function deleteFrom<T>(array: T[], item: T): boolean {
        let index = array.indexOf(item)
        if (index !== -1) {
            array.splice(index, 1)
            return true
        } else {
            return false
        }
    }
    
    
    export function complement<T>(source: T[], toBeRemoved: T[]): T[] {
        let array = source.slice()
        toBeRemoved.forEach(target => deleteFrom(array, target))
        return array
    }
    
    
    export function average(array: number[]): number {
        if (array.length > 1) {
            let sum = array.reduce((a, b) => a + b)
            let n   = array.length
            return sum / n
        } else if (array.length === 1) {
            return array[0]
        } else {
            return NaN
        }
    }
    
    
    export function median(samples: number[]): number {
        let array  = samples.slice().sort()
        let length = array.length
        
        if (length % 2 === 1) {
            return array[(length - 1) / 2]
        } else {
            let a = array[length / 2]
            let b = array[length / 2 - 1]
            
            return (a + b) / 2
        }
    }
    
    
    export function rangeTo(stop: number) {
        let accumulator = <number[]>[]
        
        for (let i = 0; i < stop; i++) {
            accumulator.push(i)
        }
        
        return accumulator
    }
    
    
    export function shuffle<T>(array: T[]): T[] {
        let builder = array.slice() 
        let length  = builder.length
        
        for (let i = length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [builder[i], builder[j]] = [builder[j], builder[i]]
        }
        return builder
    }
    
    
    export function randomVertices(count: number): Vector[] {
        let {width: x_range, height: y_range} = Size.default
        
        let random      = Math.random
        let accumulator = new Array(count)
        
        for (var index = 0; index < count; index++ ) {
            accumulator[index] = new Vector(random() * x_range, random() * y_range)
        }
        
        return Object.freeze(accumulator)
    }
    
    
    export function parseIntSafe(s: string, default_ = 0) {
        let x = parseInt(s)
        return isNaN(x) ? default_ : x
    }
    
    
    export function clip(text: string, length: number, trail: string) {
        if (text.length < length) {
            return text
        } else {
            return text.slice(0, length) + trail
        }
    }
    
    
    export const maxLineLength = 160 //characters
    
    
    export function swap<T>(array: T[], index0: number, index1: number): T[] {
        let accumulator = array.slice();
        [accumulator[index1], accumulator[index0]] = [accumulator[index0], accumulator[index1]];
        return accumulator;
    }
    
    
    export function totalLength(vertices: Vector[], closed = true): number {
        var accumulator = 0
        var length = vertices.length
        
       vertices.forEach((vertex, index) => {
            if (index + 1 < length) {
                let next = vertices[index + 1]
                accumulator += vertex.to(next).length
            }
        })
        
        if (closed) {
            let first = vertices[0]
            let last  = vertices[length - 1]
            
            accumulator += first.to(last).length
        }
        
        return accumulator
    }
    
    
    export function clamp(min: number, value: number, max: number): number {
        return Math.min(Math.max(min, value), max)
    }
    
    
    export function randomElementFrom<T>(array: T[]): T {
        let length = array.length
        let random = Math.random()
        let index  = Math.floor(random * length)
        
        return array[index]
    }
    
    
    export function sequentialPairs<T>(array: T[], loop = true): T[][] {
        let length      = array.length
        let accumulator = <T[][]>[]
        
        for (let i = 0; i < length - 1; i++) {
            let x = array[i]
            let y = array[i + 1]
            
            accumulator.push([x, y])
        }
        
        if (loop) {
            let first = array[0]
            let last  = array[length - 1]
            accumulator.push([last, first])
        }
        
        return accumulator
    }
    
    
    export function insertElementIntoAfter<T>(item: T, array: T[], after: T) {
        let index = array.indexOf(after) + 1
        array.splice(index, 0, item)
    }
}
