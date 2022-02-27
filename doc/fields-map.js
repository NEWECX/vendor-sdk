'use strict';

const fields_map = [
  {
    key: 'vendor_sku',
 // type: 'string',
 // require: 'expected',

 // description: 'vendor internal sku or stock#'
  },
  {
    key: 'carat',
 // type: 'number',
 // require: 'required',

 // description: 'carat weight'
  },
  {
    key: 'shipping_availability',
 // type: 'string',
 // require: 'optional',

 // description: 'memo field, please filter available ones to submit'
  },
  {
    key: 'certificate_lab',
 // type: 'string',
 // require: 'required',

 // description: 'certificate lab',

 // allowed_values:: 'GIA, AGSL, HRD, IGI, GCAL, DF, EGL, GHI, GSI, IIDGR, PGS, BSC, JGS, WGI, EDR, LGC',

 /* for your reference:

    dictionary: {
      GIA: 'The Gemological Institute of America',
      AGSL: 'American GEM Society Laboratories',
      HRD: 'Diamond High Council',
      IGI: 'International Gemological Institute',
      GCAL: 'GEM Certification & Assurance LAB',
      DF: 'Diamond Foundry',
      EGL: 'European Gemological Laboratories',
      GHI: 'Gemology Headquarters International Laboratory',
      GSI: 'Gemological Science International',
      IIDGR: 'International Institute of Diamond Grading & Research',
      PGS: 'Professional GEM Science Laboratory',
      BSC: 'Biological Safety Cabinet Testing & Certification',
      JGS: 'J.B. Grading System',
      WGI: 'World Gemological Institute',
      EDR: 'Lloyds Family Jewellery Certificate',
      LGC: 'The UK’s designated National Measurement Institute for chemical and bioanalytical measurements'
    }
*/
  },
  {
    key: 'certificate_number',
 // type: 'string',
 // require: 'required',

 // description: 'certificate number'
  },
  {
    key: 'orig_certificate_url',
 // type: 'string',
 // require: 'expected',

 // description: 'url for certificate.pdf (preferred) or  certificate.jpg'
  },
  {
    key: 'shape',
 // type: 'string',
 // require: 'required',

 // description: 'shape',

 // allowed_values:: 'RD, CU, PR, EM, OV, AS, RA, MQ, PS, HS, TR, SH, PE, OC, ST, HE, HM, TZ, KI, BT, DE, LO, OT',

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
      PE: 'Pentagon',
      OC: 'Octagon',
      ST: 'Star',
      HE: 'Hexagon',
      HM: 'Half Moon',
      TZ: 'Trapezoid',
      KI: 'Kite',
      BT: 'Briolette',
      DE: 'Decagon',
      LO: 'Lozenge',
      OT: 'Other'
    }
*/
  },
  {
    key: 'cost',
 // type: 'number',
 // require: 'required',

 // description: 'the cost of the whole stone, NOT cost per carat'
  },
  {
    key: 'cost_per_carat',
 // type: 'number',
 // require: 'required',

 // description: 'the cost per carat'
  },
  {
    key: 'clarity',
 // type: 'string',
 // require: 'required',

 // description: 'clarity',

 // allowed_values:: 'FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3',

 /* for your reference:

    dictionary: {
      FL: 'Flawless',
      IF: 'Internally Flawless',
      VVS1: 'Very, Very Slightly Inclusion 1',
      VVS2: 'Very, Very Slightly Inclusion 2',
      VS1: 'Very Slightly Inclusion 1',
      VS2: 'Very Slightly Inclusion 2',
      SI1: 'Slightly Inclusion 1',
      SI2: 'Slightly Inclusion 2',
      I1: 'Inclusion 1',
      I2: 'Inclusion 2',
      I3: 'Inclusion 3'
    }
*/
  },
  {
    key: 'clarity_characteristics',
 // require: 'optional',

 // description: 'clarity characteristics, i.e, Feather'
  },
  {
    key: 'color',
 // type: 'string',
 // require: 'required',

 // description: 'color',

 // allowed_values:: 'D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, FLY, FY, FIY, FVY, FPY, FDY, FLO, FO, FIO, FVO, FPO, FDO, FLR, FR, FIR, FVR, FPR, FDR, FLBLU, FBLU, FIBLU, FVBLU, FPBLU, FDBLU, FLBLA, FBLA, FIBLA, FVBLA, FPBLA, FDBLA, FLBRO, FBRO, FIBRO, FVBRO, FPBRO, FDBRO, FLPI, FPI, FIPI, FVPI, FPPI, FDPI, FLPU, FPU, FIPU, FVPU, FPPU, FDPU, FLGRE, FGRE, FIGRE, FVGRE, FPGRE, FDGRE, FLGRA, FGRA, FIGRA, FVGRA, FPGRA, FDGRA, FLW, FW, FIW, FVW, FPW, FDW',

 /* for your reference:

    dictionary: {
      D: 'D',
      E: 'E',
      F: 'F',
      G: 'G',
      H: 'H',
      I: 'I',
      J: 'J',
      K: 'K',
      L: 'L',
      M: 'M',
      N: 'N',
      O: 'O',
      P: 'P',
      Q: 'Q',
      R: 'R',
      S: 'S',
      T: 'T',
      U: 'U',
      V: 'V',
      W: 'W',
      X: 'X',
      Y: 'Y',
      Z: 'Z',
      FLY: 'Fancy Light Yellow',
      FY: 'Fancy Yellow',
      FIY: 'Fancy Intense Yellow',
      FVY: 'Fancy Vivid Yellow',
      FPY: 'Fancy Deep Yellow',
      FDY: 'Fancy Dark Yellow',
      FLO: 'Fancy Light Orange',
      FO: 'Fancy Orange',
      FIO: 'Fancy Intense Orange',
      FVO: 'Fancy Vivid Orange',
      FPO: 'Fancy Deep Orange',
      FDO: 'Fancy Dark Orange',
      FLR: 'Fancy Light Red',
      FR: 'Fancy Red',
      FIR: 'Fancy Intense Red',
      FVR: 'Fancy Vivid Red',
      FPR: 'Fancy Deep Red',
      FDR: 'Fancy Dark Red',
      FLBLU: 'Fancy Light Blue',
      FBLU: 'Fancy Blue',
      FIBLU: 'Fancy Intense Blue',
      FVBLU: 'Fancy Vivid Blue',
      FPBLU: 'Fancy Deep Blue',
      FDBLU: 'Fancy Dark Blue',
      FLBLA: 'Fancy Light Black',
      FBLA: 'Fancy Black',
      FIBLA: 'Fancy Intense Black',
      FVBLA: 'Fancy Vivid Black',
      FPBLA: 'Fancy Deep Black',
      FDBLA: 'Fancy Dark Black',
      FLBRO: 'Fancy Light Brown',
      FBRO: 'Fancy Brown',
      FIBRO: 'Fancy Intense Brown',
      FVBRO: 'Fancy Vivid Brown',
      FPBRO: 'Fancy Deep Brown',
      FDBRO: 'Fancy Dark Brown',
      FLPI: 'Fancy Light Pink',
      FPI: 'Fancy Pink',
      FIPI: 'Fancy Intense Pink',
      FVPI: 'Fancy Vivid Pink',
      FPPI: 'Fancy Deep Pink',
      FDPI: 'Fancy Dark Pink',
      FLPU: 'Fancy Light Purple',
      FPU: 'Fancy Purple',
      FIPU: 'Fancy Intense Purple',
      FVPU: 'Fancy Vivid Purple',
      FPPU: 'Fancy Deep Purple',
      FDPU: 'Fancy Dark Purple',
      FLGRE: 'Fancy Light Green',
      FGRE: 'Fancy Green',
      FIGRE: 'Fancy Intense Green',
      FVGRE: 'Fancy Vivid Green',
      FPGRE: 'Fancy Deep Green',
      FDGRE: 'Fancy Dark Green',
      FLGRA: 'Fancy Light Gray',
      FGRA: 'Fancy Gray',
      FIGRA: 'Fancy Intense Gray',
      FVGRA: 'Fancy Vivid Gray',
      FPGRA: 'Fancy Deep Gray',
      FDGRA: 'Fancy Dark Gray',
      FLW: 'Fancy Light White',
      FW: 'Fancy White',
      FIW: 'Fancy Intense White',
      FVW: 'Fancy Vivid White',
      FPW: 'Fancy Deep White',
      FDW: 'Fancy Dark White'
    }
*/
  },
  {
    key: 'color_origin',
 // require: 'optional',

 // description: 'color origin, i.e, Nature'
  },
  {
    key: 'color_distribution',
 // require: 'optional',

 // description: 'color distribution, i.e, Even'
  },
  {
    key: 'cut',
 // type: 'string',
 // require: 'expected',

 // description: 'cut grade',

 // allowed_values:: 'ID, VG, G, F, P',

 /* for your reference:

    dictionary: {
      ID: 'Ideal',
      VG: 'Very Good',
      G: 'Good',
      F: 'Fair',
      P: 'Poor'
    }
*/
  },
  {
    key: 'culet_size',
 // type: 'string',
 // require: 'optional',

 // description: 'culet size',

 // allowed_values:: 'N, VS, S, M, SL, LG, VL',

 /* for your reference:

    dictionary: {
      N: 'None',
      VS: 'Very Small',
      S: 'Small',
      M: 'Medium',
      SL: 'Slightly Large',
      LG: 'Large',
      VL: 'Very Large'
    }
*/
  },
  {
    key: 'culet_condition',
 // type: 'string',
 // require: 'optional',

 // description: 'culet condition'
  },
  {
    key: 'polish',
 // type: 'string',
 // require: 'required',

 // description: 'polish',

 // allowed_values:: 'EX, VG, G, F, P',

 /* for your reference:

    dictionary: {
      EX: 'Excellent',
      VG: 'Very Good',
      G: 'Good',
      F: 'Fair',
      P: 'Poor'
    }
*/
  },
  {
    key: 'depth',
 // type: 'number',
 // require: 'required',

 // description: 'depth in mm'
  },
  {
    key: 'depth_percent',
 // type: 'number',
 // require: 'required',

 // description: 'depth percent'
  },
  {
    key: 'width',
 // type: 'number',
 // require: 'required',

 // description: 'width in mm'
  },
  {
    key: 'length',
 // type: 'number',
 // require: 'required',

 // description: 'length in mm'
  },
  {
    key: 'length_width_ratio',
 // type: 'number',
 // require: 'optional',

 // description: 'length width ratio'
  },
  {
    key: 'measurements',
 // type: 'string',
 // require: 'optional',

 // description: 'measurements by width - length x depth mm'
  },
  {
    key: 'fluorescence',
 // type: 'string',
 // require: 'required',

 // description: 'fluorescence',

 // allowed_values:: 'N, F, M, S, VS',

 /* for your reference:

    dictionary: {
      N: 'None',
      F: 'Faint',
      M: 'Medium',
      S: 'Strong',
      VS: 'Very Strong'
    }
*/
  },
  {
    key: 'fluorescence_color',
 // type: 'string',
 // require: 'optional',

 // description: 'fluorescence color'
  },
  {
    key: 'girdle',
 // type: 'string',
 // require: 'optional',

 // description: 'girdle includes thin to thick'
  },
  {
    key: 'girdle_thin',
 // type: 'string',
 // require: 'optional',

 // description: 'girdle thin'
  },
  {
    key: 'girdle_thick',
 // type: 'string',
 // require: 'optional',

 // description: 'girdle thick'
  },
  {
    key: 'girdle_percent',
 // type: 'number',
 // require: 'optional',

 // description: 'girdle percent'
  },
  {
    key: 'symmetry',
 // type: 'string',
 // require: 'required',

 // description: 'symmetry',

 // allowed_values:: 'EX, VG, G, F, P',

 /* for your reference:

    dictionary: {
      EX: 'Excellent',
      VG: 'Very Good',
      G: 'Good',
      F: 'Fair',
      P: 'Poor'
    }
*/
  },
  {
    key: 'table_percent',
 // type: 'number',
 // require: 'required',

 // description: 'table percent'
  },
  {
    key: 'key_to_symbols',
 // type: 'string',
 // require: 'optional',

 // description: 'key to symbols'
  },
  {
    key: 'crown_height',
 // type: 'number',
 // require: 'optional',

 // description: 'crown height percent'
  },
  {
    key: 'crown_angle',
 // type: 'number',
 // require: 'optional',

 // description: 'crown angle'
  },
  {
    key: 'pavilion_depth',
 // type: 'number',
 // require: 'optional',

 // description: 'pavilion depth percent'
  },
  {
    key: 'pavilion_angle',
 // type: 'number',
 // require: 'optional',

 // description: 'pavilion angle'
  },
  {
    key: 'fancy_color',
 // type: 'string',
 // require: 'optional',

 // description: 'fancy color',

 // allowed_values:: 'YELLOW, PINK, PURPLE, RED, BLUE, GREEN, ORANGE, BROWN, BLACK, GRAY, WHITE',

 /* for your reference:

    dictionary: {
      YELLOW: 'Yellow',
      PINK: 'Pink',
      PURPLE: 'Purple',
      RED: 'Red',
      BLUE: 'Blue',
      GREEN: 'Green',
      ORANGE: 'Orange',
      BROWN: 'Brown',
      BLACK: 'Black',
      GRAY: 'Gray',
      WHITE: 'White'
    }
*/
  },
  {
    key: 'fancy_color_intensity',
 // type: 'string',
 // require: 'optional',

 // description: 'fancy color intensity',

 // allowed_values:: 'FL, FA, FI, FV, FP, FD',

 /* for your reference:

    dictionary: {
      FL: 'Fancy Light',
      FA: 'Fancy',
      FI: 'Fancy Intense',
      FV: 'Fancy Vivid',
      FP: 'Fancy Deep',
      FD: 'Fancy Dark'
    }
*/
  },
  {
    key: 'fancy_color_overtone',
 // type: 'string',
 // require: 'optional',

 // description: 'fancy color overtone',

 // allowed_values:: 'YELLOW, PINK, PURPLE, RED, BLUE, GREEN, ORANGE, BROWN, BLACK, GRAY, WHITE',

 /* for your reference:

    dictionary: {
      YELLOW: 'Yellow',
      PINK: 'Pink',
      PURPLE: 'Purple',
      RED: 'Red',
      BLUE: 'Blue',
      GREEN: 'Green',
      ORANGE: 'Orange',
      BROWN: 'Brown',
      BLACK: 'Black',
      GRAY: 'Gray',
      WHITE: 'White'
    }
*/
  },
  {
    key: 'city',
 // type: 'string',
 // require: 'optional',

 // description: 'city of the diamond location'
  },
  {
    key: 'state',
 // type: 'string',
 // require: 'optional',

 // description: 'state of the diamond location'
  },
  {
    key: 'country',
 // type: 'string',
 // require: 'optional',

 // description: 'country of the diamond location'
  },
  {
    key: 'location',
 // type: 'string',
 // require: 'optional',

 // description: 'location of the diamond'
  },
  {
    key: 'days_to_ship',
 // type: 'number',
 // require: 'optional',

 // description: 'days need to ship the diamond'
  },
  {
    key: 'lab_grown',
 // type: 'number',
 // require: 'required',

 // description: 'lab grown or earth grown',

 // allowed_values:: '0, 1',

 /* for your reference:

    dictionary: {
      '0': 'N',
      '1': 'Y'
    }
*/
  },
  {
    key: 'laser_inscription',
 // type: 'string',
 // require: 'optional',

 // description: 'laser inscription'
  },
  {
    key: 'report_date',
 // type: 'string',
 // require: 'optional',

 // description: 'date shows on lab report'
  },
  {
    key: 'comments',
 // type: 'string',
 // require: 'optional',

 // description: 'comments'
  },
  {
    key: 'orig_primary_image_url',
 // type: 'string',
 // require: 'expected',

 // description: 'url for primary image primary.jpg'
  },
  {
    key: 'orig_proportions_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for proportions diagram cutprofile.jpg'
  },
  {
    key: 'orig_plotting_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for plotting diagram plot.jpg'
  },
  {
    key: 'orig_video_url',
 // type: 'string',
 // require: 'expected',

 // description: 'url for video video.mp4'
  },
  {
    key: 'orig_3d_360_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for 3D 360 vision url'
  },
  {
    key: 'orig_alt_image1_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for additional image image1.jpg'
  },
  {
    key: 'orig_alt_image2_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for additional image image2.jpg'
  },
  {
    key: 'orig_alt_image3_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for additional image image3.jpg'
  },
  {
    key: 'orig_video1_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for additional video video1.mp4'
  },
  {
    key: 'orig_video2_url',
 // type: 'string',
 // require: 'optional',

 // description: 'url for additional video video2.mp4'
  }
];

module.exports = fields_map;