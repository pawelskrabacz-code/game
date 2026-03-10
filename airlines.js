// ═══════════════════════════════════════════════════════════════
//  SKYWARD — airlines.js
//  188 carriers · financial, alliance, hub, and category data
//
//  Usage:
//    const airline = AIRLINES['BA'];
//    // → { code:'BA', name:'British Airways', alliance:'oneworld',
//    //     category:'Large', acquisitionCost:100000000, ... }
//
//  category:         'Small' | 'Medium' | 'Large'
//  acquisitionCost:  in dollars (game currency)
//  startingBudget:   player starting balance if this airline is chosen
//  totalDailyEarn:   earnings/day if ALL routes unlocked
//  routes:           total route count in real-world data
//  avgMiles:         average route distance in miles
// ═══════════════════════════════════════════════════════════════

const AIRLINES = {
  "3L":{"code":"3L","name":"Air Arabia Abu Dhabi","alliance":"None","category":"Medium","routes":30,"avgMiles":1481,"totalDailyEarn":38070,"acquisitionCost":7000000,"startingBudget":75000,"primaryHub":"AUH","hubs":["AUH"],"focus":[]},
  "3U":{"code":"3U","name":"Sichuan Airlines","alliance":"None","category":"Large","routes":378,"avgMiles":1005,"totalDailyEarn":400590,"acquisitionCost":70000000,"startingBudget":150000,"primaryHub":"CTU","hubs":["CTU"],"focus":["CKG","KMG"]},
  "4Z":{"code":"4Z","name":"Airlink","alliance":"None","category":"Medium","routes":69,"avgMiles":711,"totalDailyEarn":77730,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"JNB","hubs":["JNB","CPT"],"focus":["DUR"]},
  "5J":{"code":"5J","name":"Cebu Pacific","alliance":"None","category":"Medium","routes":91,"avgMiles":922,"totalDailyEarn":143650,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"MNL","hubs":["MNL"],"focus":["CEB","DVO"]},
  "5N":{"code":"5N","name":"Smartavia","alliance":"None","category":"Small","routes":48,"avgMiles":983,"totalDailyEarn":41560,"acquisitionCost":7500000,"startingBudget":30000,"primaryHub":"ARH","hubs":["ARH"],"focus":["SVO"]},
  "6E":{"code":"6E","name":"IndiGo","alliance":"None","category":"Large","routes":633,"avgMiles":837,"totalDailyEarn":852150,"acquisitionCost":150000000,"startingBudget":150000,"primaryHub":"DEL","hubs":["DEL"],"focus":["BOM","BLR","HYD"]},
  "8L":{"code":"8L","name":"Lucky Air","alliance":"None","category":"Medium","routes":108,"avgMiles":831,"totalDailyEarn":95470,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"KMG","hubs":["KMG"],"focus":["LJG"]},
  "8M":{"code":"8M","name":"Myanmar Airways International","alliance":"None","category":"Small","routes":52,"avgMiles":610,"totalDailyEarn":37420,"acquisitionCost":6500000,"startingBudget":30000,"primaryHub":"RGN","hubs":["RGN"],"focus":["MDL"]},
  "9C":{"code":"9C","name":"Spring Airlines","alliance":"None","category":"Large","routes":255,"avgMiles":897,"totalDailyEarn":261390,"acquisitionCost":45000000,"startingBudget":150000,"primaryHub":"SHA","hubs":["SHA"],"focus":["PVG","SZX"]},
  "9K":{"code":"9K","name":"Cape Air","alliance":"None","category":"Small","routes":40,"avgMiles":124,"totalDailyEarn":24230,"acquisitionCost":4500000,"startingBudget":30000,"primaryHub":"BOS","hubs":["BOS"],"focus":["HYA","ACK","MVY"]},
  "9R":{"code":"9R","name":"Satena","alliance":"None","category":"Small","routes":48,"avgMiles":244,"totalDailyEarn":25360,"acquisitionCost":4500000,"startingBudget":30000,"primaryHub":"BOG","hubs":["BOG"],"focus":["MDE"]},
  "9X":{"code":"9X","name":"Southern Airways Express","alliance":"None","category":"Small","routes":25,"avgMiles":133,"totalDailyEarn":14220,"acquisitionCost":2500000,"startingBudget":30000,"primaryHub":"MEM","hubs":["MEM"],"focus":["CLT"]},
  "A3":{"code":"A3","name":"Aegean Airlines","alliance":"Star Alliance","category":"Medium","routes":182,"avgMiles":797,"totalDailyEarn":149250,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"ATH","hubs":["ATH","SKG","LCA"],"focus":[]},
  "A6":{"code":"A6","name":"Air Travel","alliance":"None","category":"Small","routes":55,"avgMiles":928,"totalDailyEarn":37850,"acquisitionCost":7000000,"startingBudget":30000,"primaryHub":"TBU","hubs":["TBU"],"focus":[]},
  "AA":{"code":"AA","name":"American Airlines","alliance":"oneworld","category":"Large","routes":1225,"avgMiles":1168,"totalDailyEarn":2883700,"acquisitionCost":500000000,"startingBudget":150000,"primaryHub":"DFW","hubs":["DFW","CLT","ORD","MIA","PHX","PHL","LAX","JFK","DCA"],"focus":[]},
  "AC":{"code":"AC","name":"Air Canada","alliance":"Star Alliance","category":"Large","routes":366,"avgMiles":2044,"totalDailyEarn":658180,"acquisitionCost":100000000,"startingBudget":150000,"primaryHub":"YYZ","hubs":["YYZ","YUL","YVR"],"focus":["YYC"]},
  "AD":{"code":"AD","name":"Azul","alliance":"None","category":"Large","routes":267,"avgMiles":718,"totalDailyEarn":314390,"acquisitionCost":55000000,"startingBudget":150000,"primaryHub":"VCP","hubs":["VCP"],"focus":["GRU","BSB"]},
  "AE":{"code":"AE","name":"Mandarin Airlines","alliance":"None","category":"Small","routes":17,"avgMiles":258,"totalDailyEarn":12590,"acquisitionCost":2500000,"startingBudget":30000,"primaryHub":"TPE","hubs":["TPE"],"focus":["RMQ","KHH"]},
  "AF":{"code":"AF","name":"Air France","alliance":"SkyTeam","category":"Large","routes":198,"avgMiles":2343,"totalDailyEarn":465200,"acquisitionCost":85000000,"startingBudget":150000,"primaryHub":"CDG","hubs":["CDG"],"focus":["ORY"]},
  "AI":{"code":"AI","name":"Air India","alliance":"Star Alliance","category":"Large","routes":134,"avgMiles":1845,"totalDailyEarn":365540,"acquisitionCost":65000000,"startingBudget":150000,"primaryHub":"DEL","hubs":["DEL","BOM"],"focus":["BLR","CCU"]},
  "AK":{"code":"AK","name":"AirAsia","alliance":"None","category":"Medium","routes":118,"avgMiles":984,"totalDailyEarn":225500,"acquisitionCost":40000000,"startingBudget":75000,"primaryHub":"KUL","hubs":["KUL"],"focus":["PEN","JHB"]},
  "AM":{"code":"AM","name":"Aeromexico","alliance":"SkyTeam","category":"Large","routes":125,"avgMiles":1629,"totalDailyEarn":269170,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"MEX","hubs":["MEX"],"focus":["GDL","MTY"]},
  "AQ":{"code":"AQ","name":"9 Air Co Ltd.","alliance":"None","category":"Medium","routes":89,"avgMiles":876,"totalDailyEarn":64240,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"CAN","hubs":["CAN"],"focus":["WUH"]},
  "AR":{"code":"AR","name":"Aerolineas Argentinas","alliance":"SkyTeam","category":"Medium","routes":120,"avgMiles":1074,"totalDailyEarn":151360,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"EZE","hubs":["EZE"],"focus":["AEP","COR"]},
  "AT":{"code":"AT","name":"Royal Air Maroc","alliance":"oneworld","category":"Large","routes":152,"avgMiles":1386,"totalDailyEarn":156970,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"CMN","hubs":["CMN"],"focus":["RAK"]},
  "AV":{"code":"AV","name":"Avianca","alliance":"Star Alliance","category":"Large","routes":161,"avgMiles":1334,"totalDailyEarn":323650,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"BOG","hubs":["BOG"],"focus":["MED","SAL"]},
  "AY":{"code":"AY","name":"Finnair","alliance":"oneworld","category":"Large","routes":117,"avgMiles":1661,"totalDailyEarn":169770,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"HEL","hubs":["HEL"],"focus":[]},
  "AZ":{"code":"AZ","name":"ITA Airways","alliance":"Star Alliance *","category":"Large","routes":88,"avgMiles":1534,"totalDailyEarn":152640,"acquisitionCost":25000000,"startingBudget":150000,"primaryHub":"FCO","hubs":["FCO"],"focus":["MXP"]},
  "B6":{"code":"B6","name":"JetBlue","alliance":"None","category":"Large","routes":280,"avgMiles":1347,"totalDailyEarn":565420,"acquisitionCost":100000000,"startingBudget":150000,"primaryHub":"JFK","hubs":["JFK","BOS"],"focus":["FLL","MCO","LAX","SJU"]},
  "BA":{"code":"BA","name":"British Airways","alliance":"oneworld","category":"Large","routes":257,"avgMiles":1971,"totalDailyEarn":581550,"acquisitionCost":100000000,"startingBudget":150000,"primaryHub":"LHR","hubs":["LHR","LGW"],"focus":["LCY"]},
  "BC":{"code":"BC","name":"Skymark Airlines","alliance":"None","category":"Small","routes":23,"avgMiles":583,"totalDailyEarn":47900,"acquisitionCost":8500000,"startingBudget":30000,"primaryHub":"HND","hubs":["HND"],"focus":["KIX","CTS"]},
  "BG":{"code":"BG","name":"Biman Bangladesh Airlines","alliance":"None","category":"Medium","routes":43,"avgMiles":1958,"totalDailyEarn":36560,"acquisitionCost":6500000,"startingBudget":75000,"primaryHub":"DAC","hubs":["DAC"],"focus":["CGP"]},
  "BK":{"code":"BK","name":"Okay Airways","alliance":"None","category":"Small","routes":61,"avgMiles":697,"totalDailyEarn":43030,"acquisitionCost":7500000,"startingBudget":30000,"primaryHub":"TNA","hubs":["TNA"],"focus":["PKX"]},
  "BR":{"code":"BR","name":"EVA Air","alliance":"Star Alliance","category":"Large","routes":60,"avgMiles":2697,"totalDailyEarn":155910,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"TPE","hubs":["TPE"],"focus":["KHH"]},
  "BS":{"code":"BS","name":"US-Bangla Airlines","alliance":"None","category":"Small","routes":22,"avgMiles":1587,"totalDailyEarn":27290,"acquisitionCost":5000000,"startingBudget":30000,"primaryHub":"DAC","hubs":["DAC"],"focus":["CGP"]},
  "BT":{"code":"BT","name":"Air Baltic","alliance":"None","category":"Medium","routes":122,"avgMiles":1205,"totalDailyEarn":82640,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"RIX","hubs":["RIX"],"focus":["TLL","VNO"]},
  "BW":{"code":"BW","name":"Caribbean Airlines","alliance":"None","category":"Small","routes":43,"avgMiles":814,"totalDailyEarn":31210,"acquisitionCost":5500000,"startingBudget":30000,"primaryHub":"POS","hubs":["POS"],"focus":["BGI"]},
  "BX":{"code":"BX","name":"Air Busan","alliance":"None","category":"Small","routes":31,"avgMiles":1194,"totalDailyEarn":32030,"acquisitionCost":6000000,"startingBudget":30000,"primaryHub":"PUS","hubs":["PUS"],"focus":["ICN"]},
  "CI":{"code":"CI","name":"China Airlines","alliance":"SkyTeam","category":"Large","routes":67,"avgMiles":2275,"totalDailyEarn":121690,"acquisitionCost":20000000,"startingBudget":150000,"primaryHub":"TPE","hubs":["TPE"],"focus":["KHH"]},
  "CX":{"code":"CX","name":"Cathay Pacific","alliance":"oneworld","category":"Large","routes":83,"avgMiles":3021,"totalDailyEarn":324310,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"HKG","hubs":["HKG"],"focus":[]},
  "CZ":{"code":"CZ","name":"China Southern Airlines","alliance":"None","category":"Large","routes":661,"avgMiles":1260,"totalDailyEarn":1238480,"acquisitionCost":200000000,"startingBudget":150000,"primaryHub":"CAN","hubs":["CAN"],"focus":["PEK","WUH"]},
  "D7":{"code":"D7","name":"AirAsia X","alliance":"None","category":"Medium","routes":25,"avgMiles":2857,"totalDailyEarn":43710,"acquisitionCost":8000000,"startingBudget":75000,"primaryHub":"KUL","hubs":["KUL"],"focus":[]},
  "D8":{"code":"D8","name":"Norwegian Air Sweden","alliance":"None","category":"Large","routes":208,"avgMiles":1248,"totalDailyEarn":146300,"acquisitionCost":25000000,"startingBudget":150000,"primaryHub":"ARN","hubs":["ARN"],"focus":["OSL"]},
  "DE":{"code":"DE","name":"Condor","alliance":"None","category":"Large","routes":149,"avgMiles":2023,"totalDailyEarn":141050,"acquisitionCost":25000000,"startingBudget":150000,"primaryHub":"FRA","hubs":["FRA"],"focus":["DUS","MUC"]},
  "DG":{"code":"DG","name":"Cebgo","alliance":"None","category":"Small","routes":32,"avgMiles":190,"totalDailyEarn":18990,"acquisitionCost":3500000,"startingBudget":30000,"primaryHub":"MNL","hubs":["MNL"],"focus":["CEB"]},
  "DL":{"code":"DL","name":"Delta Air Lines","alliance":"SkyTeam","category":"Large","routes":980,"avgMiles":1443,"totalDailyEarn":2405560,"acquisitionCost":450000000,"startingBudget":150000,"primaryHub":"ATL","hubs":["ATL","DTW","MSP","SLC","SEA","JFK","LAX","BOS","LGA"],"focus":[]},
  "DM":{"code":"DM","name":"Arajet","alliance":"None","category":"Medium","routes":36,"avgMiles":1598,"totalDailyEarn":38490,"acquisitionCost":7000000,"startingBudget":75000,"primaryHub":"SDQ","hubs":["SDQ"],"focus":[]},
  "DP":{"code":"DP","name":"Pobeda","alliance":"None","category":"Medium","routes":75,"avgMiles":1039,"totalDailyEarn":110130,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"VKO","hubs":["VKO"],"focus":["SVO"]},
  "DR":{"code":"DR","name":"Ruili Airlines","alliance":"None","category":"Medium","routes":85,"avgMiles":822,"totalDailyEarn":57810,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"JHG","hubs":["JHG"],"focus":["RUG"]},
  "DY":{"code":"DY","name":"Norwegian","alliance":"None","category":"Medium","routes":156,"avgMiles":1162,"totalDailyEarn":113520,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"OSL","hubs":["OSL"],"focus":["CPH","ARN","LGW"]},
  "DZ":{"code":"DZ","name":"Donghai Airlines","alliance":"None","category":"Small","routes":72,"avgMiles":663,"totalDailyEarn":41800,"acquisitionCost":7500000,"startingBudget":30000,"primaryHub":"SZX","hubs":["SZX"],"focus":[]},
  "EI":{"code":"EI","name":"Aer Lingus","alliance":"oneworld","category":"Large","routes":122,"avgMiles":1411,"totalDailyEarn":161670,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"DUB","hubs":["DUB"],"focus":["ORK","SNN"]},
  "EK":{"code":"EK","name":"Emirates","alliance":"None","category":"Large","routes":148,"avgMiles":3280,"totalDailyEarn":616640,"acquisitionCost":100000000,"startingBudget":150000,"primaryHub":"DXB","hubs":["DXB"],"focus":[]},
  "EN":{"code":"EN","name":"Air Dolomiti","alliance":"Star Alliance","category":"Small","routes":29,"avgMiles":328,"totalDailyEarn":24470,"acquisitionCost":4500000,"startingBudget":30000,"primaryHub":"VRN","hubs":["VRN"],"focus":["MXP","FCO"]},
  "EU":{"code":"EU","name":"Chengdu Airlines","alliance":"None","category":"Medium","routes":210,"avgMiles":725,"totalDailyEarn":146160,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"CTU","hubs":["CTU"],"focus":["XIY"]},
  "EW":{"code":"EW","name":"Eurowings","alliance":"None","category":"Large","routes":439,"avgMiles":1050,"totalDailyEarn":304620,"acquisitionCost":55000000,"startingBudget":150000,"primaryHub":"DUS","hubs":["DUS"],"focus":["CGN","HAM","STR","VIE"]},
  "EY":{"code":"EY","name":"Etihad Airways","alliance":"None","category":"Large","routes":105,"avgMiles":2868,"totalDailyEarn":329610,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"AUH","hubs":["AUH"],"focus":[]},
  "F3":{"code":"F3","name":"Flyadeal","alliance":"None","category":"Small","routes":54,"avgMiles":764,"totalDailyEarn":77430,"acquisitionCost":15000000,"startingBudget":30000,"primaryHub":"JED","hubs":["JED"],"focus":["RUH"]},
  "F8":{"code":"F8","name":"Flair Airlines","alliance":"None","category":"Medium","routes":43,"avgMiles":1318,"totalDailyEarn":46470,"acquisitionCost":8500000,"startingBudget":75000,"primaryHub":"YEG","hubs":["YEG"],"focus":["YYC","YVR","YYZ"]},
  "F9":{"code":"F9","name":"Frontier Airlines","alliance":"None","category":"Large","routes":360,"avgMiles":962,"totalDailyEarn":266480,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"DEN","hubs":["DEN"],"focus":["ORD","ATL"]},
  "FA":{"code":"FA","name":"Safair","alliance":"None","category":"Small","routes":26,"avgMiles":638,"totalDailyEarn":62370,"acquisitionCost":10000000,"startingBudget":30000,"primaryHub":"JNB","hubs":["JNB","CPT"],"focus":["DUR"]},
  "FI":{"code":"FI","name":"Icelandair","alliance":"None","category":"Medium","routes":62,"avgMiles":1806,"totalDailyEarn":92130,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"KEF","hubs":["KEF"],"focus":[]},
  "FJ":{"code":"FJ","name":"Fiji Airways","alliance":"oneworld","category":"Medium","routes":44,"avgMiles":1718,"totalDailyEarn":41560,"acquisitionCost":7500000,"startingBudget":75000,"primaryHub":"NAN","hubs":["NAN"],"focus":["SUV"]},
  "FM":{"code":"FM","name":"Shanghai Airlines","alliance":"None","category":"Medium","routes":138,"avgMiles":950,"totalDailyEarn":153810,"acquisitionCost":30000000,"startingBudget":75000,"primaryHub":"SHA","hubs":["SHA"],"focus":["PVG"]},
  "FR":{"code":"FR","name":"Ryanair","alliance":"None","category":"Large","routes":2473,"avgMiles":894,"totalDailyEarn":1704290,"acquisitionCost":300000000,"startingBudget":150000,"primaryHub":"DUB","hubs":[],"focus":["DUB","STN","BGY","BCN","MAD"]},
  "FY":{"code":"FY","name":"Firefly","alliance":"None","category":"Small","routes":23,"avgMiles":410,"totalDailyEarn":18210,"acquisitionCost":3500000,"startingBudget":30000,"primaryHub":"KUL","hubs":["KUL"],"focus":["PEN","JHB"]},
  "FZ":{"code":"FZ","name":"Flydubai","alliance":"None","category":"Large","routes":136,"avgMiles":1549,"totalDailyEarn":237910,"acquisitionCost":45000000,"startingBudget":150000,"primaryHub":"DXB","hubs":["DXB"],"focus":[]},
  "G3":{"code":"G3","name":"Gol","alliance":"None","category":"Large","routes":201,"avgMiles":987,"totalDailyEarn":284330,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"GRU","hubs":["GRU"],"focus":["GIG","BSB"]},
  "G4":{"code":"G4","name":"Allegiant Air","alliance":"None","category":"Large","routes":531,"avgMiles":926,"totalDailyEarn":283970,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"LAS","hubs":[],"focus":["LAS","PIE","PGD","AZA"]},
  "G5":{"code":"G5","name":"China Express Airlines","alliance":"None","category":"Medium","routes":272,"avgMiles":501,"totalDailyEarn":155970,"acquisitionCost":30000000,"startingBudget":75000,"primaryHub":"CKG","hubs":["CKG"],"focus":["GYN"]},
  "G9":{"code":"G9","name":"Air Arabia","alliance":"None","category":"Large","routes":94,"avgMiles":1535,"totalDailyEarn":178400,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"SHJ","hubs":["SHJ"],"focus":["CMN","HRG"]},
  "GA":{"code":"GA","name":"Garuda Indonesia","alliance":"SkyTeam","category":"Medium","routes":55,"avgMiles":1540,"totalDailyEarn":99770,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"CGK","hubs":["CGK"],"focus":["DPS","SUB"]},
  "GF":{"code":"GF","name":"Gulf Air","alliance":"None","category":"Medium","routes":54,"avgMiles":1851,"totalDailyEarn":86540,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"BAH","hubs":["BAH"],"focus":[]},
  "GK":{"code":"GK","name":"Jetstar Japan","alliance":"None","category":"Small","routes":25,"avgMiles":839,"totalDailyEarn":35220,"acquisitionCost":6500000,"startingBudget":30000,"primaryHub":"NRT","hubs":["NRT"],"focus":["KIX","NGO"]},
  "GS":{"code":"GS","name":"Tianjin Airlines","alliance":"None","category":"Medium","routes":148,"avgMiles":809,"totalDailyEarn":95970,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"TSN","hubs":["TSN"],"focus":["XMN"]},
  "GX":{"code":"GX","name":"GX Airlines","alliance":"None","category":"Small","routes":83,"avgMiles":736,"totalDailyEarn":50000,"acquisitionCost":9000000,"startingBudget":30000,"primaryHub":"KWL","hubs":["KWL"],"focus":["NNG"]},
  "GY":{"code":"GY","name":"Colorful Guizhou Airlines","alliance":"None","category":"Small","routes":61,"avgMiles":698,"totalDailyEarn":42520,"acquisitionCost":7500000,"startingBudget":30000,"primaryHub":"KWE","hubs":["KWE"],"focus":[]},
  "H2":{"code":"H2","name":"Sky Airline","alliance":"None","category":"Small","routes":51,"avgMiles":868,"totalDailyEarn":53720,"acquisitionCost":9500000,"startingBudget":30000,"primaryHub":"SCL","hubs":["SCL"],"focus":["ANF"]},
  "HO":{"code":"HO","name":"Juneyao Air","alliance":"None","category":"Large","routes":174,"avgMiles":1035,"totalDailyEarn":213840,"acquisitionCost":40000000,"startingBudget":150000,"primaryHub":"PVG","hubs":["PVG"],"focus":["SHA"]},
  "HU":{"code":"HU","name":"Hainan Airlines","alliance":"None","category":"Large","routes":279,"avgMiles":1562,"totalDailyEarn":385610,"acquisitionCost":70000000,"startingBudget":150000,"primaryHub":"HAK","hubs":["HAK"],"focus":["PEK","SHA"]},
  "HX":{"code":"HX","name":"Hong Kong Airlines","alliance":"None","category":"Medium","routes":29,"avgMiles":1587,"totalDailyEarn":49600,"acquisitionCost":9000000,"startingBudget":75000,"primaryHub":"HKG","hubs":["HKG"],"focus":[]},
  "IB":{"code":"IB","name":"Iberia","alliance":"oneworld","category":"Large","routes":173,"avgMiles":1707,"totalDailyEarn":339070,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"MAD","hubs":["MAD"],"focus":[]},
  "ID":{"code":"ID","name":"Batik Air","alliance":"None","category":"Medium","routes":67,"avgMiles":701,"totalDailyEarn":81260,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"CGK","hubs":["CGK"],"focus":["UPG","DPS"]},
  "IU":{"code":"IU","name":"Super Air Jet","alliance":"None","category":"Small","routes":74,"avgMiles":502,"totalDailyEarn":71360,"acquisitionCost":15000000,"startingBudget":30000,"primaryHub":"CGK","hubs":["CGK"],"focus":["KNO"]},
  "IX":{"code":"IX","name":"Air India Express","alliance":"None","category":"Large","routes":175,"avgMiles":1159,"totalDailyEarn":213180,"acquisitionCost":40000000,"startingBudget":150000,"primaryHub":"COK","hubs":["COK"],"focus":["TRV","MAA","CCJ"]},
  "J2":{"code":"J2","name":"Azerbaijan Airlines","alliance":"None","category":"Medium","routes":48,"avgMiles":1317,"totalDailyEarn":50630,"acquisitionCost":9000000,"startingBudget":75000,"primaryHub":"GYD","hubs":["GYD"],"focus":["NAJ"]},
  "J9":{"code":"J9","name":"Jazeera Airways","alliance":"None","category":"Medium","routes":65,"avgMiles":1231,"totalDailyEarn":57820,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"KWI","hubs":["KWI"],"focus":[]},
  "JA":{"code":"JA","name":"JetSmart Chile","alliance":"None","category":"Medium","routes":97,"avgMiles":876,"totalDailyEarn":101630,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"SCL","hubs":["SCL"],"focus":["CCP"]},
  "JD":{"code":"JD","name":"Capital Airlines","alliance":"None","category":"Medium","routes":150,"avgMiles":1165,"totalDailyEarn":128460,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"PEK","hubs":["PEK"],"focus":["XIY"]},
  "JH":{"code":"JH","name":"Fuji Dream Airlines","alliance":"None","category":"Small","routes":26,"avgMiles":434,"totalDailyEarn":23950,"acquisitionCost":4500000,"startingBudget":30000,"primaryHub":"FSZ","hubs":["FSZ"],"focus":["NGO","SDJ"]},
  "JT":{"code":"JT","name":"Lion Air","alliance":"None","category":"Medium","routes":73,"avgMiles":586,"totalDailyEarn":80700,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"CGK","hubs":["CGK"],"focus":["SUB","UPG"]},
  "KE":{"code":"KE","name":"Korean Air","alliance":"SkyTeam","category":"Large","routes":111,"avgMiles":2308,"totalDailyEarn":234900,"acquisitionCost":40000000,"startingBudget":150000,"primaryHub":"ICN","hubs":["ICN"],"focus":["GMP"]},
  "KL":{"code":"KL","name":"KLM","alliance":"SkyTeam","category":"Large","routes":169,"avgMiles":2288,"totalDailyEarn":385420,"acquisitionCost":70000000,"startingBudget":150000,"primaryHub":"AMS","hubs":["AMS"],"focus":[]},
  "KN":{"code":"KN","name":"China United Airlines","alliance":"None","category":"Medium","routes":98,"avgMiles":841,"totalDailyEarn":96720,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"PEK","hubs":["PEK"],"focus":["PKX"]},
  "KQ":{"code":"KQ","name":"Kenya Airways","alliance":"SkyTeam","category":"Medium","routes":49,"avgMiles":1560,"totalDailyEarn":62950,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"NBO","hubs":["NBO"],"focus":[]},
  "KU":{"code":"KU","name":"Kuwait Airways","alliance":"None","category":"Medium","routes":59,"avgMiles":1853,"totalDailyEarn":77670,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"KWI","hubs":["KWI"],"focus":[]},
  "KY":{"code":"KY","name":"Kunming Airlines","alliance":"None","category":"Small","routes":48,"avgMiles":794,"totalDailyEarn":58460,"acquisitionCost":10000000,"startingBudget":30000,"primaryHub":"KMG","hubs":["KMG"],"focus":[]},
  "LA":{"code":"LA","name":"LATAM Airlines","alliance":"None","category":"Large","routes":331,"avgMiles":1313,"totalDailyEarn":731620,"acquisitionCost":150000000,"startingBudget":150000,"primaryHub":"SCL","hubs":["SCL","GRU"],"focus":["LIM","BOG"]},
  "LG":{"code":"LG","name":"Luxair","alliance":"None","category":"Medium","routes":96,"avgMiles":936,"totalDailyEarn":57810,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"LUX","hubs":["LUX"],"focus":[]},
  "LH":{"code":"LH","name":"Lufthansa","alliance":"Star Alliance","category":"Large","routes":293,"avgMiles":1775,"totalDailyEarn":538330,"acquisitionCost":95000000,"startingBudget":150000,"primaryHub":"FRA","hubs":["FRA","MUC"],"focus":[]},
  "LJ":{"code":"LJ","name":"Jin Air","alliance":"None","category":"Medium","routes":56,"avgMiles":984,"totalDailyEarn":60890,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"ICN","hubs":["ICN"],"focus":["GMP","PUS"]},
  "LM":{"code":"LM","name":"Loganair","alliance":"None","category":"Small","routes":54,"avgMiles":224,"totalDailyEarn":31090,"acquisitionCost":5500000,"startingBudget":30000,"primaryHub":"GLA","hubs":["GLA","ABZ","EDI","INV"],"focus":["NCL","KOI"]},
  "LO":{"code":"LO","name":"LOT Polish Airlines","alliance":"Star Alliance","category":"Medium","routes":113,"avgMiles":1362,"totalDailyEarn":142710,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"WAW","hubs":["WAW"],"focus":["KRK","WRO"]},
  "LS":{"code":"LS","name":"Jet2","alliance":"None","category":"Large","routes":532,"avgMiles":1398,"totalDailyEarn":361320,"acquisitionCost":65000000,"startingBudget":150000,"primaryHub":"LBA","hubs":["LBA"],"focus":["MAN","BHX","NCL","EMA","LPL","EDI","GLA"]},
  "LX":{"code":"LX","name":"Swiss","alliance":"Star Alliance","category":"Large","routes":120,"avgMiles":1453,"totalDailyEarn":190070,"acquisitionCost":35000000,"startingBudget":150000,"primaryHub":"ZRH","hubs":["ZRH"],"focus":["GVA"]},
  "LY":{"code":"LY","name":"El Al","alliance":"None","category":"Medium","routes":62,"avgMiles":1997,"totalDailyEarn":105490,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"TLV","hubs":["TLV"],"focus":[]},
  "ME":{"code":"ME","name":"Middle East Airlines","alliance":"SkyTeam","category":"Small","routes":31,"avgMiles":1293,"totalDailyEarn":37290,"acquisitionCost":6500000,"startingBudget":30000,"primaryHub":"BEY","hubs":["BEY"],"focus":[]},
  "MH":{"code":"MH","name":"Malaysia Airlines","alliance":"oneworld","category":"Large","routes":70,"avgMiles":1896,"totalDailyEarn":177260,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"KUL","hubs":["KUL"],"focus":["PEN"]},
  "MK":{"code":"MK","name":"Air Mauritius","alliance":"None","category":"Medium","routes":13,"avgMiles":3037,"totalDailyEarn":19230,"acquisitionCost":3500000,"startingBudget":75000,"primaryHub":"MRU","hubs":["MRU"],"focus":[]},
  "MS":{"code":"MS","name":"EgyptAir","alliance":"Star Alliance","category":"Large","routes":102,"avgMiles":1985,"totalDailyEarn":150500,"acquisitionCost":25000000,"startingBudget":150000,"primaryHub":"CAI","hubs":["CAI"],"focus":[]},
  "MU":{"code":"MU","name":"China Eastern Airlines","alliance":"SkyTeam","category":"Large","routes":823,"avgMiles":1109,"totalDailyEarn":1147260,"acquisitionCost":200000000,"startingBudget":150000,"primaryHub":"PVG","hubs":["PVG","SHA"],"focus":["KMG"]},
  "MY":{"code":"MY","name":"MASwings","alliance":"None","category":"Small","routes":38,"avgMiles":100,"totalDailyEarn":20520,"acquisitionCost":3500000,"startingBudget":30000,"primaryHub":"KCH","hubs":["KCH"],"focus":["BKI","MYY"]},
  "N4":{"code":"N4","name":"Nordwind Airlines","alliance":"None","category":"Medium","routes":64,"avgMiles":1490,"totalDailyEarn":40440,"acquisitionCost":7500000,"startingBudget":75000,"primaryHub":"SVO","hubs":["SVO"],"focus":["VKO"]},
  "NH":{"code":"NH","name":"ANA","alliance":"Star Alliance","category":"Large","routes":196,"avgMiles":1373,"totalDailyEarn":391180,"acquisitionCost":70000000,"startingBudget":150000,"primaryHub":"HND","hubs":["HND","NRT"],"focus":["ITM"]},
  "NK":{"code":"NK","name":"Spirit Airlines","alliance":"None","category":"Medium","routes":192,"avgMiles":989,"totalDailyEarn":152810,"acquisitionCost":30000000,"startingBudget":75000,"primaryHub":"FLL","hubs":["FLL"],"focus":["ORD","LAS","LAX"]},
  "NT":{"code":"NT","name":"Binter Canarias","alliance":"None","category":"Small","routes":63,"avgMiles":758,"totalDailyEarn":55500,"acquisitionCost":10000000,"startingBudget":30000,"primaryHub":"LPA","hubs":["LPA"],"focus":["TFN","TFS"]},
  "NX":{"code":"NX","name":"Air Macau","alliance":"None","category":"Small","routes":30,"avgMiles":909,"totalDailyEarn":38270,"acquisitionCost":7000000,"startingBudget":30000,"primaryHub":"MFM","hubs":["MFM"],"focus":[]},
  "NZ":{"code":"NZ","name":"Air New Zealand","alliance":"Star Alliance","category":"Large","routes":79,"avgMiles":1641,"totalDailyEarn":160690,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"AKL","hubs":["AKL"],"focus":["CHC","WLG"]},
  "OB":{"code":"OB","name":"BoA","alliance":"None","category":"Small","routes":28,"avgMiles":1050,"totalDailyEarn":27310,"acquisitionCost":5000000,"startingBudget":30000,"primaryHub":"VVI","hubs":["VVI"],"focus":["LPB","CBB"]},
  "OQ":{"code":"OQ","name":"Chongqing Airlines","alliance":"None","category":"Medium","routes":70,"avgMiles":947,"totalDailyEarn":65460,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"CKG","hubs":["CKG"],"focus":[]},
  "OR":{"code":"OR","name":"TUIfly Netherlands","alliance":"None","category":"Medium","routes":58,"avgMiles":2047,"totalDailyEarn":40620,"acquisitionCost":7500000,"startingBudget":75000,"primaryHub":"AMS","hubs":["AMS"],"focus":[]},
  "OS":{"code":"OS","name":"Austrian","alliance":"Star Alliance","category":"Medium","routes":124,"avgMiles":1161,"totalDailyEarn":150160,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"VIE","hubs":["VIE"],"focus":[]},
  "OU":{"code":"OU","name":"Croatia Airlines","alliance":"Star Alliance","category":"Small","routes":60,"avgMiles":527,"totalDailyEarn":34800,"acquisitionCost":6500000,"startingBudget":30000,"primaryHub":"ZAG","hubs":["ZAG"],"focus":["SPU"]},
  "OV":{"code":"OV","name":"SalamAir","alliance":"None","category":"Medium","routes":43,"avgMiles":1337,"totalDailyEarn":41650,"acquisitionCost":7500000,"startingBudget":75000,"primaryHub":"MCT","hubs":["MCT"],"focus":[]},
  "OZ":{"code":"OZ","name":"Asiana Airlines","alliance":"Star Alliance","category":"Large","routes":66,"avgMiles":2046,"totalDailyEarn":120780,"acquisitionCost":20000000,"startingBudget":150000,"primaryHub":"ICN","hubs":["ICN"],"focus":["GMP"]},
  "PD":{"code":"PD","name":"Porter Airlines","alliance":"None","category":"Medium","routes":98,"avgMiles":1141,"totalDailyEarn":116370,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"YTZ","hubs":["YTZ"],"focus":["YYZ","YOW"]},
  "PG":{"code":"PG","name":"Bangkok Airways","alliance":"None","category":"Small","routes":22,"avgMiles":528,"totalDailyEarn":32410,"acquisitionCost":6000000,"startingBudget":30000,"primaryHub":"BKK","hubs":["BKK"],"focus":["USM","CNX"]},
  "PK":{"code":"PK","name":"Pakistan International Airlines","alliance":"None","category":"Medium","routes":75,"avgMiles":1654,"totalDailyEarn":51530,"acquisitionCost":9500000,"startingBudget":75000,"primaryHub":"KHI","hubs":["KHI"],"focus":["LHE","ISB"]},
  "PN":{"code":"PN","name":"West Air","alliance":"None","category":"Medium","routes":88,"avgMiles":854,"totalDailyEarn":85090,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"CKG","hubs":["CKG"],"focus":["XIY"]},
  "PR":{"code":"PR","name":"Philippine Airlines","alliance":"None","category":"Large","routes":90,"avgMiles":1513,"totalDailyEarn":151500,"acquisitionCost":25000000,"startingBudget":150000,"primaryHub":"MNL","hubs":["MNL"],"focus":["CEB"]},
  "QF":{"code":"QF","name":"Qantas","alliance":"oneworld","category":"Large","routes":179,"avgMiles":1822,"totalDailyEarn":394420,"acquisitionCost":70000000,"startingBudget":150000,"primaryHub":"SYD","hubs":["SYD","MEL"],"focus":["BNE","PER"]},
  "QG":{"code":"QG","name":"Citilink","alliance":"None","category":"Small","routes":57,"avgMiles":583,"totalDailyEarn":76960,"acquisitionCost":15000000,"startingBudget":30000,"primaryHub":"CGK","hubs":["CGK"],"focus":["SUB","DPS"]},
  "QP":{"code":"QP","name":"Akasa Air","alliance":"None","category":"Medium","routes":69,"avgMiles":932,"totalDailyEarn":79710,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"BOM","hubs":["BOM"],"focus":["DEL","BLR"]},
  "QR":{"code":"QR","name":"Qatar Airways","alliance":"oneworld","category":"Large","routes":176,"avgMiles":2806,"totalDailyEarn":568260,"acquisitionCost":100000000,"startingBudget":150000,"primaryHub":"DOH","hubs":["DOH"],"focus":[]},
  "QW":{"code":"QW","name":"Qingdao Airlines","alliance":"None","category":"Medium","routes":83,"avgMiles":895,"totalDailyEarn":59090,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"TAO","hubs":["TAO"],"focus":[]},
  "QZ":{"code":"QZ","name":"Indonesia AirAsia","alliance":"None","category":"Small","routes":40,"avgMiles":899,"totalDailyEarn":56760,"acquisitionCost":10000000,"startingBudget":30000,"primaryHub":"CGK","hubs":["CGK"],"focus":["SUB","DPS"]},
  "RJ":{"code":"RJ","name":"Royal Jordanian","alliance":"oneworld","category":"Medium","routes":65,"avgMiles":1718,"totalDailyEarn":74600,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"AMM","hubs":["AMM"],"focus":[]},
  "RK":{"code":"RK","name":"Ryanair UK","alliance":"None","category":"Medium","routes":116,"avgMiles":933,"totalDailyEarn":68950,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"STN","hubs":[],"focus":["STN","LGW","MAN"]},
  "S7":{"code":"S7","name":"S7 Airlines","alliance":"Suspended - oneworld","category":"Large","routes":140,"avgMiles":1417,"totalDailyEarn":174520,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"OVB","hubs":["OVB"],"focus":["DME"]},
  "SC":{"code":"SC","name":"Shandong Airlines","alliance":"Star Alliance","category":"Large","routes":206,"avgMiles":802,"totalDailyEarn":300220,"acquisitionCost":55000000,"startingBudget":150000,"primaryHub":"TNA","hubs":["TNA"],"focus":["JNA"]},
  "SG":{"code":"SG","name":"SpiceJet","alliance":"None","category":"Small","routes":61,"avgMiles":709,"totalDailyEarn":53890,"acquisitionCost":9500000,"startingBudget":30000,"primaryHub":"DEL","hubs":["DEL"],"focus":["BOM","HYD"]},
  "SK":{"code":"SK","name":"SAS","alliance":"SkyTeam","category":"Large","routes":253,"avgMiles":1185,"totalDailyEarn":290340,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"CPH","hubs":["CPH","ARN","OSL"],"focus":[]},
  "SN":{"code":"SN","name":"Brussels Airlines","alliance":"Star Alliance","category":"Medium","routes":89,"avgMiles":1433,"totalDailyEarn":104800,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"BRU","hubs":["BRU"],"focus":[]},
  "SQ":{"code":"SQ","name":"Singapore Airlines","alliance":"Star Alliance","category":"Large","routes":80,"avgMiles":3393,"totalDailyEarn":344770,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"SIN","hubs":["SIN"],"focus":[]},
  "SS":{"code":"SS","name":"Corsair","alliance":"None","category":"Medium","routes":10,"avgMiles":3548,"totalDailyEarn":19640,"acquisitionCost":3500000,"startingBudget":75000,"primaryHub":"ORY","hubs":["ORY"],"focus":[]},
  "SU":{"code":"SU","name":"Aeroflot","alliance":"Suspended - SkyTeam","category":"Large","routes":258,"avgMiles":1808,"totalDailyEarn":491750,"acquisitionCost":90000000,"startingBudget":150000,"primaryHub":"SVO","hubs":["SVO"],"focus":["LED"]},
  "SV":{"code":"SV","name":"Saudia","alliance":"SkyTeam","category":"Large","routes":160,"avgMiles":1929,"totalDailyEarn":286630,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"JED","hubs":["JED","RUH"],"focus":["DMM"]},
  "SY":{"code":"SY","name":"Sun Country Airlines","alliance":"None","category":"Medium","routes":86,"avgMiles":1179,"totalDailyEarn":55020,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"MSP","hubs":["MSP"],"focus":[]},
  "TB":{"code":"TB","name":"TUIfly Belgium","alliance":"None","category":"Medium","routes":94,"avgMiles":1321,"totalDailyEarn":57240,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"BRU","hubs":["BRU"],"focus":[]},
  "TG":{"code":"TG","name":"Thai Airways International","alliance":"Star Alliance","category":"Large","routes":65,"avgMiles":2224,"totalDailyEarn":176570,"acquisitionCost":30000000,"startingBudget":150000,"primaryHub":"BKK","hubs":["BKK"],"focus":["CNX"]},
  "TK":{"code":"TK","name":"Turkish Airlines","alliance":"Star Alliance","category":"Large","routes":288,"avgMiles":2019,"totalDailyEarn":807980,"acquisitionCost":150000000,"startingBudget":150000,"primaryHub":"IST","hubs":["IST"],"focus":["ESB"]},
  "TO":{"code":"TO","name":"Transavia France","alliance":"None","category":"Large","routes":230,"avgMiles":1098,"totalDailyEarn":213000,"acquisitionCost":40000000,"startingBudget":150000,"primaryHub":"ORY","hubs":["ORY"],"focus":["LYS","NTE"]},
  "TP":{"code":"TP","name":"TAP Air Portugal","alliance":"Star Alliance","category":"Large","routes":106,"avgMiles":2068,"totalDailyEarn":218690,"acquisitionCost":40000000,"startingBudget":150000,"primaryHub":"LIS","hubs":["LIS"],"focus":["OPO"]},
  "TR":{"code":"TR","name":"Scoot","alliance":"None","category":"Medium","routes":84,"avgMiles":1569,"totalDailyEarn":124860,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"SIN","hubs":["SIN"],"focus":[]},
  "TS":{"code":"TS","name":"Air Transat","alliance":"None","category":"Large","routes":104,"avgMiles":2772,"totalDailyEarn":91120,"acquisitionCost":15000000,"startingBudget":150000,"primaryHub":"YUL","hubs":["YUL","YYZ"],"focus":["YVR"]},
  "TV":{"code":"TV","name":"Tibet Airlines","alliance":"None","category":"Medium","routes":113,"avgMiles":765,"totalDailyEarn":89940,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"LXA","hubs":["LXA"],"focus":["CTU"]},
  "TW":{"code":"TW","name":"T'way Air","alliance":"None","category":"Medium","routes":62,"avgMiles":1666,"totalDailyEarn":71830,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"ICN","hubs":["ICN"],"focus":["GMP","CJU"]},
  "TX":{"code":"TX","name":"Air Caraibes","alliance":"None","category":"Medium","routes":12,"avgMiles":3355,"totalDailyEarn":18440,"acquisitionCost":3500000,"startingBudget":75000,"primaryHub":"PTP","hubs":["PTP","FDF"],"focus":[]},
  "U2":{"code":"U2","name":"EasyJet","alliance":"None","category":"Large","routes":1172,"avgMiles":1023,"totalDailyEarn":907730,"acquisitionCost":150000000,"startingBudget":150000,"primaryHub":"LGW","hubs":[],"focus":["LGW","LTN","AMS","GVA","CDG","MXP"]},
  "UA":{"code":"UA","name":"United Airlines","alliance":"Star Alliance","category":"Large","routes":1060,"avgMiles":1546,"totalDailyEarn":2629420,"acquisitionCost":450000000,"startingBudget":150000,"primaryHub":"ORD","hubs":["ORD","EWR","IAH","DEN","SFO","IAD","LAX","GUM"],"focus":[]},
  "UI":{"code":"UI","name":"Auric Air","alliance":"None","category":"Small","routes":19,"avgMiles":198,"totalDailyEarn":11200,"acquisitionCost":2000000,"startingBudget":30000,"primaryHub":"MWZ","hubs":["MWZ"],"focus":["DAR"]},
  "UL":{"code":"UL","name":"SriLankan Airlines","alliance":"oneworld","category":"Medium","routes":35,"avgMiles":2117,"totalDailyEarn":53820,"acquisitionCost":9500000,"startingBudget":75000,"primaryHub":"CMB","hubs":["CMB"],"focus":[]},
  "UO":{"code":"UO","name":"HK Express","alliance":"None","category":"Medium","routes":35,"avgMiles":1080,"totalDailyEarn":73900,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"HKG","hubs":["HKG"],"focus":[]},
  "UX":{"code":"UX","name":"Air Europa","alliance":"SkyTeam","category":"Large","routes":67,"avgMiles":2162,"totalDailyEarn":110520,"acquisitionCost":20000000,"startingBudget":150000,"primaryHub":"MAD","hubs":["MAD"],"focus":["PMI"]},
  "V7":{"code":"V7","name":"Volotea","alliance":"None","category":"Medium","routes":390,"avgMiles":651,"totalDailyEarn":200290,"acquisitionCost":35000000,"startingBudget":75000,"primaryHub":"BCN","hubs":[],"focus":["BCN","MRS","VCE","BOD","PMI"]},
  "VA":{"code":"VA","name":"Virgin Australia","alliance":"None","category":"Large","routes":79,"avgMiles":1425,"totalDailyEarn":202300,"acquisitionCost":35000000,"startingBudget":150000,"primaryHub":"BNE","hubs":["BNE"],"focus":["MEL","SYD","PER"]},
  "VF":{"code":"VF","name":"AJet","alliance":"None","category":"Medium","routes":192,"avgMiles":832,"totalDailyEarn":196660,"acquisitionCost":35000000,"startingBudget":75000,"primaryHub":"SAW","hubs":["SAW"],"focus":["AYT","ADB"]},
  "VJ":{"code":"VJ","name":"VietJet Air","alliance":"None","category":"Large","routes":104,"avgMiles":1236,"totalDailyEarn":185210,"acquisitionCost":35000000,"startingBudget":150000,"primaryHub":"SGN","hubs":["SGN"],"focus":["HAN"]},
  "VN":{"code":"VN","name":"Vietnam Airlines","alliance":"SkyTeam","category":"Large","routes":117,"avgMiles":1669,"totalDailyEarn":184770,"acquisitionCost":35000000,"startingBudget":150000,"primaryHub":"HAN","hubs":["HAN","SGN"],"focus":["DAD"]},
  "VS":{"code":"VS","name":"Virgin Atlantic","alliance":"SkyTeam","category":"Medium","routes":35,"avgMiles":4210,"totalDailyEarn":114010,"acquisitionCost":20000000,"startingBudget":75000,"primaryHub":"LHR","hubs":["LHR"],"focus":["MAN","LGW"]},
  "VY":{"code":"VY","name":"Vueling","alliance":"None","category":"Medium","routes":229,"avgMiles":733,"totalDailyEarn":264700,"acquisitionCost":50000000,"startingBudget":75000,"primaryHub":"BCN","hubs":["BCN"],"focus":["MAD","FCO"]},
  "W4":{"code":"W4","name":"Wizz Air Malta","alliance":"None","category":"Large","routes":399,"avgMiles":906,"totalDailyEarn":286990,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"MLA","hubs":[],"focus":["MLA"]},
  "W6":{"code":"W6","name":"Wizz Air","alliance":"None","category":"Large","routes":476,"avgMiles":934,"totalDailyEarn":310740,"acquisitionCost":55000000,"startingBudget":150000,"primaryHub":"BUD","hubs":[],"focus":["BUD","LTN","KTW","WAW","WMI"]},
  "W9":{"code":"W9","name":"Wizz Air UK","alliance":"None","category":"Medium","routes":65,"avgMiles":1266,"totalDailyEarn":60260,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"LTN","hubs":[],"focus":["LTN","STN"]},
  "WF":{"code":"WF","name":"Wideroe","alliance":"None","category":"Small","routes":101,"avgMiles":225,"totalDailyEarn":63640,"acquisitionCost":10000000,"startingBudget":30000,"primaryHub":"BGO","hubs":["BGO"],"focus":["OSL","TRD"]},
  "WK":{"code":"WK","name":"Edelweiss Air","alliance":"None","category":"Medium","routes":92,"avgMiles":2149,"totalDailyEarn":63560,"acquisitionCost":10000000,"startingBudget":75000,"primaryHub":"ZRH","hubs":["ZRH"],"focus":[]},
  "WN":{"code":"WN","name":"Southwest Airlines","alliance":"None","category":"Large","routes":929,"avgMiles":974,"totalDailyEarn":1529660,"acquisitionCost":300000000,"startingBudget":150000,"primaryHub":"DAL","hubs":["DAL","MDW","DEN","LAS","BWI","PHX"],"focus":[]},
  "WS":{"code":"WS","name":"WestJet","alliance":"None","category":"Large","routes":295,"avgMiles":1738,"totalDailyEarn":341230,"acquisitionCost":60000000,"startingBudget":150000,"primaryHub":"YYC","hubs":["YYC"],"focus":["YYZ","YVR","YEG"]},
  "WY":{"code":"WY","name":"Oman Air","alliance":"oneworld","category":"Medium","routes":48,"avgMiles":1881,"totalDailyEarn":79480,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"MCT","hubs":["MCT"],"focus":[]},
  "X3":{"code":"X3","name":"TUIfly","alliance":"None","category":"Medium","routes":111,"avgMiles":1574,"totalDailyEarn":69460,"acquisitionCost":15000000,"startingBudget":75000,"primaryHub":"DUS","hubs":["DUS"],"focus":["BER","HAM"]},
  "XJ":{"code":"XJ","name":"Thai AirAsia X","alliance":"None","category":"Medium","routes":10,"avgMiles":2619,"totalDailyEarn":18560,"acquisitionCost":3500000,"startingBudget":75000,"primaryHub":"BKK","hubs":["BKK"],"focus":[]},
  "XY":{"code":"XY","name":"Flynas","alliance":"None","category":"Medium","routes":140,"avgMiles":1139,"totalDailyEarn":133810,"acquisitionCost":25000000,"startingBudget":75000,"primaryHub":"RUH","hubs":["RUH"],"focus":["JED"]},
  "XZ":{"code":"XZ","name":"Aeroitalia","alliance":"None","category":"Small","routes":33,"avgMiles":406,"totalDailyEarn":28830,"acquisitionCost":5000000,"startingBudget":30000,"primaryHub":"FCO","hubs":[],"focus":["FCO","BGY","BRI"]},
  "Y4":{"code":"Y4","name":"Volaris","alliance":"None","category":"Large","routes":237,"avgMiles":951,"totalDailyEarn":270380,"acquisitionCost":50000000,"startingBudget":150000,"primaryHub":"MEX","hubs":["MEX"],"focus":["GDL","TIJ"]},
  "YB":{"code":"YB","name":"Harbour Air","alliance":"None","category":"Small","routes":16,"avgMiles":64,"totalDailyEarn":8650,"acquisitionCost":1500000,"startingBudget":30000,"primaryHub":"YWH","hubs":["YWH"],"focus":["YVR"]},
  "Z2":{"code":"Z2","name":"Philippines AirAsia","alliance":"None","category":"Small","routes":26,"avgMiles":644,"totalDailyEarn":32030,"acquisitionCost":6000000,"startingBudget":30000,"primaryHub":"MNL","hubs":["MNL"],"focus":["CEB"]},
  "ZH":{"code":"ZH","name":"Shenzhen Airlines","alliance":"Star Alliance","category":"Large","routes":234,"avgMiles":878,"totalDailyEarn":369350,"acquisitionCost":65000000,"startingBudget":150000,"primaryHub":"SZX","hubs":["SZX"],"focus":["WUH"]},
  "ZL":{"code":"ZL","name":"Regional Express","alliance":"None","category":"Small","routes":63,"avgMiles":221,"totalDailyEarn":38720,"acquisitionCost":7000000,"startingBudget":30000,"primaryHub":"SYD","hubs":["SYD"],"focus":["ADL","MEL"]}
};

// ── Helper Functions ─────────────────────────────────────────

/** Look up an airline by IATA code. Returns null if not found. */
function getAirline(code) {
  return AIRLINES[code] || null;
}

/** Get starting budget for a player choosing this airline */
function getStartingBudget(code) {
  const a = AIRLINES[code];
  return a ? a.startingBudget : 30000;
}

/** Get all airports in an airline's network (hubs + focus cities) */
function getAirlineAirports(code) {
  const a = AIRLINES[code];
  if (!a) return [];
  return [...new Set([...a.hubs, ...a.focus, a.primaryHub].filter(Boolean))];
}

/** Get airlines filtered by category */
function getByCategory(cat) {
  return Object.values(AIRLINES).filter(a => a.category === cat);
}

/** Get airlines filtered by alliance */
function getByAlliance(alliance) {
  return Object.values(AIRLINES).filter(a => a.alliance === alliance);
}

/** Get UI color tokens for an alliance badge */
function getAllianceColor(alliance) {
  if (alliance === 'Star Alliance')          return { bg:'#E8EEF8', text:'#1A3A6E', dot:'#1A3A6E' };
  if (alliance === 'oneworld')               return { bg:'#F8EAEA', text:'#8B1A1A', dot:'#8B1A1A' };
  if (alliance === 'SkyTeam')                return { bg:'#E8F2FA', text:'#1A5580', dot:'#1A5580' };
  if (alliance && alliance.startsWith('Suspended')) return { bg:'#F5F5F5', text:'#999999', dot:'#CCCCCC' };
  return { bg:'#EDE5D6', text:'#6A6478', dot:'#A89E94' };
}

/** Get acquisition bonus for buying this airline (based on order of acquisition) */
function getAcquisitionBonus(acquisitionNumber) {
  // 1st acquisition: +$3,000/day, 2nd: +$5,000/day, 3rd+: +$7,500/day
  if (acquisitionNumber === 1) return 3000;
  if (acquisitionNumber === 2) return 5000;
  return 7500;
}

// ── Stats ────────────────────────────────────────────────────
const AIRLINE_STATS = {
  total: Object.keys(AIRLINES).length,
  byCategory: {
    Small:  Object.values(AIRLINES).filter(a => a.category === 'Small').length,
    Medium: Object.values(AIRLINES).filter(a => a.category === 'Medium').length,
    Large:  Object.values(AIRLINES).filter(a => a.category === 'Large').length,
  },
  byAlliance: {
    'Star Alliance': Object.values(AIRLINES).filter(a => a.alliance === 'Star Alliance').length,
    'oneworld':      Object.values(AIRLINES).filter(a => a.alliance === 'oneworld').length,
    'SkyTeam':       Object.values(AIRLINES).filter(a => a.alliance === 'SkyTeam').length,
    'Independent':   Object.values(AIRLINES).filter(a => a.alliance === 'None').length,
    'Suspended':     Object.values(AIRLINES).filter(a => a.alliance && a.alliance.startsWith('Suspended')).length,
  }
};

if (typeof module !== 'undefined') {
  module.exports = { AIRLINES, AIRLINE_STATS, getAirline, getStartingBudget,
    getAirlineAirports, getByCategory, getByAlliance, getAllianceColor, getAcquisitionBonus };
}
