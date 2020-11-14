import { AuthResponse, Callback, Context, CustomAuthorizerEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

export const handler = (event: CustomAuthorizerEvent, context: Context, callback: Callback) => {
  console.log('authorizer');
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));

  try {
    const authHeader = event.authorizationToken?.split(' ') || [];

    if (authHeader.length === 2 && authHeader[0].toLowerCase() === 'bearer') {
      const decoded = jwt.verify(authHeader[1], process.env.AUTH0_CLIENT_SECRET as string) as { sub: string };

      const authResponse: AuthResponse = {
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Resource: [
                event.methodArn,
              ],
              Effect: 'Allow',
            },
          ],
        },
        principalId: decoded.sub,
      };

      callback(undefined, authResponse);
    } else {
      callback('Unauthorized', undefined);
    }
  } catch (err) {
    console.log(err);
    callback('Unauthorized', undefined);
  }
};
