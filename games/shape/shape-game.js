"use strict";

var _welcome, _experiment, _begin, _results, _totals, _total, _shape;

var shape = (function() {
    var _gap = 20;
    var _keyid = 1;
    var _color = "#333333";
    var _shapes = [];

    var rand1 = function(max) {
        return Math.floor(Math.random() * max);
    };

    var rand2 = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var canvas = function(name, width, height, scale) {
        var canvas = document.createElement("canvas");
        scale = scale || 1;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width * scale + 'px';
        canvas.style.height = height * scale + 'px';
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.display = "none";
        canvas.setAttribute("id", "canvas" + name);
        canvas.setAttribute("name", name);
        canvas.setAttribute("data-scale", 1);
        document.getElementById("shapes").appendChild(canvas);
        return canvas;
    };

    var context = function(cvs) {
        var ctx = cvs.getContext("2d");
        var scale = parseInt(cvs.getAttribute("data-scale", scale)) || 1;
        ctx.width = cvs.width;
        ctx.height = cvs.height;
        ctx.scaled = scale;
        ctx.scale(scale, scale);
        ctx.clear = function() {
            ctx.clearRect(0, 0, ctx.width, ctx.height);
            return ctx;
        };
        return ctx;
    };

    var button = function(key, name, icon) {
        var div = document.createElement("div");
        var btn = document.createElement("input");
        btn.style.backgroundImage = "url(" + icon + ")";
        btn.style.backgroundPosition = "22px 3px";
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "button" + name);
        btn.setAttribute("name", name);
        btn.className = "game-button";
        div.appendChild(btn);
        document.getElementById("buttons").appendChild(div);
        console.log('Button created:', name, btn);
        return btn;
    };

    var Shape = function(name, draw) {
        var self = this;
        self.name = name;
        self.width = 100;
        self.height = 100;
        self.scale = 4;
        self.key = _keyid;
        self.canvas = canvas(name, self.width, self.height, self.scale);
        self.context = context(self.canvas);
        self.draw = draw;
        self.pixels = [];
        self.makebutton().redraw();
        self.total = self.pixels.length;
        _shapes[name] = self;
        _keyid++;
    };

    Shape.prototype.eachPixel = function(callback) {
        var self = this;
        var image = self.context.getImageData(0, 0, self.width, self.height);
        var data = image.data;
        var length = data.length;
        for (var y = 0; y < self.height; y++) {
            for (var x = 0; x < self.width; x++) {
                var i = (x + y * self.width) * 4;
                callback(x, y, data[i], data[i + 1], data[i + 2], data[i + 3]);
            }
        }
        return image;
    };

    Shape.prototype.cachePixels = function() {
        var self = this;
        self.pixels = [];
        self.eachPixel(function(x, y, r, g, b, a) {
            if (r < 255 && g < 255 && b < 255 && r > 0 && g > 0 && b > 0 && a > 0.0)
                self.pixels.push({
                    x: x,
                    y: y
                });
        });
    };

    Shape.prototype.randPixel = function() {
        var self = this;
        var i = rand1(self.pixels.length);
        var p = self.pixels[i];
        self.pixels.splice(i, 1);
        return p;
    };

    Shape.prototype.putPixel = function(r, g, b, a) {
        var self = this;
        var xy = self.randPixel();
        var i = (xy.x + xy.y * self.width) * 4;
        var image = self.image;
        image.data[i + 0] = r;
        image.data[i + 1] = g;
        image.data[i + 2] = b;
        image.data[i + 3] = a || 255;
        self.context.putImageData(image, 0, 0);
    };

    Shape.prototype.makebutton = function() {
        var self = this;
        self.context.scale(0.5, 0.5);
        self.draw.call(self, _color);
        self.icon = self.canvas.toDataURL();
        self.context.scale(2, 2);
        self.context.clear();
        self.button = button(self.key, self.name, self.icon);
        return self;
    };

    Shape.prototype.redraw = function() {
        var self = this;
        self.draw.call(self, _color);
        self.cachePixels();
        self.context.clear();
        self.image = self.context.getImageData(0, 0, self.width, self.height);
        clearInterval(self.interval);
        return self;
    };

    Shape.prototype.start = function(gap) {
        var self = this;
        self.started = (new Date()) - 0;
        self.interval = setInterval(function() {
            if (self.pixels.length) self.putPixel(0, 0, 0);
            else self.stop();
        }, gap || _gap);
        return self;
    };

    Shape.prototype.stop = function() {
        clearInterval(this.interval);
        return this;
    };

    Shape.prototype.test = function(guess) {
        return this.name.toLowerCase() === guess.toLowerCase();
    };

    Shape.prototype.done = function() {
        return this.total - this.pixels.length;
    };

    Shape.prototype.percent = function() {
        return this.done() / this.total;
    };

    Shape.prototype.time = function() {
        return (new Date()) - this.started;
    };

    Shape.prototype.show = function() {
        this.canvas.style.display = "block";
        return this;
    };

    Shape.prototype.hide = function() {
        this.canvas.style.display = "none";
        return this;
    };

    function addShape(name, draw, test) {
        return new Shape(name, draw, test);
    }

    function testShape(name, guess) {
        return _shapes[name].test(guess);
    }

    function listShapes() {
        var list = [];
        for (var i in _shapes)
            if (_shapes.hasOwnProperty(i)) list.push(_shapes[i]);
        return list;
    }

    function randomShape() {
        var list = listShapes();
        return list[rand1(list.length)];
    }

    function keys() {
        var list = [];
        for (var i in _shapes)
            if (_shapes.hasOwnProperty(i)) list.push(_shapes[i].name);
        return list;
    }

    function each(callback) {
        var list = listShapes();
        for (var i = 0; i < list.length; i++) callback.call(list[i], list[i]);
    }

    var shape = {
        add: addShape,
        each: each,
        keys: keys,
        random: randomShape
    };

    var polygon = function(ctx, color, points) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };

    var model = (function() {
        var _key = 'shape_experiment';
        var _url = window.location.href;

        var init = function() {
            if (localStorage.getItem(_key)) {
                var data = JSON.parse(localStorage.getItem(_key));
                document.getElementById('totals').innerHTML = data.totals;
                document.getElementById('results').innerHTML = data.results;
            }
        };

        var logs = function() {
            var data = {
                totals: document.getElementById('totals').innerHTML,
                results: document.getElementById('results').innerHTML
            };
            localStorage.setItem(_key, JSON.stringify(data));
        };

        var total = function(shape, guess, correct, totalPixels, done, time, image) {
            console.log('total() called with:', {
                shape: shape,
                guess: guess,
                correct: correct,
                totalPixels: totalPixels,
                done: done,
                time: time
            });

            var best_percent = parseFloat(localStorage.getItem('best_percent_' + shape)) || 0;
            var best_time = parseFloat(localStorage.getItem('best_time_' + shape)) || Infinity;
            var avg_percent = parseFloat(localStorage.getItem('avg_percent_' + shape)) || 0;
            var avg_time = parseFloat(localStorage.getItem('avg_time_' + shape)) || 0;
            var count = parseInt(localStorage.getItem('count_' + shape)) || 0;
            var pct = done / totalPixels;
            var t = time / 1000;

            console.log('Before update:', {
                best_percent: best_percent,
                best_time: best_time,
                avg_percent: avg_percent,
                avg_time: avg_time,
                count: count,
                pct: pct,
                t: t
            });

            if (correct) {
                if (pct > best_percent) {
                    localStorage.setItem('best_percent_' + shape, pct);
                    best_percent = pct;
                }
                if (t < best_time) {
                    localStorage.setItem('best_time_' + shape, t);
                    best_time = t;
                }
            }

            count++;
            avg_percent = (avg_percent * (count - 1) + pct) / count;
            avg_time = (avg_time * (count - 1) + t) / count;

            console.log('After update:', {
                best_percent: best_percent,
                best_time: best_time,
                avg_percent: avg_percent,
                avg_time: avg_time,
                count: count
            });

            localStorage.setItem('avg_percent_' + shape, avg_percent);
            localStorage.setItem('avg_time_' + shape, avg_time);
            localStorage.setItem('count_' + shape, count);

            return {
                best_percent: best_percent,
                best_time: best_time,
                avg_percent: avg_percent,
                avg_time: avg_time,
                grand: {
                    best_percent: parseFloat(localStorage.getItem('grand_best_percent')) || 0,
                    best_time: parseFloat(localStorage.getItem('grand_best_time')) || Infinity,
                    avg_percent: parseFloat(localStorage.getItem('grand_avg_percent')) || 0,
                    avg_time: parseFloat(localStorage.getItem('grand_avg_time')) || 0,
                    count: parseInt(localStorage.getItem('grand_count')) || 0
                }
            };
        };

        var log = function(shape, guess, correct, totalPixels, done, time, image) {
            total(shape, guess, correct, totalPixels, done, time, image);

            var grand = {
                best_percent: parseFloat(localStorage.getItem('grand_best_percent')) || 0,
                best_time: parseFloat(localStorage.getItem('grand_best_time')) || Infinity,
                avg_percent: parseFloat(localStorage.getItem('grand_avg_percent')) || 0,
                avg_time: parseFloat(localStorage.getItem('grand_avg_time')) || 0,
                count: parseInt(localStorage.getItem('grand_count')) || 0
            };

            if (correct) {
                if (grand.best_percent < done / totalPixels) {
                    localStorage.setItem('grand_best_percent', done / totalPixels);
                    grand.best_percent = done / totalPixels;
                }
                if (grand.best_time > time / 1000) {
                    localStorage.setItem('grand_best_time', time / 1000);
                    grand.best_time = time / 1000;
                }
            }

            grand.count++;
            grand.avg_percent = (grand.avg_percent * (grand.count - 1) + done / totalPixels) / grand.count;
            grand.avg_time = (grand.avg_time * (grand.count - 1) + time / 1000) / grand.count;

            localStorage.setItem('grand_count', grand.count);
            localStorage.setItem('grand_avg_percent', grand.avg_percent);
            localStorage.setItem('grand_avg_time', grand.avg_time);

            return grand;
        };

        var result = function(shape, guess, correct, totalPixels, done, time, image) {
            var img = document.createElement("img");
            img.className = 'pixel';
            img.src = image;
            return img;
        };

        return {
            init: init,
            logs: logs,
            total: total,
            log: log,
            result: result
        };
    })();

    var circle = shape.add("circle", function(color) {
        var ctr = this.width / 2;
        var rad = this.width / 2 - 11;
        var ctx = this.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(ctr, ctr, rad, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    });

    var triangle = shape.add("triangle", function(color) {
        polygon(this.context, color, [
            [15, 85],
            [50, 15],
            [85, 85]
        ]);
    });

    var square = shape.add("square", function(color) {
        var margin = 15;
        this.context.fillStyle = color;
        this.context.fillRect(margin, margin, this.width - margin * 2, this.width - margin * 2);
    });

    var pentagon = shape.add("pentagon", function(color) {
        polygon(this.context, color, [
            [25, 85],
            [15, 40],
            [50, 15],
            [85, 40],
            [75, 85]
        ]);
    });

    var donut = shape.add("donut", function(color) {
        var ctr = this.width / 2;
        var rad = this.width / 2 - 11;
        var ctx = this.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(ctr, ctr, rad, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,1.0)";
        ctx.arc(ctr, ctr, rad / 3.7, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    });

    var star = shape.add("star", function(color) {
        polygon(this.context, color, [
            [50, 10],
            [35, 35],
            [10, 40],
            [28, 58],
            [20, 85],
            [50, 72],
            [80, 85],
            [72, 58],
            [90, 40],
            [65, 35]
        ]);
    });

    var bars = shape.add("bars", function(color) {
        var margin = 15;
        var height = Math.floor((this.height - margin) / 2.6);
        var width = this.width - margin * 2;
        this.context.fillStyle = color;
        this.context.fillRect(margin, margin, width, height);
        this.context.fillRect(margin, this.height - height - margin, width, height);
    });

    var diamond = shape.add("diamond", function(color) {
        polygon(this.context, color, [
            [50, 15],
            [85, 50],
            [50, 85],
            [15, 50]
        ]);
    });

    var record = function(shape, guess, correct, totalPixels, done, time, image) {
        var img = document.createElement("img");
        img.className = 'pixel';
        img.src = image;
        return img;
    };

    var tally = function(shape, bpct, btime, apct, atime) {
        document.getElementById('total').style.display = "block";
        var tr = document.getElementById("total_" + shape);
        var isnew = tr ? 0 : 1;

        if (isnew) {
            tr = document.createElement("tr");
            tr.setAttribute("id", "total_" + shape);
            document.getElementById('totals').appendChild(tr);
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
            var tag = !i ? '' : i % 2 ? '%' : 's';
            var value = arguments[i];
            
            if (i > 0 && !isFinite(value)) {
                value = 0;
            }
            
            var td = isnew ? document.createElement("td") : tr.cells[i];
            td.textContent = (((i > 0) ? parseInt(value * 100) / 100 : value) || 0) + tag;
            isnew && tr.appendChild(td);
        }
    };

    var display = function(shape, guess, correct, totalPixels, done, time, image, nolog) {
        var li = document.createElement("div");
        var classes = [correct ? 'result-correct' : 'result-incorrect', 'result-item'];
        var percent = done / totalPixels;
        var container = document.createElement("div");
        var info1 = document.createElement("div");
        var info2 = document.createElement("div");
        var thumb = document.createElement("img");

        thumb.src = image;
        info1.textContent = '| ' + shape + ' |  ' + (parseInt(percent * 10000) / 100) + '%   |  ' + (parseInt(percent * 10000) / 100) + ' seconds | ';
        info2.textContent = '( ' + guess + ' ' + done + ' )';

        container.appendChild(info2);
        container.appendChild(thumb);
        container.className = "hidden";

        if (!nolog) li.appendChild(record.apply(this, arguments));

        li.setAttribute("class", classes.join(' '));
        li.appendChild(info1);
        li.appendChild(container);

        var resultsEl = document.getElementById('results');
        if (resultsEl.getElementsByTagName("div").length) {
            resultsEl.insertBefore(li, resultsEl.firstChild);
        } else {
            resultsEl.appendChild(li);
        }

        var toggle = function() {
            container.style.display = container.style.display === 'block' ? 'none' : 'block';
        };

        li.onclick = toggle;
        li.touchend = toggle;
    };

    var restart = function() {
        console.log('restart() called, _shape:', _shape);
        if (_shape) {
            _shape.stop().redraw().hide();
        }
        _shape = shape.random().show().start();
        console.log('restart() created new _shape:', _shape);
        console.log('_shape.started:', _shape.started);
        console.log('_shape.time():', _shape.time());
    };

    var keypress = function(e) {
        var key = (e.keyCode || e.which) - 48;
        if (key > 0 && key < 9) answer(shape.keys()[key]);
    };

    var init = function() {
        _welcome = document.getElementById('welcome');
        _experiment = document.getElementById('experiment');
        _results = document.getElementById('results');
        _totals = document.getElementById('totals');
        _total = document.getElementById('total');
        
        model.init();
        var logs = model.logs();
        _welcome.style.display = "none";
        _experiment.style.display = "block";
        restart();
    };

    var answer = function(guess) {
        console.log('answer() called with guess:', guess);
        console.log('_shape:', _shape);
        
        if (_shape) {
            var name = _shape.name;
            var image = _shape.canvas.toDataURL(0, 0, _shape.width, _shape.height);
            var correct = _shape.test(guess);
            var time = _shape.time();
            
            console.log('Shape details:', {
                name: name,
                correct: correct,
                started: _shape.started,
                time: time,
                timeInSeconds: time / 1000
            });
            
            var args = [name, guess, correct, _shape.total, _shape.done(), time, image];
            var totals = model.total.apply(this, args);
            model.log.apply(this, args);
            display.apply(this, args);

            var g = totals.grand;

            console.log('Tally data for grand:', {
                best_percent: g.best_percent,
                best_time: g.best_time,
                avg_percent: g.avg_percent,
                avg_time: g.avg_time
            });

            console.log('Tally data for', name, ':', {
                best_percent: totals.best_percent,
                best_time: totals.best_time,
                avg_percent: totals.avg_percent,
                avg_time: totals.avg_time
            });

            tally('grand', g.best_percent * 100, g.best_time, g.avg_percent * 100, g.avg_time);
            tally(name, totals.best_percent * 100, totals.best_time, totals.avg_percent * 100, totals.avg_time);

            restart();
        } else {
            console.log('ERROR: _shape is undefined or null!');
        }
    };

    shape.answer = answer;
    
    shape.each(function() {
        var self = this;
        console.log('Binding button for shape:', self.name, self.button);
        self.button.onclick = function() {
            console.log('Button clicked:', self.name);
            shape.answer(self.name);
        };
    });

    shape.init = init;
    window.shapeInit = init;
    window.shape = shape;

    return shape;
})();
