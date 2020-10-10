import { NativeScriptConfig } from "@nativescript/core";

// tslint:disable-next-line:no-object-literal-type-assertion
export default {
  id: "exuberant.comptia.quiz",
  appResourcesPath: "app/App_Resources",
  android: {
    v8Flags: "--expose_gc",
    markingMode: "none"
  },
  appPath: "app"
} as NativeScriptConfig;
