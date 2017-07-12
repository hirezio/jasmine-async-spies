import * as webpack from 'webpack';

import { resolve } from 'path';

export const webpackConfig: webpack.Configuration = {
  
  devtool: 'inline-source-map',
  entry: './index.ts',
  output: {
    filename: 'jasmine-async-spies.js',
    path: resolve('./dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts/, use:['awesome-typescript-loader'] }
    ]
  }
}

export default webpackConfig;