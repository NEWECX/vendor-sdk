
1) General folders and files structure

    Example Tree:

    data
    ├── inventory.csv
    └── assets
        ├── GIA-2205729946
        │   ├── certificate.pdf
        │   ├── cutprofile.jpg
        │   ├── plot.jpg
        │   ├── primary.jpg
        │   └── video.mp4
        ├── ......
        ......

    Rules for ftp operations:

    1) the root folder takes csv only, for example: inventory.csv

    2) only make sub-folder under assets folder

    3) the sub-folder name must in the format of LAB-CERT#, for example: GIA-2205729946

    4) the sub-folder takes following file names:

    certificate.pdf 
    certificate.jpg
    primary.jpg
    cutprofile.jpg
    plot.jpg
    image1.jpg
    image2.jpg
    image3.jpg
    video.mp4 
    video1.mp4
    video2.mp4

    Note: if the rules are not fully followed, the system don't have enough information to match assets files to 
    diamonds in the csv.

2)  Note for FileZilla: https://filezilla-project.org/
    
    Site Manger, Encryption option "Require implicit FTP over TLS" will not work. use one of other 3 options.

3)  Ftp Client

    See the ftp-client directory, it is a small node program that is ready to use for uploading inventory and assets to 
    
    ftp.ritani.com.

    src/config.js is configured with working demo1 account credential. 

    Please refer to readme file under the ftp-client directory for detail.
    
    Once you confirmed that it works. You should replace user and password with your own.

    For the convenience of developing your ftp-client, you can test your code with sandbox
 
 4) Sandbox for developing

    Sandbox has everything as production except it will not add your feed into production database.

    All new created account are started with sandbox setting, after approval, it will move out of sandbox.

