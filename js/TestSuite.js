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

var PageElement = (function (i,c) {
  //this.tag = tag;
  this.i = i;       //The element's id
  this.c = c;       //The element's class
});

PageElement.prototype.outputElement = (function () {
  return "ID: " + e.id + ", Class: " + e.class;
});

var TestResult = (function (title,severity,description) {
  this.title = title;             //The QuailJS test title
  this.severity = severity;       //The severity of a failure
  this.description = description; //The QuailJS test description
  this.elements = [];             //The elements that failed the test
});

TestResult.prototype.addElement = (function (element) {
  this.elements.push(element);
});

TestResult.prototype.displayResult = (function () {
  var out = "<div class='quail-fail'><h3>" + this.title + "</h3>";
  out += "<p>Severity: " + this.severity + "</p><p>" + this.description + "</p>";
  out += "<span>Elements Affected: <ul>";
  for (e in this.elements) {
    out += "<li>Tag: " + e.outputElement + "</li>";
  }
  out += "</ul></span></div>";
  return out;
});

//Constructor for the TestSuite object that takes two functions: one to
//handle passing a test and the other to handle failing a test. Creates
//an empty list to which tests may be added.
var TestSuite = (function (fail_handler,done_handler,json_path,output_element) {
  if (typeof fail_handler === 'function' &&
      typeof done_handler === 'function') {

    this.tests = [];                    //The list of test names to run
    this.results = [];                  //The list of failed tests
    this.failure = fail_handler;        //Function for testFailed option
    this.done = done_handler;           //Function for complete option
    this.json_path = json_path;         //Path to tests.min.json
    this.outElement = output_element;   //Element to write results to

  } else {
    console.log("Error: Invalid handlers. Aborting TestSuite creation.");
    console.log("Handlers must be functions.");
  }
});

//Adds a test to the end of a test list.
TestSuite.prototype.addTest = (function (test) {
  this.tests.push(test);
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
                          testFailed : this.failure,
                          complete : this.done,
                        });
  } else {
    console.log("No tests selected. Aborting TestSuite.run().");
    console.log("Select tests to run and then try again.");
  }
});






/*
  extensionRunQuail()

    Parameters:
      None

    Return Value:
      None

    This function contains the logic for running the test suite in the confines
    of a browser add-on/extension. It contains the handlers for QuailJS's
    testFailed and complete options. The function creates a TestSuite instance,
    obtains the list of tests, and runs the TestSuite.
 */
var extensionRunQuail = (function () {
  var suite;

  //The handler for test completion. 
  var done = (function (event) {
    console.log(suite.results);

    for (r in suite.results) {
      $(suite.outElement).append(r.displayResult());
    }

  });

  var failure = (function (event) {
    event.element.css("border", "5px dashed red");

    $.getJSON("tests.json", function (data) {
      console.log(event.testName);
        
      var test = data[event.testName];

      if (!(event.testName in suite.results)) {
        console.log("Adding new result");
        suite.addResult(event.testName, test["title"]["en"],
                        event.severity, test["description"]["en"]);

      }

      suite.results[event.testName].addElement(new PageElement(
                    event.element.prop('id'), event.element.prop('class')));

      $(suite.outElement).append(suite.results[event.testName].displayResult());

    });

  });

  var jsonPath, outputElement

  var options = $.getJSON("ext-config.json", (function (data) {
          jsonPath = data.testJSONPath;
          outputElement = data.resultsElement;
  }));

  suite = new TestSuite(failure, complete, jsonPath, outputElement);

  //TODO: GET SELECTED TEST NAMES

  suite.addTest();
  suite.run();
});