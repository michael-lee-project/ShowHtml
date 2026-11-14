/* CoolForge i18n · EN / ES / AR + RTL · persisted */
(function () {
  'use strict';
  const DICT = {
    en: {
      'fit.portrait': 'Portrait', 'fit.square': 'Square', 'fit.wide': 'Wide', 'car.prev': 'Previous product', 'car.next': 'Next product', 'car.pause': 'Pause carousel', 'car.play': 'Play carousel', 'hero.viewpart': 'View part',
      'nav.home': 'Home', 'nav.catalog': 'Catalog', 'nav.eras': 'Eras', 'nav.custom': 'Custom', 'nav.factory': 'Factory', 'nav.quote': 'Quote', 'nav.parts': 'Parts', 'nav.getquote': 'Get a quote', 'nav.menu': 'Menu',
      'hero.kicker': 'A/C parts factory', 'hero.h1a': 'Engineered cold.', 'hero.h1b': 'Built to fit.',
      'hero.sub': '> Factory-direct evaporators, condensers, valves, driers and custom hose assemblies. Every era of refrigerant. Every part leak-tested before it ships.',
      'hero.cta1': 'Get a quote', 'hero.cta2': 'Browse parts',
      'hero.stat1': 'Categories', 'hero.stat2': 'Quote reply', 'hero.stat3': 'Custom services',
      'hero.hud1a': 'SYS', 'hero.hud1b': 'BORE #6-#12', 'hero.hud2a': 'REF', 'hero.hud2b': 'TEST 100% PASS',
      'vid.live': 'Factory floor · live', 'vid.paused': 'Factory floor · paused', 'vid.still': 'Factory floor · still', 'vid.pause': 'Pause factory video', 'vid.play': 'Play factory video',
      'cat.kicker': 'Catalog', 'cat.h': 'Five core categories', 'cat.sub': '> Hundreds of SKUs across the A/C system. Search by OEM number or browse a category. Reference prices shown, final price confirmed by quote.',
      'cat.hose': 'A/C Hose', 'cat.hose.cnt': 'Custom specialist', 'cat.evap': 'Evaporator', 'cat.cond': 'Condenser', 'cat.exv': 'Expansion Valve', 'cat.drier': 'Receiver Drier', 'cat.ref': 'ref',
      'eras.kicker': 'Coverage', 'eras.h': 'Every refrigerant era', 'eras.sub': '> Refrigerant generations changed the parts. We tool for all three, so the vehicle on your lift is never too old or too new.',
      'eras.r12': 'Classic systems. Hard-to-find hoses and driers for vintage vehicles, still in our catalog.',
      'eras.r134': 'The volume era. Barrier hoses, evaporators and condensers for the largest parc on the road.',
      'eras.r1234': 'Modern low-GWP systems. Correct fittings and materials, not interchangeable with R-134a.',
      'custom.kicker': 'Custom', 'custom.h': 'Four ways to make it yours', 'custom.sub': '> Send a drawing, a sample, or just the vehicle. We model, prototype and produce under one roof.',
      'svc1.h': 'Vehicle fitment', 'svc1.p': 'Match by year, make, model or OEM number. We confirm fitment before you order.',
      'svc2.h': 'Size & fittings', 'svc2.p': 'Custom length, fitting type and bend angles to your drawing or sample.',
      'svc3.h': 'Private label', 'svc3.p': 'Your brand, your packaging, your part numbers on our production line.',
      'svc4.h': 'OEM / ODM', 'svc4.p': 'Build to print or sample. In-house modeling takes you from drawing to sample fast.',
      'fac.kicker': 'Factory', 'fac.h': "We don't resell. We forge.", 'fac.sub': '> Every hose cut, crimped, tested and packed under our own roof. No middlemen, no guesswork.',
      'fac.badge': 'Factory floor', 'fac.p1h': 'Cut & form', 'fac.p1p': 'Tube cut to length, bent to your angles.', 'fac.p2h': 'Crimp', 'fac.p2p': 'Fittings crimped to spec, seal verified.', 'fac.p3h': 'Leak test', 'fac.p3p': 'Every assembly pressure-tested.', 'fac.p4h': 'Pack & ship', 'fac.p4p': 'Labeled, protected, shipped to you.',
      'rfq.kicker': 'Contact', 'rfq.h': 'Get a quote', 'rfq.sub': '> We reply within 24 hours. Form, WhatsApp or email, whichever is fastest for you.',
      'f.qty': 'Quantity *', 'f.oem': 'Part / OEM number', 'f.veh': 'Vehicle (year / make / model)', 'f.name': 'Name *', 'f.email': 'Email *', 'f.company': 'Company', 'f.wa': 'WhatsApp', 'f.msg': 'Notes',
      'f.qty.ph': '50', 'f.oem.ph': 'GHP961J10', 'f.veh.ph': '2016 Toyota Camry', 'f.msg.ph': 'Fitting details, target price, delivery...',
      'rfq.submit': 'Send RFQ · reply in 24h', 'rfq.ok': '✓ RFQ_RECEIVED', 'rfq.okp': 'Our team will reply within 24h. For a faster response, continue on WhatsApp:', 'rfq.again': '↺ Send another request',
      'ch.wa': 'WhatsApp', 'ch.wa.p': 'Fastest reply · send photos and drawings', 'ch.mail.p': 'For formal RFQs and documentation', 'ch.24': '24-hour response', 'ch.24.p': 'Quotes confirmed within one business day', 'ch.geo': 'North America & Middle East', 'ch.geo.p': 'English · Español · العربية',
      'foot.tag': 'Factory-direct automotive A/C parts. Custom hoses our specialty.', 'foot.products': 'Products', 'foot.services': 'Services', 'foot.contact': 'Contact', 'foot.proto': 'REFERENCE PRICES ARE PLACEHOLDERS', 'foot.copy': '© 2026 COOLFORGE',
      /* product page */
      'pd.crumb.home': 'Home', 'pd.crumb.cat': 'Catalog', 'pd.kicker': 'Product detail',
      'pd.h1a': 'Find the part.', 'pd.h1b': 'Confirm the fit.',
      'pd.sub': '> Real OEM references, vehicle fitment and factory specs. Switch between our hose assemblies and evaporator cores below.',
      'pd.fitbar': 'Not sure it fits? Send your OEM number or vehicle and we confirm fitment within 24h.',
      'pd.refprice': 'Reference price', 'pd.refnote': 'Final price confirmed by quote', 'pd.request': 'Request quote', 'pd.customize': 'Customize this part',
      'pd.specs': 'Factory specifications', 'pd.fitment': 'Vehicle fitment', 'pd.related': 'Related parts', 'pd.zoom': 'Click image to zoom', 'pd.copy': 'Copy OEM', 'pd.copied': 'Copied',
      'pd.chip.tested': '100% leak-tested', 'pd.chip.custom': 'Custom available', 'pd.chip.stock': 'Factory direct',
      'spec.type': 'Type', 'spec.ref': 'Refrigerant', 'spec.core': 'Core size', 'spec.bore': 'Bore', 'spec.fitting': 'Fittings', 'spec.material': 'Material', 'spec.length': 'Length', 'spec.oem': 'OEM reference', 'spec.make': 'Make / model', 'spec.years': 'Years',
      /* factory page */
      'fp.crumb': 'Factory', 'fp.kicker': 'Inside the factory', 'fp.h1a': 'One roof.', 'fp.h1b': 'Every process.',
      'fp.sub': '> From raw tube to tested assembly. Watch the line, walk the process, and see the checks every part passes before it ships.',
      'fp.cap': 'Assembly line · live feed', 'fp.stat1': 'Assemblies / month', 'fp.stat2': 'Quote response', 'fp.stat3': 'Leak-test coverage', 'fp.stat4': 'Custom services', 'fp.statnote': 'Illustrative capacity · confirm on quote',
      'fp.proc.kicker': 'Process', 'fp.proc.h': 'Drawing to delivery', 'fp.proc.sub': '> Four controlled stages. Each one gauged, logged and signed off before the part moves on.',
      'fp.qc.kicker': 'Quality', 'fp.qc.h': 'Checked at every stage', 'fp.qc.sub': '> We show the actual checks, not certificates we do not hold.',
      'fp.qc1h': 'Incoming material', 'fp.qc1p': 'Tube and rubber verified against spec on arrival.', 'fp.qc2h': 'In-process gauging', 'fp.qc2p': 'Crimp dimensions and bend angles measured.', 'fp.qc3h': '100% leak test', 'fp.qc3p': 'Every assembly pressure-tested before packing.', 'fp.qc4h': 'Final audit', 'fp.qc4p': 'Fitment, labeling and packaging audited per order.',
      'fp.gal.kicker': 'Floor gallery', 'fp.gal.h': 'Where the work happens', 'fp.gal.ph': 'Placeholder · real media coming',
      'fp.g1': 'Workshop', 'fp.g2': 'Crimping', 'fp.g3': 'Leak test', 'fp.g4': 'Warehouse', 'fp.g5': 'QC lab', 'fp.g6': 'Packing',
      /* custom page */
      'cp.crumb': 'Custom', 'cp.kicker': 'Custom services', 'cp.h1a': 'Your drawing.', 'cp.h1b': 'Our line.',
      'cp.sub': '> Four ways to make a part yours. Send a drawing, a sample or just the vehicle, and we model, prototype and produce it.',
      'cp.flow.kicker': 'How it works', 'cp.flow.h': 'From request to production',
      'cp.fl1h': 'Send request', 'cp.fl1p': 'Drawing, sample or vehicle details.', 'cp.fl2h': 'Feasibility & quote', 'cp.fl2p': 'Engineering review within 24h.', 'cp.fl3h': 'Sample', 'cp.fl3p': 'Prototype built and confirmed.', 'cp.fl4h': 'Production', 'cp.fl4p': 'Batch run, tested and shipped.',
      'cp.form.h': 'Start a custom project', 'cp.form.sub': '> Tell us what you need. Attach a drawing or sample photo and we reply within 24h.',
      'cp.type': 'Custom type *', 'cp.type1': 'Vehicle fitment', 'cp.type2': 'Size & fittings', 'cp.type3': 'Private label', 'cp.type4': 'OEM / ODM (to print)',
      'cp.spec': 'Specifications', 'cp.spec.ph': 'e.g. #8 barrier hose, 1200mm, O-ring both ends, R-134a',
      'cp.upload': 'Attach drawing / sample photo', 'cp.upload.types': 'PDF · PNG · JPG · DWG · STEP · up to 10MB', 'cp.submit': 'Send custom RFQ · reply in 24h',
      'cp.faq.kicker': 'Questions', 'cp.faq.h': 'Before you send',
      'cp.faq1q': 'What is the minimum order?', 'cp.faq1a': 'Custom hose assemblies start at a practical batch quantity. Tell us your target volume in the RFQ and we quote MOQ with the price. Standard catalog parts have no minimum.',
      'cp.faq2q': 'How fast is a sample?', 'cp.faq2a': 'Once the drawing is confirmed, a prototype is typically built within days. Lead time is quoted with feasibility so you can plan.',
      'cp.faq3q': 'Can you match my existing part?', 'cp.faq3a': 'Yes. Send the OEM number, a photo or the physical sample. We cross-reference and confirm fitment before production.',
      'cp.faq4q': 'Do you keep my design confidential?', 'cp.faq4a': 'Your drawings and samples are used only to build your part. NDA available on request for OEM programs.',
      /* catalog page */
      'nav.contact': 'Contact',
      'cc.crumb': 'Catalog', 'cc.kicker': 'Full catalog', 'cc.h1a': 'Five lines.', 'cc.h1b': 'Hundreds of SKUs.',
      'cc.sub': '> Browse by category, or send your OEM number and we match the part within 24h. Reference prices shown; final price confirmed by quote.',
      'cc.por': 'Price on request',
      'cc.hose.p': 'Custom assemblies are our specialty — any length, fitting and bend angle, built to your drawing or sample and 100% leak-tested before they ship.',
      'cc.evap.p': 'Brazed aluminum cores for the cabin side — evaporators and heater cores. We tool new cores from your sample or core dimensions.',
      'cc.cond.p': 'Parallel-flow condensers for R-134a and R-1234yf systems, with integrated or separate receiver drier.',
      'cc.exv.p': 'Thermostatic expansion valves that meter refrigerant into the evaporator — block and flange types to application.',
      'cc.drier.p': 'Receiver driers for TXV systems: they filter debris, separate moisture and hold refrigerant reserve.',
      'cc.more.k': 'First batch in digitization',
      'cc.more.p': 'The first batch is several hundred SKUs. Fitment data (year / make / model / OEM) is imported from your list — send it over and we confirm coverage and reference prices.',
      /* contact page */
      'ct.crumb': 'Contact', 'ct.kicker': 'Contact', 'ct.h1a': 'Talk to the factory.', 'ct.h1b': 'Replies in 24h.',
      'ct.sub': '> Send the RFQ form, WhatsApp or email — whichever is fastest. Quotes confirmed within one business day.',
      'ct.promise.h': 'Response promise', 'ct.promise.p': 'Every RFQ receives an engineering reply within one business day — including fitment confirmation.'
    },
    es: {
      'fit.portrait': 'Vertical', 'fit.square': 'Cuadrado', 'fit.wide': 'Ancho', 'car.prev': 'Producto anterior', 'car.next': 'Producto siguiente', 'car.pause': 'Pausar carrusel', 'car.play': 'Reproducir carrusel', 'hero.viewpart': 'Ver parte',
      'nav.home': 'Inicio', 'nav.catalog': 'Catálogo', 'nav.eras': 'Eras', 'nav.custom': 'A medida', 'nav.factory': 'Fábrica', 'nav.quote': 'Cotizar', 'nav.parts': 'Partes', 'nav.getquote': 'Cotizar', 'nav.menu': 'Menú',
      'hero.kicker': 'Fábrica de partes A/C', 'hero.h1a': 'Frío de ingeniería.', 'hero.h1b': 'Hecho a medida.',
      'hero.sub': '> Evaporadores, condensadores, válvulas, secadores y mangueras a medida, directo de fábrica. Cada era de refrigerante. Cada parte probada antes de enviar.',
      'hero.cta1': 'Cotizar', 'hero.cta2': 'Ver partes',
      'hero.stat1': 'Categorías', 'hero.stat2': 'Respuesta', 'hero.stat3': 'Servicios a medida',
      'hero.hud1a': 'SIS', 'hero.hud1b': 'CAL #6-#12', 'hero.hud2a': 'REF', 'hero.hud2b': 'PRUEBA 100% OK',
      'vid.live': 'Planta · en vivo', 'vid.paused': 'Planta · pausado', 'vid.still': 'Planta · imagen', 'vid.pause': 'Pausar video', 'vid.play': 'Reproducir video',
      'cat.kicker': 'Catálogo', 'cat.h': 'Cinco categorías', 'cat.sub': '> Cientos de SKUs del sistema A/C. Busque por número OEM o explore una categoría. Precios de referencia; el final se confirma por cotización.',
      'cat.hose': 'Manguera A/C', 'cat.hose.cnt': 'Especialista a medida', 'cat.evap': 'Evaporador', 'cat.cond': 'Condensador', 'cat.exv': 'Válvula de expansión', 'cat.drier': 'Secador receptor', 'cat.ref': 'ref',
      'eras.kicker': 'Cobertura', 'eras.h': 'Cada era de refrigerante', 'eras.sub': '> Las generaciones de refrigerante cambiaron las partes. Fabricamos para las tres, para que ningún vehículo quede fuera.',
      'eras.r12': 'Sistemas clásicos. Mangueras y secadores difíciles de encontrar para vehículos antiguos, aún en catálogo.',
      'eras.r134': 'La era de volumen. Mangueras barrier, evaporadores y condensadores para el mayor parque rodante.',
      'eras.r1234': 'Sistemas modernos de bajo GWP. Conexiones y materiales correctos, no intercambiables con R-134a.',
      'custom.kicker': 'A medida', 'custom.h': 'Cuatro formas de hacerlo suyo', 'custom.sub': '> Envíe un plano, una muestra o solo el vehículo. Modelamos, prototipamos y producimos bajo un mismo techo.',
      'svc1.h': 'Adaptación por vehículo', 'svc1.p': 'Por año, marca, modelo o número OEM. Confirmamos la adaptación antes de ordenar.',
      'svc2.h': 'Medidas y conexiones', 'svc2.p': 'Largo, tipo de conexión y ángulos a su plano o muestra.',
      'svc3.h': 'Marca propia', 'svc3.p': 'Su marca, su empaque, sus números de parte en nuestra línea.',
      'svc4.h': 'OEM / ODM', 'svc4.p': 'Fabricación por plano o muestra. Modelado interno del plano a la muestra rápido.',
      'fac.kicker': 'Fábrica', 'fac.h': 'No revendemos. Forjamos.', 'fac.sub': '> Cada manguera cortada, engastada, probada y empacada bajo nuestro techo. Sin intermediarios.',
      'fac.badge': 'Planta', 'fac.p1h': 'Cortar y formar', 'fac.p1p': 'Tubo cortado a largo, doblado a sus ángulos.', 'fac.p2h': 'Engastar', 'fac.p2p': 'Conexiones engastadas a especificación.', 'fac.p3h': 'Prueba de fugas', 'fac.p3p': 'Cada ensamblaje probado a presión.', 'fac.p4h': 'Empacar y enviar', 'fac.p4p': 'Etiquetado, protegido y enviado.',
      'rfq.kicker': 'Contacto', 'rfq.h': 'Cotizar', 'rfq.sub': '> Respondemos en 24 horas. Formulario, WhatsApp o correo, lo que sea más rápido.',
      'f.qty': 'Cantidad *', 'f.oem': 'Parte / número OEM', 'f.veh': 'Vehículo (año / marca / modelo)', 'f.name': 'Nombre *', 'f.email': 'Correo *', 'f.company': 'Empresa', 'f.wa': 'WhatsApp', 'f.msg': 'Notas',
      'f.qty.ph': '50', 'f.oem.ph': 'GHP961J10', 'f.veh.ph': 'Toyota Camry 2016', 'f.msg.ph': 'Detalles de conexión, precio objetivo, entrega...',
      'rfq.submit': 'Enviar RFQ · respuesta 24h', 'rfq.ok': '✓ RFQ_RECIBIDA', 'rfq.okp': 'Nuestro equipo responde en 24h. Para ir más rápido, continúe por WhatsApp:', 'rfq.again': '↺ Enviar otra solicitud',
      'ch.wa': 'WhatsApp', 'ch.wa.p': 'Respuesta rápida · envíe fotos y planos', 'ch.mail.p': 'Para RFQ formales y documentación', 'ch.24': 'Respuesta en 24 horas', 'ch.24.p': 'Cotizaciones en un día hábil', 'ch.geo': 'Norteamérica y Medio Oriente', 'ch.geo.p': 'English · Español · العربية',
      'foot.tag': 'Partes A/C automotrices directo de fábrica. Mangueras a medida nuestra especialidad.', 'foot.products': 'Productos', 'foot.services': 'Servicios', 'foot.contact': 'Contacto', 'foot.proto': 'PRECIOS DE REFERENCIA SON MARCADORES', 'foot.copy': '© 2026 COOLFORGE',
      'pd.crumb.home': 'Inicio', 'pd.crumb.cat': 'Catálogo', 'pd.kicker': 'Detalle de producto',
      'pd.h1a': 'Encuentre la parte.', 'pd.h1b': 'Confirme el ajuste.',
      'pd.sub': '> Referencias OEM reales, adaptación por vehículo y especificaciones de fábrica. Cambie entre mangueras y evaporadores abajo.',
      'pd.fitbar': '¿No está seguro? Envíe su número OEM o vehículo y confirmamos la adaptación en 24h.',
      'pd.refprice': 'Precio de referencia', 'pd.refnote': 'Precio final confirmado por cotización', 'pd.request': 'Solicitar cotización', 'pd.customize': 'Personalizar esta parte',
      'pd.specs': 'Especificaciones de fábrica', 'pd.fitment': 'Adaptación por vehículo', 'pd.related': 'Partes relacionadas', 'pd.zoom': 'Clic para ampliar', 'pd.copy': 'Copiar OEM', 'pd.copied': 'Copiado',
      'pd.chip.tested': 'Probado 100%', 'pd.chip.custom': 'Personalizable', 'pd.chip.stock': 'Directo de fábrica',
      'spec.type': 'Tipo', 'spec.ref': 'Refrigerante', 'spec.core': 'Núcleo', 'spec.bore': 'Calibre', 'spec.fitting': 'Conexiones', 'spec.material': 'Material', 'spec.length': 'Largo', 'spec.oem': 'Referencia OEM', 'spec.make': 'Marca / modelo', 'spec.years': 'Años',
      'fp.crumb': 'Fábrica', 'fp.kicker': 'Dentro de la fábrica', 'fp.h1a': 'Un techo.', 'fp.h1b': 'Cada proceso.',
      'fp.sub': '> Del tubo crudo al ensamblaje probado. Vea la línea, recorra el proceso y las verificaciones de cada parte.',
      'fp.cap': 'Línea de ensamblaje · en vivo', 'fp.stat1': 'Ensamblajes / mes', 'fp.stat2': 'Respuesta', 'fp.stat3': 'Prueba de fugas', 'fp.stat4': 'Servicios a medida', 'fp.statnote': 'Capacidad ilustrativa · confirmar al cotizar',
      'fp.proc.kicker': 'Proceso', 'fp.proc.h': 'Del plano a la entrega', 'fp.proc.sub': '> Cuatro etapas controladas. Cada una medida, registrada y aprobada.',
      'fp.qc.kicker': 'Calidad', 'fp.qc.h': 'Verificado en cada etapa', 'fp.qc.sub': '> Mostramos las verificaciones reales, no certificados que no tenemos.',
      'fp.qc1h': 'Material entrante', 'fp.qc1p': 'Tubo y hule verificados contra especificación.', 'fp.qc2h': 'Medición en proceso', 'fp.qc2p': 'Dimensiones de engaste y ángulos medidos.', 'fp.qc3h': 'Prueba 100%', 'fp.qc3p': 'Cada ensamblaje probado antes de empacar.', 'fp.qc4h': 'Auditoría final', 'fp.qc4p': 'Ajuste, etiquetado y empaque auditados.',
      'fp.gal.kicker': 'Galería', 'fp.gal.h': 'Donde ocurre el trabajo', 'fp.gal.ph': 'Marcador · medios reales pronto',
      'fp.g1': 'Taller', 'fp.g2': 'Engaste', 'fp.g3': 'Prueba', 'fp.g4': 'Almacén', 'fp.g5': 'Laboratorio', 'fp.g6': 'Empaque',
      'cp.crumb': 'A medida', 'cp.kicker': 'Servicios a medida', 'cp.h1a': 'Su plano.', 'cp.h1b': 'Nuestra línea.',
      'cp.sub': '> Cuatro formas de hacer suya una parte. Envíe plano, muestra o vehículo; modelamos, prototipamos y producimos.',
      'cp.flow.kicker': 'Cómo funciona', 'cp.flow.h': 'De la solicitud a producción',
      'cp.fl1h': 'Enviar solicitud', 'cp.fl1p': 'Plano, muestra o datos del vehículo.', 'cp.fl2h': 'Factibilidad y cotización', 'cp.fl2p': 'Revisión de ingeniería en 24h.', 'cp.fl3h': 'Muestra', 'cp.fl3p': 'Prototipo construido y confirmado.', 'cp.fl4h': 'Producción', 'cp.fl4p': 'Lote corrido, probado y enviado.',
      'cp.form.h': 'Iniciar proyecto a medida', 'cp.form.sub': '> Díganos qué necesita. Adjunte plano o foto y respondemos en 24h.',
      'cp.type': 'Tipo *', 'cp.type1': 'Adaptación', 'cp.type2': 'Medidas y conexiones', 'cp.type3': 'Marca propia', 'cp.type4': 'OEM / ODM (por plano)',
      'cp.spec': 'Especificaciones', 'cp.spec.ph': 'ej. manguera #8, 1200mm, O-ring ambos extremos, R-134a',
      'cp.upload': 'Adjuntar plano / foto de muestra', 'cp.upload.types': 'PDF · PNG · JPG · DWG · STEP · hasta 10MB', 'cp.submit': 'Enviar RFQ a medida · respuesta 24h',
      'cp.faq.kicker': 'Preguntas', 'cp.faq.h': 'Antes de enviar',
      'cp.faq1q': '¿Cuál es el pedido mínimo?', 'cp.faq1a': 'Los ensamblajes a medida parten de un lote práctico. Indique su volumen en la RFQ y cotizamos el MOQ con el precio. Las partes de catálogo no tienen mínimo.',
      'cp.faq2q': '¿Qué tan rápida es una muestra?', 'cp.faq2a': 'Confirmado el plano, el prototipo se construye en días. El plazo se cotiza con la factibilidad.',
      'cp.faq3q': '¿Pueden igualar mi parte existente?', 'cp.faq3a': 'Sí. Envíe el número OEM, una foto o la muestra física. Cruzamos la referencia y confirmamos antes de producir.',
      'cp.faq4q': '¿Mi diseño es confidencial?', 'cp.faq4a': 'Sus planos y muestras se usan solo para fabricar su parte. NDA disponible para programas OEM.',
      /* catalog page */
      'nav.contact': 'Contacto',
      'cc.crumb': 'Catálogo', 'cc.kicker': 'Catálogo completo', 'cc.h1a': 'Cinco líneas.', 'cc.h1b': 'Cientos de SKUs.',
      'cc.sub': '> Explore por categoría o envíe su número OEM y hacemos la correspondencia en 24h. Precios de referencia; el final se confirma por cotización.',
      'cc.por': 'Precio a solicitar',
      'cc.hose.p': 'Los ensamblajes a medida son nuestra especialidad: cualquier largo, conexión y ángulo, fabricados por su plano o muestra y probados 100% antes de enviar.',
      'cc.evap.p': 'Núcleos de aluminio soldado para el lado de la cabina: evaporadores y núcleos de calefacción. Herramentamos núcleos nuevos desde su muestra o dimensiones.',
      'cc.cond.p': 'Condensadores de flujo paralelo para sistemas R-134a y R-1234yf, con secador integrado o separado.',
      'cc.exv.p': 'Válvulas de expansión termostáticas que dosifican el refrigerante hacia el evaporador: tipo bloque y brida según aplicación.',
      'cc.drier.p': 'Secadores receptores para sistemas TXV: filtran residuos, separan humedad y guardan reserva de refrigerante.',
      'cc.more.k': 'Primera tanda en digitalización',
      'cc.more.p': 'La primera tanda son varios cientos de SKUs. Los datos de adaptación (año / marca / modelo / OEM) se importan de su lista — envíela y confirmamos cobertura y precios de referencia.',
      /* contact page */
      'ct.crumb': 'Contacto', 'ct.kicker': 'Contacto', 'ct.h1a': 'Hable con la fábrica.', 'ct.h1b': 'Respuesta en 24h.',
      'ct.sub': '> Envíe el formulario, WhatsApp o correo, lo que sea más rápido. Cotizaciones confirmadas en un día hábil.',
      'ct.promise.h': 'Compromiso de respuesta', 'ct.promise.p': 'Cada RFQ recibe respuesta de ingeniería en un día hábil, con confirmación de adaptación.'
    },
    ar: {
      'fit.portrait': 'طولي', 'fit.square': 'مربع', 'fit.wide': 'عرضي', 'car.prev': 'المنتج السابق', 'car.next': 'المنتج التالي', 'car.pause': 'إيقاف العرض', 'car.play': 'تشغيل العرض', 'hero.viewpart': 'عرض القطعة',
      'nav.home': 'الرئيسية', 'nav.catalog': 'الكتالوج', 'nav.eras': 'الحقب', 'nav.custom': 'تخصيص', 'nav.factory': 'المصنع', 'nav.quote': 'عرض سعر', 'nav.parts': 'القطع', 'nav.getquote': 'طلب عرض سعر', 'nav.menu': 'القائمة',
      'hero.kicker': 'مصنع قطع التكييف', 'hero.h1a': 'برودة بهندسة.', 'hero.h1b': 'مصنوعة لتناسب.',
      'hero.sub': '> مبخرات ومكثفات وصمامات ومجففات وخراطيم مخصصة مباشرة من المصنع. كل حقبة وسيط تبريد. كل قطعة تُختبر قبل الشحن.',
      'hero.cta1': 'طلب عرض سعر', 'hero.cta2': 'تصفح القطع',
      'hero.stat1': 'الفئات', 'hero.stat2': 'رد على العرض', 'hero.stat3': 'خدمات التخصيص',
      'hero.hud1a': 'النظام', 'hero.hud1b': 'القطر #6-#12', 'hero.hud2a': 'المرجع', 'hero.hud2b': 'اختبار 100% ناجح',
      'vid.live': 'أرض المصنع · مباشر', 'vid.paused': 'أرض المصنع · متوقف', 'vid.still': 'أرض المصنع · صورة', 'vid.pause': 'إيقاف الفيديو', 'vid.play': 'تشغيل الفيديو',
      'cat.kicker': 'الكتالوج', 'cat.h': 'خمس فئات رئيسية', 'cat.sub': '> مئات المنتجات عبر نظام التكييف. ابحث برقم OEM أو تصفح فئة. الأسعار مرجعية ويُؤكد النهائي عبر عرض السعر.',
      'cat.hose': 'خرطوم التكييف', 'cat.hose.cnt': 'تخصص التخصيص', 'cat.evap': 'المبخر', 'cat.cond': 'المكثف', 'cat.exv': 'صمام التمدد', 'cat.drier': 'المجفف المستقبِل', 'cat.ref': 'مرجعي',
      'eras.kicker': 'التغطية', 'eras.h': 'كل حقبة تبريد', 'eras.sub': '> غيّرت أجيال وسائط التبريد القطع. نصنّع للأجيال الثلاثة فلا تكون مركبتك قديمة أو حديثة جداً.',
      'eras.r12': 'أنظمة كلاسيكية. خراطيم ومجففات يصعب إيجادها للمركبات القديمة، ما زالت في كتالوجنا.',
      'eras.r134': 'حقبة الكم. خراطيم حاجزة ومبخرات ومكثفات لأكبر أسطول على الطريق.',
      'eras.r1234': 'أنظمة حديثة منخفضة الاحترار. وصلات ومواد صحيحة، غير قابلة للتبديل مع R-134a.',
      'custom.kicker': 'تخصيص', 'custom.h': 'أربع طرق لجعلها لك', 'custom.sub': '> أرسل رسماً أو عينة أو المركبة فقط. نصمّم وننمذج وننتج تحت سقف واحد.',
      'svc1.h': 'ملاءمة المركبة', 'svc1.p': 'حسب السنة والصنع والطراز أو رقم OEM. نؤكد الملاءمة قبل الطلب.',
      'svc2.h': 'المقاسات والوصلات', 'svc2.p': 'طول ونوع وصلة وزوايا حسب رسمك أو عينتك.',
      'svc3.h': 'علامتك الخاصة', 'svc3.p': 'علامتك وتعبئتك وأرقام قطعك على خط إنتاجنا.',
      'svc4.h': 'OEM / ODM', 'svc4.p': 'تصنيع حسب الرسم أو العينة. نمذجة داخلية من الرسم إلى العينة بسرعة.',
      'fac.kicker': 'المصنع', 'fac.h': 'لا نعيد البيع. نصنّع.', 'fac.sub': '> كل خرطوم يُقطع ويُكبس ويُختبر ويُعبأ تحت سقفنا. بلا وسطاء ولا تخمين.',
      'fac.badge': 'أرض المصنع', 'fac.p1h': 'القطع والتشكيل', 'fac.p1p': 'أنبوب يُقطع للطول ويُثنى لزواياك.', 'fac.p2h': 'الكبس', 'fac.p2p': 'وصلات تُكبس حسب المواصفة.', 'fac.p3h': 'اختبار التسرب', 'fac.p3p': 'كل تجميعة تُختبر بالضغط.', 'fac.p4h': 'التعبئة والشحن', 'fac.p4p': 'مُوسَمة ومحمية وتُشحن إليك.',
      'rfq.kicker': 'تواصل', 'rfq.h': 'طلب عرض سعر', 'rfq.sub': '> نرد خلال 24 ساعة. النموذج أو واتساب أو البريد، الأسرع لك.',
      'f.qty': 'الكمية *', 'f.oem': 'القطعة / رقم OEM', 'f.veh': 'المركبة (السنة / الصنع / الطراز)', 'f.name': 'الاسم *', 'f.email': 'البريد *', 'f.company': 'الشركة', 'f.wa': 'واتساب', 'f.msg': 'ملاحظات',
      'f.qty.ph': '50', 'f.oem.ph': 'GHP961J10', 'f.veh.ph': 'تويوتا كامري 2016', 'f.msg.ph': 'تفاصيل الوصلة، السعر المستهدف، التسليم...',
      'rfq.submit': 'إرسال الطلب · رد خلال 24 ساعة', 'rfq.ok': '✓ تم استلام الطلب', 'rfq.okp': 'يرد فريقنا خلال 24 ساعة. لرد أسرع تابع عبر واتساب:', 'rfq.again': '↺ إرسال طلب آخر',
      'ch.wa': 'واتساب', 'ch.wa.p': 'أسرع رد · أرسل الصور والرسومات', 'ch.mail.p': 'لطلبات العروض الرسمية والتوثيق', 'ch.24': 'رد خلال 24 ساعة', 'ch.24.p': 'تُؤكد العروض خلال يوم عمل', 'ch.geo': 'أمريكا الشمالية والشرق الأوسط', 'ch.geo.p': 'English · Español · العربية',
      'foot.tag': 'قطع تكييف سيارات مباشرة من المصنع. الخراطيم المخصصة تخصصنا.', 'foot.products': 'المنتجات', 'foot.services': 'الخدمات', 'foot.contact': 'تواصل', 'foot.proto': 'الأسعار المرجعية عناصر نائبة', 'foot.copy': '© 2026 COOLFORGE',
      'pd.crumb.home': 'الرئيسية', 'pd.crumb.cat': 'الكتالوج', 'pd.kicker': 'تفاصيل المنتج',
      'pd.h1a': 'اعثر على القطعة.', 'pd.h1b': 'أكّد الملاءمة.',
      'pd.sub': '> مراجع OEM حقيقية وملاءمة مركبات ومواصفات مصنع. بدّل بين الخراطيم والمبخرات أدناه.',
      'pd.fitbar': 'غير متأكد؟ أرسل رقم OEM أو المركبة ونؤكد الملاءمة خلال 24 ساعة.',
      'pd.refprice': 'سعر مرجعي', 'pd.refnote': 'السعر النهائي يُؤكد عبر العرض', 'pd.request': 'طلب عرض سعر', 'pd.customize': 'تخصيص هذه القطعة',
      'pd.specs': 'مواصفات المصنع', 'pd.fitment': 'ملاءمة المركبة', 'pd.related': 'قطع ذات صلة', 'pd.zoom': 'انقر للتكبير', 'pd.copy': 'نسخ OEM', 'pd.copied': 'تم النسخ',
      'pd.chip.tested': 'مختبرة 100%', 'pd.chip.custom': 'قابل للتخصيص', 'pd.chip.stock': 'مباشرة من المصنع',
      'spec.type': 'النوع', 'spec.ref': 'وسيط التبريد', 'spec.core': 'حجم القلب', 'spec.bore': 'القطر', 'spec.fitting': 'الوصلات', 'spec.material': 'المادة', 'spec.length': 'الطول', 'spec.oem': 'مرجع OEM', 'spec.make': 'الصنع / الطراز', 'spec.years': 'السنوات',
      'fp.crumb': 'المصنع', 'fp.kicker': 'داخل المصنع', 'fp.h1a': 'سقف واحد.', 'fp.h1b': 'كل العمليات.',
      'fp.sub': '> من الأنبوب الخام إلى التجميعة المختبرة. شاهد الخط وتعرّف على العملية والفحوصات التي تمر بها كل قطعة.',
      'fp.cap': 'خط التجميع · بث مباشر', 'fp.stat1': 'تجميعة / شهر', 'fp.stat2': 'رد على العرض', 'fp.stat3': 'تغطية الاختبار', 'fp.stat4': 'خدمات التخصيص', 'fp.statnote': 'سعة توضيحية · تُؤكد عند العرض',
      'fp.proc.kicker': 'العملية', 'fp.proc.h': 'من الرسم إلى التسليم', 'fp.proc.sub': '> أربع مراحل مضبوطة. كل واحدة تُقاس وتُسجّل وتُعتمد قبل الانتقال.',
      'fp.qc.kicker': 'الجودة', 'fp.qc.h': 'فحص في كل مرحلة', 'fp.qc.sub': '> نعرض الفحوصات الفعلية لا شهادات لا نملكها.',
      'fp.qc1h': 'المواد الواردة', 'fp.qc1p': 'الأنبوب والمطاط يُفحصان حسب المواصفة.', 'fp.qc2h': 'القياس أثناء العملية', 'fp.qc2p': 'أبعاد الكبس وزوايا الثني تُقاس.', 'fp.qc3h': 'اختبار 100%', 'fp.qc3p': 'كل تجميعة تُختبر قبل التعبئة.', 'fp.qc4h': 'التدقيق النهائي', 'fp.qc4p': 'الملاءمة والوسم والتعبئة تُدقق لكل طلب.',
      'fp.gal.kicker': 'معرض الأرضية', 'fp.gal.h': 'حيث يحدث العمل', 'fp.gal.ph': 'عنصر نائب · الوسائط الحقيقية قريباً',
      'fp.g1': 'الورشة', 'fp.g2': 'الكبس', 'fp.g3': 'الاختبار', 'fp.g4': 'المستودع', 'fp.g5': 'مختبر الجودة', 'fp.g6': 'التعبئة',
      'cp.crumb': 'تخصيص', 'cp.kicker': 'خدمات التخصيص', 'cp.h1a': 'رسمك.', 'cp.h1b': 'خطّنا.',
      'cp.sub': '> أربع طرق لجعل القطعة لك. أرسل رسماً أو عينة أو المركبة، ونصمّم وننمذج وننتج.',
      'cp.flow.kicker': 'كيف يعمل', 'cp.flow.h': 'من الطلب إلى الإنتاج',
      'cp.fl1h': 'أرسل الطلب', 'cp.fl1p': 'رسم أو عينة أو بيانات المركبة.', 'cp.fl2h': 'الجدوى والعرض', 'cp.fl2p': 'مراجعة هندسية خلال 24 ساعة.', 'cp.fl3h': 'العينة', 'cp.fl3p': 'نموذج يُبنى ويُؤكد.', 'cp.fl4h': 'الإنتاج', 'cp.fl4p': 'دفعة تُنتج وتُختبر وتُشحن.',
      'cp.form.h': 'ابدأ مشروعاً مخصصاً', 'cp.form.sub': '> أخبرنا بما تحتاج. أرفق رسماً أو صورة عينة ونرد خلال 24 ساعة.',
      'cp.type': 'نوع التخصيص *', 'cp.type1': 'ملاءمة المركبة', 'cp.type2': 'المقاسات والوصلات', 'cp.type3': 'علامتك الخاصة', 'cp.type4': 'OEM / ODM (حسب الرسم)',
      'cp.spec': 'المواصفات', 'cp.spec.ph': 'مثال: خرطوم #8، 1200مم، O-ring بالطرفين، R-134a',
      'cp.upload': 'إرفاق رسم / صورة عينة', 'cp.upload.types': 'PDF · PNG · JPG · DWG · STEP · حتى 10MB', 'cp.submit': 'إرسال طلب مخصص · رد خلال 24 ساعة',
      'cp.faq.kicker': 'أسئلة', 'cp.faq.h': 'قبل أن ترسل',
      'cp.faq1q': 'ما الحد الأدنى للطلب؟', 'cp.faq1a': 'تبدأ الخراطيم المخصصة بكمية دفعة عملية. أخبرنا بحجمك المستهدف في الطلب ونعرض الحد الأدنى مع السعر. قطع الكتالوج بلا حد أدنى.',
      'cp.faq2q': 'ما سرعة العينة؟', 'cp.faq2a': 'بعد تأكيد الرسم يُبنى النموذج عادة خلال أيام. تُعرض المهلة مع الجدوى لتخطط.',
      'cp.faq3q': 'هل يمكن مطابقة قطعتي الحالية؟', 'cp.faq3a': 'نعم. أرسل رقم OEM أو صورة أو العينة الفعلية. نقارن المرجع ونؤكد الملاءمة قبل الإنتاج.',
      'cp.faq4q': 'هل تصميمي سري؟', 'cp.faq4a': 'رسوماتك وعيناتك تُستخدم فقط لصنع قطعتك. اتفاقية سرية متاحة لبرامج OEM.',
      /* catalog page */
      'nav.contact': 'تواصل',
      'cc.crumb': 'الكتالوج', 'cc.kicker': 'الكتالوج الكامل', 'cc.h1a': 'خمس خطوط إنتاج.', 'cc.h1b': 'مئات المنتجات.',
      'cc.sub': '> تصفح حسب الفئة أو أرسل رقم OEM ونطابق القطعة خلال 24 ساعة. الأسعار مرجعية ويُؤكد النهائي عبر عرض السعر.',
      'cc.por': 'السعر عند الطلب',
      'cc.hose.p': 'التجميعات المخصصة تخصصنا — أي طول وأي وصلة وأي زاوية ثني، تُصنع حسب رسمك أو عينتك وتُختبر 100% قبل الشحن.',
      'cc.evap.p': 'قلوب ألمنيوم ملحومة لجهة المقصورة — مبخرات وقلوب تدفئة. نصنع قلوباً جديدة من عينتك أو مقاساتك.',
      'cc.cond.p': 'مكثفات تدفق متوازٍ لأنظمة R-134a و R-1234yf، مع مجفف مدمج أو منفصل.',
      'cc.exv.p': 'صمامات تمدد حرارية تضبط تدفق وسيط التبريد إلى المبخر — نوع كتلة ونوع شفة حسب التطبيق.',
      'cc.drier.p': 'مجففات مستقبِلة لأنظمة TXV: تُرشّح الشوائب وتفصل الرطوبة وتحتفظ باحتياطي وسيط التبريد.',
      'cc.more.k': 'الدفعة الأولى قيد الرقمنة',
      'cc.more.p': 'الدفعة الأولى عدة مئات من المنتجات. بيانات الملاءمة (سنة / صنع / طراز / OEM) تُستورد من قائمتك — أرسلها ونؤكد التغطية والأسعار المرجعية.',
      /* contact page */
      'ct.crumb': 'تواصل', 'ct.kicker': 'تواصل', 'ct.h1a': 'تحدث مع المصنع.', 'ct.h1b': 'رد خلال 24 ساعة.',
      'ct.sub': '> أرسل النموذج أو واتساب أو البريد، الأسرع لك. تُؤكد العروض خلال يوم عمل.',
      'ct.promise.h': 'وعد الاستجابة', 'ct.promise.p': 'كل طلب يصل إليه رد هندسي خلال يوم عمل، مع تأكيد الملاءمة.'
    }
  };

  const LANGS = ['en', 'es', 'ar'];
  const get = () => localStorage.getItem('cf-lang') || 'en';
  const t = (key) => (DICT[get()] && DICT[get()][key]) || DICT.en[key] || key;
  window.CF = { t, lang: get, DICT };

  function apply(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = (DICT[lang] && DICT[lang][el.dataset.i18n]) || DICT.en[el.dataset.i18n];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = (DICT[lang] && DICT[lang][el.dataset.i18nPh]) || DICT.en[el.dataset.i18nPh];
      if (v != null) el.placeholder = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = (DICT[lang] && DICT[lang][el.dataset.i18nAria]) || DICT.en[el.dataset.i18nAria];
      if (v != null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('.lang-sw button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
    document.dispatchEvent(new CustomEvent('cf:lang', { detail: { lang } }));
  }

  function mountSwitcher() {
    document.querySelectorAll('[data-lang-slot]').forEach(slot => {
      const sw = document.createElement('div');
      sw.className = 'lang-sw';
      sw.setAttribute('role', 'group');
      sw.setAttribute('aria-label', 'Language');
      sw.innerHTML = LANGS.map(l => `<button type="button" data-lang="${l}" ${l === get() ? 'class="on"' : ''}>${l === 'ar' ? 'ع' : l.toUpperCase()}</button>`).join('');
      sw.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        localStorage.setItem('cf-lang', b.dataset.lang);
        apply(b.dataset.lang);
      }));
      slot.replaceWith(sw);
    });
  }

  document.addEventListener('DOMContentLoaded', () => { mountSwitcher(); apply(get()); });
})();
