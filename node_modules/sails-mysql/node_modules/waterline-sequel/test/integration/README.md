Integration tests
==========================
[![Circle CI](https://img.shields.io/circleci/project/balderdashy/waterline-sequel/master.svg?style=shield)](https://circleci.com/gh/balderdashy/waterline-sequel/tree/master)

A set of integration tests that test the SQL official adapters against waterline-sequel edge version: [example](https://travis-ci.org/balderdashy/waterline-sequel/jobs/56144647#L404).


## Goals

 * Detect if a change in waterline-sequel breaks any official SQL adapter tests;
 * Test using the edge version of waterline-sequel and the adapters to ensure the current snapshot of all these are working together and consequently are OK to release;
 * make it easier for waterline-sequel developers to test changes against the dependents adapters.


## What's the difference between these tests and the ones ran by the individual adapters?

The adapters are configured to run their tests against the **stable** version of waterline-sequel. From an adapter point of view, this makes sense since the adapter is only responsible for supporting the stable versions of its dependencies. These tests run against waterline-sequel **edge** version (latest in github) and the objective is to prevent changes in waterline-sequel to accidently break the adapters.


## What's the difference between these tests and the waterline-adapter-tests?

The set of integration tests in waterline-adapter-tests test waterline core **edge** against the adapters **edge** versions. These tests tests waterline-sequel **edge** against the adapters **edge** versions using waterline core **stable**. While the former is targeted at waterline core developers the later is targeted waterline-sequel developers.


For more details check [PR #32](https://github.com/balderdashy/waterline-sequel/pull/32).
