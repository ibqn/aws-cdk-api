import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class AwsCdkApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const message = new NodejsFunction(this, 'message-function', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: `${__dirname}/../lambda-fns/message.ts`,
      handler: 'handler',
    })
  }
}
