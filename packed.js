var TSP;
(function (TSP) {
    "use strict";
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Vector.prototype, "copy", {
            get: function () {
                return new Vector(this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y;
                return Math.sqrt(x * x + y * y);
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.toString = function () {
            return "(" + this.x + ", " + this.y + ")";
        };
        Vector.prototype.to = function (target) {
            var dx = target.x - this.x;
            var dy = target.y - this.y;
            return new Vector(dx, dy);
        };
        Vector.prototype.dot = function (operand) {
            return this.x * operand.x + this.y * operand.y;
        };
        Vector.prototype.angleWith = function (operand) {
            var dot_product = this.dot(operand);
            var length_product = this.length * operand.length;
            return Math.acos(dot_product / length_product);
        };
        Vector.prototype.signedAngleWith = function (point) {
            return this.angleWith(point) * Math.sign(point.y * this.x - point.x * this.y);
        };
        Vector.origin = new Vector(0, 0);
        return Vector;
    })();
    TSP.Vector = Vector;
    var Circle = (function () {
        function Circle(center, radius) {
            this.center = center;
            this.radius = radius;
        }
        Circle.prototype.contains = function (point) {
            var _a = this, center = _a.center, radius = _a.radius;
            var relative_length = center.to(point).length;
            return relative_length < radius;
        };
        Circle.prototype.toString = function () {
            var _a = this, center = _a.center, radius = _a.radius;
            return "(" + center + ", " + radius + ")";
        };
        return Circle;
    })();
    TSP.Circle = Circle;
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.prototype.toString = function () {
            return "(" + this.width + ", " + this.height + ")";
        };
        Size.default = Object.freeze(new Size(1000, 1000));
        return Size;
    })();
    TSP.Size = Size;
    var Path = (function () {
        function Path(vertices, closed) {
            if (closed === void 0) { closed = true; }
            this.vertices = vertices;
            this.closed = closed;
        }
        Object.defineProperty(Path.prototype, "length", {
            get: function () {
                return totalLength(this.vertices, this.closed);
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
    TSP.Optimizers = [];
    TSP.identityOptimizerName = "-Geen-";
    function verticesFromJSON(json) {
        return JSON.parse(json)
            .map(function (_a) {
            var x = _a[0], y = _a[1];
            return (x !== undefined && y !== undefined) ? new Vector(x, y) : null;
        })
            .filter(function (perhaps) { return perhaps !== null; });
    }
    TSP.verticesFromJSON = verticesFromJSON;
    function verticesToJSON(vertices) {
        return JSON.stringify(vertices.map(function (vertex) { return [vertex.x, vertex.y]; }));
    }
    TSP.verticesToJSON = verticesToJSON;
    function encodeAsDataURL(text) {
        var content = encodeURIComponent(text);
        return "data:text;charset=utf-8," + content;
    }
    TSP.encodeAsDataURL = encodeAsDataURL;
    function downloadTextFile(name, content) {
        var a = document.createElement('a');
        a.href = encodeAsDataURL(content);
        a.download = name;
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
    function deleteFrom(array, item) {
        var index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
    TSP.deleteFrom = deleteFrom;
    function complement(source, toBeRemoved) {
        var array = source.slice();
        toBeRemoved.forEach(function (target) { return deleteFrom(array, target); });
        return array;
    }
    TSP.complement = complement;
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
            var a = array[length / 2];
            var b = array[length / 2 - 1];
            return (a + b) / 2;
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
    function shuffle(array) {
        var builder = array.slice();
        var length = builder.length;
        for (var i = length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [builder[j], builder[i]], builder[i] = _a[0], builder[j] = _a[1];
        }
        return builder;
        var _a;
    }
    TSP.shuffle = shuffle;
    function randomVertices(count) {
        var _a = Size.default, x_range = _a.width, y_range = _a.height;
        var random = Math.random;
        var accumulator = new Array(count);
        for (var index = 0; index < count; index++) {
            accumulator[index] = new Vector(random() * x_range, random() * y_range);
        }
        return Object.freeze(accumulator);
    }
    TSP.randomVertices = randomVertices;
    function parseIntSafe(s, default_) {
        if (default_ === void 0) { default_ = 0; }
        var x = parseInt(s);
        return isNaN(x) ? default_ : x;
    }
    TSP.parseIntSafe = parseIntSafe;
    function clip(text, length, trail) {
        if (text.length < length) {
            return text;
        }
        else {
            return text.slice(0, length) + trail;
        }
    }
    TSP.clip = clip;
    TSP.maxLineLength = 160;
    function swap(array, index0, index1) {
        var accumulator = array.slice();
        _a = [accumulator[index0], accumulator[index1]], accumulator[index1] = _a[0], accumulator[index0] = _a[1];
        return accumulator;
        var _a;
    }
    TSP.swap = swap;
    function totalLength(vertices, closed) {
        if (closed === void 0) { closed = true; }
        var accumulator = 0;
        var length = vertices.length;
        vertices.forEach(function (vertex, index) {
            if (index + 1 < length) {
                var next = vertices[index + 1];
                accumulator += vertex.to(next).length;
            }
        });
        if (closed) {
            var first = vertices[0];
            var last = vertices[length - 1];
            accumulator += first.to(last).length;
        }
        return accumulator;
    }
    TSP.totalLength = totalLength;
    function clamp(min, value, max) {
        return Math.min(Math.max(min, value), max);
    }
    TSP.clamp = clamp;
    function randomElementFrom(array) {
        var length = array.length;
        var random = Math.random();
        var index = Math.floor(random * length);
        return array[index];
    }
    TSP.randomElementFrom = randomElementFrom;
    function sequentialPairs(array, loop) {
        if (loop === void 0) { loop = true; }
        var length = array.length;
        var accumulator = [];
        for (var i = 0; i < length - 1; i++) {
            var x = array[i];
            var y = array[i + 1];
            accumulator.push([x, y]);
        }
        if (loop) {
            var first = array[0];
            var last = array[length - 1];
            accumulator.push([last, first]);
        }
        return accumulator;
    }
    TSP.sequentialPairs = sequentialPairs;
    function insertElementIntoAfter(item, array, after) {
        var index = array.indexOf(after) + 1;
        array.splice(index, 0, item);
    }
    TSP.insertElementIntoAfter = insertElementIntoAfter;
})(TSP || (TSP = {}));
/// <reference path="../tsp.ts"/>
var TSP;
(function (TSP) {
    var τ = 2 * Math.PI;
    function display(parameters) {
        var path = parameters.path, ctx = parameters.context, _a = parameters.dimensions, width = _a.width, height = _a.height, _b = parameters.edgeWidth, edgeWidth = _b === void 0 ? 2 : _b, _c = parameters.vertexSize, vertexSize = _c === void 0 ? 5 : _c;
        var closed = path.closed;
        window.requestAnimationFrame(function () {
            ctx.clearRect(0, 0, width, height);
            if (edgeWidth > 0) {
                ctx.lineWidth = edgeWidth;
                ctx.beginPath();
                path.vertices.forEach(function (vertex) { return ctx.lineTo(vertex.x, vertex.y); });
                if (closed) {
                    ctx.closePath();
                }
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
            this.outlets = parameters;
            this.vertices = null;
            this.iconicPath = null;
            this.optimizedPath = null;
            this.previewContext = this.outlets.previewArea.getContext('2d');
            this.resultContext = this.outlets.resultArea.getContext('2d');
            this.resizeCanvases();
            this.populatePickers();
            this.registerListeners();
        }
        Controller.prototype.resizeCanvases = function () {
            var _a = this.outlets, resultArea = _a.resultArea, previewArea = _a.previewArea, dimensions = _a.dimensions;
            resultArea.width = previewArea.width = dimensions.width;
            resultArea.height = previewArea.height = dimensions.height;
        };
        Controller.prototype.populatePickers = function () {
            var _this = this;
            TSP.Heuristics.forEach(function (algorithm) {
                var option = document.createElement('option');
                option.innerText = algorithm.name;
                _this.outlets.algorithmPicker.appendChild(option);
            });
            TSP.Optimizers.forEach(function (optAlgorithm) {
                var option = document.createElement('option');
                option.innerText = optAlgorithm.name;
                _this.outlets.optimizationPicker.appendChild(option);
            });
        };
        Controller.prototype.registerListeners = function () {
            var _this = this;
            var _a = this.outlets, importButton = _a.importButton, exportInputButton = _a.exportInputButton, exportOutputButton = _a.exportOutputButton, updateButton = _a.updateButton, generateButton = _a.generateButton, calculateButton = _a.calculateButton;
            importButton.addEventListener('click', function (event) { return _this.importContentFromFile(); }, false);
            exportInputButton.addEventListener('click', function (event) { return _this.exportInputToFile(); }, false);
            exportOutputButton.addEventListener('click', function (event) { return _this.exportOutputToFile(); }, false);
            updateButton.addEventListener('click', function (event) { return _this.updatePreview(); }, false);
            generateButton.addEventListener('click', function (event) { return _this.generateRandomVertices(); }, false);
            calculateButton.addEventListener('click', function (event) { return _this.calculateResults(); }, false);
            window.addEventListener('beforeunload', function (event) { return _this.saveFiddle(); }, false);
            this.loadFiddle();
        };
        Controller.prototype.generateRandomVertices = function () {
            var _a = this.outlets, randomCount = _a.randomCount, fiddleArea = _a.fiddleArea;
            var count = TSP.parseIntSafe(randomCount.value, 1);
            var vertices = TSP.randomVertices(count);
            var pairs = vertices.map(function (vertex) { return [Math.round(vertex.x), Math.round(vertex.y)]; });
            fiddleArea.value = JSON.stringify(pairs, null, 4);
        };
        Controller.prototype.saveFiddle = function () {
            window.localStorage.setItem(TSP.storageKey, this.outlets.fiddleArea.value);
        };
        Controller.prototype.loadFiddle = function () {
            var value = window.localStorage.getItem(TSP.storageKey);
            if (value) {
                this.outlets.fiddleArea.value = value;
            }
        };
        Controller.prototype.importContentFromFile = function () {
            var _a = this.outlets, fileInput = _a.fileInput, fiddleArea = _a.fiddleArea;
            var file = fileInput.files[0];
            var reader = new FileReader();
            fiddleArea.value = "";
            reader.addEventListener('loadend', function (event) {
                fiddleArea.value = reader.result;
            }, false);
            reader.readAsText(file);
        };
        Controller.prototype.exportInputToFile = function () {
            if (this.vertices !== null) {
                TSP.downloadTextFile('input.txt', TSP.verticesToJSON(this.vertices));
            }
        };
        Controller.prototype.exportOutputToFile = function () {
            if (this.iconicPath !== null && this.optimizedPath !== null) {
                TSP.downloadTextFile('output.txt', TSP.verticesToJSON(this.optimizedPath.vertices));
            }
        };
        Controller.prototype.updatePreview = function () {
            var _a = this.outlets, fiddleArea = _a.fiddleArea, importError = _a.importError;
            var error;
            try {
                this.vertices = TSP.verticesFromJSON(fiddleArea.value);
                error = false;
            }
            catch (e) {
                error = true;
            }
            if (error) {
                importError.innerText = 'Malformed input';
            }
            else {
                importError.innerText = '';
                this.saveFiddle();
                TSP.display({
                    path: new TSP.Path(this.vertices),
                    context: this.previewContext,
                    dimensions: TSP.Size.default,
                    edgeWidth: 0,
                });
            }
        };
        Controller.prototype.calculateResults = function () {
            this.updatePreview();
            console.clear();
            if (this.vertices !== null) {
                var _a = this.outlets, algorithmPicker = _a.algorithmPicker, optimizationPicker = _a.optimizationPicker, testCount = _a.testCount, summary = _a.summary, allResults = _a.allResults;
                var algorithm = TSP.Heuristics.filter(function (algo) { return algo.name === algorithmPicker.value; })[0];
                var optimizer = TSP.Optimizers.filter(function (opt) { return opt.name === optimizationPicker.value; })[0];
                var count = TSP.parseIntSafe(testCount.value, 1);
                var vertices = this.vertices;
                var results = [];
                var opt_results = [];
                this.iconicPath = TSP.performTest(algorithm, vertices).path;
                this.optimizedPath = TSP.performTest(optimizer, this.iconicPath.vertices).path;
                TSP.rangeTo(count).forEach(function (i) {
                    var result = TSP.performTest(algorithm, vertices);
                    var opt_result = TSP.performTest(optimizer, result.path.vertices);
                    results.push(result);
                    opt_results.push(opt_result);
                });
                var timings = results.map(function (result) { return result.time; });
                var opt_timings = opt_results.map(function (result) { return result.time; });
                var $ = Math.round;
                summary.innerText =
                    ("Lengte: " + $(this.iconicPath.length) + "\n") +
                        ("Geopt. lengte: " + $(this.optimizedPath.length) + "\n") +
                        ("Winst: " + $((1 - this.optimizedPath.length / this.iconicPath.length) * 100) + "%");
                allResults.innerText =
                    ("Algoritme uitvoertijden: (Q\u2082: " + $(TSP.median(timings)) + ")\n" + TSP.clip(timings.join(", "), TSP.maxLineLength / 3, "...") + " \n") +
                        ("Optimalisatie uitvoertijden: (Q\u2082: " + $(TSP.median(opt_timings)) + ")\n" + TSP.clip(opt_timings.join(", "), TSP.maxLineLength / 3, "...") + " \n\n") +
                        ("Puntenset: " + TSP.clip(this.optimizedPath.vertices.join(", "), TSP.maxLineLength, "..."));
                TSP.display({
                    path: this.optimizedPath,
                    context: this.resultContext,
                    dimensions: this.outlets.dimensions,
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
    "use strict";
    TSP.Heuristics.push({
        name: TSP.identityOptimizerName,
        solve: function (vertices) { return vertices; }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    function findLeftmostTurn(point, candidates) {
        var chosen = TSP.randomElementFrom(candidates);
        candidates.forEach(function (candidate) {
            var chosen_edge = point.to(chosen);
            var candidate_edge = point.to(candidate);
            if (chosen_edge.signedAngleWith(candidate_edge) > 0) {
                chosen = candidate;
            }
        });
        return chosen;
    }
    function convexHull(vertices) {
        var x_vertices = vertices.map(function (vertex) { return vertex.x; });
        var minimum_x = Math.min.apply(Math, x_vertices);
        var start = vertices[x_vertices.indexOf(minimum_x)];
        var accumulator = [start];
        while (true) {
            var cursor = accumulator[accumulator.length - 1];
            var remaining = TSP.removeFrom(vertices, cursor);
            var candidate = findLeftmostTurn(cursor, remaining);
            if (candidate === start) {
                break;
            }
            else {
                accumulator.push(candidate);
            }
        }
        return accumulator;
    }
    function findGreatestAngle(hull, candidates) {
        var chosen = [hull[0], TSP.randomElementFrom(candidates)];
        var greatest_angle = 0;
        var pairs = TSP.sequentialPairs(hull);
        pairs.forEach(function (pair) {
            var v = pair[0], w = pair[1];
            candidates.forEach(function (candidate) {
                var angle = candidate.to(v).angleWith(candidate.to(w));
                if (angle > greatest_angle) {
                    greatest_angle = angle;
                    chosen = [v, candidate];
                }
            });
        });
        return chosen;
    }
    TSP.Heuristics.push({
        name: "Grootste Hoek",
        solve: function (vertices) {
            var route = convexHull(vertices);
            var candidates = TSP.complement(vertices, route);
            while (candidates.length > 0) {
                var _a = findGreatestAngle(route, candidates), position = _a[0], item = _a[1];
                TSP.insertElementIntoAfter(item, route, position);
                candidates = TSP.complement(vertices, route);
            }
            return route;
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    TSP.Heuristics.push({
        name: "Naaste Buur",
        solve: function (vertices) {
            function findNearest(vertex, pool) {
                var lengths = pool.map(function (match) { return vertex.to(match).length; });
                var shortest = Math.min.apply(null, lengths);
                var index = lengths.indexOf(shortest);
                return pool[index];
            }
            var ordered = [vertices[0]];
            var unordered = vertices.slice(1);
            while (unordered.length !== 0) {
                var current = ordered[0];
                var nearest = findNearest(current, unordered);
                ordered.unshift(nearest);
                TSP.deleteFrom(unordered, nearest);
            }
            return ordered.reverse();
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    TSP.Heuristics.push({
        name: "Willekeurig",
        solve: function (vertices) { return TSP.shuffle(vertices); }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    TSP.Heuristics.push({
        name: "Straal",
        solve: function (vertices) {
            function findNearest(vertex, pool) {
                var start = 1;
                var stop = 2 * 1000;
                var step = stop / 10;
                var radius = start;
                var matches = [];
                while (matches.length === 0) {
                    var circle = new TSP.Circle(vertex, radius);
                    pool.forEach(function (remainingVertex) {
                        if (circle.contains(remainingVertex)) {
                            matches.push(remainingVertex);
                        }
                    });
                    radius += step;
                    if (radius >= stop) {
                        return null;
                    }
                }
                var lengths = matches.map(function (match) { return vertex.to(match).length; });
                var shortest = Math.min.apply(null, lengths);
                var index = lengths.indexOf(shortest);
                return matches[index];
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
    "use strict";
    TSP.Optimizers.push({
        name: TSP.identityOptimizerName,
        solve: function (vertices) { return vertices; }
    });
})(TSP || (TSP = {}));
/// <reference path="./../common.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    function $(vertices) {
        return new TSP.Path(vertices);
    }
    TSP.Optimizers.push({
        name: "2-Opt",
        solve: function (vertices) {
            /*let length     = vertices.length
            let best_route = vertices.slice()
            
            again:
            for (let i = 1; i < length - 3; i++ ) {
                for (let j = i + 2; j < length - 1; j++) {
                    let a = best_route[i]
                    let b = best_route[i + 1]
                    let c = best_route[j]
                    let d = best_route[j + 1]
                    
                    let before = a.to(b).lengthSquared + c.to(d).lengthSquared
                    let after  = a.to(c).lengthSquared + b.to(d).lengthSquared
                    
                    if (after < before) {
                        best_route = swap(best_route, i+1, j)
                        continue again
                    }
                }
            }
            
            return best_route*/
            var length = vertices.length;
            var best_route = vertices.slice();
            var stale = true;
            again: do {
                stale = true;
                for (var i = 0; i < length; i++) {
                    for (var j = i + 1; j < length; j++) {
                        var new_route = [].concat(best_route.slice(0, i), best_route.slice(i, j).reverse(), best_route.slice(j));
                        var before = TSP.totalLength(best_route);
                        var after = TSP.totalLength(new_route);
                        if (after < before) {
                            best_route = new_route;
                            stale = false;
                            continue again;
                        }
                    }
                }
            } while (!stale);
            return best_route;
        }
    });
})(TSP || (TSP = {}));
/// <reference path="./src/common.ts"/>
/// <reference path="./src/output.ts"/>
/// <reference path="./src/controller.ts"/>
/// <reference path="./src/variants/id.ts"/>
/// <reference path="./src/variants/greatest_angle.ts"/>
/// <reference path="./src/variants/nn_alt.ts"/>
/// <reference path="./src/variants/nn.ts"/>
/// <reference path="./src/variants/random.ts"/>
/// <reference path="./src/variants/radius.ts"/>
/// <reference path="./src/opt-variants/none.ts"/>
/// <reference path="./src/opt-variants/2-opt.ts"/>
var TSP;
(function (TSP) {
    "use strict";
    var controller = new TSP.Controller({
        dimensions: TSP.Size.default,
        summary: document.getElementById("InfoPanel"),
        allResults: document.getElementById("AllResults"),
        resultArea: document.getElementById("Viewport"),
        exportOutputButton: document.getElementById("ExportResults"),
        exportInputButton: document.getElementById("ControllerExport"),
        importButton: document.getElementById("ControllerImport"),
        importError: document.getElementById("InputError"),
        previewArea: document.getElementById("ControllerPreview"),
        fiddleArea: document.getElementById("ControllerFiddleArea"),
        fileInput: document.getElementById("ControllerFiles"),
        updateButton: document.getElementById("ControllerUpdate"),
        randomCount: document.getElementById("RandomCount"),
        generateButton: document.getElementById("RandomGenerate"),
        algorithmPicker: document.getElementById("Picker"),
        optimizationPicker: document.getElementById("OptPicker"),
        calculateButton: document.getElementById("Calculate"),
        testCount: document.getElementById("TestCount"),
    });
})(TSP || (TSP = {}));
function vector(x, y) {
    return new TSP.Vector(x, y);
}
//# sourceMappingURL=packed.js.map