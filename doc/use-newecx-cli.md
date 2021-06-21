# Use newecx cli Command

Here is a snapshot of a project work directory, after running newecx cli command for a typical vendor operations:

    .
    ├── data
    │   ├── inventory.csv
    │   └── assets
    │       ├── IGI-LG457051822
    │       │   ├── certificate.pdf
    │       │   └── primary.jpg
    │       ├── IGI-LG457051825
    │       │   ├── certificate.pdf
    │       │   └── primary.jpg
    │       ├── IGI-LG457051828
    │       │   ├── certificate.pdf
    │       │   └── primary.jpg
    ......
    │       ├── IGI-LG474106608
    │       │   └── certificate.pdf
    │       ├── IGI-LG474106653
    │       │   └── certificate.pdf
    │       └── IGI-LG474106655
    │           └── certificate.pdf
    ├── report
    │   ├── assets-retrieval.csv
    │   ├── errors.csv
    │   ├── passed.csv
    │   ├── summary.csv
    │   └── warnings.csv
    └── src
        ├── agreed-header.js
        └── fields-maps.js

1. data/inventory.csv is the feed that contains latest diamonds that are available to sell. You are supposed to copy it to here. Only keep the latest one in here.

2. data/assets contains all assets of diamonds that passed validation process.

3. report folder contains report files after each operations.

4. src/agreed-header.js and src/fields-maps.js are used by newecx command. They provided instructions to newecx cli for how to validate and transform values in your inventory csv into Ritani standard format for diamonds.

## Operations for newly started vendor:

Assuming you followed the quick start, create a project directory, change your current work directory to the project directory, and run newecx --set-config to setup your credentials.

### Step 1 make and update src/agreed-header.js

    newecx --make-header

    It reads the data/inventory.csv and extract the header and save as src/agreed-header.js

    newecx --upload-header

    The header of data/inventory.csv is updated to server. It will serve as contract between you and the API server. So the name is called "agreed-header". If you make any changes to the header of the csv file, you will need to update the server.

### Step 2 make src/fields-maps.js

    newecx --make-fields-maps

    The cli generates src/fields-maps.js based on the header and data in data/inventory.csv. It is javascript object that defines:

1. How to mapping standard key to field in data/inventory.csv? it provides an estimation version of this. You are responsible to ensure they are correct.

2. How to mapping different values to standard values? It provides values_map object in a commented out block that the newecx needs your help.

### Step 3 modify src/fields-maps.js file 

   It is a process to read through the file, follow instruction provided within the file, and answer and modify ? marked section

### Step 4 run validate

   newecx --validate-inventory

   Here are sample out:

   total diamonds: 583 passed count: 568

   summary report is saved to .../ritani-inventory/report/summary.csv
   passed diamonds report is saved to .../ritani-inventory/report/passed.csv
   errors report is saved to .../ritani-inventory/report/errors.csv
   warnings report is saved to .../ritani-inventory/report/warnings.csv
    
   1) report/summary.csv provides summary info
   2) report/errors.csv gives the reason why the diamond is not accepted
   3) report/warnings.csv provides ways to improve your feeds
   4) report/passed.csv provides the list of passed diamonds

   The typical new vendor will go through many times from Step3 to Step4 to make the feed are perfect.

### Step 5 update the fields-maps to API server

   newecx --upload-fields-maps


## Daily Operations:

    newecx --validate-inventory

    to see if your feeds are OK

    newecx -submit-inventory

    to submit the data/inventory.csv file to Ritani


