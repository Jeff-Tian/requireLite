///<reference path="/../requireLite.js"/>
///<reference path="/lib/jasmine/jasmine.js"/>

describe("requireLite helper test suite", function () {
    it("Spec: Can get the module name from a url path", function() {
        expect(requireLiteHelper.getModuleNameFromPath("http://localhost:33109/Scripts/2012.2.607/telerik.timepicker.min.js")).toBe("telerik.timepicker");
        expect(requireLiteHelper.getModuleNameFromPath("http://localhost:33109/Scripts/2012.2.607/telerik.timepicker.js")).toBe("telerik.timepicker");
        expect(requireLiteHelper.getModuleNameFromPath("window")).toBe("window");
    });

    it("Spec: Can detect if a module has been loaded already", function() {
        expect(requireLiteHelper.hasBeenLoadedAlready("window")).toBe(true);
        expect(requireLiteHelper.hasBeenLoadedAlready("not.loaded")).toBe(false);
    });
});

(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;

    /**
     Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
     */
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    /**
     Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
     */
    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    /**
     Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler
  
     ### Test Results
  
     Scroll down to see the results of all of these specs.
     */
    var currentWindowOnload = window.onload;
    window.onload = function () {
        if (currentWindowOnload) {
            currentWindowOnload();
        }

        document.querySelector('.version').innerHTML = jasmineEnv.versionString();
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
})();