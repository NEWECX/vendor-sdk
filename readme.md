# Diamond Vendor Inventory SDK Quick Start

## How To Install (node version 14 or higher is required):

    npm -g install @ritani/vendor-sdk

To install node and npm, please refer to: <a href="https://nodejs.org/en/download/">pre-built installer for your platform</a>

## How To Use

### Step 1: Get API and FTP credentials from Ritani:

If you already have it, you can skip step 1 and go to step 2 directly.

Sign up on Ritani's vendor portal:

<a href="https://vendor-portal.ritani.com/vendor/signup">Click to Sign up and create an account</a>

Once sign up is complete, sign in and click on the account tab. There you will find your FTP and API credentials:

    Username, Password and API key

### Step 2: Create a project folder. Then run the SDK config command. This will guide you through the process of configuring the SDK.

for example: ritani-inventory as project folder, ritani-inventory/data as data folder

    mkdir -p ritani-inventory/data

    cd ritani-inventory

    newecx --set-config

    Enter your project directory: .../ritani-inventory
    Enter your data directory: .../ritani-inventory/data
    Enter your FTP username: ...
    Enter your FTP password: ...
    Enter your vendor API key: ...

### Step 3: generate template with instruction and sample data

    newecx --generate-template

    template files are saved in .../ritani-inventory/template

    Here is what we have in the project directory:
    .
    ├── data
    └── template
        ├── assets
        ...
        ├── agreed-header.js
        ├── fields-map.js
        ├── instruction.csv
        └── inventory.csv

Click below to view sample data:

1. <a href="/doc/agreed-header.js">agreed-header.js</a>
2. <a href="/doc/fields-map.js">fields-map.js</a>
3. <a href="/doc/instruction.csv">instruction.csv</a>
4. <a href="/doc/inventory.csv">inventory.csv</a>

### Step 4: explore newecx cli command

    newecx -h

    Usage: newecx [options]

    Options:
    -v, --version                              output the current version
    -set --set-config                          to set project and data directories, ftp and api credentials
    -sd --set-data-dir <data_directory>        to set data directory
    -sp --set-project-dir <project_directory>  to set project directory
    -gt --generate-template                    to generate template, instruction and sample data
    -di --download-inventory                   to download latest inventory feed data from server
    -dh --download-header                      to download agreed header from server
    -df --download-fields-maps                 to download fields-maps from server
    -uh --upload-header                        to upload agreed header to server
    -uf --upload-fields-maps                   to upload fields-maps to server
    -fuh --force-upload-header                 to force upload agreed header to server
    -fuf --force-upload-fields-maps            to force upload fields-maps to server
    -mh --make-header                          to make agreed-header.js from inventory data
    -mf --make-fields-maps                     to make fields-maps.js from inventory data
    -vi --validate-inventory                   to validate inventory csv
    -ra --retrieve-assets                      to retrieve assets of passed diamonds
    -si --submit-inventory                     to submit inventory feed to server
    -sa --submit-assets                        to submit retrieved assets to server
    -sb --submit-both-inventory-assets         to submit both inventory and assets to server
    -h, --help                                 display help for command

<a href="/doc/use-newecx-cli.md">Click here for the full documentation of the newecx cli command</a>

### Step 5: Example of Using Vendor SDK APIs

To upload your inventory feed (data/inventory.csv file):

    'use strict';

    const node_path = require('path');
    const { api_upload_inventory } = require('@ritani/vendor-sdk');

    (async () => {

        let inventory_filepath = node_path.join(__dirname(), 'data', 'inventory.csv');

        console.log('api upload inventory.csv');
        const result = await api_upload_inventory(inventory_filepath);
        console.log(result);

    })();

<a href="/doc/vender-sdk-apis.md">Click here for full documentation of the Vendor SDK APIs</a>
