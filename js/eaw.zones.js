eaw.zones = {};
//holds data preloaded from an svg path image for rendering
//the squares.  this better supports loading games previously saved
eaw.zones.map_data = null;

eaw.ZoneProperties = {
/** Off Map Areas **/
OffMapPersia: {type: "land", owner: "na", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
OffMapRussia: {type: "land", owner: "na", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** Norway **/
Oslo: {type: "land", owner:"nr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Trondheim: {type: "land", owner:"nr", hasFactory: true, pointValue: 1, center: {x: 0, y: 20}},
Bergen: {type: "land", owner:"nr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
/** Finland **/
Helsinki: {type: "land", owner:"fn", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Tampere: {type: "land", owner:"fn", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Kuopio: {type: "land", owner:"fn", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** Hungary **/
Budapest: {type: "land", owner:"hu", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Debrecen: {type: "land", owner:"hu", hasFactory: true, pointValue: 1, center: {x: -20, y: -10}},
/** Bulgaria **/
Sofia: {type: "land", owner:"bu", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Varna: {type: "land", owner:"bu", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Burgas: {type: "land", owner: "bu", hasFactory: true, pointValue: 1, center: {x: -10, y: 0}},
/** Single-Zone Neutrals **/
Denmark: {type: "land", owner:"dk", hasFactory: true, pointValue: 1, center: {x: -15, y: 0}},
Ireland: {type: "land", owner:"ei", hasFactory: true, pointValue: 1, center: {x: 10, y: 0}},
Belgium: {type: "land", owner:"be", hasFactory: true, pointValue: 2, center: {x: 0, y: -10}},
Netherlands: {type: "land", owner:"ne", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Switzerland: {type: "land", owner: "sz", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Qatar: {type: "land", owner: "qa", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
/** Germany **/
Hamburg: {type: "land", owner:"de", hasFactory: true, pointValue: 3, center: {x: 10, y: 20}},
Munich: {type: "land", owner:"de", hasFactory: true, pointValue: 4, center: {x: 0, y: 0}},
Berlin: {type: "land", owner:"de", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Frankfurt: {type: "land", owner:"de", hasFactory: true, pointValue: 6, center: {x: 0, y: 0}},
Konigsberg: {type: "land", owner:"de", hasFactory: true, pointValue: 1, center: {x: 5, y: 20}},
Stettin: {type: "land", owner: "de", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Koln: {type: "land", owner: "de", hasFactory: true, pointValue: 5, center: {x: 0, y: 0}},
Breslau: {type: "land", owner: "de", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Leipzig: {type: "land", owner: "de", hasFactory: true, pointValue: 3, center: {x: -15, y: 0}},
Wien: {type: "land", owner: "de", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Praha: {type: "land", owner: "de", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Presov: {type: "land", owner: "de", hasFactory: true, pointValue: 4, center: {x: 0, y: 0}},
/** Sweden **/
Goteborg: {type: "land", owner: "sw", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Stockholm: {type: "land", owner: "sw", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Soderhamn: {type: "land", owner: "sw", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Sundsvall: {type: "land", owner: "sw", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
/** Poland **/
Danzig: {type: "land", owner:"po", hasFactory: true, pointValue: 1, center: {x: 0, y: 25}},
Warsaw: {type: "land", owner: "po", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Posen: {type: "land", owner: "po", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Krakow: {type: "land", owner: "po", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** Greece **/
Rhodes: {type: "land", owner:"gr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Athens: {type: "land", owner: "gr", hasFactory: true, pointValue: 2, center: {x: -17, y: 10}},
Crete: {type: "land", owner: "gr", hasFactory: false, pointValue: 0, center: {x: 0, y: 5}},
Volos: {type: "land", owner: "gr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Thessalonika: {type: "land", owner: "gr", hasFactory: true, pointValue: 1, center: {x: -17, y: -5}},
/** Yugoslavia **/
Zagreb: {type: "land", owner: "yu", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Beograd: {type: "land", owner: "yu", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Nis: {type: "land", owner: "yu", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Bitolji: {type: "land", owner: "yu", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Mostar: {type: "land", owner: "yu", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** Iraq **/
Baghdad: {type: "land", owner: "iq", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Mosul: {type: "land", owner: "iq", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Basra: {type: "land", owner: "iq", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
/** Iran **/
Khoi: {type: "land", owner: "ir", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Tabriz: {type: "land", owner: "ir", hasFactory: false, pointValue: 0, center: {x: -5, y: 20}},
Aveh: {type: "land", owner: "ir", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Shustar: {type: "land", owner: "ir", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
/** France **/
Paris: {type: "land", owner:"fr", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
LeMans: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Brest: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 10}},
Calais: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Orleans: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Nancy: {type: "land", owner:"fr", hasFactory: true, pointValue: 5, center: {x: 0, y: 0}},
Reims: {type: "land", owner:"fr", hasFactory: true, pointValue: 4, center: {x: 0, y: 0}},
Bordeaux: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 3, y: 0}},
Clermont: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 10}},
Toulouse: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Lyon: {type: "land", owner:"fr", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Marseille: {type: "land", owner:"fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Rabat: {type: "land", owner: "fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Oudja: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Bone: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Gabes: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Touggourt: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Oran: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Algiers: {type: "land", owner: "fr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Corsica: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Aleppo: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Beirut: {type: "land", owner: "fr", hasFactory: true, pointValue: 1, center: {x: -5, y: 0}},
Tunis: {type: "land", owner: "fr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** United Kingdom **/
Manchester: {type: "land", owner:"uk", hasFactory: true, pointValue: 10, center: {x: 0, y: 0}},
Glascow: {type: "land", owner:"uk", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
London: {type: "land", owner:"uk", hasFactory: true, pointValue: 8, center: {x: 0, y: 0}},
Bristol: {type: "land", owner:"uk", hasFactory: true, pointValue: 6, center: {x: 15, y: 20}},
Newcastle: {type: "land", owner:"uk", hasFactory: true, pointValue: 6, center: {x: 5, y: -10}},
Belfast: {type: "land", owner:"uk", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Malta: {type: "land", owner: "uk",hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Alexandria: {type: "land", owner: "uk", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Suez: {type: "land", owner: "uk",hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Cairo: {type: "land", owner: "uk", hasFactory: true, pointValue: 2, center: {x: -20, y: 0}},
Kuwait: {type: "land", owner: "uk", hasFactory: true, pointValue: 3, center: {x: -5, y: 0}},
Cyprus: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: -3, y: 7}},
Jaffa: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Amman: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: -10, y: 20}},
Gibralter: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
ElAlamein: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Sallum: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
BoxGibralterLand: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
BoxMaltaLand: {type: "land", owner: "uk", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},

/** Spain **/
Spanish_Morocco: {type: "land", owner: "sp", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Bilbao: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Barcelona: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Granada: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 10}},
Valencia: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: -20, y: 0}},
Madrid: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Sevilla: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Cordoba: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 5, y: 0}},
Salamanca: {type: "land", owner: "sp", hasFactory: true, pointValue: 1, center: {x: 0, y: 10}},
Gijon: {type: "land", owner: "sp", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** Portugal **/
Porto: {type: "land", owner: "pr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Lisbon: {type: "land", owner: "pr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
/** Italy **/
Venice: {type: "land", owner: "it", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Milan: {type: "land", owner: "it", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Florence: {type: "land", owner: "it", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Albania: {type: "land", owner: "it", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Naples: {type: "land", owner: "it", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Rome: {type: "land", owner: "it", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Sicily: {type: "land", owner: "it", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Taranto: {type: "land", owner: "it", hasFactory: true, pointValue: 1, center: {x: -15, y: -30}},
Sardinia: {type: "land", owner: "it", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Tripoli: {type: "land", owner: "it", hasFactory: true, pointValue: 1, center: {x: 20, y: 0}},
Sirte: {type: "land", owner: "it", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Benghazi: {type: "land", owner: "it", hasFactory: false, pointValue: 0, center: {x: 20, y: 0}},
Tubruq: {type: "land", owner: "it", hasFactory: false, pointValue: 0, center: {x: 10, y: 0}},
/** Soviet Occupied Buffer Zones **/
Lithuania: {type: "land", owner: "buffer", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Latvia: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 10, y: 0}},
Estonia: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Pinsk: {type: "land", owner: "buffer", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Wilno: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Bjorko: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Chisinau: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 5, y: 0}},
Lwow: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Sarny: {type: "land", owner: "buffer", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
/** USSR **/
Minsk: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Moscow: {type: "land", owner: "ru", hasFactory: true, pointValue: 2, center: {x: 0, y: 0}},
Leningrad: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Sevastapol: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: -10, y: 0}},
Baku: {type: "land", owner: "ru", hasFactory: true, pointValue: 6, center: {x: 0, y: 0}},
Olonets: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Novgorod: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Zabore: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Tbilisi: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Poti: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 10, y: 0}},
Krasnodar: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Rostov: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Dnepropetrovsk: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Yemtsa: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Vologda: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Velsk: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Toropets: {type: "land", owner: "ru", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Odessa: {type: "land", owner: "ru", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Yaroslavl: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Ryazan: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 20}},
Tula: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Kharkov: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Kargopol: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Tver: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Rzhev: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Kaluga: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Smolensk: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Grozny: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 15}},
Gurev:  {type: "land", owner: "ru", hasFactory: true, pointValue : 3, center: {x: 0, y: 0}},
Astrakhan:  {type: "land", owner: "ru", hasFactory: true, pointValue : 4, center: {x: -10, y: 0}},
Elan: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Saratov: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Yeisk: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Bikovo: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Tsarev: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Markovka: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Remontnaya: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Stalingrad: {type: "land", owner: "ru", hasFactory: true, pointValue : 2, center: {x: 0, y: 0}},
Ivanovo: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Nikolsk: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Vladimir: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Gorki: {type: "land", owner: "ru", hasFactory: true, pointValue : 6, center: {x: 0, y: 0}},
Turov:  {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Nyezhin:  {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Kursk:  {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
Kiev: {type: "land", owner: "ru", hasFactory: true, pointValue : 1, center: {x: 0, y: 0}},
Beridichev: {type: "land", owner: "ru", hasFactory: true, pointValue : 1, center: {x: 0, y: 0}},
/** Off-Map Build **/
FarEastT1: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
FarEastT2: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
MurmanskBox: {type: "land", owner: "ru", hasFactory: false, pointValue : 0, center: {x: 0, y: 0}},
/** Romania **/
Galati: {type: "land", owner: "rm", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Cernauti: {type: "land", owner: "rm", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Bucharest: {type: "land", owner: "rm", hasFactory: true, pointValue: 3, center: {x: 0, y: 0}},
Cluji: {type: "land", owner: "rm", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Lugo: {type: "land", owner: "rm", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
/** Saudi Arabia **/
AlJawf: {type: "land", owner: "sa", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Haql: {type: "land", owner: "sa", hasFactory: false, pointValue: 0, center: {x: -10, y: -15}},
AtTurayf: {type: "land", owner: "sa", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
AlQaysumah: {type: "land", owner: "sa", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
AdDamman: {type: "land", owner: "sa", hasFactory: true, pointValue: 3, center: {x: 5, y: 0}},
/** Turkey **/
Istanbul: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: -5, y: 0}},
Ankara: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Izmir: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Izmit: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Adana: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Selinoi: {type: "land", owner: "tr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Konya: {type: "land", owner: "tr", hasFactory: false, pointValue: 0, center: {x: 0, y: 0}},
Mugla: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Trabzon: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Kars: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Bitilis: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
Urfa: {type: "land", owner: "tr", hasFactory: true, pointValue: 1, center: {x: 0, y: 0}},
/** Ocean **/
SevastapolHarbor: {type: "sea", majorHarbor: true},
DenmarkSeazone: {type: "sea", majorHarbor: true},
NorthernNorthSea: {type: "sea", majorHarbor: false},
IrishSea: {type: "sea", majorHarbor: false},
ScapaFlow: {type: "sea", majorHarbor: true},
WesternAtlantic: {type: "sea", majorHarbor: false},
BrestHarbor: {type: "sea", majorHarbor: true},
HamburgHarbor: {type: "sea", majorHarbor: true},
BergenCoast: {type: "sea", majorHarbor: false},
TrondheimHarbor: {type: "sea", majorHarbor: true},
EnglishEasternCoast: {type: "sea", majorHarbor: false},
EasternEnglishChannel: {type: "sea", majorHarbor: false},
WesternEnglishChannel: {type: "sea", majorHarbor: false},
BristolHarbor: {type: "sea", majorHarbor: true},
Seazone8: {type: "sea", majorHarbor: false},
Seazone3: {type: "sea", majorHarbor: false},
Seazone4: {type: "sea", majorHarbor: false},
Seazone10: {type: "sea", majorHarbor: false},
BayofBiscay: {type: "sea", majorHarbor: false},
WesternBaltic: {type: "sea", majorHarbor: false},
CentralBaltic: {type: "sea", majorHarbor: false},
CorsicaSeazone: {type: "sea", majorHarbor: false},
MarseilleHarbor: {type: "sea", majorHarbor: true},
CentralWesternMed: {type: "sea", majorHarbor: false},
BarcelonaHarbor: {type: "sea", majorHarbor: true},
AlgeriaEastCoast: {type: "sea", majorHarbor: false},
AlgeriaCentralCoast: {type: "sea", majorHarbor: false},
AlgeriaWestCoast: {type: "sea", majorHarbor: false},
GibralterHarbor: {type: "sea", majorHarbor: true},
SicilyNorthCoast: {type: "sea", majorHarbor: false},
NorthAdriatic: {type: "sea", majorHarbor: false},
SouthAdriatic: {type: "sea", majorHarbor: false},
MaltaSeazone: {type: "sea", majorHarbor: false},
TarantoHarbor: {type: "sea", majorHarbor: true},
CentralMed: {type: "sea", majorHarbor: false},
TunisianCoast: {type: "sea", majorHarbor: false},
GreeceWestcoast: {type: "sea", majorHarbor: false},
TripoliCoast: {type: "sea", majorHarbor: false},
LeningradHarbor: {type: "sea", majorHarbor: true},
NorthernBaltic: {type: "sea", majorHarbor: false},
EgyptWestCoast: {type: "sea", majorHarbor: false},
TobrukCoast: {type: "sea", majorHarbor: false},
LibyaEastCoast: {type: "sea", majorHarbor: false},
AlexandriaHarbor: {type: "sea", majorHarbor: true},
BeirutCoast: {type: "sea", majorHarbor: false},
AleppoCoast: {type: "sea", majorHarbor: false},
EasternMed: {type: "sea", majorHarbor: false},
AthensHarbor: {type: "sea", majorHarbor: true},
IstanbulHarbor: {type: "sea", majorHarbor: true},
WesternBlackSea: {type: "sea", majorHarbor: false},
EasternBlackSea: {type: "sea", majorHarbor: false},
RedSea: {type: "sea", majorHarbor: false},
LeningradLake: {type: "sea", majorHarbor: false},
PersianGulf: {type: "sea", majorHarbor: false},
CaspianSea: {type: "sea", majorHarbor: false},
Box3: {type: "sea", majorHarbor: false},
BoxUST1: {type: "sea", majorHarbor: false},
BoxUST2: {type: "sea", majorHarbor: false},
Box4: {type: "sea", majorHarbor: false},
Box10: {type: "sea", majorHarbor: false},
BoxMalta: {type: "sea", majorHarbor: false},
BoxGibralter: {type: "sea", majorHarbor: false},
Suez1: {type: "sea", majorHarbor: false},
Suez2: {type: "sea", majorHarbor: false},
Suez3: {type: "sea", majorHarbor: false}
};


//load the elements so we can create zones
//and setup unit behaviors - connect html dom elements w/ canvas ones
  eaw.zones.loadZones = function () {
    if (eaw.zones.map_data !== null){
      console.log('USING PRE LOADED DATA');
      eaw.zones.createMap(eaw.zones.map_data);
    }
    else{
      $.get( "images/eaw.svg", function(data){
        eaw.zones.map_data = data;
        eaw.zones.createMap(data);
      });
    }
  };



  eaw.zones.createMap = function (data) {

      console.log('Painting map...');
      $(data).find('path').each(function(){
        var path_string = $(this).attr("d");
        var zone_id = $(this).attr("id");
        var zone_data = eaw.ZoneProperties[zone_id];
        if (typeof zone_data === 'undefined')
          console.log(zone_id + ' was not found in the zone list.');
        if (zone_data["type"] === "sea"){
          var majorHarbor = zone_data["majorHarbor"];

          var zone = new eaw.SeaZone(path_string, eaw.paper, zone_id, majorHarbor);
          zone.drawElement();
          var b = zone.el.getBBox();
          var x = b.x + (b.width/2);
          var y = b.y + (b.height/2);
          LAST_ZONE = zone.el;
          eaw.paper.zone_set[eaw.paper.zone_set.length] = zone.el;
          if (zone.major_harbor){
            //load the anchor
            var anchor_path = 'M 20.00,17.50 C 20.00,17.50 20.00,12.50 20.00,12.50 20.00,12.50 15.00,12.50 15.00,12.50 15.00,12.50 16.37,13.87 16.37,13.87 15.27,15.70 13.43,17.01 11.25,17.38 11.25,17.38 11.25,9.82 11.25,9.82 13.40,9.27 15.00,7.33 15.00,5.00 15.00,2.24 12.76,0.00 10.00,0.00 7.24,0.00 5.00,2.24 5.00,5.00 5.00,7.33 6.60,9.27 8.75,9.82 8.75,9.82 8.75,17.38 8.75,17.38 6.57,17.01 4.73,15.70 3.63,13.87 3.63,13.87 5.00,12.50 5.00,12.50 5.00,12.50 0.00,12.50 0.00,12.50 0.00,12.50 0.00,17.50 0.00,17.50 0.00,17.50 1.53,15.97 1.53,15.97 3.36,18.46 6.56,20.03 10.00,20.00 13.43,20.03 16.64,18.46 18.47,15.97 18.47,15.97 20.00,17.50 20.00,17.50 Z M 10.00,7.50 C 8.62,7.50 7.50,6.38 7.50,5.00 7.50,3.62 8.62,2.50 10.00,2.50 11.38,2.50 12.50,3.62 12.50,5.00 12.50,6.38 11.38,7.50 10.00,7.50 Z';
            var anchor_el = eaw.paper.path(anchor_path).attr({stroke: 'black', fill: 'black', 'stroke-width': 1}).insertAfter(zone.el);

            switch(zone.name){
              case 'LeningradHarbor':
                x = x - 65;
                y = y - 20;
              break;
              case 'TrondheimHarbor':
                x = x - 50;
                y = y + 30;
              break;
              case 'IstanbulHarbor':
                y = y - 7;
              break;
            }
            anchor_el.transform('t' + x + ',' + y);
          }

          if (zone.name.substr(0, 7) === "Seazone" || zone.name.substr(0,3) === "Box" || zone.name.substr(0,4) === "Suez"){
              var t = '';
              var fs = '32px';
              var family = 'Comic Sans MS';
              switch(zone.name){
                case 'BoxUST1':
                  t = ' US Turn 1 ';
                  fs = '14px';
                  y = y + 40;
                  family = 'Arial Black';
                break;
                case 'BoxUST2':
                  t = ' US Turn 2 ';
                  fs = '14px';
                  y = y + 40;;
                  family = 'Arial Black';
                break;
                case 'BoxMalta':
                  t = ' Malta ';
                  fs = '20px';
                  family = 'Arial Black';
                break;
                case 'BoxGibralter':
                  t = ' Gibralter ';
                  fs = '20px';
                  family = 'Arial Black';
                break;
                case 'Seazone3':
                  x = x - 200;
                  y = y + 85;
                  t = ' 3 ';
                break;
                case 'Seazone4':
                  x = x - 90;
                  t = ' 4 ';
                break;
                case 'Seazone10':
                  x = x - 10;
                  y = y + 30;
                  t = ' 10 ';
                break;
                case 'Seazone8':
                  t = ' 8 ';
                  x = x - 70;
                break;
                case 'Box3':
                  t = ' Box 3 ';
                  fs = '14px';
                  y = y + 80;
                  family = 'Arial Black';
                break;
                case 'Box4':
                  t = ' Box 4 ';
                  fs = '14px';
                  y = y + 40;
                  family = 'Arial Black';
                break;
                case 'Box10':
                  t = ' Box 10 ';
                  fs = '14px';
                  y = y + 40;
                  family = 'Arial Black';
                break;
                case 'Suez1':
                  t = ' Suez Turn 1 ';
                  fs = '10px';
                  y = y - 20;
                  family = 'Arial Black';
                break;
                case 'Suez2':
                  t = ' Suez Turn 2 ';
                  fs = '10px';
                  y = y - 20;
                  family = 'Arial Black';
                break;
                case 'Suez3':
                  t = ' Suez Turn 3 ';
                  fs = '10px';
                  y = y - 20;
                  family = 'Arial Black';
                break;
              }
              eaw.paper.text(x,y, t).attr({ fontSize: fs, "text-anchor": "middle", 'font-weight': 'bold', 'font-family': family});
          }
        }else{
          var zone = new eaw.LandZone(path_string, eaw.paper, zone_id, zone_data["owner"], zone_data["hasFactory"], zone_data["pointValue"]);
          zone.drawElement();
          var b = zone.el.getBBox();
          var x = b.x + (b.width/2);
          var y = b.y + (b.height/2);

          x = x + eaw.ZoneProperties[zone.name].center.x;
          y = y + eaw.ZoneProperties[zone.name].center.y;

          var zonename = zone.name;
          if (zonename === 'BoxGibralterLand') zonename = 'Gibralter';
          if (zonename === 'BoxMaltaLand') zonename = 'Malta';

          if (zone.point_value > 0){
            eaw.paper.text(x,y+10, '(' + zone.point_value + ')').attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Comic Sans MS'});
            eaw.paper.text(x,y, zonename).attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Arial Black'});
          }else{


            eaw.paper.text(x,y, zonename).attr({ fontSize: '7px', "text-anchor": "middle"});
          }
        }

        LAST_ZONE = zone.el;
        eaw.paper.zone_set[eaw.paper.zone_set.length] = zone.el;
        eaw.game.ZONE_SET[eaw.game.ZONE_SET.length] = zone;
      });
      console.log('Map painting complete.');
    }
