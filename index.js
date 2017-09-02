'use strict';

module.exports = {
  sharedExamplesFor: (groupName, examples) => {
    if (typeof jasmine.sharedExamples === "undefined") { jasmine.sharedExamples = {}; }

    if (jasmine.sharedExamples[groupName]) {
      throw "Example group “" + groupName + "” already defined.";
    }
    if (typeof examples !== "function") { throw "Examples have to be a function."; }

    jasmine.sharedExamples[groupName] = examples;
  },

  itBehavesLike: (groupName, ...args) => {
    if (!jasmine.sharedExamples[groupName]) {
      throw "Example group “" + groupName + "” not defined.";
    }

    var contextFunction;
    if (typeof args[args.length - 1] === "function") {
      contextFunction = args.pop();
    }
    describe(groupName, () => {
      if (contextFunction) { contextFunction() };
      jasmine.sharedExamples[groupName].apply(null, args);
    });
  },
};
