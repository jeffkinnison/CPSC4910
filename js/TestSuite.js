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

var PageElement = (function (i, c) {
  //this.tag = tag;
  this.i = i;
  this.c = c;
});

PageElement.prototype.outputElement = (function () {
  return "ID: " + e.id + ", Class: " + e.class;
});

var TestResult = (function (title, severity, description) {
  this.title = title;
  this.severity = severity;
  this.description = description;
  this.elements = [];
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
var TestSuite = (function (fail_handler, done_handler, json_path) {
  if (typeof fail_handler === 'function' &&
      typeof done_handler === 'function') {
    this.tests = [];
    this.results = [];
    this.failure = fail_handler;
    this.done = done_handler;
    this.json_path = json_path;
  } else {
    console.log("Invalid handlers. Aborting TestSuite creation.");
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
      var isSame = function(element, index, array) { element !== test; };
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

TestSuite.prototype.addResult = (function (name, title, severity, description) {
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

TestSuite.prototype.displayResult = (function () {
  this.done(0);
});