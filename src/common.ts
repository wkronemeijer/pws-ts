interface HTMLAnchorElement {
    download: string
}



module TSP {
    export class Vector {
        constructor(public x: number, public y: number) {
            Object.freeze(this)
        }
        
        static relative(base: Vector, target: Vector): Vector {
            let dx = target.x - base.x
            let dy = target.y - base.y
            
            return new Vector(dx, dy)
        }
        
        get lengthSquared(): number {
            let {x, y} = this
            return x*x + y*y
        }
        
        get length(): number {
            return Math.sqrt(this.lengthSquared)
        }
        
        to(target: Vector): Vector {
            return Vector.relative(this, target)
        }
    }
    
    
    export class Circle {
        constructor(public center: Vector, public radius: number) {
            Object.freeze(this)
        }
        
        contains(point: Vector) {
            let {center, radius} = this
            
            let relative      = center.to(point)
            let radiusSquared = radius * radius
            
            return relative.lengthSquared < radiusSquared
        }
    }
    
    
    export class Size {
        constructor(public width: number, public height: number) {
            Object.freeze(this)
        }
        
        static default = new Size(1000, 1000)
    }
    
    
    export class Path {
        constructor(public vertices: Vector[]) {
            Object.freeze(this.vertices)
            Object.freeze(this)
        }
        
        static random(vertex_count: number): Vector[] {
            let random = Math.random
            let accumulator = new Array(vertex_count)
            
            for (var index = 0; index < vertex_count; index++ ) {
                accumulator[index] = new Vector(random() * 1000, random() * 1000)
            }
            
            return Object.freeze(accumulator)
        }
        
        get length(): number {
            var accumulator = 0
            var length = this.vertices.length
            
            this.vertices.forEach((vertex, index) => {
                if (index + 1 < length) {
                    let next = this.vertices[index + 1]
                    accumulator += vertex.to(next).length
                }
            })
            return accumulator
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
        let after = Date.now()
        
        return {
            algorithm: algo,
            path: new Path(solved),
            time: after - before
        }
    }
    
    /** Place for extensions to .push() new algorithms */
    export let Heuristics: TSPAlgorithm[] = []
    
    
    let nestedFromJSON = (json: string) => <number[][]> JSON.parse(json)
    let verticesFromNested = (nested_array: number[][]) => nested_array.map(([x,y]) => {
            if (x !== undefined && y !== undefined) {
                return new Vector(x, y)
            } else {
                return null
            }
        }).filter(perhaps => perhaps !== null)
    
    export let verticesFromJSON = (json: string) => verticesFromNested(nestedFromJSON(json))
    
    
     
    
    
    export function downloadTextFile(text: string) {
        let a = document.createElement('a')
        
        a.href     = `data:text;charset=utf-8,${text}`
        a.download = `points.txt`
        
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
        let array = samples.slice().sort()
        
        let {length} = array
        if (length % 2 === 1) {
            return array[(length - 1) / 2]
        } else {
            let next = array[length / 2]
            let prev = array[length / 2 - 1]
            
            return (next + prev) / 2
        }
    }
    
    
    export function rangeTo(stop: number) {
        let accumulator = <number[]>[]
        
        for (let i = 0; i < stop; i++) {
            accumulator.push(i)
        }
        
        return accumulator
    }
    
    /**Replaces NaN with default_ */
    export function parseIntSafe(s: string, default_: number) {
        let x = parseInt(s)
        return isNaN(x) ? default_ : x
    }
}