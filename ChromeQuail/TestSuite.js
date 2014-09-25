var TestSuite = function(fail_handler, success_handler) {
  this.tests = [];
  this.failure = fail_handler;
  this.success = success_handler;
}

TestSuite.prototype.addTest = function(test) {
  this.tests.push(test);
}

TestSuite.prototype.remTest = function(test) {
  var isSame = function(element, index, array) { element != test; };
  this.tests = this.tests.filter(isSame);
}

TestSuite.prototype.currentTests = function() {
  for (test in this.tests) { console.log(test) };
}

TestSuite.prototype.run = function() {
  $('#content').quail({ jsonPath : '../quail-2.1.0/src/resources',
                        guideline : this.tests,
                        testFailed : this.failure,
                        complete : this.success,
                      });
}