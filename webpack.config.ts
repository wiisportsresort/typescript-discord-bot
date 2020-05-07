import * as webpack from 'webpack';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as nodeExternals from 'webpack-node-externals';

dotenv.config();

const devMode = process.env.NODE_ENV === 'development';

export default function (env: any) {
  return <webpack.Configuration>{
    mode: devMode ? 'development' : 'production',
    entry: './server/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    target: 'node',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [new CleanWebpackPlugin()],
    externals: [nodeExternals()],
    optimization: {
      noEmitOnErrors: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
      ],
    },
  };
}
