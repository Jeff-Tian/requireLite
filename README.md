requireLite
===========

Lite version of require JS?

## Basic Usage:

```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <script src="../requireLite.js"></script>
    <title>Basic Usage of RequireLite</title>
</head>
<body>

        <script type="text/javascript">
                ;
                (function() {
                        requireLite([{
                                        path: "http://code.jquery.com/jquery-1.8.3.min.js",
                                        canary: "$"
                                }], function() {
                                        alert("jquery loaded!");
                                        $("<p><strong>jquery loaded!</strong></p>").appendTo("body");
                                });
		    
						requireLite([{
							path: "http://code.jquery.com/jquery-1.8.3.min.js",
							canary: "typeof jQuery !=== 'undefined'"
						}], function () {
							alert("jquery loaded!");
							$("<p><strong>jquery loaded!</strong></p>").appendTo("body");
						});
		    
						requireLite([{
							path: "http://code.jquery.com/jquery-1.8.3.min.js",
							canary: function () { return !!$; }
						}], function () {
							alert("jquery loaded!");
							$("<p><strong>jquery loaded!</strong></p>").appendTo("body");
						});
                })();
        </script>
</body>
</html>
```
## Caution: 
If you invoke requireLite() from a callback, then the js file paths
must be absolute paths! Or the requireLite() may have chance to request a wrong 
url for the js files.
i.e, in callback case, you can use http://zizhujy.com/test.js, or /Scripts/test.js, etc.
you can't use ../../Scripts/test.js

## FAQ:
- Q: Can requireLite work well with JavaScript bundles?
- A: Yes. It can go hand in hand with JavaScript bundles which involves server side technologies. Because rquireLite will only load js files that canary value is not true. When a javascript file has been already loaded in a JavaScript bundle, then its canary value will be true, and then the rquireLite would ignore that rquiring action.