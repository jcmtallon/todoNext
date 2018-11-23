// webpack.config.js
module.exports = {
  mode: 'development',
  entry: './controllers/index.js',
  output: {
    filename: 'main.js',
    path: __dirname + '/public'
  }
};
