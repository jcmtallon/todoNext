// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './frontEnd/index.js',
  output: {
    filename: 'main.js',
    path: __dirname + '/public'
  }
};
