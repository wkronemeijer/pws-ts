var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSP;
(function (TSP) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
            Object.freeze(this);
        }
        return Point;
    })();
    TSP.Point = Point;
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector() {
            _super.apply(this, arguments);
        }
        Vector.fromPoint = function (p) {
            if (p instanceof Vector) {
                return p;
            }
            else {
                return new Vector(p.x, p.y);
            }
        };
        Vector.relative = function (base, target) {
            return new Vector(target.x - base.x, target.y - base.y);
        };
        Object.defineProperty(Vector.prototype, "lengthSquared", {
            get: function () { return Math.pow(this.x, 2) + Math.pow(this.y, 2); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () { return Math.sqrt(this.lengthSquared); },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.to = function (target) {
            return Vector.relative(this, target);
        };
        return Vector;
    })(Point);
    TSP.Vector = Vector;
    var Circle = (function () {
        function Circle(center, radius) {
            this.center = center;
            this.radius = radius;
            Object.freeze(this);
        }
        Circle.prototype.contains = function (p) {
            var center = Vector.fromPoint(this.center);
            var point = Vector.fromPoint(p);
            var relative = center.to(point);
            var radiusSquared = Math.pow(this.radius, 2);
            return relative.lengthSquared < radiusSquared;
        };
        return Circle;
    })();
    TSP.Circle = Circle;
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
            Object.freeze(this);
        }
        return Size;
    })();
    TSP.Size = Size;
    var Path = (function () {
        function Path(vertices) {
            this.vertices = vertices;
            Object.freeze(this.vertices);
            Object.freeze(this);
        }
        Path.random = function (count, range) {
            var random = Math.random;
            var verticesAccumulator = new Array(count);
            for (var index = 0; index < count; index++) {
                verticesAccumulator[index] = new Point(random() * range.width, random() * range.height);
            }
            return new Path(verticesAccumulator);
        };
        Object.defineProperty(Path.prototype, "length", {
            get: function () {
                var _this = this;
                var lengthAccumulator = 0;
                var length = this.vertices.length;
                this.vertices.forEach(function (vertex, index) {
                    if (index + 1 < length) {
                        var current = Vector.fromPoint(vertex);
                        var next = Vector.fromPoint(_this.vertices[index + 1]);
                        lengthAccumulator += current.to(next).length;
                    }
                });
                return lengthAccumulator;
            },
            enumerable: true,
            configurable: true
        });
        return Path;
    })();
    TSP.Path = Path;
    function remove(array, item) {
        var index = array.indexOf(item);
        if (index !== -1) {
            var before = array.slice(0, index);
            var after = array.slice(index + 1, array.length);
            return before.concat(after);
        }
        else {
            return array;
        }
    }
    TSP.remove = remove;
    function average(array) {
        if (array.length > 1) {
            var sum = array.reduce(function (a, b) { return a + b; });
            var n = array.length;
            return sum / n;
        }
        else if (array.length === 1) {
            return array[0];
        }
        else {
            return 0;
        }
    }
    TSP.average = average;
})(TSP || (TSP = {}));
/// <reference path="../tsp.ts"/>
var TSP;
(function (TSP) {
    var π = Math.PI;
    var radius = 2;
    function display(path, ctx, dimensions) {
        window.requestAnimationFrame(function () {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            ctx.beginPath();
            path.vertices.forEach(function (vertex) { return ctx.lineTo(vertex.x, vertex.y); });
            ctx.closePath();
            ctx.stroke();
            path.vertices.forEach(function (vertex) {
                ctx.beginPath();
                ctx.arc(vertex.x, vertex.y, radius, 0, 2 * π);
                ctx.closePath();
                ctx.fill();
            });
        });
    }
    TSP.display = display;
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    var Heuristics;
    (function (Heuristics) {
        function Nearest(vertices, dimensions) {
            function findNearest(vertex, remainingVertices) {
                var lengths = remainingVertices.map(function (match) {
                    var matchVector = TSP.Vector.fromPoint(match);
                    var basis = TSP.Vector.fromPoint(vertex);
                    return basis.to(matchVector).lengthSquared;
                });
                var maxLength = Math.max.apply(null, lengths);
                var index = lengths.indexOf(maxLength);
                return remainingVertices[index];
            }
            if (vertices.length < 3) {
                return new TSP.Path(vertices);
            }
            var result = [];
            var current = vertices[0];
            var remaining = vertices.slice(1);
            result.push(current);
            while (remaining.length !== 0) {
                var nearest = findNearest(current, remaining);
                if (nearest === null) {
                    break;
                }
                result.push(nearest);
                current = nearest;
                remaining = TSP.remove(remaining, nearest);
            }
            return new TSP.Path(result);
        }
        Heuristics.Nearest = Nearest;
    })(Heuristics = TSP.Heuristics || (TSP.Heuristics = {}));
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    var Heuristics;
    (function (Heuristics) {
        function Radius(vertices, dimensions) {
            function findNearest(vertex, remainingVertices) {
                var start = 1;
                var stop = 2 * Math.max(dimensions.width, dimensions.height);
                var step = stop / 10;
                var radius = start;
                var matches = [];
                while (matches.length === 0) {
                    var circle = new TSP.Circle(vertex, radius);
                    remainingVertices.forEach(function (remainingVertex) {
                        if (circle.contains(remainingVertex)) {
                            matches.push(remainingVertex);
                        }
                    });
                    radius += step;
                    if (radius >= stop) {
                        return null;
                    }
                }
                var lengths = matches.map(function (match) {
                    var matchVector = TSP.Vector.fromPoint(match);
                    var basis = TSP.Vector.fromPoint(vertex);
                    return basis.to(matchVector).lengthSquared;
                });
                var maxLength = Math.max.apply(null, lengths);
                var index = lengths.indexOf(maxLength);
                return matches[index];
            }
            if (vertices.length < 3) {
                return new TSP.Path(vertices);
            }
            var result = [];
            var current = vertices[0];
            var remaining = vertices.slice(1);
            result.push(current);
            while (remaining.length !== 0) {
                var nearest = findNearest(current, remaining);
                if (nearest === null) {
                    break;
                }
                result.push(nearest);
                current = nearest;
                remaining = TSP.remove(remaining, nearest);
            }
            return new TSP.Path(result);
        }
        Heuristics.Radius = Radius;
    })(Heuristics = TSP.Heuristics || (TSP.Heuristics = {}));
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    var Heuristics;
    (function (Heuristics) {
        function Random(xy_vertices, dimensions) {
            var length = xy_vertices.length;
            return TSP.Path.random(length, dimensions);
        }
        Heuristics.Random = Random;
    })(Heuristics = TSP.Heuristics || (TSP.Heuristics = {}));
})(TSP || (TSP = {}));
/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>
/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>
var TSP;
(function (TSP) {
    function init(params) {
        var canvas = params.canvas;
        var context = canvas.getContext('2d');
        var reverseMap = {};
        var timings = [];
        canvas.width = params.dimensions.width;
        canvas.height = params.dimensions.height;
        Object.keys(TSP.Heuristics).forEach(function (algorithm_function_key) {
            var algorithm_function = TSP.Heuristics[algorithm_function_key];
            var name = algorithm_function.name;
            var option = document.createElement('option');
            reverseMap[name] = algorithm_function;
            option.innerText = name;
            params.picker.appendChild(option);
        });
        function deleteTimings() { timings.splice(0, timings.length); }
        params.picker.addEventListener('change', deleteTimings);
        params.count.addEventListener('change', deleteTimings);
        canvas.addEventListener('click', function (event) {
            console.log("Click:", new TSP.Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop));
        });
        params.calculate.addEventListener('click', function (event) {
            var user_count = params.count.valueAsNumber;
            var algorithm_name = params.picker.value;
            if (isNaN(user_count)) {
                return;
            }
            var clamped_count = Math.min(Math.max(2, user_count), 1000);
            params.count.value = clamped_count.toString();
            var random_path = TSP.Path.random(clamped_count, params.dimensions);
            var before = Date.now();
            var shortest_path = reverseMap[algorithm_name](random_path.vertices, params.dimensions);
            var after = Date.now();
            var dt = after - before;
            timings.push(dt);
            TSP.display(shortest_path, context, params.dimensions);
            var info = params.infoPanel;
            info.length.innerText = "Lengte: " + Math.round(shortest_path.length).toString() + "\n";
            info.time.innerText = "Tijd: " + dt.toString() + "ms \n\n";
            info.averageTime.innerText = "Gemiddelde tijd: " + Math.round(TSP.average(timings)).toString() + "ms   \n";
        }, false);
    }
    TSP.init = init;
})(TSP || (TSP = {}));
TSP.init({
    dimensions: new TSP.Size(500, 500),
    canvas: document.getElementById('Viewport'),
    picker: document.getElementById('Picker'),
    count: document.getElementById('Count'),
    infoPanel: {
        length: document.getElementById('Length'),
        time: document.getElementById('Time'),
        averageTime: document.getElementById('AverageTime')
    },
    calculate: document.getElementById('Calculate')
});
//# sourceMappingURL=packed.js.map