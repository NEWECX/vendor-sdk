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
 // allowed_values: 'AGSL, DF, EGL, GCAL, GIA, GHI, GSI, HRD, IGI, IIDGR, PGS'
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
 // allowed_values: 'AS, CU, EM, HS, MQ, OV, PR, PS, RA, RD'
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
 // allowed_values: 'FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3'
  },
  {
    key: 'color',
 // type: 'string',
 // require: 'required',
 // description: 'color',
 // allowed_values: 'D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z'
  },
  {
    key: 'cut',
 // type: 'string',
 // require: 'required',
 // description: 'cut grade',
 // allowed_values: 'EX, VG, G'
  },
  {
    key: 'culet_size',
 // type: 'string',
 // require: 'optional',
 // description: 'culet size'
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
 // allowed_values: 'EX, VG, G'
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
 // allowed_values: 'N, F, M, S, VS'
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
 // allowed_values: 'EX, VG, G, F'
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
 // description: 'crown height'
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
 // description: 'pavilion depth'
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
 // allowed_values: 'YELLOW, PINK, PURPLE, RED, BLUE, GREEN, ORANGE, BROWN, BLACK, GRAY'
  },
  {
    key: 'fancy_color_intensity',
 // type: 'string',
 // require: 'optional',
 // description: 'fancy color intensity',
 // allowed_values: 'FL, FA, FI, FV, FE, FD'
  },
  {
    key: 'fancy_color_overtone',
 // type: 'string',
 // require: 'optional',
 // description: 'fancy color overtone'
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
    key: 'lab_grown',
 // type: 'number',
 // require: 'required',
 // description: 'lab grown or earth grown',
 // allowed_values: '0, 1'
  },
  {
    key: 'laser_inscription',
 // type: 'string',
 // require: 'optional',
 // description: 'laser inscription'
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