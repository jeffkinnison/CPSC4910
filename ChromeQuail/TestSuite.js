/*
  Quail JS Accessibility Compliance Test
  Add-On for Google Chrome

  Authors: Jeff Kinnison (jkinnis@g.clemson.edu)
           Zach McNellis (zmcnell@g.clemson.edu)
           Stephen Proce ()

  This file contains a TestSuite object that acts as an interface to the
  QuailJS library used to perform accessibility testing. It contains a
  list of all tests to be run, handlers for test results, and methods to
  manipulate, display, and run the tests in the list.
 */

//Constructor for the TestSuite object that takes two functions: one to
//handle passing a test and the other to handle failing a test. Creates
//an empty list to which tests may be added.
var TestSuite = function(fail_handler, success_handler) {
  this.tests = [];
  this.failure = fail_handler;
  this.success = success_handler;
}

//Adds a test to the end of a test list.
TestSuite.prototype.addTest = function(test) {
  this.tests.push(test);
}

//Removes the test passed into this function from the list if the list
//contains tests and the test is in the list. 
TestSuite.prototype.remTest = function(test) {
  //Only try to remove if the list contains members.
  if (this.tests != []) {
    //The most likely case is that the removed test is at the end of the list.
    //Check there first before filtering the list and handle this case with pop()
    if (this.tests[this.tests.length - 1] == test) {
      this.tests.pop();
    }

    //If the last member was not the test to remove, filter the rest of the
    //array for the supplied test. This handles the event that the supplied
    //test is not in the array--in that case the same array is returned.
    else {
      var isSame = function(element, index, array) { element != test; };
      this.tests = this.tests.filter(isSame);
    }
  }

  else {
    console.log("No tests have been selected. Aborting TestSuite.remTest().");
  }
}

//Prints all of the tests currently in the list to the console.
TestSuite.prototype.currentTests = function() {
  for (test in this.tests) { console.log(test) };
}

//Runs the TestSuite according to QuailJS documentation on running tests.
//
TestSuite.prototype.run = function() {
  if (this.tests.length > 0) {
    $('#content').quail({ jsonPath : '../quail-2.1.0/src/resources',
                          guideline : this.tests,
                          testFailed : this.failure,
                          complete : this.success,
                        });
  } else {
    console.log("No tests selected. Aborting TestSuite.run().");
    console.log("Select tests to run and then try again.");
  }
}