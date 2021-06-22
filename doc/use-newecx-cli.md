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

2. data/assets contains all assets of diamonds that passed validation process. How to download assets are explained in the late advance session. 

3. report folder contains report files after each operations.

4. src/agreed-header.js and src/fields-maps.js are used by newecx command. They provided instructions for how to validate and transform values in your inventory csv.

## Operations for newly started vendor:

Assuming you followed the quick start, 

1. create a project directory, 
2. change your current work directory to the project directory, 
3. and run newecx --set-config to setup your credentials.

### Step 1 make and update agreed-header

    run

    newecx --make-header

    It reads the data/inventory.csv and extract the header and save as src/agreed-header.js

    run

    newecx --upload-header

    The header of data/inventory.csv is updated to server. It will serve as contract between you and 
    the API server. 
    
    So the name is called "agreed-header". If you make any changes to the header of the csv file, 
    you will need to update the server.

### Step 2 make fields-maps

    run

    newecx --make-fields-maps

    The cli generates src/fields-maps.js based on the header and data in data/inventory.csv. 
    
    It is javascript object that defines:

1. How to mapping standard key to field in inventory.csv? 

    It provides an estimation version of this. You are responsible to ensure they are correct.

2. How to mapping different values to standard values? 

    It provides values_map object in a commented out block that needs your help uncomment it.

### Step 3 modify fields-maps

   It is a process to read through the file, follow instruction provided within the file, 
   
   and answer and modify ? marked section.

   Tips:

        1) lab_grown

           Most vendor doesn't have this column. You can simply add one line after key: 'lab_grown':

           default_value = 1 // for lab grown diamond

           OR

           default_value = 0 // for earth diamond

        2) values_map for shape and other keys

           To map shape in the current feed is the first step, you are expected to map 
           all potential shapes.

           The sames are expected for other keys that have values_map.

        3) cost and cost_per_cara

           You will need provide only one. If both are provided, the newecx cli checks the data 
           integrity between them.

### Step 4 run validate

   newecx --validate-inventory

   Here are sample output:

   total diamonds: 583 passed count: 568

   summary report is saved to .../ritani-inventory/report/summary.csv
   passed diamonds report is saved to .../ritani-inventory/report/passed.csv
   errors report is saved to .../ritani-inventory/report/errors.csv
   warnings report is saved to .../ritani-inventory/report/warnings.csv
    
   1) report/summary.csv provides summary info
   2) report/errors.csv gives the reasons why the diamonds are not accepted
   3) report/warnings.csv provides ways to improve your feeds
   4) report/passed.csv provides the list of passed diamonds

   The typical new vendor will go through many iterates between Step3 to Step4 
   to make the feed are perfect.

### Step 5 update the fields-maps to API server

   newecx --upload-fields-maps

## Daily Operations:

    newecx --validate-inventory

    to see if your feeds are OK

    newecx -submit-inventory

    to submit the data/inventory.csv file to Ritani


