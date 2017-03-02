'use strict';

module.exports = {
  sharedExamplesFor: (groupName, examples) => {
    if (typeof jasmine.sharedExamples === "undefined") { jasmine.sharedExamples = {}; }

    if (jasmine.sharedExamples[groupName]) {
      throw "Example group “" + groupName + "” already defined.";
    }
    if (typeof examples !== "function") { throw "Examples have to be a function."; }

    jasmine.sharedExamples[groupName] = () => { describe(groupName, examples); };
  },

  itBehavesLike: function() {
    var args = [].slice.call(arguments);
    var groupName = args.shift();
    if (!jasmine.sharedExamples[groupName]) {
      throw "Example group “" + groupName + "” not defined.";
    }

    var context = args.pop();
    if (typeof context === "function") {
      context();
    } else if (typeof context !== "undefined") {
      args.push(context);
    }
    jasmine.sharedExamples[groupName].apply(null, args);
  },
};
