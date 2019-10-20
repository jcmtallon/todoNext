// webpack.config.js
module.exports = {
  mode: 'development',
  entry: './frontEnd/index.js',
  output: {
    filename: 'main.js',
    path: __dirname + '/public'
  }
};
