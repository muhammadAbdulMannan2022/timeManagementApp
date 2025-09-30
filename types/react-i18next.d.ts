import "react-i18next";

declare module "react-i18next" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomTypeOptions {
    // Replace `any` with your TranslationResources interface if you have it exported
    resources: any;
  }
}
