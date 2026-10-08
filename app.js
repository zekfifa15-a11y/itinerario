/* İstanbul · A dois — v6 · offline travel companion
   Data: window.TRIP (data.js). Map: MapLibre GL + PMTiles (OpenMapTiles/OpenFreeMap, © OpenStreetMap). */
'use strict';
const TRIP = window.TRIP;
const VERSION = '6.0.0';
const STORE = 'ist-a-dois-v6';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- i18n ---------------- */
const I = {
  tabRoteiro: ['Roteiro', 'Itinerary', 'Plan'], tabMapa: ['Mapa', 'Map', 'Harita'], tabLugares: ['Lugares', 'Places', 'Yerler'], tabIntervalo: ['80 min', '80 min', '80 dk'], tabGuia: ['Guia', 'Guide', 'Rehber'],
  online: ['Online', 'Online', 'Çevrimiçi'], offline: ['Offline', 'Offline', 'Çevrimdışı'], offReady: ['Mapa offline ✓', 'Offline map ✓', 'Harita hazır ✓'], noNetReady: ['Sem rede ✓', 'No signal ✓', 'Bağlantı yok ✓'], mapDl: ['Mapa', 'Map', 'Harita'],
  day: ['Dia', 'Day', 'Gün'], extra: ['Extra', 'Extra', 'Ekstra'], arrivalDay: ['Chegada', 'Arrival', 'Varış'], departureDay: ['Volta', 'Return', 'Dönüş'],
  stops: ['paradas', 'stops', 'durak'], done: ['concluídos', 'done', 'tamam'], doneT: ['Concluídos', 'Completed', 'Tamamlananlar'], trash: ['Lixeira', 'Trash', 'Çöp kutusu'],
  leave: ['Saída do Airbnb', 'Leave the Airbnb', 'Airbnb’den çıkış'], back: ['De volta ao Airbnb', 'Back at the Airbnb', 'Airbnb’ye dönüş'],
  backLbl: ['Volta para casa', 'Return home', 'Eve dönüş'], approx: ['estimado', 'estimated', 'tahmini'],
  next: ['Próxima', 'Next', 'Sıradaki'], conclude: ['Concluir', 'Done', 'Tamam'], undo: ['Desfazer', 'Undo', 'Geri al'], restore: ['Restaurar', 'Restore', 'Geri yükle'],
  mapBtn: ['Mapa', 'Map', 'Harita'], go: ['Ir agora', 'Go now', 'Şimdi git'], details: ['Detalhes', 'Details', 'Ayrıntılar'], less: ['Fechar', 'Close', 'Kapat'],
  movedDone: ['Movido para Concluídos', 'Moved to Completed', 'Tamamlananlara taşındı'], movedBack: ['Voltou para o roteiro', 'Back in the plan', 'Plana geri döndü'],
  trashed: ['Movido para a lixeira', 'Moved to trash', 'Çöp kutusuna taşındı'], restored: ['Restaurado', 'Restored', 'Geri yüklendi'],
  toTrash: ['Lixeira', 'Trash', 'Çöp'], openGoogle: ['Google Maps', 'Google Maps', 'Google Maps'], source: ['Fonte', 'Source', 'Kaynak'],
  hours: ['Horário', 'Hours', 'Saatler'], price: ['Preço', 'Price', 'Fiyat'], ticket: ['Entrada', 'Entry', 'Giriş'], booking: ['Reserva', 'Booking', 'Rezervasyon'], stay: ['Tempo no local', 'Time there', 'Kalış'],
  minutes: ['min', 'min', 'dk'], walk: ['A pé', 'Walk', 'Yürüyüş'], transit: ['Transporte', 'Transit', 'Toplu taşıma'],
  tram: ['Bonde', 'Tram', 'Tramvay'], metro: ['Metrô', 'Metro', 'Metro'], ferry: ['Balsa', 'Ferry', 'Vapur'], bus: ['Ônibus', 'Bus', 'Otobüs'], funicular: ['Funicular', 'Funicular', 'Füniküler'],
  towards: ['sentido', 'towards', 'yönü'], stopsN: ['paradas', 'stops', 'durak'], getOff: ['desça em', 'get off at', 'inin:'],
  closedDay: ['fechado neste dia', 'closed on this day', 'bu gün kapalı'], noFit: ['não cabe no horário de abertura', 'does not fit opening hours', 'açılış saatlerine sığmıyor'], deadline: ['não cabe antes do retorno', 'does not fit before returning', 'dönüşten önce sığmıyor'],
  addPlace: ['Adicionar lugar', 'Add place', 'Yer ekle'], addToDay: ['Adicionar a este dia', 'Add to this day', 'Bu güne ekle'], added: ['Adicionado ao dia', 'Added to the day', 'Güne eklendi'],
  classesT: ['Aulas da Zeynep', 'Zeynep’s classes', 'Zeynep’in dersleri'], outing: ['PASSEIO A DOIS', 'OUTING TOGETHER', 'BİRLİKTE GEZİ'],
  outingTxt: ['Faculdade → Airbnb: pelo menos 1h. Chegada a partir de {a}, mais 15min para se preparar. Ajustem se houver atraso.', 'Faculty → Airbnb: at least 1h. Arrival from {a}, plus 15min to get ready. Adjust for delays.', 'Fakülte → Airbnb: en az 1 saat. En erken {a} varış, ardından 15 dakika hazırlık. Gecikmeye göre ayarlayın.'],
  noClass: ['Dia sem aulas · passeio a dois', 'No classes · a day together', 'Ders yok · birlikte gezi'],
  breakT: ['JUNTOS NO INTERVALO · SEGUNDA', 'TOGETHER IN THE BREAK · MONDAY', 'ARADA BİRLİKTE · PAZARTESİ'],
  breakFrom: ['Saída da faculdade 11:00 · de volta até 13:20', 'Leave the faculty 11:00 · back by 13:20', 'Fakülteden çıkış 11.00 · en geç 13.20 dönüş'],
  faculty: ['Faculdade', 'Faculty', 'Fakülte'], gate: ['De volta ao portão', 'Back at the gate', 'Kapıya dönüş'],
  tripProg: ['lugares concluídos na viagem', 'places completed on the trip', 'yer tamamlandı'],
  placesH: ['Lugares que valem a parada', 'Places worth the stop', 'Durmaya değer yerler'], search: ['Buscar lugar ou bairro', 'Search place or area', 'Yer veya semt ara'],
  fAll: ['Todos', 'All', 'Tümü'], fSight: ['Atrações', 'Sights', 'Gezilecek'], fFood: ['Comida > 4,6', 'Food > 4.6', 'Yemek > 4,6'], fShop: ['Mercados', 'Groceries', 'Market'], fChurch: ['Igrejas cristãs', 'Churches', 'Kiliseler'], fMine: ['Suas escolhas', 'Your picks', 'Seçimleriniz'], fTodo: ['Só falta visitar', 'Still to visit', 'Gidilecek'], fNear: ['Até 2 km do Airbnb', 'Within 2 km of Airbnb', 'Airbnb’ye 2 km'],
  toVisit: ['A visitar', 'To visit', 'Gidilecek'], nothing: ['Nenhum lugar com esses filtros.', 'No places with these filters.', 'Bu filtrelerle yer yok.'],
  notInPlan: ['Fora do roteiro', 'Not scheduled', 'Planda yok'],
  kSight: ['Atração', 'Sight', 'Gezilecek yer'], kFood: ['Restaurante', 'Restaurant', 'Restoran'], kShop: ['Compras', 'Groceries', 'Alışveriş'], kTransport: ['Passeio reservado', 'Booked experience', 'Rezerve deneyim'], kBase: ['Base', 'Base', 'Üs'],
  intH: ['80 minutos, perto dela', '80 minutes, near her', '80 dakika, ona yakın'], walkV: ['ida + volta', 'there + back', 'gidiş + dönüş'], visitV: ['no lugar', 'there', 'yerinde'], bufV: ['folga', 'buffer', 'pay'],
  guideH: ['Guia da viagem', 'Trip guide', 'Gezi rehberi'],
  mpTitle: ['Mapa offline de İstanbul', 'Offline map of İstanbul', 'Çevrimdışı İstanbul haritası'],
  mpReady: ['Pronto: mapa, rotas a pé e GPS funcionam sem internet.', 'Ready: map, walking routes and GPS work without internet.', 'Hazır: harita, yürüyüş rotaları ve GPS internetsiz çalışır.'],
  mpNeed: ['Baixe uma vez (≈18 MB) com internet. Depois tudo funciona em modo avião.', 'Download once (≈18 MB) online. Then everything works in airplane mode.', 'İnternetle bir kez indirin (≈18 MB). Sonra her şey uçak modunda çalışır.'],
  mpDl: ['Baixando mapa…', 'Downloading map…', 'Harita indiriliyor…'], mpBtn: ['Baixar mapa offline', 'Download offline map', 'Çevrimdışı haritayı indir'], mpAgain: ['Baixar de novo', 'Download again', 'Yeniden indir'],
  mpErr: ['Falhou. Conecte-se e tente de novo.', 'Failed. Connect and try again.', 'Başarısız. Bağlanıp tekrar deneyin.'],
  mpFiles: [['Mapa vetorial (ruas, metrô, balsas)', 'Vector map (streets, metro, ferries)', 'Vektör harita (sokaklar, metro, vapur)'], ['Rótulos do mapa', 'Map labels', 'Harita etiketleri'], ['Rede de caminhada para rotas offline', 'Walking network for offline routes', 'Çevrimdışı rota için yürüyüş ağı']],
  gpsWait: ['Buscando GPS…', 'Finding GPS…', 'GPS aranıyor…'], gpsDenied: ['Permissão de localização recusada. Ative em Ajustes › Privacidade › Serviços de Localização.', 'Location permission denied. Enable it in Settings › Privacy › Location Services.', 'Konum izni reddedildi. Ayarlar › Gizlilik › Konum Servisleri’nden açın.'],
  gpsNoHttps: ['Abra o app pelo endereço https para usar o GPS.', 'Open the app over https to use GPS.', 'GPS için uygulamayı https ile açın.'],
  gpsFar: ['Você está fora de İstanbul: a rota sai do ponto anterior do roteiro.', 'You are outside İstanbul: the route starts at the previous stop.', 'İstanbul dışındasınız: rota önceki duraktan başlar.'],
  routeFrom: ['Saindo de', 'From', 'Çıkış'], you: ['Você', 'You', 'Siz'], arrivedAt: ['Você chegou', 'You have arrived', 'Vardınız'],
  navWalk: ['Rota a pé calculada no celular, sem internet.', 'Walking route computed on your phone, no internet needed.', 'Yürüyüş rotası telefonda, internetsiz hesaplandı.'],
  navWalkPlan: ['Rota a pé planejada a partir da parada anterior.', 'Planned walking route from the previous stop.', 'Önceki duraktan planlı yürüyüş rotası.'],
  navPlan: ['Trajeto planejado com transporte.', 'Planned route with transit.', 'Toplu taşımalı planlı rota.'],
  navFar: ['Longe para ir a pé. Use o transporte sugerido no roteiro ou, com internet, o Google Maps.', 'Too far to walk. Use the suggested transit or, online, Google Maps.', 'Yürümek için uzak. Önerilen ulaşımı ya da internetle Google Maps’i kullanın.'],
  stopNav: ['Encerrar', 'End', 'Bitir'], remaining: ['restantes', 'left', 'kaldı'],
  fit: ['Ver tudo', 'Show all', 'Tümünü gör'], locate: ['Minha localização', 'My location', 'Konumum'], compass: ['Bússola', 'Compass', 'Pusula'],
  allPlaces: ['Todos os lugares', 'All places', 'Tüm yerler'], showDay: ['Dia', 'Day', 'Gün'],
  legend: ['Legenda', 'Legend', 'Lejant'], lWalk: ['a pé · tracejado verde', 'walk · dashed green', 'yürüyüş · kesikli yeşil'], lRide: ['transporte · roxo contínuo', 'transit · solid purple', 'ulaşım · düz mor'],
  longPress: ['Toque longo no mapa para adicionar um ponto seu.', 'Long-press the map to add your own spot.', 'Kendi noktanızı eklemek için haritaya uzun basın.'],
  customName: ['Nome do lugar', 'Place name', 'Yer adı'], customAdd: ['Adicionar ponto', 'Add spot', 'Nokta ekle'], customDay: ['Dia do roteiro', 'Itinerary day', 'Gezi günü'], cancel: ['Cancelar', 'Cancel', 'İptal'], save: ['Salvar', 'Save', 'Kaydet'],
  myPoint: ['Ponto adicionado por você', 'Spot added by you', 'Sizin eklediğiniz nokta'],
  update: ['Nova versão do guia pronta.', 'A new version is ready.', 'Yeni sürüm hazır.'], reload: ['Atualizar', 'Update', 'Güncelle'],
  resetDone: ['Zerar concluídos', 'Clear completed', 'Tamamlananları sıfırla'], resetAll: ['Zerar tudo', 'Reset everything', 'Her şeyi sıfırla'], confirmTap: ['Toque de novo para confirmar', 'Tap again to confirm', 'Onaylamak için tekrar dokunun'],
  cleared: ['Pronto, zerado.', 'Done, cleared.', 'Tamam, sıfırlandı.'],
  unknownPin: ['Embarque a confirmar no voucher', 'Boarding point in the voucher', 'Biniş yeri kuponda'],
  freeDay: ['Sem paradas fixas neste dia.', 'No fixed stops this day.', 'Bu gün sabit durak yok.'],
  arrivalSteps: ['Passo a passo', 'Step by step', 'Adım adım'], seeOnMap: ['Ver no mapa', 'See on map', 'Haritada gör'],
  depT: ['Partida · 4/11', 'Departure · 4 Nov', 'Dönüş · 4 Kasım'],
  weekT: ['Semana de aulas', 'Class week', 'Ders haftası'], mon: ['Segunda', 'Monday', 'Pazartesi'], wed: ['Quarta', 'Wednesday', 'Çarşamba'], fri: ['Sexta', 'Friday', 'Cuma'],
  weekNote: ['Saída do Airbnb para passear = fim da última aula + pelo menos 1h de deslocamento da Zeynep + 15 min para se preparar.', 'Airbnb departure for outings = end of last class + at least 1h for Zeynep to travel + 15 min to get ready.', 'Gezi için Airbnb’den çıkış = son dersin bitişi + Zeynep’in en az 1 saatlik yolu + 15 dakika hazırlık.'],
  facT: ['Como chegar à faculdade', 'Getting to the faculty', 'Fakülteye ulaşım'], legendT: ['Legenda das rotas', 'Route legend', 'Rota lejantı'], creditsT: ['Créditos e dados', 'Credits & data', 'Krediler ve veriler'],
  dataT: ['Seus dados neste aparelho', 'Your data on this device', 'Bu cihazdaki verileriniz'],
  dataTxt: ['Concluídos, lixeira e lugares adicionados ficam salvos só neste aparelho (não vão para o GitHub).', 'Completed items, trash and added places are saved only on this device (not on GitHub).', 'Tamamlananlar, çöp kutusu ve eklenen yerler yalnızca bu cihazda saklanır (GitHub’a gitmez).'],
  holidayT: ['Feriado e avisos', 'Holiday & notes', 'Tatil ve notlar'],
  installT: ['Instalar no celular', 'Install on your phone', 'Telefona yükle'],
  installTxt: ['iPhone: Safari › Compartilhar › Adicionar à Tela de Início. Android: Chrome › ⋮ › Instalar app. Abra uma vez com internet e espere o mapa offline chegar a 100%.', 'iPhone: Safari › Share › Add to Home Screen. Android: Chrome › ⋮ › Install app. Open once online and wait for the offline map to reach 100%.', 'iPhone: Safari › Paylaş › Ana Ekrana Ekle. Android: Chrome › ⋮ › Uygulamayı yükle. İnternetle bir kez açın ve çevrimdışı harita %100 olana kadar bekleyin.'],
  sideNote: ['Trajeto entre continentes: balsa', 'Cross-continent leg: ferry', 'Kıtalar arası: vapur'],
  checkConn: ['confira horários', 'check timetable', 'tarifeyi kontrol edin'],
  emptyTrash: ['Nada na lixeira.', 'Trash is empty.', 'Çöp kutusu boş.'],
  scheduled: ['No roteiro', 'Scheduled', 'Planda'], ofDay: ['do dia', 'of the day', 'günün'],
  nextStopBtn: ['Rota até a próxima', 'Route to next stop', 'Sıradaki durağa rota'], homeBtn: ['Voltar ao Airbnb daqui', 'Back to Airbnb from here', 'Buradan Airbnb’ye'],
  photo: ['Foto', 'Photo', 'Fotoğraf'],
};
let LANG = 'pt';
const LI = { pt: 0, en: 1, tr: 2 };
const t = (k, vars) => { const e = I[k]; let s = e ? e[LI[LANG]] : k; if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace('{' + a + '}', b); return s; };
const L = o => o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.pt ?? '');
const LOC = { pt: 'pt-BR', en: 'en-GB', tr: 'tr-TR' };
const fmtDate = (iso, opt) => new Intl.DateTimeFormat(LOC[LANG], { timeZone: 'UTC', ...opt }).format(new Date(iso + 'T12:00:00Z'));

/* ---------------- icons ---------------- */
const IC = {
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  nav: '<path d="M3 11 22 2l-9 19-2-8-8-2z"/>', locate: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>', chevR: '<path d="m9 18 6-6-6-6"/>', chevD: '<path d="m6 9 6 6 6-6"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  walk: '<circle cx="13" cy="4" r="2"/><path d="m9 20 3-6 3 3v4M7 12l3-4 4 1 3 4M10 8l-1 5"/>',
  tram: '<rect x="5" y="5" width="14" height="12" rx="3"/><path d="M8 21l2-4M16 21l-2-4M9 2h6M12 2v3M5 11h14"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/>',
  metro: '<rect x="4" y="3" width="16" height="15" rx="4"/><path d="M4 11h16M8 21l2-3M16 21l-2-3"/><circle cx="8.5" cy="14.5" r=".6"/><circle cx="15.5" cy="14.5" r=".6"/>',
  ferry: '<path d="M2 20c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M4 16 3 11h18l-2 5M6 11V7h12v4M12 3v4"/>',
  bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 10h16M7 21v-3M17 21v-3"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
  home: '<path d="m3 11 9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  cap: '<path d="m22 10-10-5L2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  star: '<path d="m12 2 3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.5 0-2.6-.6-3-1.6M12 6v2M12 16v2"/>',
  food: '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 21V3c-2.2 0-4 2.5-4 6 0 2.5 1.5 4 4 4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.3a10 10 0 0 1 14 0M8.5 15.8a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  shop: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  church: '<path d="M12 2v5M10 4h4M6 22V12l6-5 6 5v10M3 22h18M10 22v-4a2 2 0 0 1 4 0v4"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
const MODEIC = { walk: 'walk', tram: 'tram', metro: 'metro', ferry: 'ferry', bus: 'bus', funicular: 'tram' };

/* ---------------- state ---------------- */
function loadState() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { s = null; }
  if (!s || s.v !== 6) s = { v: 6, done: {}, trash: [], additions: {}, custom: [], steps: {}, lang: null, day: null };
  s.done ||= {}; s.trash ||= []; s.additions ||= {}; s.custom ||= []; s.steps ||= {};
  return s;
}
const S = loadState();
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* storage unavailable: keep in memory */ } }

/* migrate the v5 (React) data saved on the same site */
(function migrateV5() {
  if (S.migrated) return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('istanbul-pages-v1:')) continue;
      const o = JSON.parse(localStorage.getItem(k));
      if (!o || !o.visited) continue;
      const trues = Object.entries(o.visited).filter(([, v]) => v === true).map(([id]) => id).sort().join(',');
      const seed = trues === 'beyzade,gulhane,sehzade,topkapi'; // demo marks shipped with v5
      if (!seed) for (const [id, v] of Object.entries(o.visited)) if (v === true) S.done[id] = S.done[id] || Date.now();
      const e = o.edits || {};
      (e.trash || []).forEach(id => { if (!S.trash.includes(id)) S.trash.push(id); });
      for (const [d, ids] of Object.entries(e.additions || {})) S.additions[d] = [...new Set([...(S.additions[d] || []), ...ids])];
      (e.custom || []).forEach(c => { if (c && c.id && !S.custom.some(x => x.id === c.id)) S.custom.push(c); });
    }
    const lg = localStorage.getItem('istanbul-language');
    if (lg && !S.lang && LI[lg] !== undefined) S.lang = lg;
  } catch (e) { }
  S.migrated = true; save();
})();
LANG = S.lang || ((navigator.language || 'pt').slice(0, 2) === 'tr' ? 'tr' : (navigator.language || 'pt').slice(0, 2) === 'en' ? 'en' : 'pt');

/* ---------------- places ---------------- */
const PL = {};
function rebuildPlaces() {
  for (const k of Object.keys(PL)) delete PL[k];
  for (const [id, p] of Object.entries(TRIP.places)) PL[id] = p;
  for (const c of S.custom) PL[c.id] = { kind: 'sight', area: '', address: '', description: { pt: '', en: '', tr: '' }, ...c, custom: true };
}
rebuildPlaces();
const ASIAN = new Set(TRIP.asian);
const EXPLICIT = new Set(TRIP.explicit);
const photoURL = id => (TRIP.photos[id] && TRIP.photos[id].img) ? `./img/${id}.webp` : null;
const kindLabel = p => p.kind === 'food' ? t('kFood') : p.kind === 'shop' ? t('kShop') : p.kind === 'transport' ? t('kTransport') : p.kind === 'base' ? t('kBase') : t('kSight');
const kindIcon = p => p.kind === 'food' ? 'food' : p.kind === 'shop' ? 'shop' : p.kind === 'transport' ? 'ferry' : p.church ? 'church' : p.id === 'base' ? 'home' : p.id === 'university' ? 'cap' : 'star';
const phHTML = (id, cls = '') => { const u = photoURL(id); const p = PL[id] || {}; return `<div class="ph ${cls}">${u ? `<img src="${u}" alt="" loading="lazy" decoding="async">` : ic(kindIcon(p))}</div>`; };
const googleURL = p => {
  for (const u of [p.mapsUrl, p.source]) if (u && /^(https:\/\/maps\.app\.goo\.gl|https:\/\/(www|maps)\.google\.com\/maps\/place)/.test(u)) return u;
  if (p.custom || !p.address) return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: `${p.name}, ${p.address}, İstanbul, Türkiye` })}`;
};
const googleDir = (a, b, mode) => `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', origin: `${a.lat},${a.lng}`, destination: b.id === 'base' ? `${b.lat},${b.lng}` : `${b.name}, ${b.address || ''}, İstanbul`, travelmode: mode === 'transit' ? 'transit' : 'walking' })}`;

/* ---------------- geo ---------------- */
function hav(a, b) { // km
  const n = Math.PI / 180, r = (b.lat - a.lat) * n, i = (b.lng - a.lng) * n;
  const x = Math.sin(r / 2) ** 2 + Math.cos(a.lat * n) * Math.cos(b.lat * n) * Math.sin(i / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
const mDist = (a, b) => hav({ lat: a[1], lng: a[0] }, { lat: b[1], lng: b[0] }) * 1000;
const lineLen = c => { let d = 0; for (let i = 1; i < c.length; i++) d += mDist(c[i - 1], c[i]); return d; };
const fmtDist = m => m < 950 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(m < 9950 ? 1 : 0).replace('.', LANG === 'en' ? '.' : ',')} km`;
const fmtMin = m => m < 60 ? `${Math.max(1, Math.round(m))} ${t('minutes')}` : `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')}`;

/* ---------------- scheduling (ported from v5) ---------------- */
const hm = s => { if (!s || !/^\d{2}:\d{2}$/.test(s)) return undefined; const [a, b] = s.split(':').map(Number); return a < 24 && b < 60 ? a * 60 + b : undefined; };
const fmtHM = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function classInfo(date) {
  const wd = new Date(date + 'T12:00:00Z').getUTCDay(), cls = TRIP.classes[wd] || [];
  const end = cls.length ? cls[cls.length - 1].end : undefined, home = end ? hm(end) + 60 : undefined;
  return {
    classes: cls, weekday: wd, arrival: date === '2026-10-21', mondayBreak: wd === 1,
    departure: wd === 3 ? '10:50' : '08:00', campusArrival: wd === 3 ? '11:55' : '09:05',
    earliestHomeArrival: home === undefined ? undefined : fmtHM(home), outingStart: home === undefined ? '09:00' : fmtHM(home + 15),
    gap: wd === 1 ? '10:45–13:40' : wd === 3 ? '13:35–15:05' : wd === 5 ? '10:45–10:50' : '',
  };
}
function sideOf(p) {
  if (!p) return false;
  if (!String(p.id).startsWith('custom-') && p.id !== 'current') return ASIAN.has(p.id);
  let best, bd = Infinity;
  for (const q of Object.values(TRIP.places)) { if (q.unmapped) continue; const d = hav(p, q); if (d < bd) { bd = d; best = q; } }
  return !!best && ASIAN.has(best.id);
}
function K(a, b) {
  if (!a || !b || a.unmapped || b.unmapped) return 0;
  const n = hav(a, b);
  return sideOf(a) === sideOf(b) ? (n > 2 ? Math.ceil(15 + n * 4) : Math.max(3, Math.ceil(n * 1.3 / 4.2 * 60))) : Math.ceil(35 + n * 3);
}
const NOMEAL = new Set(['emek-borek', 'lades-menemen', 'walton', 'dogaciyiz', 'yesim', 'vefa', 'oakberry', 'hafiz', 'beyzade']);
const isMeal = (p, day) => p.kind === 'food' && !NOMEAL.has(p.id) && day.mealPeriod !== 'lunch' && !(day.lunchStops || []).includes(p.id);
const V3 = (a, b, c) => ({ pt: a, en: b, tr: c });
function infoOf(p, wd) {
  const G = TRIP.info;
  const n = G[p.id] || {
    hours: V3('Horário ainda não confirmado', 'Hours not yet confirmed', 'Saatler henüz doğrulanmadı'),
    price: V3('Preço ainda não confirmado', 'Price not yet confirmed', 'Fiyat henüz doğrulanmadı'),
    ticket: p.kind === 'food' ? V3('Refeição por pessoa', 'Meal per person', 'Kişi başı yemek') : p.kind === 'shop' ? V3('Compras à parte', 'Pay for purchases', 'Alışveriş ayrı') : V3('Confirmar ingresso', 'Check ticket', 'Bileti kontrol edin'),
    duration: p.kind === 'food' ? 60 : 40, priceKind: p.kind === 'food' ? 'meal' : p.kind === 'shop' ? 'shopping' : 'unknown',
  };
  const wk = wd === undefined ? {} : ((n.weekly || {})[wd] || {});
  if (p.kind === 'food') return { ...n, ...wk, booking: n.booking || V3('Política de reserva não confirmada · consulte o local', 'Booking policy not confirmed · ask the venue', 'Rezervasyon politikası doğrulanmadı · mekâna sorun') };
  if (p.church && !G[p.id]) return { ...n, hours: V3('Visita interna: confirmar com a igreja', 'Interior visit: confirm with the church', 'İç ziyaret: kiliseden teyit edin'), price: V3('Tarifa de visita não publicada', 'Visitor fee not published', 'Ziyaret ücreti yayımlanmamış'), ticket: V3('Acesso sujeito à abertura e celebrações', 'Access depends on opening and worship', 'Giriş açılışa ve ayinlere bağlıdır'), duration: 25, source: p.source };
  return { ...n, ...wk };
}
function orderGeo(day, ids) {
  const r = day.stops.map(s => s.id).filter(id => ids.includes(id));
  for (const i of ids.filter(id => !r.includes(id))) {
    let best = r.length, a = Infinity;
    const o = r.findIndex(x => isMeal(PL[x], day));
    const s = isMeal(PL[i], day) ? (o < 0 ? r.length : o) : 0;
    const c = !isMeal(PL[i], day) && o >= 0 ? o : r.length;
    for (let k = s; k <= c; k++) {
      const prev = PL[k ? r[k - 1] : day.start], nxt = PL[k < r.length ? r[k] : day.end];
      const l = K(prev, PL[i]) + K(PL[i], nxt) - K(prev, nxt);
      if (l < a) { best = k; a = l; }
    }
    r.splice(best, 0, i);
  }
  return r;
}
function schedule(day) {
  const ids = [...new Set([...day.stops.map(s => s.id), ...(S.additions[day.id] || [])])].filter(id => PL[id] && !S.trash.includes(id));
  const wd = day.date ? new Date(day.date + 'T12:00:00Z').getUTCDay() : -1;
  const skipped = [], open = [];
  for (const id of ids) (infoOf(PL[id]).closed || []).includes(wd) ? skipped.push({ id, reason: 'closed' }) : open.push(id);
  if (day.budget) return { ...day, stops: open.map(id => ({ id, time: '—' })), skipped, ordered: false };
  const geo = day.geographicOrder ? orderGeo(day, open) : [];
  let cur = PL[day.start];
  let tm = Math.max(hm(day.startTime) ?? 540, day.slot === 'main' && day.date && classInfo(day.date).classes.length ? hm(classInfo(day.date).outingStart) : 0);
  const dl = hm(day.endDeadline);
  let unknown = false; const out = []; const rest = [...open];
  while (rest.length) {
    const cands = rest.map(id => {
      const p = PL[id], inf = infoOf(p, wd), tr = K(cur, p);
      const op = inf.open ?? (p.kind === 'food' ? (['dogaciyiz', 'hafiz', 'beyzade'].includes(id) ? 540 : 690) : 540);
      const arr = tm + tr, st = Math.max(arr, op, isMeal(p, day) ? 1080 : 0);
      return { id, p, inf, tr, st, wait: st - arr, km: hav(cur, p) };
    }).filter(c => (!c.inf.close || c.st + c.inf.duration <= c.inf.close) && (dl === undefined || (!c.p.unmapped && !c.inf.reservation && c.st + c.inf.duration + K(c.p, PL[day.end]) <= dl)));
    if (!cands.length) { skipped.push(...rest.map(id => ({ id, reason: dl === undefined ? 'late' : 'deadline' }))); break; }
    const nw = cands.filter(c => c.wait === 0), pool = nw.length ? nw : cands;
    pool.sort((a, b) => nw.length ? a.km - b.km || a.tr - b.tr : a.st - b.st || a.km - b.km);
    const first = out.length === 0 && cands.find(c => c.id === day.firstStop);
    const g = geo.find(id => cands.some(c => c.id === id));
    const pick = (g && cands.find(c => c.id === g)) || first || pool[0];
    unknown = unknown || !!pick.p.unmapped || !!pick.inf.reservation;
    out.push({ id: pick.id, time: unknown ? '—' : fmtHM(pick.st), dur: pick.inf.duration });
    tm = pick.st + pick.inf.duration; cur = pick.p; rest.splice(rest.indexOf(pick.id), 1);
  }
  return { ...day, stops: out, skipped, ordered: true, returnTime: unknown ? undefined : fmtHM(tm + K(cur, PL[day.end])) };
}

/* ---------------- legs & routes ---------------- */
const ROUTES = TRIP.routes;
function legMode(a, b) {
  const key = `${a.id}__${b.id}`;
  if (ROUTES[key]) return ROUTES[key].mode === 'transit' ? 'transit' : 'walking';
  if (a.unmapped || b.unmapped) return 'unknown';
  const cross = sideOf(a) !== sideOf(b), c = ['blue', 'topkapi', 'cistern'];
  const coast = ['uskudar__kuzguncuk', 'kuzguncuk__patata'].includes(key);
  const hist = (a.id === 'base' && c.includes(b.id)) || (b.id === 'base' && c.includes(a.id));
  return cross || coast || hist || hav(a, b) > 2 ? 'transit' : 'walking';
}
function legsOf(day, stops) {
  const ids = [day.start, ...stops.map(s => s.id), day.end];
  const out = [];
  for (let i = 1; i < ids.length; i++) { const a = PL[ids[i - 1]], b = PL[ids[i]]; if (!a || !b || a.id === b.id) continue; out.push({ from: a.id, to: b.id, mode: legMode(a, b), key: `${a.id}__${b.id}` }); }
  return out;
}
const SPEED = { walk: 75, tram: 260, metro: 600, ferry: 300, bus: 230, funicular: 200 }; // m/min
const WAIT = { walk: 0, tram: 4, metro: 4, ferry: 10, bus: 7, funicular: 3 };
const segMin = s => s.d / SPEED[s.m] + (WAIT[s.m] || 0);
const legMemo = new Map();
/* returns {mode, segs, d, est} — uses precomputed routes, the offline walking graph, or a straight line */
function legRoute(a, b) {
  const pre = ROUTES[`${a.id}__${b.id}`];
  if (pre) return { ...pre, est: pre.segs.reduce((x, s) => x + segMin(s), 0), source: 'plan' };
  const mode = legMode(a, b);
  if (mode === 'walking' && Walk.ready) {
    const mk = `${a.id}__${b.id}@${a.lat},${a.lng}`;
    const r = legMemo.has(mk) ? legMemo.get(mk) : (legMemo.set(mk, Walk.route(a, b)), legMemo.get(mk));
    if (r) { const seg = { m: 'walk', c: r.c, d: r.d }; return { mode: 'walk', segs: [seg], d: r.d, est: segMin(seg), source: 'graph' }; }
  }
  const c = [[a.lng, a.lat], [b.lng, b.lat]], d = lineLen(c) * (mode === 'walking' ? 1.3 : 1);
  const seg = { m: mode === 'walking' ? 'walk' : 'ride', c, d, straight: true };
  return { mode: mode === 'walking' ? 'walk' : mode, segs: [seg], d, est: mode === 'walking' ? d / 75 : K(a, b), source: 'line' };
}

/* ---------------- offline walking router (A* over an OSM footpath graph) ---------------- */
const Walk = {
  ready: false, loading: null, S0: 40.970, W0: 28.928, N0: 41.062, E0: 29.066,
  inBox(p) { return p.lat > this.S0 && p.lat < this.N0 && p.lng > this.W0 && p.lng < this.E0; },
  load() {
    if (this.ready) return Promise.resolve(true);
    if (this.loading) return this.loading;
    this.loading = fetch('./map/walk.bin').then(r => { if (!r.ok) throw new Error('walk ' + r.status); return r.arrayBuffer(); })
      .then(buf => { this.parse(buf); this.ready = true; return true; })
      .catch(e => { console.warn('walk graph', e); this.loading = null; return false; });
    return this.loading;
  },
  parse(buf) {
    const h = new Uint32Array(buf, 0, 7), nV = h[0], nE = h[1], nG = h[2];
    let o = 28;
    const take = (T, n) => { const a = new T(buf, o, n); o += n * T.BYTES_PER_ELEMENT; return a; };
    this.vlat = take(Int32Array, nV); this.vlon = take(Int32Array, nV);
    this.ea = take(Uint32Array, nE); this.eb = take(Uint32Array, nE); this.elen = take(Float32Array, nE); this.eg0 = take(Uint32Array, nE);
    this.glat = take(Int32Array, nG); this.glon = take(Int32Array, nG);
    this.egn = take(Uint16Array, nE); if (nE % 2) o += 2;
    this.ew = new Uint8Array(buf, o, nE);
    this.nV = nV; this.nE = nE;
    const deg = new Uint32Array(nV + 1);
    for (let e = 0; e < nE; e++) { deg[this.ea[e] + 1]++; deg[this.eb[e] + 1]++; }
    for (let i = 0; i < nV; i++) deg[i + 1] += deg[i];
    const fill = deg.slice(0, nV), adj = new Uint32Array(2 * nE);
    for (let e = 0; e < nE; e++) { adj[fill[this.ea[e]]++] = e * 2; adj[fill[this.eb[e]]++] = e * 2 + 1; }
    this.adjStart = deg; this.adj = adj;
    // grid index
    this.cell = 0.0025; this.grid = new Map();
    for (let v = 0; v < nV; v++) {
      const k = this.key(this.lat(v), this.lng(v));
      let b = this.grid.get(k); if (!b) { b = []; this.grid.set(k, b); } b.push(v);
    }
    // only keep vertices that belong to the main connected component for snapping
    const comp = new Int32Array(nV).fill(-1); let best = -1, bestN = 0, cid = 0; const sizes = [];
    const stack = new Uint32Array(nV);
    for (let s = 0; s < nV; s++) {
      if (comp[s] >= 0) continue; let sp = 0, n = 0; stack[sp++] = s; comp[s] = cid;
      while (sp) { const u = stack[--sp]; n++; for (let i = this.adjStart[u]; i < this.adjStart[u + 1]; i++) { const ed = this.adj[i] >> 1, w = (this.adj[i] & 1) ? this.ea[ed] : this.eb[ed]; if (comp[w] < 0) { comp[w] = cid; stack[sp++] = w; } } }
      sizes.push(n); if (n > bestN) { bestN = n; best = cid; } cid++;
    }
    this.comp = comp; this.main = best; this.big = new Uint8Array(sizes.map(n => n >= 400 ? 1 : 0));
    this.g = new Float64Array(nV); this.prevE = new Int32Array(nV); this.stamp = new Uint32Array(nV); this.run = 0;
  },
  lat(v) { return this.S0 + this.vlat[v] / 1e6; }, lng(v) { return this.W0 + this.vlon[v] / 1e6; },
  key(la, lo) { return Math.floor(la / this.cell) * 100000 + Math.floor(lo / this.cell); },
  nearest(p) {
    const cy = Math.floor(p.lat / this.cell), cx = Math.floor(p.lng / this.cell);
    let best = -1, bd = Infinity; const kx = Math.cos(p.lat * Math.PI / 180);
    for (let r = 0; r <= 4; r++) {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dy), Math.abs(dx)) !== r) continue;
        const b = this.grid.get((cy + dy) * 100000 + (cx + dx)); if (!b) continue;
        for (const v of b) { if (!this.big[this.comp[v]]) continue; const d = (this.lat(v) - p.lat) ** 2 + ((this.lng(v) - p.lng) * kx) ** 2; if (d < bd) { bd = d; best = v; } }
      }
      if (best >= 0 && r >= 1) break;
    }
    return best;
  },
  route(a, b) {
    if (!this.ready || !this.inBox(a) || !this.inBox(b)) return null;
    const s = this.nearest(a), g = this.nearest(b); if (s < 0 || g < 0 || this.comp[s] !== this.comp[g]) return null;
    const run = ++this.run, G = this.g, P = this.prevE, ST = this.stamp;
    const tl = this.lat(g), tn = this.lng(g), kx = Math.cos(tl * Math.PI / 180) * 111320, ky = 110540;
    const hfun = v => Math.hypot((this.lat(v) - tl) * ky, (this.lng(v) - tn) * kx);
    const heap = [], push = (f, v) => { heap.push([f, v]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    ST[s] = run; G[s] = 0; P[s] = -1; push(hfun(s), s);
    let found = false, it = 0;
    while (heap.length && it++ < 400000) {
      const [f, u] = pop();
      if (u === g) { found = true; break; }
      if (f - hfun(u) > G[u] + 1e-6) continue;
      for (let i = this.adjStart[u]; i < this.adjStart[u + 1]; i++) {
        const code = this.adj[i], e = code >> 1, rev = code & 1, w = rev ? this.ea[e] : this.eb[e];
        const nd = G[u] + this.elen[e] * this.ew[e] / 10;
        if (ST[w] !== run || nd < G[w]) { ST[w] = run; G[w] = nd; P[w] = code; push(nd + hfun(w), w); }
      }
    }
    if (!found) return null;
    const parts = []; let v = g;
    while (v !== s) {
      const code = P[v], e = code >> 1, rev = code & 1, u = rev ? this.eb[e] : this.ea[e];
      const pts = []; const g0 = this.eg0[e], n = this.egn[e];
      for (let k = 0; k < n; k++) pts.push([this.W0 + this.glon[g0 + k] / 1e6, this.S0 + this.glat[g0 + k] / 1e6]);
      if (rev) pts.reverse();               // traversed b → a
      parts.push([[this.lng(v), this.lat(v)], ...pts.reverse()]); // stored backwards, fix below
      v = u;
    }
    const c = [[a.lng, a.lat], [this.lng(s), this.lat(s)]];
    for (let i = parts.length - 1; i >= 0; i--) { const seg = parts[i].slice().reverse(); for (const q of seg) c.push(q); }
    c.push([b.lng, b.lat]);
    const clean = c.filter((q, i) => i === 0 || q[0] !== c[i - 1][0] || q[1] !== c[i - 1][1]);
    return { c: clean.map(q => [Math.round(q[0] * 1e5) / 1e5, Math.round(q[1] * 1e5) / 1e5]), d: lineLen(clean) };
  },
};

/* ---------------- offline map pack (download once, then everything is local) ---------------- */
const MAPCACHE = 'ist-map-v1';
const MapPack = {
  files: [
    { url: './map/istanbul.pmtiles', size: 13430635 },
    { url: './map/glyphs.bin', size: 2795455 },
    { url: './map/walk.bin', size: 1704149 },
  ],
  state: 'idle', // idle | checking | downloading | ready | error | unsupported
  got: 0, total: 0, have: {}, listeners: new Set(),
  on(fn) { this.listeners.add(fn); }, emit() { this.listeners.forEach(f => { try { f(this); } catch (e) { } }); },
  get pct() { return this.total ? Math.min(100, Math.round(this.got / this.total * 100)) : 0; },
  abs(u) { return new URL(u, location.href).href; },
  async check() {
    if (!('caches' in window)) { this.state = 'unsupported'; this.emit(); return false; }
    this.state = 'checking';
    try {
      const c = await caches.open(MAPCACHE);
      for (const f of this.files) this.have[f.url] = !!(await c.match(this.abs(f.url)));
    } catch (e) { this.state = 'unsupported'; this.emit(); return false; }
    const ok = this.files.every(f => this.have[f.url]);
    this.state = ok ? 'ready' : 'idle'; this.emit(); return ok;
  },
  async download(force) {
    if (this.state === 'downloading' || !('caches' in window)) return;
    this.state = 'downloading'; this.total = this.files.reduce((a, f) => a + f.size, 0); this.got = 0; this.emit();
    try {
      const c = await caches.open(MAPCACHE);
      for (const f of this.files) {
        if (this.have[f.url] && !force) { this.got += f.size; this.emit(); continue; }
        const r = await fetch(f.url, { cache: 'no-store' });
        if (!r.ok) throw new Error(f.url + ' ' + r.status);
        let blob;
        if (r.body && r.body.getReader) {
          const rd = r.body.getReader(), chunks = []; let n = 0;
          for (;;) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); n += value.length; this.got += value.length; if (chunks.length % 8 === 0) this.emit(); }
          blob = new Blob(chunks, { type: 'application/octet-stream' });
          this.got += Math.max(0, f.size - n);
        } else { blob = await r.blob(); this.got += f.size; }
        await c.put(this.abs(f.url), new Response(blob, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(blob.size) } }));
        this.have[f.url] = true; this.emit();
      }
      this.state = 'ready'; this.emit();
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
      Tiles.useCache(); Walk.load();
    } catch (e) { console.warn(e); this.state = 'error'; this.emit(); }
  },
  async blob(url) {
    try { const r = await caches.match(this.abs(url)); return r ? await r.blob() : null; } catch (e) { return null; }
  },
};

/* PMTiles source: reads byte ranges from the cached blob, or from the network until the pack is cached */
const Tiles = {
  blob: null, key: 'istanbul',
  async useCache() { const b = await MapPack.blob('./map/istanbul.pmtiles'); if (b) this.blob = b; return !!b; },
  source() {
    const self = this;
    return {
      getKey() { return self.key; },
      async getBytes(offset, length, signal) {
        if (self.blob) return { data: await self.blob.slice(offset, offset + length).arrayBuffer() };
        const r = await fetch('./map/istanbul.pmtiles', { headers: { Range: `bytes=${offset}-${offset + length - 1}` }, signal });
        if (r.status === 200) { const all = await r.arrayBuffer(); return { data: all.slice(offset, offset + length) }; }
        if (!r.ok) throw new Error('pmtiles ' + r.status);
        return { data: await r.arrayBuffer() };
      },
    };
  },
};

/* Map label glyphs packed in one file: header(len) + JSON index + PBF ranges */
const Glyphs = {
  idx: null, buf: null, loading: null,
  load() {
    if (this.buf) return Promise.resolve();
    if (this.loading) return this.loading;
    this.loading = (async () => {
      let ab = null; const b = await MapPack.blob('./map/glyphs.bin');
      if (b) ab = await b.arrayBuffer(); else { const r = await fetch('./map/glyphs.bin'); if (r.ok) ab = await r.arrayBuffer(); }
      if (!ab) throw new Error('glyphs');
      const n = new DataView(ab).getUint32(0, true);
      this.idx = JSON.parse(new TextDecoder().decode(new Uint8Array(ab, 4, n))); this.buf = ab; this.base = 4 + n;
    })().catch(e => { this.loading = null; throw e; });
    return this.loading;
  },
  async get(url) {
    const m = decodeURIComponent(url).match(/^glyphs:\/\/(.+)\/(\d+-\d+)$/);
    try { await this.load(); } catch (e) { return new ArrayBuffer(0); }
    if (!m) return new ArrayBuffer(0);
    const font = m[1].split(',')[0].trim(), e = this.idx[`${font}/${m[2]}`] || this.idx[`Noto Sans Regular/${m[2]}`];
    return e ? this.buf.slice(this.base + e[0], this.base + e[0] + e[1]) : new ArrayBuffer(0);
  },
};

/* lazy-load MapLibre + PMTiles scripts */
let libsPromise = null;
function loadLibs() {
  if (window.maplibregl && window.pmtiles) return Promise.resolve();
  if (libsPromise) return libsPromise;
  const add = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  libsPromise = add('./vendor/maplibre-gl.js').then(() => add('./vendor/pmtiles.js'));
  return libsPromise;
}

/* ---------------- map style (OpenMapTiles schema, custom "porcelain" palette) ---------------- */
function mapStyle(dark) {
  const P = dark ? {
    bg: '#16202F', water: '#0E3550', water2: '#164866', park: '#1C3A2E', wood: '#1B3528', res: '#1A2536', ind: '#1D2433', bld: '#25324A', bldo: '#2D3B57',
    road: '#2F3D57', road2: '#3C4C6A', major: '#4C5F80', motor: '#6B5A3A', casing: '#101826', path: '#4D5D7A', rail: '#8A93A6', label: '#D9D2C3', halo: '#101826', place: '#F0E6D0', ferry: '#4DA3D9', poi: '#C9B48A', sand: '#2A2A26',
  } : {
    bg: '#F3EEE3', water: '#A8D3E5', water2: '#8FC4DA', park: '#D3E6C5', wood: '#C3DDB2', res: '#EEE7D9', ind: '#E9E2D6', bld: '#E2D9C8', bldo: '#D6CBB6',
    road: '#FFFFFF', road2: '#FFFFFF', major: '#FFF4D9', motor: '#FBD99A', casing: '#D8CEBC', path: '#B9AE98', rail: '#8C8577', label: '#4A4337', halo: '#FFFFFF', place: '#2A2F3D', ferry: '#3C8DC4', poi: '#8A6A2E', sand: '#F1E7C9',
  };
  const F = { r: ['Noto Sans Regular'], b: ['Noto Sans Bold'], i: ['Noto Sans Italic'] };
  const roadW = (base) => ['interpolate', ['exponential', 1.5], ['zoom'], 10, base * 0.4, 14, base * 1.6, 17, base * 5, 19, base * 11];
  const ZS = [[10, 0.4], [14, 1.6], [17, 5], [19, 11]];
  const roadWm = (pairs, dflt) => ['interpolate', ['exponential', 1.5], ['zoom'], ...ZS.flatMap(([z, k]) => [z, ['match', ['get', 'class'], ...pairs.flatMap(([cl, b]) => [cl, b * k]), dflt * k]])];
  const cls = ['get', 'class'];
  const minor = ['match', cls, ['minor', 'service', 'track'], true, false];
  const isPath = ['match', cls, ['path', 'pedestrian'], true, false];
  return {
    version: 8, glyphs: 'glyphs://{fontstack}/{range}',
    sources: { omt: { type: 'vector', url: 'pmtiles://istanbul', attribution: '© <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' } },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': P.bg } },
      { id: 'landuse-res', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: ['match', cls, ['residential', 'suburb', 'neighbourhood'], true, false], paint: { 'fill-color': P.res, 'fill-opacity': 0.7 } },
      { id: 'landuse-ind', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: ['match', cls, ['industrial', 'commercial', 'retail', 'railway', 'garages'], true, false], paint: { 'fill-color': P.ind, 'fill-opacity': 0.6 } },
      { id: 'landuse-edu', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: ['match', cls, ['school', 'university', 'college', 'hospital', 'cemetery', 'religious'], true, false], paint: { 'fill-color': dark ? '#22283A' : '#EDE3D2', 'fill-opacity': 0.8 } },
      { id: 'landcover', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: ['match', cls, ['grass', 'wood', 'farmland', 'wetland'], true, false], paint: { 'fill-color': ['match', cls, 'wood', P.wood, P.park], 'fill-opacity': 0.75 } },
      { id: 'landcover-sand', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: ['==', cls, 'sand'], paint: { 'fill-color': P.sand } },
      { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': P.park, 'fill-opacity': 0.8 } },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', filter: ['!=', ['get', 'brunnel'], 'tunnel'], paint: { 'fill-color': P.water } },
      { id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', paint: { 'line-color': P.water2, 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 17, 3] } },
      { id: 'aeroway', type: 'fill', source: 'omt', 'source-layer': 'aeroway', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': dark ? '#222C3D' : '#E6E1D6' } },
      { id: 'aeroway-line', type: 'line', source: 'omt', 'source-layer': 'aeroway', filter: ['==', ['geometry-type'], 'LineString'], paint: { 'line-color': dark ? '#3A4560' : '#D2CABB', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 12] } },
      { id: 'building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 14, paint: { 'fill-color': P.bld, 'fill-outline-color': P.bldo, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.4, 16, 0.95] } },
      { id: 'ferry', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['==', cls, 'ferry'], minzoom: 11, paint: { 'line-color': P.ferry, 'line-width': 0.9, 'line-dasharray': [4, 4], 'line-opacity': 0.35 } },
      { id: 'tunnel', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['all', ['==', ['get', 'brunnel'], 'tunnel'], ['match', cls, ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false]], paint: { 'line-color': P.casing, 'line-width': roadW(1.4), 'line-opacity': 0.5, 'line-dasharray': [2, 2] } },
      { id: 'path', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 14, filter: ['all', isPath, ['!=', ['get', 'brunnel'], 'tunnel']], paint: { 'line-color': P.path, 'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.6, 18, 2.2], 'line-dasharray': [2, 1.4] } },
      { id: 'road-casing', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['all', ['!=', ['get', 'brunnel'], 'tunnel'], ['match', cls, ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'service'], true, false]], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': P.casing, 'line-width': roadWm([[['motorway', 'trunk'], 2.2], [['primary', 'secondary'], 1.9], ['tertiary', 1.6]], 1.1), 'line-gap-width': 0, 'line-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.3, 14, 1] } },
      { id: 'road-minor', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 12, filter: ['all', ['!=', ['get', 'brunnel'], 'tunnel'], minor], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': P.road, 'line-width': roadW(0.8) } },
      { id: 'road-mid', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['all', ['!=', ['get', 'brunnel'], 'tunnel'], ['match', cls, ['secondary', 'tertiary'], true, false]], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': P.road2, 'line-width': roadWm([['secondary', 1.5]], 1.25) } },
      { id: 'road-major', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['all', ['!=', ['get', 'brunnel'], 'tunnel'], ['match', cls, ['primary', 'trunk', 'motorway'], true, false]], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': ['match', cls, 'primary', P.major, P.motor], 'line-width': roadWm([['primary', 1.6]], 1.8) } },
      { id: 'rail', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['all', ['match', cls, ['rail', 'transit'], true, false], ['!=', ['get', 'brunnel'], 'tunnel']], paint: { 'line-color': P.rail, 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 16, 2.2] } },
      { id: 'rail-ties', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 14, filter: ['all', ['match', cls, ['rail', 'transit'], true, false], ['!=', ['get', 'brunnel'], 'tunnel']], paint: { 'line-color': P.rail, 'line-width': ['interpolate', ['linear'], ['zoom'], 14, 3, 17, 6], 'line-dasharray': [0.2, 2.2] } },
      { id: 'boundary', type: 'line', source: 'omt', 'source-layer': 'boundary', filter: ['==', ['get', 'maritime'], 0], paint: { 'line-color': dark ? '#5A6480' : '#B9AFC8', 'line-width': 1, 'line-dasharray': [3, 2] } },
      { id: 'water-name', type: 'symbol', source: 'omt', 'source-layer': 'water_name', filter: ['==', ['geometry-type'], 'Point'], layout: { 'text-field': ['get', 'name'], 'text-font': F.i, 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 11, 15, 15], 'text-letter-spacing': 0.15, 'text-max-width': 7 }, paint: { 'text-color': dark ? '#7FB3D3' : '#2F6E95', 'text-halo-color': P.water, 'text-halo-width': 1 } },
      { id: 'water-name-l', type: 'symbol', source: 'omt', 'source-layer': 'water_name', filter: ['==', ['geometry-type'], 'LineString'], layout: { 'text-field': ['get', 'name'], 'text-font': F.i, 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 11, 15, 15], 'text-letter-spacing': 0.15, 'symbol-placement': 'line' }, paint: { 'text-color': dark ? '#7FB3D3' : '#2F6E95', 'text-halo-color': P.water, 'text-halo-width': 1 } },
      { id: 'road-label', type: 'symbol', source: 'omt', 'source-layer': 'transportation_name', minzoom: 14, filter: ['match', cls, ['primary', 'secondary', 'tertiary', 'minor', 'trunk', 'pedestrian', 'service'], true, false], layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': F.r, 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 18, 13.5], 'text-max-angle': 30, 'symbol-spacing': 280 }, paint: { 'text-color': P.label, 'text-halo-color': P.halo, 'text-halo-width': 1.4 } },
      { id: 'poi-dot', type: 'circle', source: 'omt', 'source-layer': 'poi', minzoom: 15, filter: ['match', cls, ['place_of_worship', 'museum', 'attraction', 'castle', 'monument', 'ferry_terminal', 'railway', 'harbor'], true, false], paint: { 'circle-radius': 3, 'circle-color': ['match', cls, ['ferry_terminal', 'harbor'], P.ferry, ['railway'], '#7656D6', P.poi], 'circle-stroke-color': P.halo, 'circle-stroke-width': 1 } },
      { id: 'poi-label', type: 'symbol', source: 'omt', 'source-layer': 'poi', minzoom: 15, filter: ['match', cls, ['place_of_worship', 'museum', 'attraction', 'castle', 'monument', 'ferry_terminal', 'railway', 'harbor', 'park'], true, false], layout: { 'text-field': ['get', 'name'], 'text-font': F.r, 'text-size': 11, 'text-offset': [0, 0.8], 'text-anchor': 'top', 'text-max-width': 8, 'text-optional': true }, paint: { 'text-color': ['match', cls, ['ferry_terminal', 'harbor'], P.ferry, ['railway'], '#6A4FC4', P.poi], 'text-halo-color': P.halo, 'text-halo-width': 1.3 } },
      { id: 'airport', type: 'symbol', source: 'omt', 'source-layer': 'aerodrome_label', layout: { 'text-field': ['coalesce', ['get', 'iata'], ['get', 'name']], 'text-font': F.b, 'text-size': 12 }, paint: { 'text-color': P.place, 'text-halo-color': P.halo, 'text-halo-width': 1.5 } },
      { id: 'place-minor', type: 'symbol', source: 'omt', 'source-layer': 'place', minzoom: 12, filter: ['match', cls, ['suburb', 'quarter', 'neighbourhood'], true, false], layout: { 'text-field': ['get', 'name'], 'text-font': F.b, 'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 16, 13], 'text-transform': 'uppercase', 'text-letter-spacing': 0.12, 'text-max-width': 8 }, paint: { 'text-color': dark ? '#B7AE9C' : '#7A6E5A', 'text-halo-color': P.halo, 'text-halo-width': 1.4 } },
      { id: 'place-major', type: 'symbol', source: 'omt', 'source-layer': 'place', filter: ['match', cls, ['city', 'town', 'village', 'island'], true, false], layout: { 'text-field': ['get', 'name'], 'text-font': F.b, 'text-size': ['interpolate', ['linear'], ['zoom'], 6, 11, 12, 15] }, paint: { 'text-color': P.place, 'text-halo-color': P.halo, 'text-halo-width': 1.6 } },
    ],
  };
}

/* ---------------- map view ---------------- */
const IST_BOX = { s: 40.80, n: 41.36, w: 28.45, e: 29.45 };
const inIstanbul = p => p && p.lat > IST_BOX.s && p.lat < IST_BOX.n && p.lng > IST_BOX.w && p.lng < IST_BOX.e;
const MapView = {
  map: null, ready: false, failed: false, markers: [], extra: [], ctx: null, sel: null, follow: false, dark: false, pending: null,
  async init() {
    if (this.map || this.failed) return;
    const el = $('#map');
    try {
      await loadLibs();
      const cv = document.createElement('canvas'); if (!(cv.getContext('webgl2') || cv.getContext('webgl'))) throw new Error('webgl');
    } catch (e) { this.fail(); return; }
    await Tiles.useCache();
    const proto = new pmtiles.Protocol();
    proto.add(new pmtiles.PMTiles(Tiles.source()));
    maplibregl.addProtocol('pmtiles', proto.tile);
    maplibregl.addProtocol('glyphs', async (params) => ({ data: await Glyphs.get(params.url) }));
    this.dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const m = this.map = new maplibregl.Map({
      container: el, style: mapStyle(this.dark), center: [28.9725, 41.0257], zoom: 13.4, minZoom: 8, maxZoom: 19,
      maxBounds: [[27.4, 40.2], [30.4, 41.8]], attributionControl: false, dragRotate: true, pitchWithRotate: false, touchPitch: false, fadeDuration: 0,
    });
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    m.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: 'metric' }), 'bottom-right');
    m.on('load', () => { this.addLayers(); this.ready = true; if (this.pending) { const p = this.pending; this.pending = null; this.show(p); } else this.show(this.ctx || { type: 'day', dayId: currentDay().id }); });
    m.on('dragstart', () => { if (this.follow) { this.follow = false; this.renderTools(); } });
    m.on('rotate', () => Geo.paintHeading());
    m.on('click', e => { if (e.originalEvent && e.originalEvent.target === m.getCanvas()) { if (!Nav.active) this.closeSheet(); } });
    // long-press → add your own spot
    let lp = null, lpStart = null;
    const cancel = () => { clearTimeout(lp); lp = null; };
    m.on('touchstart', e => { if (!e.originalEvent.touches || e.originalEvent.touches.length !== 1) return cancel(); lpStart = e.point; const ll = e.lngLat; cancel(); lp = setTimeout(() => { lp = null; UI.addCustomSheet(ll); }, 650); });
    m.on('touchmove', e => { if (lpStart && e.point && Math.hypot(e.point.x - lpStart.x, e.point.y - lpStart.y) > 10) cancel(); });
    m.on('touchend', cancel); m.on('touchcancel', cancel); m.on('movestart', () => { if (lp && lpStart) { /* small drift tolerated */ } });
    m.on('contextmenu', e => UI.addCustomSheet(e.lngLat));
    m.on('error', e => { if (e && e.error) console.warn('map', e.error.message || e.error); });
    this.renderTools();
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', ev => { if (!document.documentElement.dataset.theme) { this.dark = ev.matches; this.restyle(); } });
  },
  fail() { this.failed = true; const f = $('#mapFallback'); f.hidden = false; f.innerHTML = `<div>${ic('map')}<p>${esc(LANG === 'tr' ? 'Bu tarayıcı haritayı (WebGL) gösteremiyor. Plan ve listeler çalışmaya devam eder.' : LANG === 'en' ? 'This browser cannot display the map (WebGL). The itinerary and lists keep working.' : 'Este navegador não consegue exibir o mapa (WebGL). O roteiro e as listas continuam funcionando.')}</p></div>`; },
  restyle() { if (!this.map) return; this.ready = false; this.map.setStyle(mapStyle(this.dark)); this.map.once('styledata', () => { this.addLayers(); this.ready = true; this.draw(); Nav.draw(); }); },
  addLayers() {
    const m = this.map, empty = { type: 'FeatureCollection', features: [] };
    for (const id of ['plan', 'live', 'acc']) if (!m.getSource(id)) m.addSource(id, { type: 'geojson', data: empty });
    const W = this.dark ? '#0D1420' : '#FFFFFF';
    const walkC = this.dark ? '#3CCB86' : '#159A5B', rideC = this.dark ? '#A08BF5' : '#6F4FD8';
    const lw = (b) => ['interpolate', ['linear'], ['zoom'], 11, b * 0.6, 15, b, 18, b * 1.5];
    m.addLayer({ id: 'acc', type: 'fill', source: 'acc', paint: { 'fill-color': '#1F7AE0', 'fill-opacity': 0.12, 'fill-outline-color': '#1F7AE0' } });
    m.addLayer({ id: 'plan-ride-case', type: 'line', source: 'plan', filter: ['==', ['get', 'k'], 'ride'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': W, 'line-width': lw(9), 'line-opacity': ['case', ['==', ['get', 'f'], 1], 0.35, 0.95] } });
    m.addLayer({ id: 'plan-ride', type: 'line', source: 'plan', filter: ['==', ['get', 'k'], 'ride'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': rideC, 'line-width': lw(5), 'line-opacity': ['case', ['==', ['get', 'f'], 1], 0.3, 1] } });
    m.addLayer({ id: 'plan-walk-case', type: 'line', source: 'plan', filter: ['==', ['get', 'k'], 'walk'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': W, 'line-width': lw(8), 'line-opacity': ['case', ['==', ['get', 'f'], 1], 0.3, 0.9] } });
    m.addLayer({ id: 'plan-walk', type: 'line', source: 'plan', filter: ['==', ['get', 'k'], 'walk'], layout: { 'line-join': 'round' }, paint: { 'line-color': walkC, 'line-width': lw(4.2), 'line-dasharray': [1.5, 1.2], 'line-opacity': ['case', ['==', ['get', 'f'], 1], 0.3, 1] } });
    m.addLayer({ id: 'live-ride-case', type: 'line', source: 'live', filter: ['==', ['get', 'k'], 'ride'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': W, 'line-width': lw(11) } });
    m.addLayer({ id: 'live-ride', type: 'line', source: 'live', filter: ['==', ['get', 'k'], 'ride'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': rideC, 'line-width': lw(6.5) } });
    m.addLayer({ id: 'live-walk-case', type: 'line', source: 'live', filter: ['==', ['get', 'k'], 'walk'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': W, 'line-width': lw(10) } });
    m.addLayer({ id: 'live-walk', type: 'line', source: 'live', filter: ['==', ['get', 'k'], 'walk'], layout: { 'line-join': 'round' }, paint: { 'line-color': '#0F8F52', 'line-width': lw(5.5), 'line-dasharray': [1.4, 1.1] } });
  },
  /* contexts: day | circuit | all | leg | route | place */
  show(ctx) {
    this.ctx = ctx;
    if (!this.map || !this.ready) { this.pending = ctx; return; }
    if (ctx.type === 'day' && ctx.dayId) { S.day = ctx.dayId; save(); }
    this.closeSheet(true); this.draw(); this.renderTop(); this.fit();
    if (ctx.type === 'place') this.select(ctx.id);
    if (ctx.type === 'leg' || ctx.type === 'route') this.legSheet(ctx);
  },
  model() {
    const c = this.ctx || { type: 'day', dayId: currentDay().id };
    if (c.type === 'all' || c.type === 'place') {
      const ids = Object.values(PL).filter(p => !p.unmapped && p.id !== 'base' && p.id !== 'university' && !S.trash.includes(p.id)).map(p => p.id);
      return { stops: ids.map(id => ({ id })), legs: [], numbered: false, extra: ['base', 'university'] };
    }
    if (c.type === 'circuit') {
      const cc = TRIP.circuits.find(x => x.id === c.id); const sc = schedule(cc);
      return { stops: sc.stops, legs: legsOf(cc, sc.stops), numbered: true, extra: ['university'], day: cc };
    }
    if (c.type === 'route') {
      const [a, b] = c.key.split('__');
      return { stops: [], legs: [{ from: a, to: b, key: c.key, mode: 'transit' }], numbered: false, extra: [b === 'base' ? 'base' : b, a === 'ist' ? null : a].filter(Boolean) };
    }
    const day = dayById(c.dayId) || currentDay(); const sc = schedule(day);
    const brk = TRIP.breaks.filter(b => b.date === day.date).map(b => ({ b, sc: schedule(b) }));
    const legs = legsOf(day, sc.stops);
    let stops = sc.stops;
    if (c.type === 'leg') return { stops, legs, focus: c.key, numbered: true, extra: ['base'], day, brk };
    return { stops, legs, numbered: true, extra: ['base'].concat(brk.length ? ['university'] : []), day, brk };
  },
  draw() {
    if (!this.map || !this.ready) return;
    const md = this.model(); this.md = md;
    const feats = [];
    const addRoute = (key, faded) => {
      let r;
      if (key === 'ist__base') r = ROUTES.ist__base; else { const [a, b] = key.split('__'); if (!PL[a] || !PL[b]) return; r = legRoute(PL[a], PL[b]); }
      if (!r) return;
      for (const s of r.segs) feats.push({ type: 'Feature', properties: { k: s.m === 'walk' ? 'walk' : 'ride', f: faded ? 1 : 0 }, geometry: { type: 'LineString', coordinates: s.c } });
      return r;
    };
    const doneIdx = new Set(md.stops.filter(s => S.done[s.id]).map(s => s.id));
    for (const l of md.legs) {
      const faded = md.focus ? l.key !== md.focus : (doneIdx.has(l.to) && (doneIdx.has(l.from) || l.from === 'base' || l.from === 'university'));
      addRoute(l.key, faded);
    }
    if (md.brk) for (const { b, sc } of md.brk) for (const l of legsOf(b, sc.stops)) addRoute(l.key, true);
    this.map.getSource('plan').setData({ type: 'FeatureCollection', features: feats });
    // markers
    this.markers.forEach(mk => mk.remove()); this.markers = [];
    const mkEl = (html, cls, onClick) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (onClick) d.addEventListener('click', ev => { ev.stopPropagation(); onClick(); }); return d; };
    md.stops.forEach((s, i) => {
      const p = PL[s.id]; if (!p || p.unmapped) return;
      const done = !!S.done[s.id];
      const el = mkEl(done ? ic('check') : md.numbered ? String(i + 1) : ic(kindIcon(p), 's'), `mk mk-${p.kind}${done ? ' done' : ''}${this.sel === s.id ? ' sel' : ''}`, () => this.select(s.id));
      el.dataset.id = s.id;
      this.markers.push(new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(this.map));
    });
    if (md.brk) for (const { sc } of md.brk) sc.stops.forEach(s => { const p = PL[s.id]; if (!p) return; const el = mkEl(ic(kindIcon(p), 's'), `mk mk-${p.kind} ghost${S.done[s.id] ? ' done' : ''}`, () => this.select(s.id)); el.dataset.id = s.id; this.markers.push(new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(this.map)); });
    for (const id of md.extra || []) {
      const p = PL[id]; if (!p) continue;
      const el = mkEl(ic(id === 'base' ? 'home' : 'cap'), `mk ${id === 'base' ? 'base' : 'uni'}`, () => this.select(id));
      this.markers.push(new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(this.map));
    }
    // transit stations on the visible legs
    const seen = new Set();
    const stLegs = md.legs.map(l => l.key === 'ist__base' ? ROUTES.ist__base : (ROUTES[l.key] && ROUTES[l.key].mode === 'transit' ? ROUTES[l.key] : null)).filter(Boolean);
    for (const r of stLegs) for (const s of r.segs) if (s.m !== 'walk' && s.from) {
      for (const [nm, pt] of [[s.from, s.c[0]], [s.to, s.c[s.c.length - 1]]]) {
        const k = s.m + nm; if (seen.has(k)) continue; seen.add(k);
        const tag = s.m === 'bus' ? '🚌' : s.m === 'ferry' ? '⛴' : (s.line || ''); const el = mkEl(`${esc(tag)} ${esc(nm)}`, `st-pin ${s.m}`);
        this.markers.push(new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -6] }).setLngLat(pt).addTo(this.map));
      }
    }
    this.renderLegend();
  },
  fit(pad) {
    if (!this.map) return;
    const md = this.md || this.model(); const pts = [];
    const add = p => { if (p && !p.unmapped) pts.push([p.lng, p.lat]); };
    if (md.focus) { const [a, b] = md.focus.split('__'); const r = legRoute(PL[a], PL[b]); r.segs.forEach(s => s.c.forEach(c => pts.push(c))); }
    else if (this.ctx && this.ctx.type === 'route') { const r = this.ctx.key === 'ist__base' ? ROUTES.ist__base : legRoute(PL[this.ctx.key.split('__')[0]], PL[this.ctx.key.split('__')[1]]); r.segs.forEach(s => s.c.forEach(c => pts.push(c))); }
    else { md.stops.forEach(s => add(PL[s.id])); (md.extra || []).forEach(id => add(PL[id])); if (md.brk) md.brk.forEach(({ sc }) => sc.stops.forEach(s => add(PL[s.id]))); }
    if (!pts.length) return;
    const b = pts.reduce((bb, c) => bb.extend(c), new maplibregl.LngLatBounds(pts[0], pts[0]));
    const sheetH = $('#mapSheet').hidden ? 0 : Math.min($('#mapSheet').offsetHeight, innerHeight * 0.4);
    this.map.fitBounds(b, { padding: { top: 96, bottom: 64 + sheetH + (pad || 0), left: 36, right: 72 }, maxZoom: 16.5, duration: 600 });
  },
  renderTop() {
    const c = this.ctx || {};
    let title = '', sub = '';
    if (c.type === 'all' || c.type === 'place') { title = t('allPlaces'); sub = `${Object.values(PL).filter(p => !p.unmapped && p.kind !== 'base').length} · ${t('longPress')}`; }
    else if (c.type === 'circuit') { const cc = TRIP.circuits.find(x => x.id === c.id); title = L(cc.title); sub = `${t('tabIntervalo')} · ${t('faculty')}`; }
    else if (c.type === 'route') { title = c.key === 'ist__base' ? L(TRIP.guide.arrTitle) : t('facT'); sub = c.key === 'ist__base' ? 'M11 → M2 → Şişhane' : 'T1 Karaköy → Laleli–Üniversite'; }
    else { const d = dayById(c.dayId) || currentDay(); title = `${dayLabel(d)} · ${L(d.title)}`; sub = fmtDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' }); }
    $('#mapTop').innerHTML = `<div class="ctx">
      <button class="btn icon" data-act="map-prev" aria-label="prev">${ic('chevL')}</button>
      <button class="cur" data-act="map-daypick"><b>${esc(title)}</b><small>${esc(sub)}</small></button>
      <button class="btn icon" data-act="map-next" aria-label="next">${ic('chevR')}</button></div>`;
  },
  renderTools() {
    $('#mapTools').innerHTML = `
      <button class="mt ${this.follow ? 'follow' : Geo.watching ? 'on' : ''}" data-act="gps" aria-label="${esc(t('locate'))}">${ic(this.follow ? 'nav' : 'locate')}</button>
      <button class="mt ${Geo.compass ? 'on' : ''}" data-act="compass" aria-label="${esc(t('compass'))}">${ic('compass')}</button>
      <button class="mt" data-act="map-fit" aria-label="${esc(t('fit'))}">${ic('expand')}</button>
      <button class="mt ${this.ctx && (this.ctx.type === 'all' || this.ctx.type === 'place') ? 'on' : ''}" data-act="map-all" aria-label="${esc(t('allPlaces'))}">${ic('layers')}</button>
      <button class="mt" data-act="nav-home" aria-label="${esc(t('homeBtn'))}">${ic('home')}</button>`;
  },
  renderLegend() { $('#mapLegend').innerHTML = `<span><i class="lg-walk"></i>${esc(t('walk'))}</span><span><i class="lg-ride"></i>${esc(t('transit'))}</span>`; },
  select(id) {
    this.sel = id; $$('.mk').forEach(m => m.classList.toggle('sel', m.dataset.id === id));
    const p = PL[id]; if (!p) return;
    if (Nav.active) return;
    const md = this.md || {}; const st = (md.stops || []).find(s => s.id === id);
    const day = md.day; const num = st ? (md.stops.indexOf(st) + 1) : null;
    const done = !!S.done[id], inf = infoOf(p, day && day.date ? new Date(day.date + 'T12:00:00Z').getUTCDay() : undefined);
    const sh = $('#mapSheet'); sh.hidden = false;
    sh.innerHTML = `<div class="ms-h">${phHTML(id)}<div class="sc-txt"><div class="sc-top">${st && st.time && st.time !== '—' ? `<span class="time">${st.time}</span>` : ''}<span class="kind">${esc(kindLabel(p))}${num && md.numbered ? ' · ' + num : ''}</span></div><h4 style="font-family:var(--serif);margin:2px 0;font-size:18px">${esc(p.name)}</h4><div class="sub" style="font-size:12.5px;color:var(--muted);font-weight:600">${esc(p.area || '')}${p.rating ? ` · <span style="color:var(--gold)">★ ${String(p.rating).replace('.', LANG === 'en' ? '.' : ',')}</span>` : ''}</div></div><button class="btn icon x" data-act="sheet-close">${ic('x')}</button></div>
      <div class="ms-b"><p style="margin:0 0 10px;font-size:13.5px;line-height:1.5;color:var(--ink-2)">${esc(L(p.description))}</p>
      ${p.kind !== 'base' ? `<dl class="facts"><dt>${ic('clock', 's')}</dt><dd>${esc(L(inf.hours))}</dd><dt>${ic('ticket', 's')}</dt><dd>${esc(L(inf.price))}</dd></dl>` : ''}
      <div class="sc-act" style="padding:0">${p.kind !== 'base' ? `<button class="btn ${done ? 'ok' : 'pri'}" data-act="toggle" data-id="${id}">${ic(done ? 'undo' : 'check', 's')}${esc(done ? t('undo') : t('conclude'))}</button>` : ''}
      <button class="btn" data-act="nav" data-id="${id}">${ic('nav', 's')}${esc(t('go'))}</button>
      <a class="btn" href="${esc(googleURL(p))}" target="_blank" rel="noopener">${ic('ext', 's')}Google</a></div></div>`;
    this.map.easeTo({ center: [p.lng, p.lat], offset: [0, -Math.min(sh.offsetHeight, innerHeight * .4) / 2], duration: 400 });
  },
  legSheet(ctx) {
    let r, a, b;
    if (ctx.key === 'ist__base') { r = ROUTES.ist__base; a = { name: 'IST' }; b = PL.base; }
    else { [a, b] = ctx.key.split('__').map(id => PL[id]); r = legRoute(a, b); }
    const sh = $('#mapSheet'); sh.hidden = false;
    sh.innerHTML = `<div class="nav-card"><div style="display:flex;align-items:center;gap:8px"><div><div class="eyebrow">${esc(r.mode === 'walk' ? t('walk') : t('transit'))} · ${fmtDist(r.d)} · ~${fmtMin(r.est || r.segs.reduce((x, s) => x + (SPEED[s.m] ? segMin(s) : 0), 0))}</div><b style="font-family:var(--serif);font-size:18px">${esc(a.name)} → ${esc(b.name)}</b></div><button class="btn icon x" style="margin-left:auto" data-act="sheet-close">${ic('x')}</button></div>${UI.legSteps(r)}${ctx.key !== 'ist__base' && a.lat ? `<div class="links" style="margin-top:10px"><a href="${esc(googleDir(a, b, r.mode === 'walk' ? 'walking' : 'transit'))}" target="_blank" rel="noopener">${ic('ext', 's')} Google Maps</a></div>` : ''}</div>`;
  },
  closeSheet(silent) { const sh = $('#mapSheet'); sh.hidden = true; sh.innerHTML = ''; this.sel = null; $$('.mk.sel').forEach(m => m.classList.remove('sel')); if (!silent && Nav.active) Nav.renderSheet(); },
  step(dir) {
    const c = this.ctx || { type: 'day', dayId: currentDay().id };
    if (c.type === 'circuit') { const i = TRIP.circuits.findIndex(x => x.id === c.id); const n = TRIP.circuits[(i + dir + TRIP.circuits.length) % TRIP.circuits.length]; return this.show({ type: 'circuit', id: n.id }); }
    const d = dayById(c.dayId) || currentDay(); const i = DAYS.indexOf(d); const n = DAYS[Math.min(DAYS.length - 1, Math.max(0, i + dir))];
    this.show({ type: 'day', dayId: n.id });
  },
};

/* ---------------- GPS + compass ---------------- */
const Geo = {
  watching: false, pos: null, id: null, compass: false, heading: null, marker: null, err: null, waiters: [],
  start() {
    if (this.watching) return;
    if (!window.isSecureContext) { UI.toast(t('gpsNoHttps')); return; }
    if (!navigator.geolocation) { UI.toast(t('gpsNoHttps')); return; }
    this.watching = true; UI.toast(t('gpsWait'));
    this.id = navigator.geolocation.watchPosition(p => this.onPos(p), e => this.onErr(e), { enableHighAccuracy: true, maximumAge: 4000, timeout: 30000 });
    MapView.renderTools();
  },
  stop() { if (this.id != null) navigator.geolocation.clearWatch(this.id); this.watching = false; this.id = null; MapView.follow = false; MapView.renderTools(); },
  onErr(e) { this.err = e; if (e.code === 1) { UI.toast(t('gpsDenied')); this.stop(); } this.waiters.splice(0).forEach(f => f(null)); },
  onPos(p) {
    const c = p.coords; this.pos = { lat: c.latitude, lng: c.longitude, acc: c.accuracy, heading: c.heading, speed: c.speed, ts: Date.now() };
    if (c.heading != null && !isNaN(c.heading) && c.speed > 0.8 && !this.compass) this.heading = c.heading;
    this.paint();
    this.waiters.splice(0).forEach(f => f(this.pos));
    if (MapView.follow && MapView.map) MapView.map.easeTo({ center: [this.pos.lng, this.pos.lat], duration: 500, ...(this.compass && this.heading != null ? { bearing: this.heading } : {}) });
    Nav.onPos(this.pos);
  },
  fresh(maxAge = 60000) { return this.pos && Date.now() - this.pos.ts < maxAge ? this.pos : null; },
  wait(ms) { if (this.fresh(20000)) return Promise.resolve(this.pos); this.start(); return new Promise(res => { this.waiters.push(res); setTimeout(() => res(this.fresh(60000)), ms); }); },
  paint() {
    const m = MapView.map; if (!m || !MapView.ready || !this.pos) return;
    if (!this.marker) { const el = document.createElement('div'); el.className = 'me'; el.innerHTML = '<div class="cone"></div><div class="d"></div>'; this.marker = new maplibregl.Marker({ element: el }).setLngLat([this.pos.lng, this.pos.lat]).addTo(m); }
    this.marker.setLngLat([this.pos.lng, this.pos.lat]);
    const n = 48, R = Math.min(this.pos.acc || 0, 500), pts = [];
    for (let i = 0; i <= n; i++) { const a = i / n * 2 * Math.PI; pts.push([this.pos.lng + R / (111320 * Math.cos(this.pos.lat * Math.PI / 180)) * Math.cos(a), this.pos.lat + R / 110540 * Math.sin(a)]); }
    m.getSource('acc') && m.getSource('acc').setData({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [pts] }, properties: {} });
    this.paintHeading();
  },
  paintHeading() {
    if (!this.marker) return; const el = this.marker.getElement();
    if (this.heading == null) { el.classList.remove('head'); return; }
    el.classList.add('head'); const b = MapView.map ? MapView.map.getBearing() : 0;
    el.querySelector('.cone').style.transform = `rotate(${this.heading - b}deg)`;
  },
  async toggleCompass() {
    if (this.compass) { this.compass = false; window.removeEventListener('deviceorientation', this._or, true); window.removeEventListener('deviceorientationabsolute', this._or, true); if (MapView.map) MapView.map.easeTo({ bearing: 0 }); MapView.renderTools(); return; }
    try { if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') { const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') { UI.toast(t('gpsDenied')); return; } } } catch (e) { }
    this._or = this._or || (ev => {
      let h = null;
      if (ev.webkitCompassHeading != null) h = ev.webkitCompassHeading;
      else if (ev.absolute && ev.alpha != null) h = (360 - ev.alpha) % 360;
      if (h == null) return; this.heading = h; this.paintHeading();
      if (MapView.follow && MapView.map && !this._rot) { this._rot = true; MapView.map.rotateTo(h, { duration: 200 }); setTimeout(() => this._rot = false, 250); }
    });
    window.addEventListener('deviceorientationabsolute', this._or, true); window.addEventListener('deviceorientation', this._or, true);
    this.compass = true; this.start(); MapView.follow = true; MapView.renderTools();
  },
};

/* ---------------- navigation (offline) ---------------- */
const Nav = {
  active: false, target: null, route: null, origin: null, note: '', arrived: false, lastCalc: 0, fromId: null,
  async start(targetId, fromId) {
    const target = PL[targetId]; if (!target) return;
    UI.go('mapa'); await MapView.init(); if (MapView.failed) return;
    this.active = true; this.target = target; this.fromId = fromId; this.arrived = false;
    this.renderSheet(true);
    await Walk.load();
    const pos = await Geo.wait(9000);
    this.compute(pos);
    MapView.follow = !!(pos && inIstanbul(pos)); MapView.renderTools();
  },
  compute(pos) {
    const tg = this.target, prev = this.fromId ? PL[this.fromId] : null;
    const here = pos && inIstanbul(pos) ? { id: 'current', lat: pos.lat, lng: pos.lng } : null;
    let r = null, note = '', origin = here || prev || PL.base;
    const plan = prev ? ROUTES[`${prev.id}__${tg.id}`] : null;
    if (here && plan && plan.mode === 'transit' && hav(here, prev) < 0.35) { r = { ...plan }; note = t('navPlan'); origin = prev; }
    else if (here && sideOf(here) === sideOf(tg) && hav(here, tg) < 4.5 && Walk.ready && Walk.inBox(here) && Walk.inBox(tg)) { const w = Walk.route(here, tg); if (w) { r = { mode: 'walk', segs: [{ m: 'walk', c: w.c, d: w.d }], d: w.d }; note = t('navWalk'); } }
    if (!r && plan) { r = { ...plan }; note = (here ? '' : (pos ? t('gpsFar') + ' ' : '')) + (plan.mode === 'transit' ? t('navPlan') : t('navWalkPlan')); origin = prev; }
    if (!r && !here && prev) { const lr = legRoute(prev, tg); r = lr; note = (pos ? t('gpsFar') : '') + ' ' + (lr.mode === 'walk' ? t('navWalk') : t('navFar')); origin = prev; }
    if (!r && here) { const c = [[here.lng, here.lat], [tg.lng, tg.lat]]; r = { mode: 'ride', segs: [{ m: 'ride', c, d: lineLen(c), straight: true }], d: lineLen(c) }; note = t('navFar'); }
    if (!r) { const lr = legRoute(PL.base, tg); r = lr; origin = PL.base; note = t('routeFrom') + ' Airbnb.'; }
    this.route = r; this.origin = origin; this.note = note.trim(); this.lastCalc = Date.now();
    this.draw(); this.renderSheet();
    const pts = []; r.segs.forEach(s => s.c.forEach(c => pts.push(c)));
    if (pts.length && MapView.map) { const b = pts.reduce((bb, c) => bb.extend(c), new maplibregl.LngLatBounds(pts[0], pts[0])); MapView.map.fitBounds(b, { padding: { top: 90, bottom: 260, left: 40, right: 70 }, maxZoom: 17, duration: 600 }); }
  },
  draw() {
    const m = MapView.map; if (!m || !MapView.ready) return;
    const f = this.active && this.route ? this.route.segs.map(s => ({ type: 'Feature', properties: { k: s.m === 'walk' ? 'walk' : 'ride' }, geometry: { type: 'LineString', coordinates: s.c } })) : [];
    m.getSource('live') && m.getSource('live').setData({ type: 'FeatureCollection', features: f });
  },
  remaining(pos) {
    const c = this.route.segs.flatMap(s => s.c); if (!c.length) return null;
    let bi = 0, bd = Infinity;
    for (let i = 0; i < c.length; i++) { const d = mDist([pos.lng, pos.lat], c[i]); if (d < bd) { bd = d; bi = i; } }
    let rest = 0; for (let i = bi + 1; i < c.length; i++) rest += mDist(c[i - 1], c[i]);
    return { off: bd, rest: rest + bd };
  },
  onPos(pos) {
    if (!this.active || !this.route) return;
    const dT = hav(pos, this.target) * 1000;
    if (dT < 40 && !this.arrived) { this.arrived = true; this.renderSheet(); if (navigator.vibrate) navigator.vibrate(120); return; }
    const rm = this.remaining(pos);
    if (rm && rm.off > 45 && Date.now() - this.lastCalc > 12000 && this.route.mode === 'walk' && inIstanbul(pos)) { this.compute(pos); return; }
    this.rest = rm ? rm.rest : null; this.renderSheet();
  },
  stop() { this.active = false; this.route = null; this.draw(); MapView.closeSheet(true); MapView.follow = false; MapView.renderTools(); },
  renderSheet(loading) {
    if (!this.active) return; const tg = this.target; const sh = $('#mapSheet'); sh.hidden = false;
    if (loading || !this.route) { sh.innerHTML = `<div class="nav-card"><div class="eyebrow">${esc(t('go'))}</div><b style="font-family:var(--serif);font-size:19px">${esc(tg.name)}</b><p style="color:var(--muted);font-size:13px;margin:6px 0 0">${esc(t('gpsWait'))}</p></div>`; return; }
    const r = this.route, d = this.rest != null ? this.rest : r.d;
    const mins = r.mode === 'walk' ? d / 75 : (r.segs.reduce((x, s) => x + (SPEED[s.m] ? segMin(s) : s.d / 250), 0));
    sh.innerHTML = `<div class="nav-card">
      <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:0"><div class="eyebrow">${esc(t('go'))} · ${esc(r.mode === 'walk' ? t('walk') : t('transit'))}</div><b style="font-family:var(--serif);font-size:19px;display:block">${esc(tg.name)}</b></div><button class="btn sm ghost" style="margin-left:auto" data-act="nav-stop">${ic('x', 's')}${esc(t('stopNav'))}</button></div>
      <div class="nav-big">${fmtDist(d)} <small>· ~${fmtMin(mins)} ${esc(t('remaining'))}</small></div>
      ${this.arrived ? `<div class="arrived">${ic('check')} ${esc(t('arrivedAt'))}: ${esc(tg.name)} <button class="btn sm ok" style="margin-left:auto" data-act="toggle" data-id="${tg.id}">${esc(S.done[tg.id] ? '✓' : t('conclude'))}</button></div>` : ''}
      <p style="font-size:12.5px;color:var(--muted);margin:4px 0 6px;font-weight:600">${esc(this.origin && this.origin.id !== 'current' ? t('routeFrom') + ' ' + this.origin.name + '. ' : '')}${esc(this.note)}</p>
      ${r.mode !== 'walk' ? UI.legSteps(r) : ''}
      <div class="links"><a href="${esc(googleDir(this.origin.id === 'current' ? this.origin : this.origin, tg, r.mode === 'walk' ? 'walking' : 'transit'))}" target="_blank" rel="noopener">${ic('ext', 's')} Google Maps (online)</a></div></div>`;
  },
};

/* ---------------- days ---------------- */
const DAYS = TRIP.days.slice().sort((a, b) => a.date.localeCompare(b.date));
const dayById = id => DAYS.find(d => d.id === id);
const todayISO = () => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };
function currentDay() { return dayById(S.day) || DAYS.find(d => d.date === todayISO()) || DAYS[0]; }
const dayLabel = d => d.number ? `${t('day')} ${d.number}` : d.date === '2026-10-21' ? t('arrivalDay') : d.departure ? t('departureDay') : t('extra');
const dayPlaces = d => [...new Set([...d.stops.map(s => s.id), ...(S.additions[d.id] || [])])];
const whereScheduled = (() => { let cache = null; return (id) => { if (!cache) { cache = {}; for (const d of DAYS) for (const pid of dayPlaces(d)) (cache[pid] ||= []).push(d.id); for (const b of TRIP.breaks) for (const s of b.stops) (cache[s.id] ||= []).push(b.date); } return cache[id] || []; }; })();

/* ---------------- UI ---------------- */
const UI = {
  view: 'roteiro', filter: 'all', q: '', open: new Set(), openLeg: new Set(), arm: null,
  go(v) {
    this.view = v; $$('.view').forEach(x => x.classList.toggle('on', x.id === 'view-' + v));
    this.renderTabs();
    if (v === 'mapa') { MapView.init().then(() => { if (MapView.map) { MapView.map.resize(); if (MapView.ready && !MapView.ctx) MapView.show({ type: 'day', dayId: currentDay().id }); } }); }
    else this.render();
    try { history.replaceState(null, '', '#' + v); } catch (e) { }
  },
  renderTabs() {
    const tabs = [['roteiro', 'route', 'tabRoteiro'], ['mapa', 'map', 'tabMapa'], ['lugares', 'pin', 'tabLugares'], ['intervalo', 'clock', 'tabIntervalo'], ['guia', 'book', 'tabGuia']];
    $('#tabbar').innerHTML = tabs.map(([v, i, k]) => `<button class="${this.view === v ? 'on' : ''}" data-tab="${v}">${ic(i)}<span>${esc(t(k))}</span></button>`).join('');
    $$('.langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
    document.documentElement.lang = LOC[LANG];
  },
  render() {
    if (this.view === 'roteiro') this.renderRoteiro();
    else if (this.view === 'lugares') this.renderLugares();
    else if (this.view === 'intervalo') this.renderIntervalo();
    else if (this.view === 'guia') this.renderGuia();
    this.renderNet();
  },
  refresh() { this.render(); if (MapView.map && MapView.ready) { MapView.draw(); if (MapView.sel && !$('#mapSheet').hidden) MapView.select(MapView.sel); } },

  /* ---------- Roteiro ---------- */
  renderRoteiro() {
    const d = currentDay(), sc = schedule(d), ci = classInfo(d.date);
    const all = sc.stops, pend = all.filter(s => !S.done[s.id]), done = all.filter(s => S.done[s.id]);
    const totalPl = new Set(DAYS.flatMap(x => dayPlaces(x)).concat(TRIP.breaks.flatMap(b => b.stops.map(s => s.id))).filter(id => PL[id] && !S.trash.includes(id)));
    const doneN = [...totalPl].filter(id => S.done[id]).length;
    const hero = all.map(s => s.id).find(id => photoURL(id)) || (TRIP.breaks.find(b => b.date === d.date)?.stops.map(s => s.id).find(id => photoURL(id)));
    const pct = all.length ? Math.round(done.length / all.length * 100) : 0;
    const dates = DAYS.map(x => {
      const xs = schedule(x).stops, alld = xs.length && xs.every(s => S.done[s.id]);
      const cls = classInfo(x.date).classes.length;
      return `<button class="date ${x.id === d.id ? 'on' : ''} ${alld ? 'alldone' : ''}" data-day="${x.id}"><span class="marks">${cls ? '<i class="mk class"></i>' : ''}${x.date === todayISO() ? '<i class="mk today"></i>' : ''}</span><span class="wd">${esc(fmtDate(x.date, { weekday: 'short' }).replace('.', ''))}</span><span class="dn">${fmtDate(x.date, { day: 'numeric' })}</span><span class="mo">${esc(fmtDate(x.date, { month: 'short' }).replace('.', ''))}</span></button>`;
    }).join('');
    const brks = TRIP.breaks.filter(b => b.date === d.date);
    let h = `<div class="datestrip"><div class="dates" id="dates">${dates}</div></div><div class="wrap">
      <div class="hero">${hero ? `<img src="${photoURL(hero)}" alt="">` : ''}
        ${all.length ? `<div class="ring" style="--p:${pct}"><span>${done.length}/${all.length}<small>${esc(t('done'))}</small></span></div>` : ''}
        <div class="hero-in"><div class="hero-k"><span class="chip gold">${esc(dayLabel(d))}</span><span class="chip">${ic('cal', 'xs')}${esc(fmtDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' }))}</span></div>
        <h1>${esc(L(d.title))}</h1><div class="area">${esc(L(d.area))}</div>
        <div class="hero-k" style="margin:10px 0 0">${ci.classes.length ? `<span class="chip">${ic('cap', 'xs')}${esc(t('classesT'))}</span>` : `<span class="chip">${ic('heart', 'xs')}${esc(t('noClass'))}</span>`}${all.length ? `<span class="chip">${ic('pin', 'xs')}${all.length} ${esc(t('stops'))}</span>` : ''}</div></div></div>
      <p class="note">${esc(L(d.note))}</p>
      <div class="card trip-prog"><div style="flex:1"><b>${doneN} / ${totalPl.size}</b> <small>${esc(t('tripProg'))}</small><div class="bar" style="margin-top:7px"><i style="width:${totalPl.size ? doneN / totalPl.size * 100 : 0}%"></i></div></div><button class="btn sm" data-act="map-day" data-day="${d.id}">${ic('map', 's')}${esc(t('mapBtn'))}</button></div>`;
    if (d.date === '2026-10-21') h += this.arrivalCard();
    if (d.departure) h += this.departureCard();
    if (ci.classes.length || ci.arrival) h += this.classesCard(d, ci);
    for (const b of brks) h += this.breakCard(b);
    if (!d.departure || all.length) {
      h += `<div class="sec-h"><h2>${esc(t('tabRoteiro'))}</h2><span class="meta">${done.length} ${esc(t('done'))} · ${pend.length} ${esc(t('stops'))}</span></div>`;
      h += this.timeline(d, sc);
    }
    h += `<button class="btn wide ghost" style="margin-top:14px;height:44px" data-act="add-sheet" data-day="${d.id}">${ic('plus', 's')}${esc(t('addPlace'))}</button>`;
    h += this.doneFold(done.map(s => s.id), d);
    const tr = dayPlaces(d).filter(id => S.trash.includes(id) && PL[id]);
    if (tr.length) h += this.trashFold(tr);
    h += '</div>';
    const v = $('#view-roteiro'), y = v.scrollTop, sx = $('#dates') ? $('#dates').scrollLeft : null;
    v.innerHTML = h;
    const ds = $('#dates'); if (ds) { if (sx != null && this._keepScroll) ds.scrollLeft = sx; else { const on = ds.querySelector('.on'); if (on) ds.scrollLeft = on.offsetLeft - ds.clientWidth / 2 + on.clientWidth / 2; } }
    if (this._keepScroll) v.scrollTop = y; this._keepScroll = false;
  },
  timeline(d, sc) {
    const start = PL[d.start], legs = legsOf(d, sc.stops), all = sc.stops;
    const pend = all.filter(s => !S.done[s.id]);
    const nextId = pend.length ? pend[0].id : null;
    const isBreak = d.slot === 'monday-break';
    let h = `<ol class="tl">`;
    const startTime = d.slot === 'main' && d.date && classInfo(d.date).classes.length ? classInfo(d.date).outingStart : d.startTime;
    h += `<li class="node"><span class="pin">${ic(d.start === 'university' ? 'cap' : 'home', 's')}</span><span class="lbl">${esc(d.start === 'university' ? t('faculty') : t('leave'))}<small>${esc(start ? start.name : '')}</small></span><span class="t">${esc(startTime || '')}</span></li>`;
    if (!all.length) h += `<li class="empty">${esc(t('freeDay'))}</li>`;
    all.forEach((s, i) => {
      if (S.done[s.id]) return;
      const leg = legs.find(l => l.to === s.id && l.from === (i ? all[i - 1].id : d.start));
      const prevHidden = i > 0 && S.done[all[i - 1].id];
      if (leg) h += this.legRow(leg, d, prevHidden);
      h += this.stopCard(PL[s.id], s, i + 1, d, s.id === nextId);
    });
    const lastLeg = legs[legs.length - 1];
    if (lastLeg && all.length) h += this.legRow(lastLeg, d, S.done[lastLeg.from]);
    if (all.length || d.start !== d.end) h += `<li class="node end"><span class="pin">${ic(d.end === 'university' ? 'cap' : 'home', 's')}</span><span class="lbl">${esc(d.end === 'university' ? t('gate') : t('back'))}<small>${esc(d.endDeadline ? d.endDeadline + ' · limite' : (PL[d.end] || {}).name || '')}</small></span><span class="t">${sc.returnTime ? '~' + sc.returnTime : ''}</span></li>`;
    h += '</ol>';
    if (sc.skipped && sc.skipped.length) h += `<div class="callout" style="margin-top:10px">${ic('info')}<div>${sc.skipped.map(x => `<div><strong>${esc(PL[x.id].name)}</strong> — ${esc(x.reason === 'closed' ? t('closedDay') : x.reason === 'deadline' ? t('deadline') : t('noFit'))}</div>`).join('')}</div></div>`;
    return h;
  },
  legRow(leg, d, prevHidden) {
    const a = PL[leg.from], b = PL[leg.to];
    if (leg.mode === 'unknown') return `<li class="leg unknown"><span class="legbtn">${ic('info', 'xs')} ${esc(t('unknownPin'))}</span></li>`;
    const r = legRoute(a, b), key = leg.key;
    const rides = r.segs.filter(s => s.m !== 'walk');
    const cls = rides.length ? (r.segs.some(s => s.m === 'walk') ? 'mix' : 'ride') : '';
    const doneLeg = S.done[leg.to];
    const label = rides.length ? rides.map(s => `<span class="m ride">${ic(MODEIC[s.m] || 'tram', 'xs')}${esc(s.line && s.m !== 'bus' ? s.line : t(s.m === 'ride' ? 'transit' : s.m))}</span>`).join('') : `<span class="m">${ic('walk', 'xs')}${esc(t('walk'))}</span>`;
    const open = this.openLeg.has(d.id + key);
    return `<li class="leg ${cls}${doneLeg ? ' faded' : ''}"><div style="flex:1;min-width:0"><button class="legbtn" data-act="leg-open" data-key="${esc(d.id + key)}">${label}<span>${fmtDist(r.d)} · ~${fmtMin(r.est)}</span>${prevHidden ? `<span class="dim">· ${esc(t('routeFrom'))} ${esc(a.name)}</span>` : ''}${r.source === 'line' && r.mode !== 'walk' ? `<span class="dim">· ${esc(t('checkConn'))}</span>` : ''}</button>
      ${open ? `<div class="legsteps">${this.legSteps(r)}<div class="links"><button class="btn sm" data-act="map-leg" data-key="${esc(key)}" data-day="${d.id}">${ic('map', 's')}${esc(t('seeOnMap'))}</button><a class="btn sm ghost" href="${esc(googleDir(a, b, r.mode === 'walk' ? 'walking' : 'transit'))}" target="_blank" rel="noopener">${ic('ext', 's')}Google</a></div></div>` : ''}</div></li>`;
  },
  legSteps(r) {
    return `<div class="legsteps">` + r.segs.map(s => {
      if (s.m === 'walk') return `<div>${ic('walk', 's')}<span><b>${esc(t('walk'))}</b> · ${fmtDist(s.d)} · ~${fmtMin(segMin(s))}${s.straight ? ' · ' + esc(t('approx')) : ''}</span></div>`;
      if (s.m === 'ride') return `<div>${ic('tram', 's')}<span><b>${esc(t('transit'))}</b> · ${fmtDist(s.d)} · ${esc(t('checkConn'))}</span></div>`;
      const nm = s.m === 'bus' ? `${t('bus')} ${s.line}` : s.m === 'ferry' ? t('ferry') : `${t(s.m)} ${s.line}`;
      const extra = s.dir ? ` · ${t('towards')} ${s.dir}${s.n ? ` · ${s.n} ${t('stopsN')}` : ''}` : s.op ? ` · ${s.op}` : '';
      return `<div>${ic(MODEIC[s.m], 's')}<span><b>${esc(nm)}</b> · ${esc(s.from)} → ${esc(s.to)}${esc(extra)} · ~${fmtMin(segMin(s))}</span></div>`;
    }).join('') + `</div>`;
  },
  stopCard(p, s, n, d, isNext) {
    const wd = d.date ? new Date(d.date + 'T12:00:00Z').getUTCDay() : undefined, inf = infoOf(p, wd), open = this.open.has(p.id);
    const done = !!S.done[p.id];
    const time = s.time && s.time !== '—' ? `<span class="time">${s.time}</span>` : '';
    return `<li class="stop k-${p.kind}" data-card="${p.id}"><span class="num">${n}</span><div class="body"><div class="card sc ${isNext ? 'next' : ''}">
      <button class="sc-main" data-act="more" data-id="${p.id}">${phHTML(p.id)}<div class="sc-txt"><div class="sc-top">${time}${isNext ? `<span class="nextbadge">${esc(t('next'))}</span>` : ''}<span class="kind">${esc(kindLabel(p))}</span></div><h4>${esc(p.name)}</h4><div class="sub">${esc(p.area || '')}${p.rating ? ` · <span class="star">★ ${String(p.rating).replace('.', LANG === 'en' ? '.' : ',')}</span>` : ''}${inf.duration ? ` · ${fmtMin(inf.duration)}` : ''}</div>${p.custom ? `<div class="sub">${esc(t('myPoint'))}</div>` : ''}</div><span class="more-i">${ic(open ? 'chevD' : 'info', 's')}</span></button>
      ${open ? this.details(p, inf) : ''}
      <div class="sc-act"><button class="btn ${done ? 'ok' : 'pri'}" data-act="toggle" data-id="${p.id}">${ic(done ? 'undo' : 'check', 's')}${esc(done ? t('undo') : t('conclude'))}</button>
      ${p.unmapped ? '' : `<button class="btn" data-act="map-place" data-id="${p.id}" data-day="${d.slot === 'main' ? d.id : ''}">${ic('map', 's')}${esc(t('mapBtn'))}</button><button class="btn" data-act="nav" data-id="${p.id}" data-from="${this.prevOf(d, p.id)}">${ic('nav', 's')}${esc(t('go'))}</button>`}
</div></div></div></li>`;
  },
  prevOf(d, id) { const sc = schedule(d); const i = sc.stops.findIndex(s => s.id === id); return i > 0 ? sc.stops[i - 1].id : d.start; },
  details(p, inf) {
    const src = inf.source || p.source, bsrc = inf.bookingSource;
    return `<div class="sc-more"><p>${esc(L(p.description))}</p><dl class="facts">
      <dt>${ic('clock', 's')}${esc(t('hours'))}</dt><dd>${esc(L(inf.hours))}</dd>
      <dt>${ic('coin', 's')}${esc(t('price'))}</dt><dd>${esc(L(inf.price))}</dd>
      <dt>${ic('ticket', 's')}${esc(t('ticket'))}</dt><dd>${esc(L(inf.ticket))}</dd>
      ${inf.booking ? `<dt>${ic('cal', 's')}${esc(t('booking'))}</dt><dd>${esc(L(inf.booking))}</dd>` : ''}
      <dt>${ic('pin', 's')}</dt><dd>${esc(p.address || '')}</dd></dl>
      <div class="links"><a href="${esc(googleURL(p))}" target="_blank" rel="noopener">${ic('ext', 's')}${esc(t('openGoogle'))}</a>${src ? `<a href="${esc(src)}" target="_blank" rel="noopener">${ic('ext', 's')}${esc(t('source'))}</a>` : ''}${bsrc && bsrc !== src ? `<a href="${esc(bsrc)}" target="_blank" rel="noopener">${ic('ext', 's')}${esc(t('booking'))}</a>` : ''}
      <button class="btn sm ghost danger" data-act="trash" data-id="${p.id}" style="margin-left:auto">${ic('trash', 's')}${esc(t('toTrash'))}</button></div>
      ${TRIP.photos[p.id] ? `<div class="credits" style="margin-top:8px">${esc(t('photo'))}: ${esc(TRIP.photos[p.id].credit)} · ${esc(TRIP.photos[p.id].license)}</div>` : ''}</div>`;
  },
  doneFold(ids, d) {
    if (!ids.length) return '';
    return `<details class="fold" open><summary><span class="ic">${ic('check', 's')}</span>${esc(t('doneT'))}<span class="cnt">${ids.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${ids.map(id => {
      const p = PL[id]; const when = S.done[id] ? new Date(S.done[id]) : null;
      return `<div class="row done">${phHTML(id)}<div class="rt"><b>${esc(p.name)}</b><span>${esc(kindLabel(p))}${when ? ' · ✓ ' + when.toLocaleTimeString(LOC[LANG], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }) + ' · ' + fmtDate(when.toISOString().slice(0, 10), { day: 'numeric', month: 'short' }) : ''}</span></div><button class="btn sm" data-act="toggle" data-id="${id}">${ic('undo', 's')}${esc(t('undo'))}</button></div>`;
    }).join('')}</div></details>`;
  },
  trashFold(ids) {
    return `<details class="fold trash"><summary><span class="ic">${ic('trash', 's')}</span>${esc(t('trash'))}<span class="cnt">${ids.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${ids.map(id => `<div class="row">${phHTML(id)}<div class="rt"><b>${esc(PL[id].name)}</b><span>${esc(kindLabel(PL[id]))}</span></div><button class="btn sm" data-act="restore" data-id="${id}">${ic('undo', 's')}${esc(t('restore'))}</button></div>`).join('')}</div></details>`;
  },
  classesCard(d, ci) {
    const G = TRIP.guide;
    let h = `<div class="card panel sec"><div class="eyebrow">${esc(t('classesT'))}</div>`;
    if (ci.classes.length) h += `<div class="classes">${ci.classes.map(c => `<div class="cl"><b>${c.start}–${c.end}</b><span>${esc(c.name)}</span></div>`).join('')}</div>`;
    if (ci.arrival) h += `<p>${esc(L(G.arrMeet))}</p>`;
    if (ci.classes.length && !d.departure) h += `<div class="callout blue" style="margin-top:10px">${ic('heart')}<div><strong>${esc(t('outing'))} · ${ci.outingStart}</strong><br>${esc(t('outingTxt', { a: ci.earliestHomeArrival }))}</div></div>`;
    if (ci.classes.length && !ci.arrival && !d.departure) h += `<p style="font-size:13px">${esc(L(G.faculty).replace('{dep}', ci.departure).replace('{arr}', ci.campusArrival))}</p><button class="btn sm" data-act="map-route" data-key="base__university">${ic('tram', 's')}${esc(t('facT'))}</button>`;
    return h + '</div>';
  },
  breakCard(b) {
    const sc = schedule(b);
    return `<div class="card panel sec" style="border-color:color-mix(in srgb,var(--plum) 35%,var(--line))"><div class="eyebrow" style="color:var(--plum)">${esc(t('breakT'))}</div><h3>${esc(L(b.title))}</h3><p style="font-size:12.5px;font-weight:700;color:var(--muted)">${esc(t('breakFrom'))}</p><p>${esc(L(b.note))}</p>${this.timeline(b, sc)}${this.doneFold(sc.stops.filter(s => S.done[s.id]).map(s => s.id), b)}</div>`;
  },
  arrivalCard() {
    const G = TRIP.guide, steps = TRIP.arrival;
    const pend = steps.filter(s => !S.steps['arr:' + s.id]), done = steps.filter(s => S.steps['arr:' + s.id]);
    const stepHTML = (s, i) => `<li class="step ${s.kind === 'transit' ? 'ride' : s.id === 'atm' ? 'gold' : ''}"><span class="sn">${i + 1}</span><div class="st"><b>${esc(L(s.title))}</b>${esc(L(s.text))}${s.instructions ? `<ol>${s.instructions.map(x => `<li>${esc(L(x))}</li>`).join('')}</ol>` : ''}<div class="links">${s.href ? `<a href="${esc(s.href)}" target="_blank" rel="noopener">${ic('ext', 's')}${esc(L(s.link))}</a>` : ''}${s.alternativeHref ? `<a href="${esc(s.alternativeHref)}" target="_blank" rel="noopener">${ic('ext', 's')}${esc(L(s.alternativeLink))}</a>` : ''}</div></div><button class="chk ${S.steps['arr:' + s.id] ? 'on' : ''}" data-act="step" data-step="arr:${s.id}" aria-label="ok">${ic('check', 's')}</button></li>`;
    return `<div class="card panel sec"><div class="eyebrow">${esc(L(G.arrHeader))}</div><h3>${esc(L(G.arrTitle))}</h3><p style="font-weight:700">${esc(L(G.arrLanding))}</p><p style="font-size:12.5px;color:var(--muted)">${esc(L(G.arrChain))}</p>
      <div class="callout" style="margin:10px 0">${ic('clock')}<div>${esc(L(G.arrPlan))}</div></div>
      <button class="btn sm" data-act="map-route" data-key="ist__base">${ic('map', 's')}${esc(t('seeOnMap'))}</button>
      <ol class="steps">${pend.map(s => stepHTML(s, steps.indexOf(s))).join('')}</ol>
      ${done.length ? `<details class="fold" open><summary><span class="ic">${ic('check', 's')}</span>${esc(t('doneT'))}<span class="cnt">${done.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${done.map(s => `<div class="row done"><span class="tick">${ic('check', 'xs')}</span><div class="rt"><b>${esc(L(s.title))}</b></div><button class="btn sm" data-act="step" data-step="arr:${s.id}">${ic('undo', 's')}</button></div>`).join('')}</div></details>` : ''}
      <h3 style="margin-top:16px;font-size:16px">${esc(L(G.fareTitle))}</h3><table class="fares">${TRIP.fares.map(([k, v]) => `<tr><td>${esc(L(k))}</td><td>${esc(v)}</td></tr>`).join('')}</table><p style="font-size:13px">${esc(L(G.fareText))}</p><p style="font-size:12px;color:var(--muted)">${esc(L(G.fareNote))}</p></div>`;
  },
  departureCard() {
    const G = TRIP.guide, steps = G.depSteps.map((s, i) => ({ id: 'dep:' + i, time: s[0], text: s[1] }));
    const pend = steps.filter(s => !S.steps[s.id]), done = steps.filter(s => S.steps[s.id]);
    return `<div class="card panel sec"><div class="eyebrow">${ic('plane', 'xs')} ${esc(t('depT'))}</div><h3>${esc(L(G.depTitle))}</h3>
      <ol class="steps">${pend.map(s => `<li class="step"><span class="sn" style="width:auto;padding:0 7px;border-radius:8px;font-family:var(--mono)">${s.time}</span><div class="st">${esc(L(s.text))}</div><button class="chk" data-act="step" data-step="${s.id}">${ic('check', 's')}</button></li>`).join('')}</ol>
      ${done.length ? `<details class="fold" open><summary><span class="ic">${ic('check', 's')}</span>${esc(t('doneT'))}<span class="cnt">${done.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${done.map(s => `<div class="row done"><span class="tick">${ic('check', 'xs')}</span><div class="rt"><b>${s.time} · ${esc(L(s.text))}</b></div><button class="btn sm" data-act="step" data-step="${s.id}">${ic('undo', 's')}</button></div>`).join('')}</div></details>` : ''}</div>`;
  },

  /* ---------- Lugares ---------- */
  renderLugares() {
    const v = $('#view-lugares');
    if (!v.dataset.built) {
      v.innerHTML = `<div class="wrap" style="padding-top:14px"><div class="eyebrow">${esc(t('tabLugares'))}</div><h2 style="font-family:var(--serif);font-size:24px;margin:2px 0 12px" id="plH">${esc(t('placesH'))}</h2>
        <label class="search">${ic('search')}<input id="plq" type="search" placeholder="${esc(t('search'))}" value="${esc(this.q)}" autocomplete="off"></label>
        <div class="chips" id="plchips"></div><div id="plnote"></div><div id="pllist"></div></div>`;
      v.dataset.built = LANG;
      $('#plq').addEventListener('input', e => { this.q = e.target.value; this.renderPlaceList(); });
    } else if (v.dataset.built !== LANG) { delete v.dataset.built; return this.renderLugares(); }
    this.renderPlaceList();
  },
  renderPlaceList() {
    const F = [['all', 'fAll'], ['sight', 'fSight'], ['food', 'fFood'], ['shop', 'fShop'], ['church', 'fChurch'], ['mine', 'fMine'], ['todo', 'fTodo'], ['near', 'fNear']];
    $('#plchips').innerHTML = F.map(([k, l]) => `<button class="${this.filter === k ? 'on' : ''}" data-act="filter" data-f="${k}">${esc(t(l))}</button>`).join('');
    $('#plnote').innerHTML = this.filter === 'church' ? `<p class="note" style="font-size:13px">${esc(L(TRIP.guide.churchesNote))}</p>` : this.filter === 'food' ? `<p class="note" style="font-size:13px">${esc(L(TRIP.guide.foodNote))}</p>` : '';
    const norm = s => (s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
    const q = norm(this.q);
    const list = Object.values(PL).filter(p => p.kind !== 'base' && !p.unmapped || p.id === 'cruise').filter(p => {
      if (q && !norm(`${p.name} ${p.area} ${p.address}`).includes(q)) return false;
      switch (this.filter) {
        case 'sight': return p.kind === 'sight';
        case 'food': return p.kind === 'food' && ((p.rating || 0) > 4.6 || EXPLICIT.has(p.id));
        case 'shop': return p.kind === 'shop';
        case 'church': return !!p.church;
        case 'mine': return !!p.saved || EXPLICIT.has(p.id) || p.custom;
        case 'todo': return !S.done[p.id];
        case 'near': return !p.unmapped && hav(p, PL.base) <= 2;
        default: return true;
      }
    });
    const firstDay = id => { const ds = whereScheduled(id).concat(Object.entries(S.additions).filter(([, ids]) => ids.includes(id)).map(([d]) => d)); const dd = ds.map(x => dayById(x) || DAYS.find(y => y.date === x)).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date)); return dd[0]; };
    const order = p => { const d = firstDay(p.id); return d ? d.date : '9999'; };
    const live = list.filter(p => !S.trash.includes(p.id));
    const pend = live.filter(p => !S.done[p.id]).sort((a, b) => order(a).localeCompare(order(b)) || a.name.localeCompare(b.name));
    const done = live.filter(p => S.done[p.id]).sort((a, b) => S.done[b.id] - S.done[a.id]);
    const trash = list.filter(p => S.trash.includes(p.id));
    const card = p => { const d = firstDay(p.id); return `<div class="card pl"><div class="phw">${phHTML(p.id, 'lg')}<span class="daychip">${d ? esc(dayLabel(d) + ' · ' + fmtDate(d.date, { day: 'numeric', month: 'short' })) : esc(t('notInPlan'))}</span></div><div class="pl-b"><span class="kind">${esc(kindLabel(p))}</span><h4>${esc(p.name)}</h4><div class="sub">${esc(p.area || '')}${p.rating ? ` · <span style="color:var(--gold);font-weight:800">★ ${String(p.rating).replace('.', LANG === 'en' ? '.' : ',')}</span>` : ''}${!p.unmapped ? ` · ${fmtDist(hav(p, Geo.fresh(300000) || PL.base) * 1000)}` : ''}</div></div>
      <div class="sc-act"><button class="btn pri" data-act="toggle" data-id="${p.id}">${ic('check', 's')}${esc(t('conclude'))}</button>${p.unmapped ? '' : `<button class="btn" data-act="map-place" data-id="${p.id}" data-day="${d && d.slot === 'main' ? d.id : ''}">${ic('map', 's')}${esc(t('mapBtn'))}</button><button class="btn" data-act="nav" data-id="${p.id}">${ic('nav', 's')}</button>`}<button class="btn icon" data-act="add-day-sheet" data-id="${p.id}" aria-label="${esc(t('addToDay'))}">${ic('plus', 's')}</button></div></div>`; };
    let h = `<div class="sec-h"><h2>${esc(t('toVisit'))}</h2><span class="meta">${pend.length}</span></div>`;
    h += pend.length ? `<div class="pl-grid">${pend.map(card).join('')}</div>` : `<div class="empty">${esc(t('nothing'))}</div>`;
    if (done.length) h += `<details class="fold" open><summary><span class="ic">${ic('check', 's')}</span>${esc(t('doneT'))}<span class="cnt">${done.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${done.map(p => `<div class="row done">${phHTML(p.id)}<div class="rt"><b>${esc(p.name)}</b><span>${esc(kindLabel(p))} · ✓ ${new Date(S.done[p.id]).toLocaleDateString(LOC[LANG], { day: 'numeric', month: 'short', timeZone: 'Europe/Istanbul' })}</span></div><button class="btn sm" data-act="toggle" data-id="${p.id}">${ic('undo', 's')}${esc(t('undo'))}</button></div>`).join('')}</div></details>`;
    if (trash.length) h += this.trashFold(trash.map(p => p.id));
    $('#pllist').innerHTML = h;
  },

  /* ---------- Intervalo ---------- */
  renderIntervalo() {
    const cs = TRIP.circuits.filter(c => c.stops.every(s => PL[s.id]));
    const isDone = c => c.stops.every(s => S.done[s.id]);
    const pend = cs.filter(c => !isDone(c)), done = cs.filter(isDone);
    const card = c => {
      const p = PL[c.stops[0].id], b = c.budget, tot = b.walk + b.visit + b.buffer;
      return `<div class="card pl"><div class="phw">${phHTML(p.id, 'lg')}<span class="daychip">${ic('cap', 'xs')} ${esc(t('faculty'))} ⇄ ${esc(L(c.area) || p.area)}</span></div><div class="pl-b"><span class="kind">${tot} ${esc(t('minutes'))}</span><h4>${esc(L(c.title))}</h4>
        <div class="budget"><i class="w" style="width:${b.walk / tot * 100}%"></i><i class="v" style="width:${b.visit / tot * 100}%"></i><i class="b" style="width:${b.buffer / tot * 100}%"></i></div>
        <div class="blegend"><span class="w">${b.walk} ${esc(t('minutes'))} ${esc(t('walkV'))}</span><span class="v">${b.visit} ${esc(t('visitV'))}</span><span class="b">${b.buffer} ${esc(t('bufV'))}</span></div>
        <p style="font-size:13.5px;line-height:1.5;color:var(--ink-2);margin:10px 0 0">${esc(L(c.note))}</p></div>
        <div class="sc-act"><button class="btn ${isDone(c) ? 'ok' : 'pri'}" data-act="toggle" data-id="${p.id}">${ic(isDone(c) ? 'undo' : 'check', 's')}${esc(isDone(c) ? t('undo') : t('conclude'))}</button><button class="btn" data-act="map-circuit" data-id="${c.id}">${ic('map', 's')}${esc(t('mapBtn'))}</button><button class="btn" data-act="nav" data-id="${p.id}" data-from="university">${ic('nav', 's')}${esc(t('go'))}</button></div></div>`;
    };
    $('#view-intervalo').innerHTML = `<div class="wrap" style="padding-top:14px"><div class="eyebrow">${esc(t('tabIntervalo'))}</div><h2 style="font-family:var(--serif);font-size:24px;margin:2px 0 6px">${esc(t('intH'))}</h2><p class="note" style="margin-top:4px">${esc(L(TRIP.guide.circuitsIntro))}</p>
      <div class="pl-grid">${pend.map(card).join('')}</div>
      ${done.length ? `<details class="fold" open><summary><span class="ic">${ic('check', 's')}</span>${esc(t('doneT'))}<span class="cnt">${done.length}</span><span class="chev">${ic('chevD', 's')}</span></summary><div class="rows">${done.map(c => `<div class="row done">${phHTML(c.stops[0].id)}<div class="rt"><b>${esc(L(c.title))}</b><span>${esc(PL[c.stops[0].id].name)}</span></div><button class="btn sm" data-act="toggle" data-id="${c.stops[0].id}">${ic('undo', 's')}${esc(t('undo'))}</button></div>`).join('')}</div></details>` : ''}</div>`;
  },

  /* ---------- Guia ---------- */
  renderGuia() {
    const G = TRIP.guide;
    const gc = (icn, title, sub, body, open) => `<details class="card gcard" ${open ? 'open' : ''}><summary><span class="gi">${ic(icn)}</span><div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div><span class="chev">${ic('chevD', 's')}</span></summary><div class="gbody">${body}</div></details>`;
    const days = { 1: t('mon'), 3: t('wed'), 5: t('fri') };
    const week = `<table class="week"><tr><th></th><th>${esc(t('classesT'))}</th><th>${esc(t('outing'))}</th></tr>${[1, 3, 5].map(w => { const cl = TRIP.classes[w]; const ci = classInfo(w === 1 ? '2026-10-26' : w === 3 ? '2026-10-28' : '2026-10-23'); return `<tr><td><b>${esc(days[w])}</b></td><td>${cl.map(c => `${c.start}–${c.end} ${esc(c.name)}`).join('<br>')}</td><td style="font-family:var(--mono);font-weight:800">${ci.outingStart}</td></tr>`; }).join('')}</table><p style="font-size:13px">${esc(t('weekNote'))}</p>`;
    const credits = Object.entries(TRIP.photos).map(([id, p]) => `${esc(PL[id] ? PL[id].name : id)}: <a href="${esc(p.source)}" target="_blank" rel="noopener">${esc(p.credit)}</a> (${esc(p.license)})`).join(' · ');
    $('#view-guia').innerHTML = `<div class="wrap" style="padding-top:14px"><div class="eyebrow">${esc(t('tabGuia'))}</div><h2 style="font-family:var(--serif);font-size:24px;margin:2px 0 4px">${esc(t('guideH'))}</h2>
      <div class="card mappack" id="mappack" style="margin-top:12px"></div>
      ${gc('plane', L(G.arrTitle), L(G.arrLanding), `<p>${esc(L(G.arrChain))}</p><p>${esc(L(G.arrPlan))}</p><button class="btn sm" data-act="day" data-day="2026-10-21" data-goto="roteiro">${ic('route', 's')}${esc(t('arrivalSteps'))}</button> <button class="btn sm" data-act="map-route" data-key="ist__base">${ic('map', 's')}${esc(t('seeOnMap'))}</button>`)}
      ${gc('home', t('depT'), L(G.depTitle), `<ol class="steps">${G.depSteps.map(s => `<li class="step"><span class="sn" style="width:auto;padding:0 7px;border-radius:8px;font-family:var(--mono)">${s[0]}</span><div class="st">${esc(L(s[1]))}</div></li>`).join('')}</ol>`)}
      ${gc('cap', t('weekT'), t('classesT'), week)}
      ${gc('tram', t('facT'), 'T1 Karaköy → Laleli–Üniversite', `<p>${esc(L(G.faculty).replace('{dep}', '08:00 / 10:50').replace('{arr}', '09:05 / 11:55'))}</p><button class="btn sm" data-act="map-route" data-key="base__university">${ic('map', 's')}${esc(t('seeOnMap'))}</button>`)}
      ${gc('cal', L(G.datesTitle), '', `<p>${esc(L(G.datesText))}</p><p>${esc(L(G.datesMeals))}</p>`)}
      ${gc('info', t('holidayT'), '28–30/10', `<p>${esc(L(G.holiday))}</p>`)}
      ${gc('shop', L(G.shopTitle), '', `<p>${esc(L(G.shopText))}</p>`)}
      ${gc('route', t('legendT'), '', `<div class="legend-row"><i class="lg-walk"></i>${esc(t('lWalk'))}</div><div class="legend-row"><i class="lg-ride"></i>${esc(t('lRide'))}</div><p style="font-size:13px">${esc(t('longPress'))}</p>`)}
      ${gc('dl', t('installT'), '', `<p>${esc(t('installTxt'))}</p>`)}
      ${gc('shield', t('dataT'), '', `<p>${esc(t('dataTxt'))}</p><div class="links"><button class="btn sm" data-act="reset-done">${esc(this.arm === 'reset-done' ? t('confirmTap') : t('resetDone'))}</button><button class="btn sm danger ghost" data-act="reset-all">${esc(this.arm === 'reset-all' ? t('confirmTap') : t('resetAll'))}</button></div><p class="credits">v${VERSION}</p>`)}
      ${gc('heart', t('creditsT'), 'OpenStreetMap · OpenMapTiles · Wikimedia', `<p class="credits">Mapa © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors · tiles <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> / <a href="https://openmaptiles.org" target="_blank" rel="noopener">OpenMapTiles</a> · rotas a pé pré-calculadas com OSRM (FOSSGIS) · renderização MapLibre GL.</p><p class="credits">${credits}</p>`)}
    </div>`;
    this.renderPack();
  },
  renderPack() {
    const el = $('#mappack'); if (!el) return;
    const st = MapPack.state, ready = st === 'ready', dl = st === 'downloading';
    el.innerHTML = `<div class="mp-top"><span class="mp-ic ${ready ? 'ok' : ''}">${ic(ready ? 'check' : 'dl')}</span><div class="mp-t"><b>${esc(t('mpTitle'))}</b><small>${esc(ready ? t('mpReady') : dl ? t('mpDl') + ' ' + MapPack.pct + '%' : st === 'error' ? t('mpErr') : t('mpNeed'))}</small></div></div>
      ${dl || st === 'error' ? `<div class="pbar"><i style="width:${MapPack.pct}%"></i></div>` : ''}
      <div class="files">${MapPack.files.map((f, i) => `<div><span>${esc(I.mpFiles[i][LI[LANG]])}</span><span class="${MapPack.have[f.url] ? 'okk' : ''}">${MapPack.have[f.url] ? '✓ ' : ''}${(f.size / 1048576).toFixed(1).replace('.', LANG === 'en' ? '.' : ',')} MB</span></div>`).join('')}</div>
      ${!dl ? `<button class="btn ${ready ? 'ghost' : 'pri'} wide" style="margin-top:12px" data-act="mp-dl" ${navigator.onLine ? '' : 'disabled'}>${ic('dl', 's')}${esc(ready ? t('mpAgain') : t('mpBtn'))}</button>` : ''}`;
  },
  renderNet() {
    const el = $('#netpill'); const on = navigator.onLine, st = MapPack.state;
    el.className = 'netpill' + (st === 'downloading' ? ' dl' : on ? '' : ' off');
    el.innerHTML = `<span class="dot"></span>${esc(st === 'downloading' ? `${t('mapDl')} ${MapPack.pct}%` : st === 'ready' ? (on ? t('offReady') : t('noNetReady')) : on ? t('online') : t('offline'))}`;
  },

  /* ---------- actions ---------- */
  toggle(id) {
    const was = !!S.done[id];
    const apply = () => { if (was) delete S.done[id]; else S.done[id] = Date.now(); save(); this._keepScroll = true; this.refresh(); };
    const card = document.querySelector(`[data-card="${CSS.escape(id)}"]`);
    if (!was && card && this.view === 'roteiro') { card.classList.add('fadeout'); setTimeout(apply, 300); } else apply();
    this.toast(was ? t('movedBack') : t('movedDone') + ' · ' + PL[id].name, { undo: () => { if (was) S.done[id] = Date.now(); else delete S.done[id]; save(); this._keepScroll = true; this.refresh(); } });
  },
  toast(msg, opt = {}) {
    const el = $('#toast'); clearTimeout(this._tt);
    el.innerHTML = `<span>${esc(msg)}</span>${opt.undo ? `<button data-act="toast-undo">${esc(t('undo'))}</button>` : ''}`;
    el.hidden = false; this._undo = opt.undo || null;
    this._tt = setTimeout(() => { el.hidden = true; this._undo = null; }, opt.undo ? 5200 : 3200);
  },
  sheet(html) { $('#sheet').innerHTML = `<div class="grab"></div>${html}`; $('#sheet').hidden = false; $('#sheetBackdrop').hidden = false; },
  closeSheet() { $('#sheet').hidden = true; $('#sheetBackdrop').hidden = true; $('#sheet').innerHTML = ''; },
  addSheet(dayId) {
    const d = dayById(dayId); const inDay = new Set(dayPlaces(d).filter(id => !S.trash.includes(id)));
    const ps = Object.values(PL).filter(p => p.kind !== 'base' && !p.unmapped && !inDay.has(p.id)).sort((a, b) => a.name.localeCompare(b.name));
    this.sheet(`<h3>${esc(t('addPlace'))} · ${esc(dayLabel(d))}</h3><label class="search">${ic('search')}<input id="addq" type="search" placeholder="${esc(t('search'))}"></label><div class="rows" id="addrows" style="margin-top:10px">${ps.map(p => `<button class="row" data-act="add-pick" data-id="${p.id}" data-day="${d.id}" data-n="${esc((p.name + ' ' + p.area).toLowerCase())}" style="text-align:left">${phHTML(p.id)}<div class="rt"><b>${esc(p.name)}</b><span>${esc(kindLabel(p))} · ${esc(p.area || '')}</span></div>${ic('plus')}</button>`).join('')}</div><p class="credits" style="margin-top:12px">${esc(t('longPress'))}</p>`);
    $('#addq').addEventListener('input', e => { const q = e.target.value.toLowerCase(); $$('#addrows .row').forEach(r => r.classList.toggle('hide', q && !r.dataset.n.includes(q))); });
  },
  addDaySheet(id) {
    const p = PL[id];
    this.sheet(`<h3>${esc(p.name)}</h3><p class="note" style="margin-top:0">${esc(t('addToDay'))}</p><div class="rows">${DAYS.map(d => `<button class="row" data-act="add-pick" data-id="${id}" data-day="${d.id}" style="text-align:left"><span class="tick" style="background:var(--cobalt)">${ic('cal', 'xs')}</span><div class="rt"><b>${esc(dayLabel(d))} · ${esc(fmtDate(d.date, { weekday: 'short', day: 'numeric', month: 'short' }))}</b><span>${esc(L(d.title))}</span></div>${ic('plus')}</button>`).join('')}</div>`);
  },
  addCustomSheet(ll) {
    this._ll = ll; const cur = currentDay();
    this.sheet(`<h3>${esc(t('customAdd'))}</h3><p class="credits">${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}</p><div class="field"><label for="cname">${esc(t('customName'))}</label><input id="cname" maxlength="60" autocomplete="off"></div><div class="field"><label for="cday">${esc(t('customDay'))}</label><select id="cday">${DAYS.map(d => `<option value="${d.id}" ${d.id === cur.id ? 'selected' : ''}>${esc(dayLabel(d))} · ${esc(fmtDate(d.date, { weekday: 'short', day: 'numeric', month: 'short' }))}</option>`).join('')}</select></div><div class="links" style="margin-top:14px"><button class="btn" data-act="sheet-x">${esc(t('cancel'))}</button><button class="btn pri" data-act="custom-save" style="margin-left:auto">${ic('plus', 's')}${esc(t('save'))}</button></div>`);
    setTimeout(() => { const i = $('#cname'); if (i) i.focus(); }, 250);
  },
  saveCustom() {
    const name = ($('#cname').value || '').trim(); if (!name) { $('#cname').focus(); return; }
    const day = $('#cday').value, ll = this._ll, id = 'custom-' + Date.now().toString(36);
    const c = { id, name, lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6), kind: 'sight', area: t('myPoint'), address: `${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}`, description: { pt: '', en: '', tr: '' } };
    S.custom.push(c); S.additions[day] = [...new Set([...(S.additions[day] || []), id])]; save(); rebuildPlaces();
    this.closeSheet(); this.toast(t('added')); S.day = day; save();
    if (MapView.map) MapView.show({ type: 'day', dayId: day });
    this.refresh();
  },
  armBtn(act, fn) {
    if (this.arm === act) { this.arm = null; fn(); this.toast(t('cleared')); this.render(); return; }
    this.arm = act; this.render(); clearTimeout(this._at); this._at = setTimeout(() => { this.arm = null; if (this.view === 'guia') this.render(); }, 4000);
  },
};

/* ---------------- events ---------------- */
document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]'); if (tab) { UI.go(tab.dataset.tab); return; }
  const lg = e.target.closest('[data-lang]'); if (lg) { LANG = lg.dataset.lang; S.lang = LANG; save(); UI.renderTabs(); UI.render(); if (MapView.map) { MapView.renderTop(); MapView.renderTools(); MapView.renderLegend(); if (Nav.active) Nav.renderSheet(); } return; }
  if (e.target.id === 'sheetBackdrop') { UI.closeSheet(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act, id = a.dataset.id;
  switch (act) {
    case 'day': S.day = a.dataset.day; save(); if (a.dataset.goto) UI.go(a.dataset.goto); else UI.renderRoteiro(); if (!a.dataset.goto) $('#view-roteiro').scrollTop = 0; break;
    case 'toggle': UI.toggle(id); break;
    case 'step': { const k = a.dataset.step; if (S.steps[k]) delete S.steps[k]; else S.steps[k] = Date.now(); save(); UI._keepScroll = true; UI.render(); break; }
    case 'more': if (UI.open.has(id)) UI.open.delete(id); else UI.open.add(id); UI._keepScroll = true; UI.render(); break;
    case 'leg-open': { const k = a.dataset.key; if (UI.openLeg.has(k)) UI.openLeg.delete(k); else UI.openLeg.add(k); UI._keepScroll = true; UI.render(); break; }
    case 'map-day': UI.go('mapa'); MapView.show({ type: 'day', dayId: a.dataset.day }); break;
    case 'map-place': { UI.go('mapa'); const dd = a.dataset.day; if (dd) { MapView.show({ type: 'day', dayId: dd }); setTimeout(() => MapView.select(id), MapView.ready ? 50 : 900); } else MapView.show({ type: 'place', id }); break; }
    case 'map-leg': UI.go('mapa'); MapView.show({ type: 'leg', dayId: a.dataset.day, key: a.dataset.key }); break;
    case 'map-route': UI.go('mapa'); MapView.show({ type: 'route', key: a.dataset.key }); break;
    case 'map-circuit': UI.go('mapa'); MapView.show({ type: 'circuit', id }); break;
    case 'map-prev': MapView.step(-1); break;
    case 'map-next': MapView.step(1); break;
    case 'map-daypick': { const c = MapView.ctx; if (c && c.type !== 'day') MapView.show({ type: 'day', dayId: currentDay().id }); else UI.go('roteiro'); break; }
    case 'map-fit': MapView.fit(); break;
    case 'map-all': { const c = MapView.ctx; MapView.show(c && (c.type === 'all' || c.type === 'place') ? { type: 'day', dayId: currentDay().id } : { type: 'all' }); MapView.renderTools(); break; }
    case 'sheet-close': MapView.closeSheet(); break;
    case 'gps': if (!Geo.watching) { Geo.start(); MapView.follow = true; } else if (!MapView.follow) { MapView.follow = true; if (Geo.pos && MapView.map) MapView.map.easeTo({ center: [Geo.pos.lng, Geo.pos.lat], zoom: Math.max(MapView.map.getZoom(), 16) }); } else { Geo.stop(); } MapView.renderTools(); break;
    case 'compass': Geo.toggleCompass(); break;
    case 'nav': Nav.start(id, a.dataset.from || null); break;
    case 'nav-home': Nav.start('base', null); break;
    case 'nav-stop': Nav.stop(); break;
    case 'trash': if (!S.trash.includes(id)) S.trash.push(id); delete S.done[id]; save(); UI._keepScroll = true; UI.refresh(); UI.toast(t('trashed'), { undo: () => { S.trash = S.trash.filter(x => x !== id); save(); UI.refresh(); } }); break;
    case 'restore': S.trash = S.trash.filter(x => x !== id); save(); UI._keepScroll = true; UI.refresh(); UI.toast(t('restored')); break;
    case 'add-sheet': UI.addSheet(a.dataset.day); break;
    case 'add-day-sheet': UI.addDaySheet(id); break;
    case 'add-pick': { const d = a.dataset.day; S.additions[d] = [...new Set([...(S.additions[d] || []), id])]; S.trash = S.trash.filter(x => x !== id); save(); UI.closeSheet(); UI.toast(t('added') + ' · ' + dayLabel(dayById(d))); UI.refresh(); break; }
    case 'custom-save': UI.saveCustom(); break;
    case 'sheet-x': UI.closeSheet(); break;
    case 'filter': UI.filter = a.dataset.f; UI.renderPlaceList(); break;
    case 'mp-dl': MapPack.download(MapPack.state === 'ready'); break;
    case 'go-guide-map': UI.go('guia'); break;
    case 'toast-undo': if (UI._undo) { const f = UI._undo; UI._undo = null; $('#toast').hidden = true; f(); } break;
    case 'reset-done': UI.armBtn('reset-done', () => { S.done = {}; S.steps = {}; save(); UI.refresh(); }); break;
    case 'reset-all': UI.armBtn('reset-all', () => { S.done = {}; S.steps = {}; S.trash = []; S.additions = {}; S.custom = []; save(); rebuildPlaces(); UI.refresh(); }); break;
  }
});
window.addEventListener('online', () => { UI.renderNet(); UI.renderPack(); if (MapPack.state !== 'ready') MapPack.download(); });
window.addEventListener('offline', () => { UI.renderNet(); UI.renderPack(); });
MapPack.on(() => { UI.renderNet(); UI.renderPack(); });

/* ---------------- service worker ---------------- */
let wantReload = false;
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    const show = w => { if (!navigator.serviceWorker.controller) return; const b = document.createElement('div'); b.className = 'update-bar'; b.innerHTML = `<span>${esc(t('update'))}</span><button>${esc(t('reload'))}</button>`; b.querySelector('button').onclick = () => { wantReload = true; w.postMessage('skipWaiting'); }; document.body.appendChild(b); };
    if (reg.waiting) show(reg.waiting);
    reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed') show(w); }); });
  }).catch(e => console.warn('sw', e));
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded || !wantReload) return; reloaded = true; location.reload(); });
}

/* ---------------- boot ---------------- */
(function boot() {
  const h = (location.hash || '').slice(1);
  UI.go(['roteiro', 'mapa', 'lugares', 'intervalo', 'guia'].includes(h) ? h : 'roteiro');
  MapPack.check().then(ok => {
    if (ok) { Tiles.useCache(); }
    else if (navigator.onLine) setTimeout(() => MapPack.download(), 1200);
    Walk.load().then(r => { if (r) UI.refresh(); });
  });
})();

