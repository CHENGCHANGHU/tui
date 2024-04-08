import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeWithRules } from 'webpack-merge';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { BaseConfig } from "../../webpack-config/index.mjs";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export default mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: {
        loader: "match",
        options: "replace",
      },
    },
  },
})(BaseConfig, {
  entry: {
    index: join(__dirname, 'src', 'index.ts'),
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              context: join(__dirname),
              configFile: join(__dirname, '..', '..', 'tsconfig.json'),
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      name: 'index.html',
      template: join(__dirname, 'index.html'),
      chunks: ['index'],
    }),
  ],
});
