#!/usr/bin/env node
const yargs = require('yargs').option('r', {
  alias: 'random',
  default: true,
  describe: 'Use random file names',
  type: 'boolean'
});
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Upload = require('./lib/Upload');

const files = yargs.argv._;
const fileList = [];

const useRandomName = yargs.argv.random;

files.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fileList.push({
      fileName: path.basename(file),
      filePath
    });
  }
});

if (fileList.length === 0) {
  console.log(chalk.yellowBright('这里没有文件可以上传哦！'));
  process.exit();
}

console.log(chalk.blueBright('准备上传的文件有：'));
fileList.forEach(({ filePath }) => {
  console.log(filePath);
});

// 空行
console.log('');

const upload = new Upload({
  random: useRandomName
});

upload
  .uploadFiles(fileList)
  .then(() => {
    console.log(chalk.greenBright('全部文件上传成功！'));
  })
  .catch(() => {
    process.exit(-1);
  });
