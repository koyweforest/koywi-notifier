import { Koywi } from "./koywi";
import { App } from "@serverless-stack/resources";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.setDefaultFunctionProps({
    environment: {
      STAGE: app.stage,
      NAME: app.name,
      REGION: app.region,
    },
  })
  app.stack(Koywi);
}
