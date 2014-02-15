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
