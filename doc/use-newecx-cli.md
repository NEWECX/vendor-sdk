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

1. data/inventory.csv is the feed that contains latest diamonds that are available to sell. You will need to copy it to here and keep only the latest one.

2. data/assets contains all assets of diamonds that passed validation process. How to download assets are explained in the late advance docs. 

3. report folder contains reports after each operations.

4. src/agreed-header.js and src/fields-maps.js are used by newecx command. They provide instructions for how to validate data and transform values in your inventory csv.

## Operations for newly started vendor:

Assuming you followed the quick start, 

1. create a project directory, 
2. change your current work directory to the project directory, 
3. and run newecx --set-config to setup your credentials.

### Step 1 agreed-header

    run

    newecx --make-header

    It reads the data/inventory.csv and extract the header and save as src/agreed-header.js

    run

    newecx --upload-header

    The header of data/inventory.csv is updated to server. It will serve as contract between you and 
    the API server. 
    
    So the name is called "agreed-header". If you make any changes to the header of the csv file, 
    you will need to update the server.

### Step 2 fields-maps

    run

    newecx --make-fields-maps

    The cli generates src/fields-maps.js based on the header and data in data/inventory.csv. 
    

It is javascript object that defines:

1. How to map standard key to field in inventory.csv? 

    It provides an estimation version of this. You are responsible to ensure they are correct.

2. How to map vendor's data values to standard values? 

    It provides values_map object in a commented out block that needs your help to uncomment it.

### Step 3 modify fields-maps

    It is a process to read through the file, follow instruction provided within the file, 
   
    and answer and modify ? marked lines and sections.

Tips:

    1) lab_grown

        Most vendors don't have this column. You can simply add one line after key: 'lab_grown':

        default_value = 1 // for lab grown diamond

        OR

        default_value = 0 // for earth diamond

    2) use default_value

        For example, days_to_ship of all of diamonds is 1 day, you don't have to create a new column, 
        instead you can simply add default_value = 1 to days_to_ship:

        {
            key: 'days_to_ship',
            default_value = 1,
            ......
        },

    3) values_map for shape and other keys

        {
            key: 'shape',
            field: 'Shape',

        // description: 'shape',
        // require: 'required',
        // type: 'string',

            values_map: {
                PC: 'PR',
                CC: 'CU'
            },

        // allowed_values:: 'RD, CU, PR, EM, OV, AS, RA, MQ, PS, HS, TR, SH, PE, OC, ST, HE, HM, TZ',

        /* for your reference:

            dictionary: {
            RD: 'Round',
            CU: 'Cushion',
            PR: 'Princess',
            EM: 'Emerald',
            OV: 'Oval',
            AS: 'Asscher',
            RA: 'Radiant',
            MQ: 'Marquise',
            PS: 'Pear',
            HS: 'Heart',
            TR: 'Triangle',
            SH: 'Shield',
            PE: 'Pentagonal',
            OC: 'Octagonal',
            ST: 'Star',
            HE: 'Hexagonal',
            HM: 'Half Moon',
            TZ: 'Trapezoid'
            }
        */
        },

        To map shape in the current feed is the first step, you are expected to map 
        all potential shapes that will use in your feed.

        The sames are expected for other keys that have values_map.

    4) cost and cost_per_carat

        You need to provide only one. If both are provided, the newecx cli checks the data 
        integrity between them.

### Step 4 validate

    run
    
    newecx --validate-inventory


Here are sample outputs:

        total diamonds: 583 passed count: 568
        
        summary report is saved to .../ritani-inventory/report/summary.csv
        passed diamonds report is saved to .../ritani-inventory/report/passed.csv
        errors report is saved to .../ritani-inventory/report/errors.csv
        warnings report is saved to .../ritani-inventory/report/warnings.csv
    
1) report/summary.csv provides summary info:

<table>
   <tr>
   <th>total diamonds</th><th>passed count</th><th>errors count</th><th>warnings count</th><th>urls for certificate</th><th>urls for primary_image</th><th>urls for primary_video</th><th>urls for 3d_360</th><th>urls for cutprofile</th><th>urls for plot</th><th>urls for alternate_image</th><th>urls for alternate_video</th>
   </tr>
   <tr>
<td>583</td><td>568</td><td>15</td><td>1822</td><td>568</td><td>148</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
    </tr>
</table>


2) report/errors.csv gives the reasons why the diamonds are not accepted

<table>
<tr>
<th>row_no</th><th>vendor_sku</th><th>certificate_lab</th><th>certificate_number</th><th>field</th><th>type</th><th>message</th>
</tr>
<tr>
<td>1</td><td>467124161</td><td>IGI</td><td>LG467124161</td><td>Symmetry</td><td>error</td><td>missing required value, key symmetry</td>
</tr>
<tr>
<td>2</td><td>464118920</td><td>IGI</td><td>LG464118920</td><td>Symmetry</td><td>error</td><td>missing required value, key symmetry</td>
</tr>
<tr>
<td>13</td><td>472175898</td><td>IGI</td><td>LG472175898</td><td>Symmetry</td><td>error</td><td>missing required value, key symmetry</td>
</tr>
<tr>
</table>



3) report/warnings.csv provides ways to improve your feeds

<table>
<tr>
<th>row_no</th><th>vendor_sku</th><th>certificate_lab</th><th>certificate_number</th><th>field</th><th>type</th><th>message</th>
</tr>
<tr>
<td>1</td><td>467124161</td><td>IGI</td><td>LG467124161</td><td>days_to_ship</td><td>warning</td><td>value for days_to_ship is empty, but expected</td>
</tr>
<tr>
<td>1</td><td>467124161</td><td>IGI</td><td>LG467124161</td><td>Diamond Image</td><td>warning</td><td>value for orig_primary_image_url is empty, but expected</td>
</tr>
<tr>
<td>1</td><td>467124161</td><td>IGI</td><td>LG467124161</td><td>orig_video_url</td><td>warning</td><td>value for orig_video_url is empty, but expected</td>
</tr>
<tr>
<td>2</td><td>464118920</td><td>IGI</td><td>LG464118920</td><td>days_to_ship</td><td>warning</td><td>value for days_to_ship is empty, but expected</td>
</tr>
<tr>
<td>2</td><td>464118920</td><td>IGI</td><td>LG464118920</td><td>Diamond Image</td><td>warning</td><td>value for orig_primary_image_url is empty, but expected</td>
</tr>
<tr>
<td>2</td><td>464118920</td><td>IGI</td><td>LG464118920</td><td>orig_video_url</td><td>warning</td><td>value for orig_video_url is empty, but expected</td>
</tr>
</table>


4) report/passed.csv provides the list of passed diamonds

<table>
<tr>
<th>row_no</th><th>vendor_sku</th><th>certificate_lab</th><th>certificate_number</th><th>carat</th><th>cost</th><th>date_time</th><th>checksum</th>
</tr>
<tr>
<td>3</td><td>445046785</td><td>IGI</td><td>LG445046785</td><td>3.5</td><td>7892.5</td><td>2021-06-21T23:40:10.595Z</td><td>rKvhKoHnxsSe6wZVD7WpOYi7dvS</td>
</tr>
<tr>
<td>4</td><td>470130062</td><td>IGI</td><td>LG470130062</td><td>3.34</td><td>11573.1</td><td>2021-06-21T23:40:10.595Z</td><td>wDEczGlCsKRvd6DlL3KCKzVjDuf</td>
</tr>
<tr>
<td>5</td><td>474106655</td><td>IGI</td><td>LG474106655</td><td>3.32</td><td>9860.4</td><td>2021-06-21T23:40:10.595Z</td><td>w3E8505MPS07KlTfMdduMOY2GOd</td>
</table>


The typical new vendor will go through many iterations between Step3 to Step4 to make the feed are perfect.

### Step 5 update the fields-maps to API server

Once you have your fields-maps.js ready:

    run
    
    newecx --upload-fields-maps

## Daily Operations:

    run

    newecx --validate-inventory

    to see if your feeds are OK

    run

    newecx --submit-inventory

    to submit the data/inventory.csv file to Ritani
