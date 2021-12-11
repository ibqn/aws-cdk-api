import * as cdk from 'aws-cdk-lib'
import * as path from 'path'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export interface VisitCounterProps {
  downstream: lambda.IFunction
}

export class VisitCounter extends Construct {
  public readonly handler: lambda.Function

  constructor(scope: Construct, id: string, props: VisitCounterProps) {
    super(scope, id)

    const table = new dynamodb.Table(this, 'hits', {
      partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    this.handler = new NodejsFunction(this, 'visit-counter-function', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: path.resolve(process.cwd(), `lambda-fns/visit-counter.ts`),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    })
  }
}
