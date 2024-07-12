function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
  
    script.onload = function() {
      callback(false);
    };
  
    script.onerror = function() {
      callback(true);
    };
  
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  loadScript("/bundle.js", function(error) {
    if (error) {
      // /bundle.js 로드 실패, /dist/bundle.js 로드 시도
      loadScript("/dist/bundle.js", function(error) {
        if (error) {
          console.error("Failed to load both /bundle.js and /dist/bundle.js");
        } else {
          console.log("/dist/bundle.js loaded successfully");
        }
      });
    } else {
      console.log("/bundle.js loaded successfully");
    }
  });