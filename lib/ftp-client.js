const fs = require('fs');
const node_path = require('path');
const { list, put, cwd, pwd, mkdir } = require('@samwen/ftp-client');
const { certificate_lab_values } = require('./cfg/1-certificates');
const { filename_values } = require('./cfg/2-assets-config');
const configuration = require('./configuration');
const get_latest_csv_file = require('./util/get-latest-csv-file');

module.exports = {
    ftp_upload_all_files,
    ftp_upload_inventory,
    ftp_upload_assets,
    ftp_upload_asset,
};

async function ftp_upload_all_files(data_dir) {

    if (!data_dir && configuration.get_data_dir()) {
        data_dir = configuration.get_data_dir();
    }
    if (!data_dir) {
        throw new Error('ftp_upload_all_files, empty data_dir');
    }
    if (!fs.existsSync(data_dir)) {
        throw new Error('ftp_upload_all_files, data_dir not found');
    }
    const [file, local_filepath] = get_latest_csv_file(data_dir);
    if (!local_filepath) {
        throw new Error('ftp_upload_all_files, empty csv_local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('ftp_upload_all_files, csv_local_filepath not found');
    }

    const inventory = await ftp_upload_inventory(local_filepath);
    const assets_path = node_path.join(data_dir, 'assets');
    const assets = await ftp_upload_assets(assets_path);
    return {
        inventory: {file, ...inventory},
        assets 
    }
}

/**
 * 
 * @param {*} local_filepath path to inventory.csv file or empty to use default
 * @returns 
 */
async function ftp_upload_inventory(local_filepath) {

    let file;
    if (!local_filepath && configuration.get_data_dir()) {
        const data_dir = configuration.get_data_dir();
        if (fs.existsSync(data_dir)) {
            [ file, local_filepath ] = get_latest_csv_file(data_dir);
        }
    }

    if (!local_filepath) {
        throw new Error('ftp_upload_inventory, empty local_filepath(1)');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error(`ftp_upload_inventory, inventory_filepath ${local_filepath} not found`);
    }

    const current_directory = await pwd();
    if (current_directory !== '/' && !await cwd('/')) {
        throw new Error('ftp_upload_inventory, failed to switch ftp work directory to /');
    }

    if (await put(local_filepath)) {
        if (file) {
            return {status: 'OK', file};
        } else {
            return {status: 'OK'};
        }
    } else {
        return {status: 'error'};
    }
}


/**
 * 
 * @param {*} assets_path path to assets folder or empty to use default
 * @param {*} certificate_lab if defined, to upload specific diamond defined by certificate_lab and certificate_number
 * @param {*} certificate_number if defined, certificate_lab also need to define
 */
async function ftp_upload_assets(assets_path, certificate_lab, certificate_number) {

    if (!assets_path && configuration.get_data_dir()) {
        const data_dir = configuration.get_data_dir();
        assets_path = node_path.join(data_dir, 'assets');
    }

    if (!assets_path) {
        throw new Error('ftp_upload_assets, empty assets_path');
    }

    if (!fs.existsSync(assets_path)) {
        throw new Error(`ftp_upload_assets, assets_path ${assets_path} not found`);
    }

    const diamond_folders = fs.readdirSync(assets_path);

    const ftp_assets_items = await list('/assets');

    const result = [];

    const promises = [];

    // loop through all diamonds directories
    //
    for (const diamond_folder of diamond_folders) {
        
        // skip . files
        if (diamond_folder.startsWith('.') || !diamond_folder.includes('-') || diamond_folder.split('-').length !==2) {
            continue;
        }

        const [lab, cert] = diamond_folder.split('-');
        if (!lab || !cert || !certificate_lab_values.includes(lab)) {
            continue;
        }

        if (certificate_lab && certificate_number) {
            if (lab !== certificate_lab || cert !== certificate_number) {
                continue;
            }
        }

        const diamond_path = node_path.join(assets_path, diamond_folder);
        if (!fs.lstatSync(diamond_path).isDirectory()) {
            continue;
        }

        if (!ftp_assets_items.find(x => x.name === diamond_folder)) {
            await cwd('/assets');
            await mkdir(diamond_folder)
        }

        let current_directory = await pwd();
        if (current_directory !== '/assets/' + diamond_folder) {
            await cwd('/assets/' + diamond_folder);
            current_directory = '/assets/' + diamond_folder;
        }

        console.log(`uploading ${diamond_folder}...`);

        const files = fs.readdirSync(diamond_path);

        for (const file of files) {

            if (!filename_values.includes(file)) {
                continue;
            }

            promises.push(put_file(diamond_path, file, lab, cert, result));
            if (promises.length === 16) {
                await Promise.all(promises);
                promises.length = 0;
            } 

        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    } 

    return result;
}

async function put_file(diamond_path, file, lab, cert, result) {
    const local_filepath = node_path.join(diamond_path, file);
    if (await put(local_filepath, file)) {
        result.push({status: 'OK', certificate_lab: lab, certificate_number: cert, file});
    } else {
        result.push({status: 'error', certificate_lab: lab, certificate_number: cert, file})
    }

}

/**
 * 
 * @param {*} local_filepath path to the asset
 * @param {*} certificate_lab if local_filepath doesn't include lab and cert#
 * @param {*} certificate_number 
 */
 async function ftp_upload_asset(local_filepath, certificate_lab, certificate_number) {

    if (!fs.existsSync(local_filepath)) {
        throw new Error(`ftp_upload_asset, local_filepath ${local_filepath} not found`);
    }
    const filename = node_path.basename(local_filepath);
    if (!filename_values.includes(filename)) {
        throw new Error(`ftp_upload_asset, filename ${filename} not supported`);
    }
    let lab_cert = node_path.basename(node_path.dirname(local_filepath));
    if (certificate_lab && certificate_number) {
        if (!certificate_lab_values.includes(certificate_lab)) {
            throw new Error('ftp_upload_asset, certificate_lab ${certificate_lab} not supported');
        }
        lab_cert = certificate_lab + '-' + certificate_number;
    } else {
        const parts = lab_cert.split('-');
        if (parts.length !== 2 || !certificate_lab_values.includes(parts[0])) {
            throw new Error(`ftp_upload_asset, lab_cert ${lab_cert} not supported`);   
        }
    }

    const ftp_assets_items = await list('/assets');
    if (!ftp_assets_items.find(x => x.name === lab_cert)) {
        await cwd('/assets');
        await mkdir(lab_cert)
    }
    await cwd('/assets/' + lab_cert);

    if (await put(local_filepath, filename)) {
        return { status: 'OK' };
    } else {
        return { status: 'error' };
    }
}