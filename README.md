# Ecologi CDK (TS) + AppSync

This is a demo application to test the capabilities of AWS Cloud Development Kit (CDK) and AppSync, the AWS managed Graphql service,

AppSync supports many resolver types, such as a direct connection to AWS services like DynamoDB and Elastic Search, invoking lambda functions, direct HTTP calls, [and more](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-amplify.html).

This project currently only uses the lambda resolver type.

This project is written in Typescript but only vanilla JS functions are deployed.

## Getting started

You can test the API out in postman:

```
POST https://guqvz37wyfhonetvzwmearvaqm.appsync-api.eu-west-1.amazonaws.com/graphql
```

With the header: `x-api-key: <ask Alex>`.

Checkout the Graphql [schema file](./src/schema.graphql) for queries to run.

## Development

Clone the repo and run `yarn` to install the node modules.

### Useful commands

* `yarn  build`      compile typescript to js
* `yarn  test`       perform the jest unit tests
* `yarn  deploy`     deploy this stack to your AWS account/region
* `yarn  diff`       compare deployed stack with current state
* `yarn  cdk synth`  emits the synthesized CloudFormation template

## About CDK

CDK is a very powerful tool for building out AWS cloud infrastructure. Checkout the [stack file](./src/stack.ts) to see how we’re piecing it together.

We currently have two lambdas, one for our _notes_ service, and one for our _users_ service.

The notes part was from an article I read and talks to DynamoDB through lambdas.

The users service I wrote to test how we could talk to outside services via HTTP.

The `cdk.json` file tells the CDK Toolkit how to execute the app. Note that `yarn build` needs to have been run before you can see the `dist` directory.

## Dependencies

Note that individual lambda functions have their own `node_modules` and we use [npm-run-all](https://github.com/mysticatea/npm-run-all) to install it's dependencies on `postinstall`.

If you add a new `package.json` file to a lambda directory, be sure to add an `install:X` script call in the root `package.json`.

## TODO

* [x] Add more features to the users service
* [x] Try converting some of the DynamoDB stuff to [VTL](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html)
* [ ] Get CDK working locally with [localstack](https://localstack.cloud/)
* [ ] Write some tests
