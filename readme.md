# Diamond Vendor Inventory SDK

## How To Install

### Step 1: Install Latest LTS Node

<a href="https://nodejs.org/en/download/">Select a pre-built installer for your platform and install node</a>

### Step 2: Run

npm -g install @ritani/vendor-sdk

## How To Use

### Step 1: Sign up with vendor-portal.ritani.com

<a href="https://vendor-portal.ritani.com/vendor/signup">Sign up and create an account</a>

You will get ftp and api credentials:

    ftp_username, ftp_password and api_key


### Step 2: Create a project folder and data folder

for example: ritani-inventory as project folder, ritani-inventory/data as data folder

    mkdir -p ritani-inventory/data


### Step 3: Change directory to the project folder

for example: 

    cd ritani-inventory

### Step 4: set config

    newecx --set-config

    Enter your project directory: .../ritani-inventory
    Enter your data directory: .../ritani-inventory/data
    Enter your FTP username: ...
    Enter your FTP password: ...
    Enter your vendor API key: ...

### Step 5: generate template with instruction and sample data

    newecx --generate-template

    template files are saved in .../ritani-inventory/template

    Here are what we have in the project directory:
    .
    ├── data
    └── template
        ├── agreed-header.js
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
        ├── fields-map.js
        ├── instruction.csv
        └── inventory.csv

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