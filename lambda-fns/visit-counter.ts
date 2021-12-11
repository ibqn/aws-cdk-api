import { DynamoDB, Lambda } from 'aws-sdk'

export const handler = async (event: any): Promise<any> => {
  console.log('request:', JSON.stringify(event, undefined, 2))

  const dynamo = new DynamoDB()
  const lambda = new Lambda()

  await dynamo
    .updateItem({
      TableName: process.env.HITS_TABLE_NAME!,
      Key: { path: { S: event.path } },
      UpdateExpression: 'ADD visits :incr',
      ExpressionAttributeValues: { ':incr': { N: '1' } },
    })
    .promise()

  const response = await lambda
    .invoke({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME!,
      Payload: JSON.stringify(event),
    })
    .promise()

  console.log('downstream response:', JSON.stringify(response, undefined, 2))

  return JSON.parse(response.Payload! as string)
}
