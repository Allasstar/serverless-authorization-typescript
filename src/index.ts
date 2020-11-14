import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const { stringify } = JSON;

export const ping: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
= async function pingHandler(event, context, callback) {
  return {
    body: stringify({ ping: 'ok' }),
    statusCode: 200,
  };
};
