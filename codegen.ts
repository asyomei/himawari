import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./shikimori.graphql",
  documents: ["src/**/*.ts"],
  ignoreNoDocuments: true,
  hooks: { afterAllFileWrite: ["biome check --fix"] },
  generates: {
    "./src/gql/_gen/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
  },
};

export default config;
