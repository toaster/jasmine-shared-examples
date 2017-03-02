#!/usr/bin/env node

if (process.argv.length != 3 || process.argv[2] != "init") {
  console.log("Usage: " + process.argv[1] + " init");
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

var helper_path = "spec/helpers/shared-examples.js";
var data = `'use strict';

const SharedExamples = require('code_cowboy-jasmine-shared-examples');
jasmine.getGlobal().sharedExamplesFor = SharedExamples.sharedExamplesFor;
jasmine.getGlobal().itBehavesLike = SharedExamples.itBehavesLike;
`;

var dir_path_components = path.dirname(helper_path).split(path.sep);
dir_path_components.forEach((dir, index) => {
  var dir_path = path.join.apply(null, dir_path_components.slice(0, index + 1));
  if (!fs.existsSync(dir_path)) {
    fs.mkdirSync(dir_path, 0o770);
  }
});
fs.writeFileSync(helper_path, data, null, 0o660);
