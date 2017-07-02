const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const autoprefixer = require(`autoprefixer`);
const webpack = require(`webpack`);
const path = require(`path`);

const isProd = process.env.NODE_ENV === `production`; // true or false
const cssDev = [
  `style-loader`,
  `css-loader`,
  {
    loader: `postcss-loader`,
    options: {
      sourceMap: true,
      plugins: () => [autoprefixer()]
    }
  },
  `sass-loader`
];

const cssProd = ExtractTextPlugin.extract({
  fallback: `style-loader`,
  use: [
    {
      loader: `css-loader`,
      options: { sourceMap: true, importLoaders: 1 }
    },
    {
      loader: `postcss-loader`,
      options: {
        sourceMap: true,
        plugins: () => [autoprefixer()]
      }
    },
    {
      loader: `sass-loader`
    }
  ],
  publicPath: `/dist`
});

const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
  entry: `./src/app.js`,
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `[name].bundle.js`
  },
  devServer: {
    contentBase: path.join(__dirname, `dist`),
    port: 9000,
    stats: `errors-only`,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [`babel-loader`, `eslint-loader`]
      },
      {
        test: /\.scss$/,
        use: cssConfig
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          `file-loader?name=[name].[ext]&publicPath=images/&outputPath=images/`,
          {
            loader: `image-webpack-loader`,
            options: {}
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: `file-loader?name=[name].[ext]&publicPath=fonts/&outputPath=fonts/`,
        // options: {
        //   name: `./font/[name].[ext]`,
        // },
        exclude: [/node_modules/]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: `Starter`, // Change to whatever project it is.
      minify: {
        collapseWhitepsace: false // Set to true to minify html
      },
      hash: true, // Set to true if we want hashed bundles.
      template: `./src/index.html` // Load a custom template (ejs by default)
    }),
    new ExtractTextPlugin({
      filename: `style.css`,
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
