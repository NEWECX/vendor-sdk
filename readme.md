# Diamond Vendor Inventory SDK

## How To Install

### Install Latest LTS Node (require version 14 or higher)

<a href="https://nodejs.org/en/download/">Click to Select a pre-built installer for your platform and install node</a>

### Run:

    npm -g install @ritani/vendor-sdk

## How To Use

### Step 1: Sign up with vendor-portal.ritani.com

<a href="https://vendor-portal.ritani.com/vendor/signup">Click to Sign up and create an account</a>

You will get ftp and api credentials:

    ftp_username, ftp_password and api_key

### Step 2: Create a project folder

for example: ritani-inventory as project folder, ritani-inventory/data as data folder

    mkdir -p ritani-inventory/data

    cd ritani-inventory

### Step 3: set config

    newecx --set-config

    Enter your project directory: .../ritani-inventory
    Enter your data directory: .../ritani-inventory/data
    Enter your FTP username: ...
    Enter your FTP password: ...
    Enter your vendor API key: ...

### Step 4: generate template with instruction and sample data

    newecx --generate-template

    template files are saved in .../ritani-inventory/template

    Here are what we have in the project directory:
    .
    ├── data
    └── template
        ├── assets
        │   ├── GIA-2205729946
        │   │   ├── certificate.pdf
        │   │   ├── cutprofile.jpg
        │   │   ├── plot.jpg
        │   │   ├── primary.jpg
        │   │   └── video.mp4
        │   └── IGI-459108837
        │       ├── certificate.pdf
        │       ├── primary.jpg
        │       └── video.mp4
        ├── agreed-header.js
        ├── fields-map.js
        ├── instruction.csv
        └── inventory.csv

For quick view, you can click on:

1. <a href="/doc/agreed-header.js">agreed-header.js</a>
2. <a href="/doc/fields-map.js">fields-map.js</a>
3. <a href="/doc/instruction.csv">instruction.csv</a>
4. <a href="/doc/inventory.csv">inventory.csv</a>

### Step 6: explore newecx cli command

    newecx -h

    Usage: newecx [options]

    Options:
    -v, --version                              output the current version
    -set --set-config                          to set project and data directories, ftp and api credentials
    -sd --set-data-dir <data_directory>        to set data directory
    -sp --set-project-dir <project_directory>  to set project directory
    -gt --generate-template                    to generate template, instruction and sample data
    -dh --download-header                      to download agreed header from server
    -df --download-fields-maps                 to download fields-maps from server
    -uh --upload-header                        to upload agreed header to server
    -uf --upload-fields-maps                   to upload fields-maps to server
    -mh --make-header                          to make agreed-header.js from inventory data
    -mf --make-fields-maps                     to make fields-maps.js from inventory data
    -vi --validate-inventory                   to validate inventory csv
    -ra --retrieve-assets                      to retrieve assets of passed diamonds
    -si --submit-inventory                     to submit inventory feed to server
    -sa --submit-assets                        to submit retrieved assets to server
    -sb --submit-both-inventory-assets         to submit both inventory and assets to server
    -h, --help                                 display help for command

<a href="/doc/newecx-cli.md">Click here for document of newecx cli command</a>

## Example of Use Vendor SDK APIs

To upload your inventory feed inventory.csv file:

    'use strict';

    const node_path = require('path');
    const { api_upload_inventory } = require('@ritani/vendor-sdk');

    (async () => {

        let inventory_filepath = node_path.join(data_dir, 'inventory.csv');

        console.log('api upload inventory.csv');
        const result = await api_upload_inventory(inventory_filepath);
        console.log(result);


    })();

<a href="/doc/vender-sdk-apis.md">Click here for document of Vendor SDK APIs</a>
