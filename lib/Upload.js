const axios = require('axios');
const chalk = require('chalk');
const qiniu = require('node-qiniu');
const path = require('path');
const { getRandomFileName } = require('./utils');

const prefix = 's/ast/';

module.exports = class Upload {
  constructor(config) {
    this.config = {
      random: false,
      ...config
    };
  }

  async getKey() {
    try {
      const res = await axios.get(
        'http://api.ybusad-local.com/splendor/cdn/getLocalKey'
      );
      return res.data;
    } catch (err) {
      console.log(chalk.redBright('获取上传凭证失败！'));
      console.error(err);
      throw err;
    }
  }

  async uploadFiles(fileList) {
    const { accessKey, secretKey, bucket: bucketName } = await this.getKey();

    qiniu.config({
      access_key: accessKey,
      secret_key: secretKey
    });

    const bucket = qiniu.bucket(bucketName);
    const allSuccess = true;

    for (let { fileName, filePath } of fileList) {
      let uploadFileNameKey = fileName;
      try {
        if (this.config.random) {
          let ext = path.extname(filePath);
          if (ext.startsWith('.')) {
            ext = ext.substr(1);
          }
          uploadFileNameKey = getRandomFileName(ext);
        }

        const res = await bucket.putFile(
          `${prefix}${uploadFileNameKey}`,
          filePath
        );
        const key = res.key;
        console.log(chalk.greenBright(`上传成功：${fileName}`));
        console.log(`https://static.ybusad.com/${key}`);
      } catch (err) {
        console.log(chalk.redBright(`上传失败：${fileName}`));
        allSuccess = false;
      }
    }

    if (!allSuccess) {
      throw '存在上传失败的文件';
    }
  }
};
