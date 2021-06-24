'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const node_path = require('path');
const {set_configuration} = require('../');

function set_config() {
    const questions = [
      {
        prefix: '',
        name: 'project_dir',
        type: 'input',
        message: 'Enter your project directory:',
        default: process.cwd(),
        validate: function(value) {
          if (value.length) {
            const fullpath = value.startsWith(node_path.sep) ? value : node_path.resolve(process.cwd(), value);
            if (fs.existsSync(fullpath)) {
              if (fs.lstatSync(fullpath).isDirectory()) {
                return true;
              } else {
                return 'The path is not directory, enter a directory.';
              }
            } else {
              return 'The directory not exists, enter an existed directory.';
            }
          } else {
            return 'Please enter your project directory.';
          }
        }
      },
      {
        prefix: '',
        name: 'data_dir',
        type: 'input',
        message: 'Enter your data directory:',
        default: node_path.join(process.cwd(), 'data'),
        validate: function(value) {
          if (value.length) {
            const fullpath = value.startsWith(node_path.sep) ? value : node_path.resolve(process.cwd(), value);
            if (fs.existsSync(fullpath)) {
              if (fs.lstatSync(fullpath).isDirectory()) {
                return true;
              } else {
                return 'The path is not directory, enter a directory.';
              }
            } else {
              return 'The directory not exists, enter an existed directory.';
            }
          } else {
            return 'Please enter your data directory.';
          }
        }
      },
      {
        prefix: '',
        name: 'ftp_user',
        type: 'input',
        message: 'Enter your FTP username:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter username.';
          }
        }
      },
      {
        prefix: '',
        name: 'ftp_password',
        type: 'input',
        message: 'Enter your FTP password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        }
      },
      {
        prefix: '',
        name: 'api_key',
        type: 'input',
        message: 'Enter your vendor API key:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your api key.';
          }
        }
      }
    ];
    inquirer.prompt(questions).then(config => {
      config.project_dir = config.project_dir.startsWith(node_path.sep) ? 
        config.project_dir : node_path.resolve(process.cwd(), config.project_dir);
      config.data_dir = config.data_dir.startsWith(node_path.sep) ? 
        config.data_dir : node_path.resolve(process.cwd(), config.data_dir);
      set_configuration(config, true);
    })
}

module.exports = set_config;