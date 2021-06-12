'use strict';

const certificate_lab_values = [
	'AGSL',				// AMERICAN GEM SOCIETY LABORATORIES
	'DF',				// Diamond Foundry
	'EGL',				// EUROPEAN GEMOLOGICAL LABORATORIES
	'GCAL',				// GEM CERTIFICATION & ASSURANCE LAB
	'GIA',				// GEMOLOGY HEADQUARTERS INTERNATIONAL LABORATORY
	'GHI',				// THE GEMOLOGICAL INSTITUTE OF AMERICA
	'GSI',				// GEMOLOGICAL SCIENCE INTERNATIONAL
	'HRD',				// DIAMOND HIGH COUNCIL
	'IGI',				// INTERNATIONAL GEMOLOGICAL INSTITUTE
	'IIDGR',			// INTERNATIONAL INSTITUTE OF DIAMOND GRADING & RESEARCH
	'PGS',				// PROFESSIONAL GEM SCIENCES LABORATORY
];

const certificate_lab_map = {
	AGSL: 'AGSL',  		
	DF: 'DF',			
	EGL: 'EGL',			
	GCAL: 'GCAL', 		
	GHI: 'GHI', 		
	GIA: 'GIA', 		
	GSI: 'GSI', 		
	HRD: 'HRD', 		
	IGI: 'IGI',		
	IIDGR: 'IIDGR', 	
	PGS: 'PGS', 		
};

const reverse_certificate_lab_map = {
	agsl: 'AGSL',  		
	ags: 'AGSL',  		
	df: 'DF',			
	egl: 'EGL',			
	gcal: 'GCAL', 		
	ghi: 'GHI', 		
	gia: 'GIA', 		
	gsi: 'GSI', 		
	hrd: 'HRD', 		
	igi: 'IGI',		
	iidgr: 'IIDGR', 	
	pgs: 'PGS', 		
};

module.exports = {
	certificate_lab_values,
    certificate_lab_map,
    reverse_certificate_lab_map,
};