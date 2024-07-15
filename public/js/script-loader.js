function loadScript(callback) {
  var scripts = document.getElementsByTagName("script");
  var mainScriptSrc = "";

  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].src;
    if (src.includes("main.") && src.endsWith(".js")) {
      mainScriptSrc = src;
      break;
    }
  }

  if (mainScriptSrc) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    script.onload = function () {
      callback(false);
    };

    script.onerror = function () {
      callback(true);
    };

    script.src = mainScriptSrc;
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    callback(true);
  }
}

loadScript(function (error) {
  if (error) {
    console.error("Failed to load main script");
  }
});
