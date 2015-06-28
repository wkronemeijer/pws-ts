module TSP {
    export class Point {
        constructor(public x: number, public y: number) {Object.freeze(this)}
    }
    
    
    export class Vector extends Point{
        static fromPoint(p: Point): Vector {
            if (p instanceof Vector) {
                return p
            } else {
                return new Vector(p.x, p.y)
            }
        }
        
        static relative(base: Vector, target: Vector): Vector {
            return new Vector(target.x - base.x, 
                              target.y - base.y)
        }
        
        get lengthSquared(): number {
            let x = this.x
            let y = this.y
            
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
        constructor(public center: Point, public radius: number) {Object.freeze(this)}
        
        contains(p: Point) {
            let center = Vector.fromPoint(this.center)
            let point = Vector.fromPoint(p)
            
            let relative = center.to(point)
            let radiusSquared = Math.pow(this.radius, 2)
            
            return relative.lengthSquared < radiusSquared
        }
    }
    
    
    export class Size {
        constructor(public width: number, public height: number) {Object.freeze(this)}
    }
    
    
    export class Path {
        constructor(public vertices: Point[]) {
            Object.freeze(this.vertices)
            Object.freeze(this)
        }
        
        static random(count: number, range: Size): Path {
            let random = Math.random
            let verticesAccumulator = new Array(count)
            
            for (var index = 0; index < count; index++ ) {
                verticesAccumulator[index] = new Point(random() * range.width, random() * range.height)
            }
            
            return new Path(verticesAccumulator)
        }
        
        get length(): number {
            var lengthAccumulator = 0
            var length = this.vertices.length
            
            this.vertices.forEach((vertex, index) => {
                if (index + 1 < length) {
                    let current = Vector.fromPoint(vertex)
                    let next = Vector.fromPoint(this.vertices[index + 1])
                    
                    lengthAccumulator += current.to(next).length
                }
            })
            return lengthAccumulator
        }
    }
    
    
    export function remove<T>(array: T[], item: T): Array<T> {
        let index = array.indexOf(item)
        if (index !== -1) {
            let before = array.slice(0, index)
            let after = array.slice(index + 1, array.length)
            
            return before.concat(after)
        } else {
            return array
        }
    }
    
    
    export function average(array: number[]): number {
        if (array.length > 1) {
            let sum = array.reduce((a, b) => a + b)
            let n = array.length
            return sum / n
        } else if (array.length === 1) {
            return array[0]
        } else {
            return 0
        }
    }
}