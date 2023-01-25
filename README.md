# Koywi the Notifier (title pending)

Use this simple Serverless app to let EVERYONE on your slack channels know how many weeks, days, and hours are left before YC Demo Day W23.

# Detailed instructions
1. Just follow the instructions outlined here: https://sst.dev/examples/how-to-use-cron-jobs-in-your-serverless-app.html
2. Change the cron configuration (if you want) in ``stacks/koywi.ts``. It's currently set to send a message every weekday  at 9AM UTC-3
2. Modify the message in ``services/lambda.ts`` at your own taste. This could be useful: https://app.slack.com/block-kit-builder/T016DS66R99
3. Configure your Slack App to send messages. This could be useful: https://api.slack.com/start/overview#creating
4. Configure your parameter store variables (or YOLO it by putting them directly into the ``services/lambda.ts`` script)
5. Enjoy your daily reminder!
