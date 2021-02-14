import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class CdkAppsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-notes-appsync-api",
      schema: appsync.Schema.fromAsset(
        path.join(__dirname, "./schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", { value: api.graphqlUrl });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", { value: api.apiKey || "" });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", { value: this.region });

    // Create a new lambda function as a notes service
    const notesLambda = new lambda.Function(this, "AppSyncNotesHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "./notes")),
      memorySize: 1024,
    });

    // Set the new Lambda function as a data source for the AppSync API
    const notesLambdaDs = api.addLambdaDataSource(
      "notesLambdaDatasource",
      notesLambda
    );

    // Add the resolvers for our lambda data source
    notesLambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getNoteById",
    });
    notesLambdaDs.createResolver({ typeName: "Query", fieldName: "listNotes" });
    notesLambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
    });
    notesLambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
    });
    notesLambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
    });

    // Setup a dynamo-db table
    const notesTable = new ddb.Table(this, "CDKNotesTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // Enable the Lambda function to access the DynamoDB table (using IAM)
    notesTable.grantFullAccess(notesLambda);

    // Create an environment variable that we will use in the function code
    notesLambda.addEnvironment("NOTES_TABLE", notesTable.tableName);

    // Create a new lambda function as a users service
    const usersLambda = new lambda.Function(this, "AppSyncUserHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "./users")),
      memorySize: 1024,
    });

    // Add this function as a data source for the AppSync API
    const usersLambdaDs = api.addLambdaDataSource(
      "usersLambdaDatasource",
      usersLambda
    );

    // Add the resolvers for our lambda data source
    usersLambdaDs.createResolver({ typeName: "Query", fieldName: "listUsers" });
  }
}
