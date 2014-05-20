;
(function () {
    if (!window.requireLite) {
        window.executeOn = function (condition, func) {
            var interval = setInterval(function () {
                try {
                    var result = false;

                    if (typeof condition === "function") {
                        result = condition();
                    } else if (typeof condition === "string") {
                        result = eval(condition);
                    } else {
                        throw "argument 'condition' must be a bool function or a bool expression.";
                    }

                    if (result === true) {
                        clearInterval(interval);
                        func();
                    }
                } catch (ex) {
                    clearInterval(interval);
                    throw ex;
                }
            }, 100);
        };

        window.executeCallback = function (callback, argsArray) {
            if (typeof callback === "function") {
                // IE doesn't support null as second argument of apply method.
                callback.apply(window, argsArray || []);
            } else if (callback instanceof Array) {
                for (var i = 0; i < callback.length; i++) {
                    (typeof callback[i] === "function") && callback[i].apply(window, argsArray || []);
                }
            }
        };

        window.getCurrentScriptUrl = function() {
            var scripts = document.getElementsByTagName('script');
            var index = scripts.length - 1;
            var myScript = scripts[index];

            return myScript.src;
        };
        function getModuleNameFromPath(path) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="path" type="String">
            /// for example: http://localhost:33109/Scripts/2012.2.607/telerik.timepicker.min.js
            /// </param>
            /// <returns type="String">
            /// for example: telerik.timepicker
            /// </returns>
            var startIndex = path.lastIndexOf("/");
            if (startIndex < 0) {
                startIndex = path.lastIndexOf("\\");
            }

            var endIndex = path.lastIndexOf(".");
            if (endIndex < 0) {
                endIndex = path.lastIndexOf("-");
            }
            if (endIndex < 0) {
                endIndex = path.lastIndexOf("_");
            }
            endIndex = endIndex < 0 ? path.length : endIndex;

            var moduleName = path.substring(startIndex + 1, endIndex);

            return moduleName.replace(".min", "").replace(".dev", "").replace("-vsdoc", "");
        }

        function getModule(moduleObj) {
            var module = null;

            if ((typeof moduleObj === "string") && moduleObj !== "") {
                module = {
                    canary: getModuleNameFromPath(moduleObj),
                    path: moduleObj
                };
            } else if ((typeof moduleObj === "object") && moduleObj !== null) {
                try {
                    if (((typeof moduleObj.canary === "string" && moduleObj.canary.length > 0)
                            || (typeof moduleObj.canary === "function"))
                        && (typeof moduleObj.path === "string" && moduleObj.path.length > 0)) {
                        module = {
                            canary: moduleObj.canary,
                            path: moduleObj.path
                        };
                    } else {
                        window.lastError = "argument 'moduleObj' should contain both valid canary property and path property.";
                        throw window.lastError;
                    }
                } catch (ex) {
                    window.lastError = ex;
                    throw window.lastError;
                }
            } else {
                window.lastError = "argument 'moduleObj' should be a string or an object.";
                throw window.lastError;
            }

            // Converts relative path to absolute path
            if (!/((ftp|http|https):)?\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(module.path)) {
                var myDir = myScriptUrl.substring(0, myScriptUrl.lastIndexOf("/") + 1);
                module.path = myDir + module.path;
            }

            return module;
        }

        function hasBeenLoadedAlready(moduleObj) {
            /// <summary>
            /// Detect if a module has been loaded already
            /// </summary>
            /// <param name="moduleObj" type="Object|String">
            /// for example: {path: "http://localhost:33109/Scripts/jquery.js", name: "$"}
            /// or "http://localhost:33109/Scripts/2012.2.607/telerik.timepicker.js".
            /// </param>
            /// <returns type="Boolean">
            /// </returns>
            var m = getModule(moduleObj);

            if (m === null) {
                // IE 8 in XP only shows "例外被抛出且未被接住" if you directly throw an exception.
                window.lastError = "Invalid argument 'moduleObj'. Expected: <An object or a string>; Actual: <" + moduleObj + ">";
                throw window.lastError;
            }

            try {
                if (typeof m.canary === "string") {
                    var loaded = eval(m.canary);

                    return typeof loaded !== "undefined" && loaded !== false;
                } else if (typeof m.canary === "function") {
                    return !!m.canary();
                } else {
                    window.lastError = "the property 'canary' should be an expression (string) or a bool function.\r\n" +
                        "Related module path: " + m.path;
                    throw window.lastError;
                }
            } catch (ex) {
                // For IE 8, some ... is undefined is not of ReferenceError.
                if (ex instanceof ReferenceError ||
                    (/.+ is not defined/i.test(ex.message) || /.+ is undefined/i.test(ex.message) ||
                    /.+ 未定义/i.test(ex.message))) {
                    return false;
                } else {
                    function Exception(message, innerException) {
                        this.message = message;

                        this.innerException = innerException;
                        
                        if (typeof Exception.__initialized__ === "undefined") {
                            Exception.prototype.toString = function() {
                                return this.message + "\r\n" + this.innerException.toString();
                            };

                            Exception.__initialized__ = true;
                        }
                    }

                    window.lastError = ex.message + "\r\nRelated canary: " + m.canary;
                    throw new Exception(window.lastError, ex);
                }
            }
        }

        function loadScript(path, callback, async) {
            var module = getModule(path);

            if (module === null) {
                throw "The argument 'path' is not valid. Expect: <a valid script path> or <an object: {path: 'a valid script path', canary: 'module name or a boolean expression'}>; Actual: <" + path + ">";
            }

            if (!hasBeenLoadedAlready(module)) {
                var script = document.createElement("script");
                script.async = !!async;
                script.src = module.path;
                script.type = "text/javascript";
                if (typeof callback === "function") {
                    // Attach handlers for all browsers
                    var done = false;
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState ||
                                this.readyState === "loaded" || this.readyState === "complete")) {
                            done = true;

                            isInCallback = true;
                            callback();
                            isInCallback = false;

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;
                        }
                    };
                }

                (document.getElementsByTagName('HEAD')[0] || document.body).appendChild(script);
            } else {
                if (typeof callback === "function") {
                    isInCallback = true;
                    callback();
                    isInCallback = false;
                }
            }
        }

        function loadScriptsSynchronously(paths, callback) {
            loadScript(paths.shift(), getCallback(paths, callback), false);
        }

        function getCallback(paths, finalCallback) {
            if ((paths instanceof Array) && paths.length > 0) {
                return function () { loadScriptsSynchronously(paths, finalCallback); };
            } else {
                return finalCallback;
            }
        }

        function loadScriptsAsynchronously(paths, callback) {
            var semaphore = 0;

            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];

                semaphore++;
                loadScript(path, function() {
                    semaphore--;
                }, true);
            }

            executeOn(function () {
                return semaphore === 0;
            }, function () {
                isInCallback = true;
                executeCallback(callback);
                isInCallback = false;
            });
        }

        var myScriptUrl;
        var isInCallback = false;
        /// <remark>
        ///     Caution: If you invoke requireLite() from a callback, then the js file paths
        ///     must be absolute paths! Or the requireLite() may have chance to request a wrong 
        ///     url for the js files.
        ///     i.e, in callback case, you can use http://zizhujy.com/test.js, or /Scripts/test.js, etc.
        ///         you can't use ../../Scripts/test.js
        /// </remark>
        function requireLite(dependentScriptPaths, callback, async) {
            if (!isInCallback) {
                myScriptUrl = getCurrentScriptUrl();
            }
            
            if (typeof dependentScriptPaths === "string") {
                dependentScriptPaths = [dependentScriptPaths];
            }

            if (!(dependentScriptPaths instanceof Array)) {
                throw "Argument 'dependentScriptPaths' should be an array of strings or {path: 'module path', canary: 'module name or a boolean expression'}s.";
            }

            // Clone a copy of dependentScriptPaths
            var paths = dependentScriptPaths.slice(0);
            if (!async) {
                loadScriptsSynchronously(paths, callback);
            } else {
                loadScriptsAsynchronously(paths, callback);
            }
        }

        requireLite.version = "1.8";
        window.requireLite = requireLite;

        // For unit testing only:
        window.requireLiteHelper = {
            getModuleNameFromPath: getModuleNameFromPath,
            hasBeenLoadedAlready: hasBeenLoadedAlready
        };
    }
})();