var TSP;
(function (TSP) {
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
            Object.freeze(this);
        }
        Vector.relative = function (base, target) {
            return new Vector(target.x - base.x, target.y - base.y);
        };
        Object.defineProperty(Vector.prototype, "lengthSquared", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y;
                return x * x + y * y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return Math.sqrt(this.lengthSquared);
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.to = function (target) {
            return Vector.relative(this, target);
        };
        return Vector;
    })();
    TSP.Vector = Vector;
    var Circle = (function () {
        function Circle(center, radius) {
            this.center = center;
            this.radius = radius;
            Object.freeze(this);
        }
        Circle.prototype.contains = function (point) {
            var _a = this, center = _a.center, radius = _a.radius;
            var relative = center.to(point);
            var radiusSquared = radius * radius;
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
        Size.default = new Size(100, 100);
        return Size;
    })();
    TSP.Size = Size;
    var Path = (function () {
        function Path(vertices) {
            this.vertices = vertices;
            Object.freeze(this.vertices);
            Object.freeze(this);
        }
        Path.random = function (vertex_count) {
            var random = Math.random;
            var accumulator = new Array(vertex_count);
            for (var index = 0; index < vertex_count; index++) {
                accumulator[index] = new Vector(random() * 100, random() * 100);
            }
            return Object.freeze(accumulator);
        };
        Object.defineProperty(Path.prototype, "length", {
            get: function () {
                var _this = this;
                var accumulator = 0;
                var length = this.vertices.length;
                this.vertices.forEach(function (vertex, index) {
                    if (index + 1 < length) {
                        var next = _this.vertices[index + 1];
                        accumulator += vertex.to(next).length;
                    }
                });
                return accumulator;
            },
            enumerable: true,
            configurable: true
        });
        return Path;
    })();
    TSP.Path = Path;
    function performTest(algo, vertices) {
        var before = Date.now();
        var solved = algo.solve(vertices);
        var after = Date.now();
        return {
            algorithm: algo,
            path: new Path(solved),
            time: after - before
        };
    }
    TSP.performTest = performTest;
    TSP.Heuristics = [];
    function removeFrom(array, item) {
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
    TSP.removeFrom = removeFrom;
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
            return NaN;
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
    TSP.Heuristics.push({
        name: "Nearest Neighbour",
        solve: function (vertices) {
            function findNearest(vertex, remainingVertices) {
                var lengths = remainingVertices.map(function (match) { return vertex.to(match).lengthSquared; });
                var minLength = Math.min.apply(null, lengths);
                var index = lengths.indexOf(minLength);
                return remainingVertices[index];
            }
            if (vertices.length < 3) {
                return vertices;
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
                remaining = TSP.removeFrom(remaining, nearest);
            }
            return result;
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    TSP.Heuristics.push({
        name: "Radius",
        solve: function (vertices) {
            function findNearest(vertex, remainingVertices) {
                var start = 1;
                var stop = 2 * 100;
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
                var lengths = matches.map(function (match) { return vertex.to(match).lengthSquared; });
                var minLength = Math.min.apply(null, lengths);
                var index = lengths.indexOf(minLength);
                return matches[index];
            }
            if (vertices.length < 3) {
                return vertices;
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
                remaining = TSP.removeFrom(remaining, nearest);
            }
            return result;
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    TSP.Heuristics.push({
        name: "Random",
        solve: function (xy_vertices) {
            return TSP.Path.random(xy_vertices.length);
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>
/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>
var TSP;
(function (TSP) {
    function run(params) {
        var canvas = params.canvas, dimensions = params.dimensions, picker = params.picker, count = params.count, calculate = params.calculate;
        var context = canvas.getContext('2d');
        var timings = [];
        window["falafal"] = context;
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        function addOptionByName(name) {
            var option = document.createElement('option');
            option.innerText = name;
            picker.appendChild(option);
        }
        TSP.Heuristics.forEach(function (algorithm) {
            addOptionByName(algorithm.name);
        });
        function deleteTimings() { timings.splice(0, timings.length); }
        picker.addEventListener('change', deleteTimings);
        count.addEventListener('change', deleteTimings);
        canvas.addEventListener('click', function (event) {
            var location = new TSP.Vector(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
        });
        calculate.addEventListener('click', function (event) {
            var user_count = count.valueAsNumber;
            var algorithm_name = picker.value;
            if (isNaN(user_count)) {
                return;
            }
            var clamped_count = Math.min(Math.max(5, user_count), 500);
            count.value = clamped_count.toString();
            var random_vertices = TSP.Path.random(clamped_count);
            var algorithm = TSP.Heuristics.filter(function (algo) { return algo.name === algorithm_name; })[0];
            var result = TSP.performTest(algorithm, random_vertices);
            timings.push(result.time);
            TSP.display(result.path, context, dimensions);
            var info = params.infoPanel;
            info.length.innerText = "Lengte: " + Math.round(result.path.length).toString() + "\n";
            info.time.innerText = "Tijd: " + result.time.toString() + "ms \n\n";
            info.averageTime.innerText = "Gemiddelde tijd: " + Math.round(TSP.average(timings)).toString() + "ms   \n";
        }, false);
    }
    TSP.run = run;
})(TSP || (TSP = {}));
TSP.run({
    dimensions: new TSP.Size(100, 100),
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
/// <reference path="./common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    var storageKey = "willy2k16";
    var PortController = (function () {
        function PortController(params) {
            var fileInput = params.fileInput, importButton = params.importButton, exportButton = params.exportButton, fiddleArea = params.fiddleArea;
            this.fileInput = fileInput;
            this.importButton = importButton;
            this.exportButton = exportButton;
            this.fiddleArea = fiddleArea;
            this.vertices = null;
            Object.seal(this);
        }
        PortController.prototype.saveContent = function () {
            localStorage.setItem(storageKey, this.fiddleArea.innerText);
        };
        PortController.prototype.loadContent = function () {
            var stored = localStorage.getItem(storageKey);
            if (stored !== null) {
                this.fiddleArea.value = stored;
            }
        };
        PortController.prototype.importContentFromFile = function () {
            var _this = this;
            var file = this.fileInput.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener('loadend', function (event) {
                var json_text = reader.result;
                _this.fiddleArea.innerText = json_text;
            }, false);
        };
        return PortController;
    })();
    TSP.PortController = PortController;
})(TSP || (TSP = {}));
//# sourceMappingURL=packed.js.map