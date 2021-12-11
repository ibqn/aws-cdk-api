import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { VisitCounter } from './visit-counter'
import * as path from 'path'
import { TableViewer } from 'cdk-dynamo-table-viewer'

export class AwsCdkApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const message = new NodejsFunction(this, 'message-function', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: path.resolve(process.cwd(), `lambda-fns/message.ts`),
    })

    const messageWithVisitCounter = new VisitCounter(
      this,
      'message-visit-counter',
      {
        downstream: message,
      }
    )

    new apigw.LambdaRestApi(this, 'endpoint', {
      handler: messageWithVisitCounter.handler,
    })

    new TableViewer(this, 'display-visits-counter', {
      title: 'Display Visits',
      table: messageWithVisitCounter.table,
    })
  }
}
