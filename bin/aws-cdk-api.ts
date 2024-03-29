#!/usr/bin/env node

import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AwsCdkApiStack } from '../lib/aws-cdk-api-stack'

const app = new cdk.App()

new AwsCdkApiStack(app, 'aws-cdk-api-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
})
