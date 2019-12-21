const str = 'abcdefghijklmnopqrstuvwxyz9876543210';

module.exports.getRandomFileName = function(ext = '', length = 18) {
  let k = '';
  for (let i = 0; i < length; i++) {
    k += str[Math.floor(Math.random() * str.length)];
  }
  if (ext) {
    k += '.' + ext;
  }
  return k;
};
