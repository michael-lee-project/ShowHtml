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
/* NEW SKUs from product_img (2026-11-15) · internal ref numbers · fitment & price pending */
window.CF_PRODUCTS.push(
  {
    id: 'p941', cat: 'hose', img: 'assets/products/p941.png', pending: true,
    oem: 'CF-P-941', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P941', es: 'Manguera A/C · P941', ar: 'خرطوم تكييف · P941' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p942', cat: 'evap', img: 'assets/products/p942.png', pending: true,
    oem: 'CF-P-942', price: null, custom: false,
    name: { en: 'Evaporator Core · P942', es: 'Evaporador · P942', ar: 'مبخر · P942' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p943', cat: 'hose', img: 'assets/products/p943.png', pending: true,
    oem: 'CF-P-943', price: null, custom: true,
    name: { en: 'A/C Fitting · P943', es: 'Conexión A/C · P943', ar: 'وصلة تكييف · P943' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p944', cat: 'hose', img: 'assets/products/p944.png', pending: true,
    oem: 'CF-P-944', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P944', es: 'Manguera A/C · P944', ar: 'خرطوم تكييف · P944' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p945', cat: 'evap', img: 'assets/products/p945.png', pending: true,
    oem: 'CF-P-945', price: null, custom: false,
    name: { en: 'Evaporator Core · P945', es: 'Evaporador · P945', ar: 'مبخر · P945' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p946', cat: 'hose', img: 'assets/products/p946.png', pending: true,
    oem: 'CF-P-946', price: null, custom: true,
    name: { en: 'A/C Fitting · P946', es: 'Conexión A/C · P946', ar: 'وصلة تكييف · P946' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p947', cat: 'evap', img: 'assets/products/p947.png', pending: true,
    oem: 'CF-P-947', price: null, custom: false,
    name: { en: 'Evaporator Core · P947', es: 'Evaporador · P947', ar: 'مبخر · P947' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p948', cat: 'evap', img: 'assets/products/p948.png', pending: true,
    oem: 'CF-P-948', price: null, custom: false,
    name: { en: 'Evaporator Core · P948', es: 'Evaporador · P948', ar: 'مبخر · P948' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p949', cat: 'evap', img: 'assets/products/p949.png', pending: true,
    oem: 'CF-P-949', price: null, custom: false,
    name: { en: 'Evaporator Core · P949', es: 'Evaporador · P949', ar: 'مبخر · P949' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p950', cat: 'evap', img: 'assets/products/p950.png', pending: true,
    oem: 'CF-P-950', price: null, custom: false,
    name: { en: 'Evaporator Core · P950', es: 'Evaporador · P950', ar: 'مبخر · P950' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p951', cat: 'evap', img: 'assets/products/p951.png', pending: true,
    oem: 'CF-P-951', price: null, custom: false,
    name: { en: 'Evaporator Core · P951', es: 'Evaporador · P951', ar: 'مبخر · P951' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p952', cat: 'hose', img: 'assets/products/p952.png', pending: true,
    oem: 'CF-P-952', price: null, custom: true,
    name: { en: 'A/C Fitting · P952', es: 'Conexión A/C · P952', ar: 'وصلة تكييف · P952' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p953', cat: 'evap', img: 'assets/products/p953.png', pending: true,
    oem: 'CF-P-953', price: null, custom: false,
    name: { en: 'Evaporator Core · P953', es: 'Evaporador · P953', ar: 'مبخر · P953' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p954', cat: 'evap', img: 'assets/products/p954.png', pending: true,
    oem: 'CF-P-954', price: null, custom: false,
    name: { en: 'Evaporator Core · P954', es: 'Evaporador · P954', ar: 'مبخر · P954' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p955', cat: 'evap', img: 'assets/products/p955.png', pending: true,
    oem: 'CF-P-955', price: null, custom: false,
    name: { en: 'Evaporator Core · P955', es: 'Evaporador · P955', ar: 'مبخر · P955' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p956', cat: 'evap', img: 'assets/products/p956.png', pending: true,
    oem: 'CF-P-956', price: null, custom: false,
    name: { en: 'Heater Core · P956', es: 'Núcleo de calefacción · P956', ar: 'قلب تدفئة · P956' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p957', cat: 'hose', img: 'assets/products/p957.png', pending: true,
    oem: 'CF-P-957', price: null, custom: true,
    name: { en: 'A/C Fitting · P957', es: 'Conexión A/C · P957', ar: 'وصلة تكييف · P957' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p958', cat: 'evap', img: 'assets/products/p958.png', pending: true,
    oem: 'CF-P-958', price: null, custom: false,
    name: { en: 'Heater Core · P958', es: 'Núcleo de calefacción · P958', ar: 'قلب تدفئة · P958' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p959', cat: 'hose', img: 'assets/products/p959.png', pending: true,
    oem: 'CF-P-959', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P959', es: 'Manguera A/C · P959', ar: 'خرطوم تكييف · P959' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p960', cat: 'hose', img: 'assets/products/p960.png', pending: true,
    oem: 'CF-P-960', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P960', es: 'Manguera A/C · P960', ar: 'خرطوم تكييف · P960' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p961', cat: 'evap', img: 'assets/products/p961.png', pending: true,
    oem: 'CF-P-961', price: null, custom: false,
    name: { en: 'Evaporator Core · P961', es: 'Evaporador · P961', ar: 'مبخر · P961' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p962', cat: 'hose', img: 'assets/products/p962.png', pending: true,
    oem: 'CF-P-962', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P962', es: 'Manguera A/C · P962', ar: 'خرطوم تكييف · P962' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p963', cat: 'hose', img: 'assets/products/p963.png', pending: true,
    oem: 'CF-P-963', price: null, custom: true,
    name: { en: 'A/C Fitting · P963', es: 'Conexión A/C · P963', ar: 'وصلة تكييف · P963' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p964', cat: 'hose', img: 'assets/products/p964.png', pending: true,
    oem: 'CF-P-964', price: null, custom: true,
    name: { en: 'A/C Fitting · P964', es: 'Conexión A/C · P964', ar: 'وصلة تكييف · P964' },
    specs: { type: { en: 'Fitting', es: 'Conexión', ar: 'وصلة' },
      material: { en: 'Machined aluminum', es: 'Aluminio mecanizado', ar: 'ألمنيوم مشغول' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p965', cat: 'evap', img: 'assets/products/p965.png', pending: true,
    oem: 'CF-P-965', price: null, custom: false,
    name: { en: 'Evaporator Core · P965', es: 'Evaporador · P965', ar: 'مبخر · P965' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p966', cat: 'evap', img: 'assets/products/p966.png', pending: true,
    oem: 'CF-P-966', price: null, custom: false,
    name: { en: 'Heater Core · P966', es: 'Núcleo de calefacción · P966', ar: 'قلب تدفئة · P966' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p967', cat: 'evap', img: 'assets/products/p967.png', pending: true,
    oem: 'CF-P-967', price: null, custom: false,
    name: { en: 'Heater Core · P967', es: 'Núcleo de calefacción · P967', ar: 'قلب تدفئة · P967' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p968', cat: 'evap', img: 'assets/products/p968.png', pending: true,
    oem: 'CF-P-968', price: null, custom: false,
    name: { en: 'Heater Core · P968', es: 'Núcleo de calefacción · P968', ar: 'قلب تدفئة · P968' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p969', cat: 'evap', img: 'assets/products/p969.png', pending: true,
    oem: 'CF-P-969', price: null, custom: false,
    name: { en: 'Evaporator Core · P969', es: 'Evaporador · P969', ar: 'مبخر · P969' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p970', cat: 'evap', img: 'assets/products/p970.png', pending: true,
    oem: 'CF-P-970', price: null, custom: false,
    name: { en: 'Heater Core · P970', es: 'Núcleo de calefacción · P970', ar: 'قلب تدفئة · P970' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p971', cat: 'evap', img: 'assets/products/p971.png', pending: true,
    oem: 'CF-P-971', price: null, custom: false,
    name: { en: 'Heater Core · P971', es: 'Núcleo de calefacción · P971', ar: 'قلب تدفئة · P971' },
    specs: { type: { en: 'Heater core', es: 'Núcleo de calefacción', ar: 'قلب تدفئة' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p972', cat: 'evap', img: 'assets/products/p972.png', pending: true,
    oem: 'CF-P-972', price: null, custom: false,
    name: { en: 'Evaporator Core · P972', es: 'Evaporador · P972', ar: 'مبخر · P972' },
    specs: { type: { en: 'Evaporator core', es: 'Núcleo evaporador', ar: 'قلب مبخر' },
      material: { en: 'Aluminum brazed', es: 'Aluminio soldado', ar: 'ألمنيوم ملحوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p973', cat: 'hose', img: 'assets/products/p973.png', pending: true,
    oem: 'CF-P-973', price: null, custom: false,
    name: { en: 'A/C Valve Core · P973', es: 'Válvula de carga · P973', ar: 'قلب صمام التكييف · P973' },
    specs: { type: { en: 'Valve core', es: 'Válvula de carga', ar: 'قلب صمام' },
      material: { en: 'Brass / aluminum', es: 'Latón / aluminio', ar: 'نحاس / ألمنيوم' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p974', cat: 'hose', img: 'assets/products/p974.png', pending: true,
    oem: 'CF-P-974', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P974', es: 'Manguera A/C · P974', ar: 'خرطوم تكييف · P974' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  },
  {
    id: 'p975', cat: 'hose', img: 'assets/products/p975.png', pending: true,
    oem: 'CF-P-975', price: null, custom: true,
    name: { en: 'A/C Hose Assembly · P975', es: 'Manguera A/C · P975', ar: 'خرطوم تكييف · P975' },
    specs: { type: { en: 'Hose assembly', es: 'Ensamblaje de manguera', ar: 'تجميعة خرطوم' },
      material: { en: 'Aluminum tube + rubber', es: 'Tubo aluminio + hule', ar: 'أنبوب ألمنيوم + مطاط' } },
    fit: { make: { en: 'Fitment data pending', es: 'Datos de adaptación pendientes', ar: 'بيانات الملاءمة قيد الإكمال' }, years: '—' }
  }
);

window.CF_CAT = {
  hose: { en: 'A/C Hose', es: 'Manguera A/C', ar: 'خرطوم التكييف' },
  evap: { en: 'Evaporator', es: 'Evaporador', ar: 'المبخر' },
  cond: { en: 'Condenser', es: 'Condensador', ar: 'المكثف' },
  exv: { en: 'Expansion Valve', es: 'Válvula de expansión', ar: 'صمام التمدد' },
  drier: { en: 'Receiver Drier', es: 'Secador receptor', ar: 'المجفف المستقبِل' }
};
