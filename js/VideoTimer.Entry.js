var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 🧱 Model has an immutable state that can be set to a new version of the state.
     * Whenever a change to the state occurs, all listeners are notified.
     * Listeners can register to specific members within the state
     * to only trigger when something relevant to them changes.
     */
    var Model = /** @class */ (function () {
        function Model(_state) {
            this._state = _state;
            this._onChangeCallbacks = [];
        }
        /**
         * 👂 Callback is triggered when specific members are changed.
         */
        Model.prototype.listen = function (memberKeys, callback) {
            var _this = this;
            this._onChangeCallbacks = __spreadArrays(this._onChangeCallbacks, [
                function (delta) {
                    if (delta == null) {
                        return;
                    }
                    var keyChanged = Object.keys(delta).
                        reduce(function (changeRelevant, deltaKey) {
                        if (changeRelevant) {
                            return changeRelevant;
                        }
                        return memberKeys.find(function (key) { return key == deltaKey; }) != null;
                    }, false);
                    if (!keyChanged) {
                        return;
                    }
                    return callback(_this._state);
                },
            ]);
        };
        /**
         * 🙌 Callback is triggered when specific members are changed.
         * Callback required to return a new object containing specified output members.
         * Output is applied immediately to the state.
         */
        Model.prototype.respond = function (memberKeys, transformation) {
            var _this = this;
            this.listen(memberKeys, function (state) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, transformation(state)];
                        case 1:
                            result = _a.sent();
                            this.state = __assign(__assign({}, this.state), result);
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        Model.prototype.merge = function (partialState) {
            this.state = __assign(__assign({}, this.state), partialState);
        };
        Object.defineProperty(Model.prototype, "state", {
            /**
             * 🏃‍♀️ Immutable state of the model.
             * Getting the state should return an object that can't be mutated.
             * Setting the state replaces the existing state with an entirely new state,
             * checks for changes to members and notifies related listeners.
             */
            get: function () {
                return this._state;
            },
            set: function (value) {
                var _this = this;
                var delta = Object.keys(value).
                    reduce(function (delta, changeKey) {
                    var _a;
                    if (value[changeKey] == _this._state[changeKey]) {
                        return delta;
                    }
                    return __assign(__assign({}, delta), (_a = {}, _a[changeKey] = value[changeKey], _a));
                }, {});
                this._changeAggregate = __assign(__assign({}, this._changeAggregate), delta);
                this._state = value;
                this.triggerChangeMicrotask();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 💣 Full refresh of all member of the state. All listeners of this model are triggered.
         */
        Model.prototype.fullRefresh = function () {
            this._changeAggregate = this._state;
            this.triggerChangeMicrotask();
        };
        Model.prototype.triggerChangeMicrotask = function () {
            var _this = this;
            if (this._changeMicrotask != null) {
                return;
            }
            this._changeMicrotask = function () {
                var aggregateIteration = undefined;
                var loopCount = 0;
                while (aggregateIteration != _this._changeAggregate) {
                    aggregateIteration = _this._changeAggregate;
                    _this._changeAggregate = undefined;
                    _this._onChangeCallbacks.forEach(function (callback) { return __awaiter(_this, void 0, void 0, function () {
                        var e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, callback(aggregateIteration)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    console.error(e_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // ♻ Infinite loop limit
                    loopCount++;
                    if (loopCount > Model.LISTEN_LOOP_LIMIT) {
                        console.error("Model loop limit reached! Listeners are codependant!");
                        break;
                    }
                }
                _this._changeMicrotask = undefined;
            };
            Promise.resolve().then(this._changeMicrotask);
        };
        Model.LISTEN_LOOP_LIMIT = 10;
        return Model;
    }());
    exports.Model = Model;
});
define("Type.CSS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Util.HtmlBuilder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HtmlBuilder;
    (function (HtmlBuilder) {
        /**
         * 📝Generates a string that describes the provided style in a way that
         * can be used in a style attribute OR a style sheet.
         */
        function generateStyleString(style) {
            return Object.keys(style).reduce(function (output, declarationKey) {
                var formattedKey = declarationKey.replace(new RegExp("([A-Z])"), function (match) { return "-" + match.toLowerCase(); });
                var value = style[declarationKey];
                return (output + " " + formattedKey + ": " + value + ";");
            }, "");
        }
        HtmlBuilder.generateStyleString = generateStyleString;
        /**
         * 📝Generates a string that describes the provided series of ClassStyles in a
         * style sheet format that can be inserted into a style tag's innerHtml
         */
        function generateStyleHTML(styles) {
            return styles.reduce(function (output, style) {
                return output + " " + style.name + " {" + Object.keys(style.declaration).reduce(function (output, declarationKey) {
                    var formattedKey = declarationKey.replace(new RegExp("([A-Z])"), function (match) { return "-" + match.toLowerCase(); });
                    var value = style.declaration[declarationKey];
                    return (output + " " + formattedKey + ": " + value + ";");
                }, "") + " }";
            }, "");
        }
        HtmlBuilder.generateStyleHTML = generateStyleHTML;
        /**
         * 🎨 Assign custom attributes and style to an existing element.
         */
        function assignToElement(element, tag) {
            if (tag.style != null) {
                Object.assign(element.style, tag.style);
            }
            if (tag.attributes != null) {
                Object.assign(element, tag.attributes);
            }
            return element;
        }
        HtmlBuilder.assignToElement = assignToElement;
        /**
         * 🎨 Assign custom attributes and style to an existing element.
         */
        function assignToElementSVG(element, tag) {
            var literalAttributes = tag.literalAttributes, style = tag.style, attributes = tag.attributes;
            if (style != null) {
                Object.assign(element.style, style);
            }
            if (attributes != null) {
                Object.assign(element, attributes);
            }
            if (literalAttributes != null) {
                Object.keys(literalAttributes).forEach(function (attributeKey) { return element.setAttributeNS(null, attributeKey, literalAttributes[attributeKey]); });
            }
            return element;
        }
        HtmlBuilder.assignToElementSVG = assignToElementSVG;
        /**
         * ✨Create a HTMLElement and add it to the parent element.
         * Assigns mentioned members to this element after creating.
         */
        function create_child(parent, tag) {
            var child = document.createElement(tag.type);
            assignToElement(child, tag);
            parent.appendChild(child);
            return child;
        }
        HtmlBuilder.create_child = create_child;
        /**
         * ✨Create a SVGElement and add it to the parent element.
         * Assigns mentioned members to this element after creating.
         */
        function createChildSVG(parent, tag) {
            var child = document.createElementNS("http://www.w3.org/2000/svg", tag.type);
            assignToElementSVG(child, tag);
            parent.appendChild(child);
            return child;
        }
        HtmlBuilder.createChildSVG = createChildSVG;
        /**
         * ♻ Re-use existing elements from pool, assigning tag attributes.
         * If nothing is left in the pool, make a new child under the parent.
         */
        function recycleElement(parent, pool, tag, onChildCreated) {
            var existingElement = pool.pop();
            if (existingElement != null) {
                assignToElement(existingElement, tag);
                parent.appendChild(existingElement);
                return existingElement;
            }
            else {
                var child = create_child(parent, tag);
                if (onChildCreated != null)
                    onChildCreated(child);
                return child;
            }
        }
        HtmlBuilder.recycleElement = recycleElement;
    })(HtmlBuilder = exports.HtmlBuilder || (exports.HtmlBuilder = {}));
});
define("VideoTimer.Styles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VideoTimerStyles;
    (function (VideoTimerStyles) {
        VideoTimerStyles.outline = {
            display: "grid",
            width: "100%",
            height: "100%",
        };
        VideoTimerStyles.centered = {
            display: "grid",
            alignItems: "center",
            justifyItems: "center",
            justifyContent: "center",
        };
        VideoTimerStyles.text = {
            textAlign: "center",
            fontFamily: "lato",
            color: "white",
        };
        VideoTimerStyles.button = __assign(__assign({}, VideoTimerStyles.centered), { pointerEvents: "all", cursor: "pointer", userSelect: "none", fontSize: 32, backgroundColor: "grey", borderStyle: "solid", borderColor: "white", borderRadius: "10px", width: "2em", height: "2em", padding: "0.25em" });
    })(VideoTimerStyles = exports.VideoTimerStyles || (exports.VideoTimerStyles = {}));
});
define("VideoTimer.Entry", ["require", "exports", "Util.HtmlBuilder", "VideoTimer.Styles", "Model"], function (require, exports, Util_HtmlBuilder_1, VideoTimer_Styles_1, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VideoTimerEntry;
    (function (VideoTimerEntry) {
        function initializeClient() {
            var head = Util_HtmlBuilder_1.HtmlBuilder.assignToElement(document.head, {
                attributes: {
                    innerHTML: "\n                    " + document.head.innerHTML + "\n                    <title>Video Timer</title>\n                    <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n                    <meta name=\"viewport\" content=\"height=device-height,width=device-width,initial-scale=1,user-scalable=no\" />\n                ",
                },
            });
            var body = Util_HtmlBuilder_1.HtmlBuilder.assignToElement(document.body, {
                style: {
                    fontSize: 20,
                },
            });
            var outline = Util_HtmlBuilder_1.HtmlBuilder.create_child(body, {
                type: "div",
                style: __assign(__assign({}, VideoTimer_Styles_1.VideoTimerStyles.outline), { gridTemplateRows: "3em 1fr 3em", gridTemplateAreas: "\n                    \"t t t\"\n                    \". a .\"\n                    \"f f f\"\n                " }),
            });
            var header = Util_HtmlBuilder_1.HtmlBuilder.create_child(outline, {
                type: "div",
                style: __assign(__assign({ gridArea: "t" }, VideoTimer_Styles_1.VideoTimerStyles.centered), { borderColor: "green", borderStyle: "solid", borderRadius: "10px", padding: "0.5em" }),
            });
            Util_HtmlBuilder_1.HtmlBuilder.create_child(header, {
                type: "div",
                style: __assign({}, VideoTimer_Styles_1.VideoTimerStyles.text),
                attributes: {
                    innerHTML: "🎥 video_timer 📝",
                },
            });
            var appSpace = Util_HtmlBuilder_1.HtmlBuilder.create_child(outline, {
                type: "div",
                style: __assign(__assign({ gridArea: "a" }, VideoTimer_Styles_1.VideoTimerStyles.centered), { gridTemplateRows: "auto 3em auto", gridTemplateAreas: "\n                    \"p\"\n                    \"t\"\n                    \"g\"\n                " }),
            });
            // 🏭 Where the magic happens
            {
                var model_1 = new Model_1.Model({
                    startTime: undefined,
                    endTime: undefined,
                    markers: [],
                });
                var startRecording_1 = Util_HtmlBuilder_1.HtmlBuilder.create_child(appSpace, {
                    type: "div",
                    style: __assign({ gridArea: "p" }, VideoTimer_Styles_1.VideoTimerStyles.button),
                    attributes: {
                        innerHTML: "⏯",
                        onclick: function () {
                            if (model_1.state.startTime != null &&
                                model_1.state.endTime == null) {
                                model_1.merge({
                                    endTime: Date.now(),
                                });
                            }
                            else {
                                model_1.merge({
                                    startTime: Date.now(),
                                    endTime: undefined,
                                });
                            }
                        },
                    },
                });
                var timer_1 = Util_HtmlBuilder_1.HtmlBuilder.create_child(appSpace, {
                    type: "div",
                    style: __assign(__assign({ gridArea: "t" }, VideoTimer_Styles_1.VideoTimerStyles.text), { fontSize: 36 }),
                    attributes: {
                        innerHTML: "0:00:000",
                    },
                });
                var buttonGrid_1 = Util_HtmlBuilder_1.HtmlBuilder.create_child(appSpace, {
                    type: "div",
                    style: __assign(__assign({}, VideoTimer_Styles_1.VideoTimerStyles.centered), { gridGap: "0.5em", gridTemplateColumns: "auto auto auto", gridAutoRows: "auto", gridAutoFlow: "row" }),
                });
                var markers = ["✨", "✂", "❌", "✔", "❓"].map(function (icon) {
                    return Util_HtmlBuilder_1.HtmlBuilder.create_child(buttonGrid_1, {
                        type: "div",
                        style: VideoTimer_Styles_1.VideoTimerStyles.button,
                        attributes: {
                            innerHTML: "" + icon,
                            onclick: function () {
                                model_1.merge({
                                    markers: __spreadArrays(model_1.state.markers, [
                                        {
                                            note: icon,
                                            readableTime: getReadableDuration(model_1.state),
                                        },
                                    ]),
                                });
                                if (model_1.state.startTime == null ||
                                    model_1.state.endTime != null) {
                                    model_1.merge({
                                        startTime: Date.now(),
                                        endTime: undefined,
                                    });
                                }
                            },
                        },
                    });
                });
                model_1.listen(["startTime", "endTime"], function (state) {
                    startRecording_1.innerHTML = state.startTime == null || state.endTime != null ? "⏯" : "🛑";
                });
                model_1.respond(["endTime"], function (state) {
                    if (state.endTime == null) {
                        return;
                    }
                    var durationReadable = getReadableDuration(state);
                    var markerOutput = state.markers.reduce(function (result, marker) {
                        return result + "\n" + marker.readableTime + " - " + marker.note;
                    }, "");
                    console.log("Total Time: " + durationReadable + " [h:m:s]\nRaw markers: " + markerOutput);
                    var json = JSON.stringify(state);
                    var blob = new Blob([json], { type: "application/json" });
                    var url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    return {
                        markers: []
                    };
                });
                var updateTimer_1 = function () {
                    var ms = Date.now();
                    var blinkState = model_1.state.endTime == null ? false : Math.floor(ms / 500) % 2 == 0;
                    timer_1.innerHTML = blinkState ? "🤚" : getReadableDuration(model_1.state);
                    requestAnimationFrame(updateTimer_1);
                };
                requestAnimationFrame(updateTimer_1);
            }
            var footer = Util_HtmlBuilder_1.HtmlBuilder.create_child(outline, {
                type: "div",
                style: __assign(__assign({ gridArea: "f", display: "grid" }, VideoTimer_Styles_1.VideoTimerStyles.centered), { gridGap: "1em", margin: "0.5em", gridTemplateAreas: "\n                    \"w a s\"\n                " }),
            });
            var warning = Util_HtmlBuilder_1.HtmlBuilder.create_child(footer, {
                type: "div",
                style: __assign(__assign({ gridArea: "w" }, VideoTimer_Styles_1.VideoTimerStyles.text), { fontSize: 12, textAlign: "left", alignSelf: "left", justifySelf: "left" }),
                attributes: {
                    innerHTML: "for personal use only.",
                },
            });
            var socials = Util_HtmlBuilder_1.HtmlBuilder.create_child(footer, {
                type: "div",
                style: __assign(__assign({ gridArea: "s" }, VideoTimer_Styles_1.VideoTimerStyles.text), { fontSize: 12, textAlign: "right", justifySelf: "right" }),
                attributes: {
                    innerHTML: "😸github.com/TacticalDan<br>🕊@tactical_dan",
                },
            });
        }
        VideoTimerEntry.initializeClient = initializeClient;
        function getReadableDuration(state) {
            var _a, _b;
            var currentMS = Date.now();
            var durationMS = ((_a = state.endTime) !== null && _a !== void 0 ? _a : currentMS) - ((_b = state.startTime) !== null && _b !== void 0 ? _b : currentMS);
            var totalSeconds = Math.floor(durationMS / 1000);
            var totalMinutes = Math.floor(totalSeconds / 60);
            var hours = Math.floor(totalMinutes / 60);
            var remainingMinutes = ("0" + (totalMinutes - hours * 60)).slice(-2);
            var remainingSeconds = ("0" + (totalSeconds - totalMinutes * 60)).slice(-2);
            var durationReadable = hours + ":" + remainingMinutes + ":" + remainingSeconds;
            return durationReadable;
        }
    })(VideoTimerEntry = exports.VideoTimerEntry || (exports.VideoTimerEntry = {}));
    // 👇 Client entry point
    VideoTimerEntry.initializeClient();
});
//# sourceMappingURL=VideoTimer.Entry.js.map