var TSP;
(function (TSP) {
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
            Object.freeze(this);
        }
        Vector.relative = function (base, target) {
            var dx = target.x - base.x;
            var dy = target.y - base.y;
            return new Vector(dx, dy);
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
        Size.default = new Size(1000, 1000);
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
                accumulator[index] = new Vector(random() * 1000, random() * 1000);
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
    var nestedFromJSON = function (json) { return JSON.parse(json); };
    var verticesFromNested = function (nested_array) { return nested_array.map(function (_a) {
        var x = _a[0], y = _a[1];
        if (x !== undefined && y !== undefined) {
            return new Vector(x, y);
        }
        else {
            return null;
        }
    }).filter(function (perhaps) { return perhaps !== null; }); };
    TSP.verticesFromJSON = function (json) { return verticesFromNested(nestedFromJSON(json)); };
    function downloadTextFile(text) {
        var a = document.createElement('a');
        a.href = "data:text;charset=utf-8," + text;
        a.download = "points.txt";
        a.click();
    }
    TSP.downloadTextFile = downloadTextFile;
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
    function median(samples) {
        var array = samples.slice().sort();
        var length = array.length;
        if (length % 2 === 1) {
            return array[(length - 1) / 2];
        }
        else {
            var next = array[length / 2];
            var prev = array[length / 2 - 1];
            return (next + prev) / 2;
        }
    }
    TSP.median = median;
    function rangeTo(stop) {
        var accumulator = [];
        for (var i = 0; i < stop; i++) {
            accumulator.push(i);
        }
        return accumulator;
    }
    TSP.rangeTo = rangeTo;
    function parseIntSafe(s, default_) {
        var x = parseInt(s);
        return isNaN(x) ? default_ : x;
    }
    TSP.parseIntSafe = parseIntSafe;
})(TSP || (TSP = {}));
/// <reference path="../tsp.ts"/>
var TSP;
(function (TSP) {
    var τ = 2 * Math.PI;
    function display(parameters) {
        var path = parameters.path, ctx = parameters.context, _a = parameters.dimensions, width = _a.width, height = _a.height, _b = parameters.edgeWidth, edgeWidth = _b === void 0 ? 2 : _b, _c = parameters.vertexSize, vertexSize = _c === void 0 ? 5 : _c;
        window.requestAnimationFrame(function () {
            ctx.clearRect(0, 0, width, height);
            if (edgeWidth > 0) {
                ctx.lineWidth = edgeWidth;
                ctx.beginPath();
                path.vertices.forEach(function (vertex) { return ctx.lineTo(vertex.x, vertex.y); });
                ctx.closePath();
                ctx.stroke();
            }
            if (vertexSize > 0) {
                path.vertices.forEach(function (vertex) {
                    ctx.beginPath();
                    ctx.arc(vertex.x, vertex.y, vertexSize, 0, τ);
                    ctx.closePath();
                    ctx.fill();
                });
            }
        });
    }
    TSP.display = display;
})(TSP || (TSP = {}));
/// <reference path="./common.ts"/>
/// <reference path="/usr/local/lib/node_modules/typescript/bin/lib.es6.d.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    TSP.storageKey = 'yolo';
    var Controller = (function () {
        function Controller(parameters) {
            Object.assign(this, parameters);
            this.vertices = null;
            this.previewContext = this.previewArea.getContext('2d');
            this.registerListeners();
            Object.seal(this);
        }
        Controller.prototype.registerListeners = function () {
            var _this = this;
            this.importButton.addEventListener('click', function (event) { return _this.importContentFromFile(); }, false);
            this.exportButton.addEventListener('click', function (event) { return _this.exportContentToFile(); }, false);
            this.updateButton.addEventListener('click', function (event) { return _this.updatePreview(); }, false);
            this.generateButton.addEventListener('click', function (event) { return _this.generateRandomVertices(); }, false);
            window.addEventListener('beforeunload', function (event) { return _this.saveFiddle(); }, false);
            this.loadFiddle();
        };
        Controller.prototype.generateRandomVertices = function () {
            var count = TSP.parseIntSafe(this.randomCount.value, 1);
            var vertices = TSP.Path.random(count);
            var pairs = vertices.map(function (vertex) { return [vertex.x, vertex.y]; });
            this.fiddleArea.value = JSON.stringify(pairs, null, 4);
        };
        Controller.prototype.saveFiddle = function () {
            window.localStorage.setItem(TSP.storageKey, this.fiddleArea.value);
        };
        Controller.prototype.loadFiddle = function () {
            var value = window.localStorage.getItem(TSP.storageKey);
            if (value) {
                this.fiddleArea.value = value;
            }
        };
        Controller.prototype.importContentFromFile = function () {
            var _this = this;
            var file = this.fileInput.files[0];
            var reader = new FileReader();
            this.fiddleArea.value = "";
            reader.readAsText(file);
            reader.addEventListener('loadend', function (event) {
                var result = reader.result;
                _this.fiddleArea.value = result;
            }, false);
        };
        Controller.prototype.exportContentToFile = function () {
            TSP.downloadTextFile(this.fiddleArea.value);
        };
        Controller.prototype.updatePreview = function () {
            var error;
            try {
                this.vertices = TSP.verticesFromJSON(this.fiddleArea.value);
                error = false;
            }
            catch (e) {
                error = true;
            }
            if (error) {
                this.importError.innerText = 'Malformed input';
            }
            else {
                this.importError.innerText = '';
                this.saveFiddle();
                TSP.display({
                    path: new TSP.Path(this.vertices),
                    context: this.previewContext,
                    dimensions: TSP.Size.default,
                    edgeWidth: 0,
                });
            }
        };
        return Controller;
    })();
    TSP.Controller = Controller;
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
/// <reference path="./src/controller.ts"/>
/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/variants/random.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    function run(params) {
        var dimensions = params.dimensions, picker = params.picker, calculate = params.calculate, controllerArguments = params.controllerArguments, infoPanel = params.infoPanel, allResults = params.allResults, testCount = params.testCount, canvas = params.canvas;
        var previewArea = controllerArguments.previewArea;
        canvas.width = previewArea.width = dimensions.width;
        canvas.height = previewArea.height = dimensions.height;
        var context = canvas.getContext('2d');
        var controller = new TSP.Controller(controllerArguments);
        function addOptionByName(name) {
            var option = document.createElement('option');
            option.innerText = name;
            picker.appendChild(option);
        }
        TSP.Heuristics.forEach(function (algorithm) { return addOptionByName(algorithm.name); });
        calculate.addEventListener('click', function (event) {
            controller.updatePreview();
            var algorithm = TSP.Heuristics.filter(function (algo) { return algo.name === picker.value; })[0];
            var count = TSP.parseIntSafe(testCount.value, 1);
            var results = [];
            var iconic_path = TSP.performTest(algorithm, controller.vertices).path;
            TSP.rangeTo(count).forEach(function (i) { return results.push(TSP.performTest(algorithm, controller.vertices)); });
            TSP.display({
                path: iconic_path,
                context: context,
                dimensions: dimensions,
            });
            var timings = results.map(function (result) { return result.time; });
            infoPanel.innerText =
                ("Lengte: " + Math.round(iconic_path.length) + "\n") +
                    ("Mediaan tijd: " + Math.round(TSP.median(timings)) + "ms\n") +
                    ("Gemiddelde tijd: " + Math.round(TSP.average(timings)) + "ms\n");
            allResults.innerText = "Tijden: " + results.map(function (result) { return Math.round(result.time); }).join(', ');
        }, false);
    }
    TSP.run = run;
})(TSP || (TSP = {}));
TSP.run({
    dimensions: new TSP.Size(1000, 1000),
    infoPanel: document.getElementById('InfoPanel'),
    allResults: document.getElementById('AllResults'),
    canvas: document.getElementById('Viewport'),
    controllerArguments: {
        exportButton: document.getElementById("ControllerExport"),
        importButton: document.getElementById("ControllerImport"),
        importError: document.getElementById("InputError"),
        previewArea: document.getElementById("ControllerPreview"),
        fiddleArea: document.getElementById("ControllerFiddleArea"),
        fileInput: document.getElementById("ControllerFiles"),
        updateButton: document.getElementById("ControllerUpdate"),
        randomCount: document.getElementById("RandomCount"),
        generateButton: document.getElementById("RandomGenerate"),
    },
    picker: document.getElementById('Picker'),
    calculate: document.getElementById('Calculate'),
    testCount: document.getElementById('TestCount'),
});
//# sourceMappingURL=packed.js.map