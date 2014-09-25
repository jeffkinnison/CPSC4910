var TestSuite = function() {
  this.tests = [];
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
                    guideline : 'wcag2a',
                    accessibilityTests : accessibilityTests,
                    testFailed : function(event) {  },
                    complete : function(event) {  },
                  });
}