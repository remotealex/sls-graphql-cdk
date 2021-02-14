#!/usr/bin/env node
const cdk = require("@aws-cdk/core");
const { CdkAppsyncStack } = require("./dist/src/stack");

const app = new cdk.App();
new CdkAppsyncStack(app, "CdkAppsyncStack");
