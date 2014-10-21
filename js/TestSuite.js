/*
  Quail JS Accessibility Compliance Test
  Add-On for Google Chrome

  Authors: Jeff Kinnison (jkinnis@g.clemson.edu)
           Zach McNellis (zmcnell@g.clemson.edu)
           Stephen Price ()

  This file contains a TestSuite object that acts as an interface to the
  QuailJS library used to perform accessibility testing. It contains a
  list of all tests to be run, handlers for test results, and methods to
  manipulate, display, and run the tests in the list.
 */

var results = [], alterSevere = true, alterModerate = true, alterSuggestion = true;

var TestResult = (function (title,severity,description) {
  this.title = title;             //The QuailJS test title
  this.severity = severity;       //The severity of a failure
  this.description = description; //The QuailJS test description
  this.num_fails = 0;
});

TestResult.prototype.incrementFailCount = (function () {
	this.num_fails++;
});

TestResult.prototype.displayResult = (function () {
  var out = "<div class='quail-fail'><h3>" + this.title + "</h3>";
  out += "<p>Severity: " + this.severity + "</p><p>" + this.description + "</p>";
  return out;
});

//Constructor for the TestSuite object that takes two functions: one to
//handle passing a test and the other to handle failing a test. Creates
//an empty list to which tests may be added.
var TestSuite = (function (sev, mod, sug) {
    this.tests = [];                    //The list of test names to run
    this.results = [];                  //The list of failed tests
    this.json_path = chrome.extension.getURL("../js");         //Path to tests.json
    this.outElement = "#quail-ext-results";   //Element to write results to
    this.alterSevere = sev;
    this.alterModerate = mod;
    this.alterSuggestion = sug;
});

TestSuite.prototype.fail_handler = (function (event) {
  if (alterSuggestion === true && event.severity === "suggestion") {
    event.element.css("border", "3px dashed green");
  }
  else if (alterModerate === true && event.severity === "moderate") {
    event.element.css("border", "3px dashed yellow");
  }
  else if (alterSevere && event.severity === "severe") {
    event.element.css("border", "3px dashed red");
  }

    var test = event.testName, title, description;

    $.ajax({
      method: "GET",
      url: chrome.extension.getURL("../js/tests.json"),
      dataType: "JSON",
      async: false,
      success: function (data) {
        console.log(event.testName);
        title = data[test].title.en;
        description = data[test].description.en;
      },
    });

    console.log(title);
    console.log(this);
    console.log(this.results);

  if (results.length === 0 && !(event.testName in results)) {
        console.log("Adding new result");
        results[test] = new TestResult(title, event.severity, description);

      }
  results[event.testName].incrementFailCount();
});

TestSuite.prototype.setGlobalOptions = (function () {
	alterSevere = this.alterSevere;
	alterModerate = this.alterModerate;
	alterSuggestion = this.alterSuggestion;
});

TestSuite.prototype.outputResults = (function () {
    //alert(this.results);

    for (r in this.results) {
      $(this.outElement).append(r.displayResult());
    }
});

//Adds a test to the end of a test list.
TestSuite.prototype.addTest = (function (test) {
	if ($.inArray(test,this.tests) === -1) {
  		this.tests.push(test);
  	}
});

TestSuite.prototype.addTests = (function (test_list) {
	for (var i = 0; i < test_list.length; i++) {
		this.addTest(test_list[i]);
	}
});

//Removes the test passed into this function from the list if the list
//contains tests and the test is in the list. 
TestSuite.prototype.remTest = (function (test) {
  //Only try to remove if the list contains members.
  if (this.tests !== []) {
    //The most likely case is that the removed test is at the end of the list.
    //Check there first before filtering the list and handle this case with pop()
    if (this.tests[this.tests.length - 1] === test) {
      this.tests.pop();
    }

    //If the last member was not the test to remove, filter the rest of the
    //array for the supplied test. This handles the event that the supplied
    //test is not in the array--in that case the same array is returned.
    else {
      var isSame = (function (element,index,array) { element !== test; });
      this.tests = this.tests.filter(isSame);
    }
  } else {
    console.log("No tests have been selected. Aborting TestSuite.remTest().");
  }
});

//Prints all of the tests currently in the list to the console.
TestSuite.prototype.currentTests = (function () {
  for (test in this.tests) { console.log(test) };
});

TestSuite.prototype.addResult = (function (name,title,severity,description) {
  this.results[name] = new TestResult(title, severity, description);
});

//Runs the TestSuite according to QuailJS documentation on running tests.
TestSuite.prototype.run = (function () {
  if (this.tests.length > 0) {
    $('html').quail({ jsonPath : this.json_path,
                          guideline : this.tests,
                          testFailed : this.fail_handler,
                        });
  } else {
    console.log("No tests selected. Aborting TestSuite.run().");
    console.log("Select tests to run and then try again.");
  }

  this.results = results;
  return results;
});