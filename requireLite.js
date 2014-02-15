﻿(function () {
    var getScriptUrl = (function () {
        var scripts = document.getElementsByTagName('script');
        var index = scripts.length - 1;
        var myScript = scripts[index];
        return function () { return myScript.src; };
    })();

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
                    canary: getModuleNameFromPath(moduleObj),
                    path: moduleObj
                };
            } else if ((typeof moduleObj === "object") && moduleObj !== null) {
                try {
                    if (moduleObj.canary.length > 0 && moduleObj.path.length > 0) {
                        module = {
                            canary: moduleObj.canary,
                            path: moduleObj.path
                        };
                    }
                } catch (ex) {
                    throw ex;
                }
            }

            // Converts relative path to absolute path
            if (!/((http|ftp|https):)?\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(module.path)) {
                var myUrl = getScriptUrl();
                var myDir = myUrl.substring(0, myUrl.lastIndexOf("/") + 1);
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
                throw "Invalid argument 'moduleObj'. Expected: <An object or a string>; Actual: <" + moduleObj + ">";
            }

            try {
                var module = eval(m.canary);

                return typeof module !== "undefined" && module !== false;
            } catch (ex) {
                return false;
            }
        }

        function loadScript(path, callback) {
            var module = getModule(path);

            if (module === null) {
                throw "The argument 'path' is not valid. Expect: <a valid script path> or <an object: {path: 'a valid script path', canary: 'module name or a boolean expression'}>; Actual: <" + path + ">";
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
                return function () { loadScripts(paths, finalCallback); };
            } else {
                return finalCallback;
            }
        }

        function requireLite(dependentScriptPaths, callback) {

            if (typeof dependentScriptPaths === "string") {
                dependentScriptPaths = [dependentScriptPaths];
            }

            if (!(dependentScriptPaths instanceof Array)) {
                throw "Argument 'dependentScriptPaths' should be an array of strings or {path: 'module path', canary: 'module name or a boolean expression'}s.";
            }

            // Clone a copy of dependentScriptPaths
            var paths = dependentScriptPaths.slice(0);
            loadScripts(paths, callback);
        }

        requireLite.version = "1.1";

        window.requireLite = requireLite;
        
        // For unit testing only:
        window.requireLiteHelper = {
            getModuleNameFromPath: getModuleNameFromPath,
            hasBeenLoadedAlready: hasBeenLoadedAlready
        };
    }
})();