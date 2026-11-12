/* CoolForge catalog · real OEM references from product photos · reference prices are placeholders */
window.CF_PRODUCTS = [
  {
    id: 'hose-universal', cat: 'hose', img: 'assets/ac-hose.png', photo: 'assets/ac-hose-photo.jpg',
    oem: 'CF-HOSE-001', price: [18, 42], custom: true,
    name: { en: 'A/C Hose Assembly · Universal', es: 'Manguera A/C · Universal', ar: 'خرطوم تكييف · عام' },
    specs: { type: { en: 'Hose assembly (discharge / suction / liquid)', es: 'Ensamblaje (descarga / succión / líquido)', ar: 'تجميعة خرطوم (تفريغ / سحب / سائل)' },
      ref: 'R-134a / R-1234yf', bore: '#6 / #8 / #10 / #12', fitting: { en: 'O-ring / flange / block, to drawing', es: 'O-ring / brida / bloque, por plano', ar: 'O-ring / شفة / كتلة، حسب الرسم' },
      material: { en: 'Aluminum tube + barrier rubber + crimped ferrules', es: 'Tubo aluminio + hule barrier + férulas', ar: 'أنبوب ألمنيوم + مطاط حاجز + حلقات كبس' },
      length: { en: 'Custom to specification', es: 'A especificación', ar: 'حسب المواصفة' } },
    fit: { make: { en: 'Universal · to drawing', es: 'Universal · por plano', ar: 'عام · حسب الرسم' }, years: '—' }
  },
  {
    id: 'evap-mazda', cat: 'evap', img: 'assets/evap-mazda-cx5.png',
    oem: 'GHP961J10', price: [38, 70], custom: false,
    name: { en: 'Evaporator · Mazda 6 / CX-5', es: 'Evaporador · Mazda 6 / CX-5', ar: 'مبخر · مازدا 6 / CX-5' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a',
      core: '282 × 280 × 44 mm', fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'Mazda 6 / CX-5', years: '2014-2019' }
  },
  {
    id: 'evap-chevy', cat: 'evap', img: 'assets/evap-chevy-express.png',
    oem: '20214066', price: [52, 95], custom: false,
    name: { en: 'Evaporator · Chevrolet Express 3500', es: 'Evaporador · Chevrolet Express 3500', ar: 'مبخر · شيفروليه إكسبرس 3500' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a',
      core: 'Rear auxiliary', fitting: { en: 'Tube + block', es: 'Tubo + bloque', ar: 'أنبوب + كتلة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'Chevrolet Express 3500', years: '2003-2019' }
  },
  {
    id: 'evap-ford', cat: 'evap', img: 'assets/evap-ford-v326.png',
    oem: 'CK4Z19B555X', price: [45, 82], custom: false,
    name: { en: 'Evaporator · Ford V326', es: 'Evaporador · Ford V326', ar: 'مبخر · فورد V326' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a / R-1234yf',
      core: 'Front', fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'Ford Transit / V326', years: '2014-2020' }
  },
  {
    id: 'evap-explorer', cat: 'evap', img: 'assets/evap-explorer.png',
    oem: 'BB5Z19850A', price: [48, 88], custom: false,
    name: { en: 'Evaporator · Ford Explorer', es: 'Evaporador · Ford Explorer', ar: 'مبخر · فورد إكسبلورر' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a',
      core: 'Front', fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'Ford Explorer', years: '2011-2019' }
  },
  {
    id: 'evap-pajero', cat: 'evap', img: 'assets/evap-pajero-l200.png',
    oem: 'MR568098', price: [42, 78], custom: false,
    name: { en: 'Evaporator · Mitsubishi Pajero / L200', es: 'Evaporador · Mitsubishi Pajero / L200', ar: 'مبخر · ميتسوبيشي باجيرو / L200' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a',
      core: 'Front', fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'Mitsubishi Pajero / L200', years: '2007-2018' }
  },
  {
    id: 'evap-passat', cat: 'evap', img: 'assets/evap-passat-audi.png',
    oem: '5Q1820102', price: [40, 75], custom: false,
    name: { en: 'Evaporator · VW Passat / Audi', es: 'Evaporador · VW Passat / Audi', ar: 'مبخر · فولكس باسات / أودي' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' }, ref: 'R-134a / R-1234yf',
      core: 'Front', fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: 'VW Passat / Audi A3', years: '2015-2021' }
  },
  {
    id: 'cond-parallel', cat: 'cond', img: 'assets/cat-condenser.c.svg',
    oem: 'CF-COND-01', price: [30, 65], custom: true,
    name: { en: 'Condenser · Parallel-flow', es: 'Condensador · Flujo paralelo', ar: 'مكثف · تدفق متوازٍ' },
    specs: { type: { en: 'Parallel-flow condenser w/ drier', es: 'Condensador flujo paralelo c/ secador', ar: 'مكثف تدفق متوازٍ مع مجفف' }, ref: 'R-134a / R-1234yf',
      core: { en: 'To application', es: 'Según aplicación', ar: 'حسب التطبيق' }, fitting: { en: 'Block / O-ring', es: 'Bloque / O-ring', ar: 'كتلة / O-ring' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Multiple applications', es: 'Múltiples aplicaciones', ar: 'تطبيقات متعددة' }, years: '—' }
  },
  {
    id: 'exv-block', cat: 'exv', img: 'assets/cat-expansion-valve.c.svg',
    oem: 'CF-EXV-01', price: [10, 28], custom: true,
    name: { en: 'Expansion Valve · Block type', es: 'Válvula de expansión · Bloque', ar: 'صمام تمدد · نوع كتلة' },
    specs: { type: { en: 'Thermostatic expansion valve', es: 'Válvula termostática', ar: 'صمام تمدد حراري' }, ref: 'R-134a / R-1234yf',
      core: { en: 'Block, to application', es: 'Bloque, según aplicación', ar: 'كتلة، حسب التطبيق' }, fitting: { en: 'Block + O-ring', es: 'Bloque + O-ring', ar: 'كتلة + O-ring' },
      material: { en: 'Aluminum body', es: 'Cuerpo aluminio', ar: 'جسم ألمنيوم' } },
    fit: { make: { en: 'Multiple applications', es: 'Múltiples aplicaciones', ar: 'تطبيقات متعددة' }, years: '—' }
  },
  {
    id: 'drier-can', cat: 'drier', img: 'assets/cat-receiver-drier.c.svg',
    oem: 'CF-DRIER-01', price: [8, 20], custom: true,
    name: { en: 'Receiver Drier · Canister', es: 'Secador receptor · Cartucho', ar: 'مجفف مستقبِل · علبة' },
    specs: { type: { en: 'Receiver drier (TXV systems)', es: 'Secador receptor (sistemas TXV)', ar: 'مجفف مستقبِل (أنظمة TXV)' }, ref: 'R-134a / R-1234yf',
      core: { en: 'Desiccant canister', es: 'Cartucho desecante', ar: 'علبة مجففة' }, fitting: { en: 'Inlet / outlet ports', es: 'Puertos entrada / salida', ar: 'منافذ دخول / خروج' },
      material: { en: 'Aluminum canister', es: 'Cartucho aluminio', ar: 'علبة ألمنيوم' } },
    fit: { make: { en: 'TXV-system vehicles', es: 'Vehículos sistema TXV', ar: 'مركبات نظام TXV' }, years: '—' }
  }
];
window.CF_CAT = {
  hose: { en: 'A/C Hose', es: 'Manguera A/C', ar: 'خرطوم التكييف' },
  evap: { en: 'Evaporator', es: 'Evaporador', ar: 'المبخر' },
  cond: { en: 'Condenser', es: 'Condensador', ar: 'المكثف' },
  exv: { en: 'Expansion Valve', es: 'Válvula de expansión', ar: 'صمام التمدد' },
  drier: { en: 'Receiver Drier', es: 'Secador receptor', ar: 'المجفف المستقبِل' }
};
