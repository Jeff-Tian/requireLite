;
(function() {
    if (!window.requireLite) {
        
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
                    name: getModuleNameFromPath(moduleObj),
                    path: moduleObj
                };
            } else if ((typeof moduleObj === "object") && moduleObj !== null) {
                try {
                    if (moduleObj.name.length > 0 && moduleObj.path.length > 0) {
                        module = {
                            name: moduleObj.name,
                            path: moduleObj.path
                        };
                    }
                } catch(ex) {
                    module = null;
                }
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
                throw "Invalid argument 'moduleObj'. Expected: <An object or a string>; Actual: <" + moduleObj + ">";
            }
            
            try {
                var module = eval(m.name);

                return typeof module !== "undefined";
            } catch(ex) {
                return false;
            }
        }

        function loadScript(path, callback) {
            var module = getModule(path);
            
            if (module === null) {
                throw "The argument 'path' is not valid. Expect: <a valid script path> or <an object: {path: 'a valid script path', name: 'module name'}>; Actual: <" + path + ">";
            }

            if (!hasBeenLoadedAlready(module)) {
                var script = document.createElement("script");
                script.async = false;
                script.src = module.path;
                script.type = "text/javascript";
                if (typeof callback === "function") {
                    script.onload = callback;
                }

                (document.getElementsByTagName('HEAD')[0] || document.body).appendChild(script);
            } else {
                if (typeof callback === "function") {
                    callback();
                }
            }
        }

        function loadScripts(paths, callback) {
            loadScript(paths.shift(), getCallback(paths, callback));
        }

        function getCallback(paths, finalCallback) {
            if ((paths instanceof Array) && paths.length > 0) {
                return function() { loadScripts(paths, finalCallback); };
            } else {
                return finalCallback;
            }
        }

        function requireLite(dependentScriptPaths, callback) {
            
            if (typeof dependentScriptPaths === "string") {
                dependentScriptPaths = [dependentScriptPaths];
            }

            if (!(dependentScriptPaths instanceof Array)) {
                throw "Argument 'dependentScriptPaths' should be an array of strings or {path: 'module path', name: 'module name'}s.";
            }

            // Clone a copy of dependentScriptPaths
            var paths = dependentScriptPaths.slice(0);
            loadScripts(paths, callback);
        }

        window.requireLite = requireLite;
        window.requireLiteHelper = {            
            getModuleNameFromPath: getModuleNameFromPath,
            hasBeenLoadedAlready: hasBeenLoadedAlready
        };
    }
})();