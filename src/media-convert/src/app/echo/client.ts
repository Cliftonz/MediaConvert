import { Echo } from '@novu/echo';
import {renderTranscodedVideo} from "~/app/echo/emails/transcodedVideo";

export const echo = new Echo({
  apiKey: process.env.NOVU_API_KEY,
  devModeBypassAuthentication: process.env.NODE_ENV === 'development',
});

echo.workflow(
  'transcoding-done',
  async ({ step, subscriber }) => {

    const inAppResponse = await step.inApp(
        'send-inApp',
        async (inputs) => {
          return {
            subject: 'Reminder For THE EVENT',
            body: "",
          };
        },
        {
          inputSchema: {},
        }
    );


      await step.email(
          'send-email1',
          async (inputs) => {
              return {
                  subject: '-project- has finished transcoding',
                  body: renderTranscodedVideo(inputs),
              };
          },
          {
              inputSchema: {},
              skip: () => inAppResponse.seen
          },
      );


  },
  { payloadSchema: { type: 'object', properties: {} } }
);

