'use strict';

const chai = require('chai');
const configuration = require('../lib/configuration');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-configuration

const account = {
    ftp_host: 'diamondftp.ritani.com',
    ftp_user: 'test',
    ftp_password: 'password',
    ftp_secure: true,
    api_base_url: 'https://api.newecx.com',
    api_key: 'API-KEY',
    data_dir: '/path/to/my-data-directory',
    project_dir: '/path/to/my-project-directory'
};

describe('Test account config', () => {

    it('test get_ftp_config', async () => {
        configuration.set_account(account);
        const ftp_config = configuration.get_ftp_config();
        expect(ftp_config).to.deep.equal({host: 'diamondftp.ritani.com', user: 'test', password: 'password', secure: true});
    });

    it('test get_api_base_url', async () => {
        configuration.set_account(account);
        const api_base_url = configuration.get_api_base_url();
        expect(api_base_url).to.equal('https://api.newecx.com');
    });

    it('test get_api_key', async () => {
        configuration.set_account(account);
        const api_key = configuration.get_api_key();
        expect(api_key).to.equal('API-KEY');
    });

    it('test get_data_directory', async () => {
        configuration.set_account(account);
        const data_dir = configuration.get_data_directory();
        expect(data_dir).to.equal('/path/to/my-data-directory');
    });

    it('test get_project_directory', async () => {
        configuration.set_account(account);
        const project_dir = configuration.get_project_directory();
        expect(project_dir).to.equal('/path/to/my-project-directory');
    });

    after(() => {
        configuration.load_configuration(); // restore config
    });
});