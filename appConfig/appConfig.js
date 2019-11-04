// Several modules in the backend refer to this constant to identify the
// current environment and therefore adapt their behavior to it.
// TODO: definitely not the right way to do it. Study and improve this.
// Node provides a global variable that can be used to identify the environment
// mode. 
module.exports = {
  production: false
};
