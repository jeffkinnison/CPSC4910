/* Update the relevant fields with the new data */
function setDOMInfo(info) {

    var res = JSON.parse(info.quailRes);
    $("#quail-ext-results").html("");
    $("#buttons").show();

    for (var i = 0; i < res.length; i++) {
        var out = "<div class='quail-fail'><h3>" + res[i].title + "</h3>";
        out += "<p>Severity: <code>" + res[i].severity + "</code></p><p>" + res[i].description + "</p><hr/></div>";
        $("#quail-ext-results").append(out);
    }

    if ($("#quail-ext-results").html() == "") {
        $("#quail-ext-results").html("<h4>No errors were found!</h4>");
    }
    download($("#quail-ext-results").html());
    //for (r in suite.results) {
      //$("#quail-ext-results").append(r.title));
    //}
    //info.quailRes.outputResults();
    //$('#quail-ext-results').html(info.quailRes);
}

function download(info) {
var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  }

    var create = document.getElementById('downloadlink');

    create.addEventListener('click', function (event) {
        create.href = makeTextFile(info);
        create.download = event.timeStamp + ".html";
    }, false);
}

/* Once the DOM is ready... */
window.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function(){
        var p1 = getParameterByName("p1");
        var p2 = getParameterByName("p2");
        var sev = getParameterByName("sev");
        var mod = getParameterByName("mod");
        var sug = getParameterByName("sug");

        $("#buttons").hide();
        $("#quail-ext-results").html("<img style='display: block; margin-left: auto; margin-right: auto; margin-top: 50px' src='../loading.gif'/>");
        /* ...query for the active tab... */
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            /* ...and send a request for the DOM info... */
            chrome.tabs.sendMessage(
                    tabs[0].id,
                    {from: 'popup', subject: 'DOMInfo', preset1: p1, preset2: p2, severe: sev, moderate: mod, suggestion: sug},
                    /* ...also specifying a callback to be called 
                     *    from the receiving end (content script) */
                    setDOMInfo);
        });
    });
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}