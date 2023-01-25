import { Cron, StackContext } from "@serverless-stack/resources";

export function Koywi({ stack }: StackContext) {
  const cron = new Cron(stack, "Cron", {
    schedule: "cron(0 12 ? * MON-FRI *)",
    job: "functions/lambda.handler",
  });

  cron.attachPermissions(['ssm:GetParameter']);
}
