import React, { useState, useEffect } from "react";
import { FaCoins, FaArrowRight, FaStar, FaCheck } from "react-icons/fa";

function PokeDetails({
  pokemon,
  onClose,
  coins,
  updateCoins,
  onUpdatePokemon,
}) {
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionResult, setEvolutionResult] = useState(null);
  const [evolutionCompleted, setEvolutionCompleted] = useState(false);
  const [evolutionStage, setEvolutionStage] = useState(0); // 0: starting, 1: transforming, 2: completed
  const [showSparkles, setShowSparkles] = useState(false);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && !isEvolving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose, isEvolving]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const calculateLevel = (exp) => {
    if (!exp) return 1;
    let level = 1;
    let xpForNextLevel = 100;

    while (exp >= xpForNextLevel) {
      level += 1;
      exp -= xpForNextLevel;
      xpForNextLevel = 100 * level;
    }

    return level;
  };

  const evolutionChains = {
    // Original evolutions
    1: { evolvesTo: 2, level: 16, name: "Bulbasaur" },
    2: { evolvesTo: 3, level: 32, name: "Ivysaur" },
    4: { evolvesTo: 5, level: 16, name: "Charmander" },
    5: { evolvesTo: 6, level: 36, name: "Charmeleon" },
    7: { evolvesTo: 8, level: 16, name: "Squirtle" },
    8: { evolvesTo: 9, level: 36, name: "Wartortle" },
    172: { evolvesTo: 25, level: 10, name: "Pichu" },
    25: { evolvesTo: 26, level: 30, name: "Pikachu" },
    133: {
      evolvesTo: [134, 135, 136],
      level: 25,
      name: "Eevee",
      evolutionNames: ["Vaporeon", "Jolteon", "Flareon"],
    },
    23: { evolvesTo: 24, level: 22, name: "Ekans" },
    27: { evolvesTo: 28, level: 22, name: "Sandshrew" },
    29: { evolvesTo: 30, level: 16, name: "Nidoran♀" },
    30: { evolvesTo: 31, level: 36, name: "Nidorina" },
    32: { evolvesTo: 33, level: 16, name: "Nidoran♂" },
    33: { evolvesTo: 34, level: 36, name: "Nidorino" },
    41: { evolvesTo: 42, level: 22, name: "Zubat" },
    43: { evolvesTo: 44, level: 21, name: "Oddish" },
    44: { evolvesTo: 45, level: 36, name: "Gloom" },
    60: { evolvesTo: 61, level: 25, name: "Poliwag" },
    61: { evolvesTo: 62, level: 40, name: "Poliwhirl" },
    74: { evolvesTo: 75, level: 25, name: "Geodude" },
    75: { evolvesTo: 76, level: 40, name: "Graveler" },
    81: { evolvesTo: 82, level: 30, name: "Magnemite" },

    // Additional evolutions - Kanto Region
    92: { evolvesTo: 93, level: 25, name: "Gastly" },
    93: { evolvesTo: 94, level: 40, name: "Haunter" },
    129: { evolvesTo: 130, level: 20, name: "Magikarp" },
    10: { evolvesTo: 11, level: 7, name: "Caterpie" },
    11: { evolvesTo: 12, level: 10, name: "Metapod" },
    13: { evolvesTo: 14, level: 7, name: "Weedle" },
    14: { evolvesTo: 15, level: 10, name: "Kakuna" },
    16: { evolvesTo: 17, level: 18, name: "Pidgey" },
    17: { evolvesTo: 18, level: 36, name: "Pidgeotto" },
    19: { evolvesTo: 20, level: 20, name: "Rattata" },
    21: { evolvesTo: 22, level: 20, name: "Spearow" },
    35: { evolvesTo: 36, level: 25, name: "Clefairy" },
    37: { evolvesTo: 38, level: 25, name: "Vulpix" },
    39: { evolvesTo: 40, level: 25, name: "Jigglypuff" },
    42: { evolvesTo: 169, level: 22, name: "Golbat" },
    46: { evolvesTo: 47, level: 24, name: "Paras" },
    48: { evolvesTo: 49, level: 31, name: "Venonat" },
    50: { evolvesTo: 51, level: 26, name: "Diglett" },
    52: { evolvesTo: 53, level: 28, name: "Meowth" },
    54: { evolvesTo: 55, level: 33, name: "Psyduck" },
    56: { evolvesTo: 57, level: 28, name: "Mankey" },
    58: { evolvesTo: 59, level: 30, name: "Growlithe" },
    63: { evolvesTo: 64, level: 16, name: "Abra" },
    64: { evolvesTo: 65, level: 36, name: "Kadabra" },
    66: { evolvesTo: 67, level: 28, name: "Machop" },
    67: { evolvesTo: 68, level: 40, name: "Machoke" },
    69: { evolvesTo: 70, level: 21, name: "Bellsprout" },
    70: { evolvesTo: 71, level: 34, name: "Weepinbell" },
    72: { evolvesTo: 73, level: 30, name: "Tentacool" },
    77: { evolvesTo: 78, level: 40, name: "Ponyta" },
    79: { evolvesTo: 80, level: 37, name: "Slowpoke" },
    84: { evolvesTo: 85, level: 31, name: "Doduo" },
    86: { evolvesTo: 87, level: 34, name: "Seel" },
    88: { evolvesTo: 89, level: 38, name: "Grimer" },
    90: { evolvesTo: 91, level: 30, name: "Shellder" },
    95: { evolvesTo: 208, level: 40, name: "Onix" },
    96: { evolvesTo: 97, level: 26, name: "Drowzee" },
    98: { evolvesTo: 99, level: 28, name: "Krabby" },
    100: { evolvesTo: 101, level: 30, name: "Voltorb" },
    102: { evolvesTo: 103, level: 35, name: "Exeggcute" },
    104: { evolvesTo: 105, level: 28, name: "Cubone" },
    109: { evolvesTo: 110, level: 35, name: "Koffing" },
    111: { evolvesTo: 112, level: 42, name: "Rhyhorn" },
    116: { evolvesTo: 117, level: 32, name: "Horsea" },
    117: { evolvesTo: 230, level: 45, name: "Seadra" },
    118: { evolvesTo: 119, level: 33, name: "Goldeen" },
    120: { evolvesTo: 121, level: 30, name: "Staryu" },
    147: { evolvesTo: 148, level: 30, name: "Dratini" },
    148: { evolvesTo: 149, level: 55, name: "Dragonair" },

    // Additional evolutions - Johto Region
    152: { evolvesTo: 153, level: 16, name: "Chikorita" },
    153: { evolvesTo: 154, level: 32, name: "Bayleef" },
    155: { evolvesTo: 156, level: 16, name: "Cyndaquil" },
    156: { evolvesTo: 157, level: 36, name: "Quilava" },
    158: { evolvesTo: 159, level: 16, name: "Totodile" },
    159: { evolvesTo: 160, level: 36, name: "Croconaw" },
    161: { evolvesTo: 162, level: 15, name: "Sentret" },
    163: { evolvesTo: 164, level: 20, name: "Hoothoot" },
    165: { evolvesTo: 166, level: 18, name: "Ledyba" },
    167: { evolvesTo: 168, level: 22, name: "Spinarak" },
    170: { evolvesTo: 171, level: 27, name: "Chinchou" },
    175: { evolvesTo: 176, level: 10, name: "Togepi" },
    177: { evolvesTo: 178, level: 25, name: "Natu" },
    179: { evolvesTo: 180, level: 15, name: "Mareep" },
    180: { evolvesTo: 181, level: 30, name: "Flaaffy" },
    183: { evolvesTo: 184, level: 18, name: "Marill" },
    187: { evolvesTo: 188, level: 18, name: "Hoppip" },
    188: { evolvesTo: 189, level: 27, name: "Skiploom" },
    191: { evolvesTo: 192, level: 25, name: "Sunkern" },
    194: { evolvesTo: 195, level: 20, name: "Wooper" },
    204: { evolvesTo: 205, level: 31, name: "Pineco" },
    209: { evolvesTo: 210, level: 23, name: "Snubbull" },
    218: { evolvesTo: 219, level: 38, name: "Slugma" },
    220: { evolvesTo: 221, level: 33, name: "Swinub" },
    223: { evolvesTo: 224, level: 30, name: "Remoraid" },
    228: { evolvesTo: 229, level: 24, name: "Houndour" },
    231: { evolvesTo: 232, level: 25, name: "Phanpy" },

    // Additional evolutions - Hoenn Region
    252: { evolvesTo: 253, level: 16, name: "Treecko" },
    253: { evolvesTo: 254, level: 36, name: "Grovyle" },
    255: { evolvesTo: 256, level: 16, name: "Torchic" },
    256: { evolvesTo: 257, level: 36, name: "Combusken" },
    258: { evolvesTo: 259, level: 16, name: "Mudkip" },
    259: { evolvesTo: 260, level: 36, name: "Marshtomp" },
    261: { evolvesTo: 262, level: 18, name: "Poochyena" },
    263: { evolvesTo: 264, level: 20, name: "Zigzagoon" },
    265: { evolvesTo: [266, 268], level: 7, name: "Wurmple" },
    266: { evolvesTo: 267, level: 10, name: "Silcoon" },
    268: { evolvesTo: 269, level: 10, name: "Cascoon" },
    270: { evolvesTo: 271, level: 14, name: "Lotad" },
    271: { evolvesTo: 272, level: 30, name: "Lombre" },
    273: { evolvesTo: 274, level: 14, name: "Seedot" },
    274: { evolvesTo: 275, level: 30, name: "Nuzleaf" },
    276: { evolvesTo: 277, level: 22, name: "Taillow" },
    278: { evolvesTo: 279, level: 25, name: "Wingull" },
    280: { evolvesTo: 281, level: 20, name: "Ralts" },
    281: { evolvesTo: 282, level: 30, name: "Kirlia" },
    283: { evolvesTo: 284, level: 22, name: "Surskit" },
    285: { evolvesTo: 286, level: 23, name: "Shroomish" },
    287: { evolvesTo: 288, level: 18, name: "Slakoth" },
    288: { evolvesTo: 289, level: 36, name: "Vigoroth" },
    293: { evolvesTo: 294, level: 20, name: "Whismur" },
    294: { evolvesTo: 295, level: 40, name: "Loudred" },
    296: { evolvesTo: 297, level: 24, name: "Makuhita" },
    300: { evolvesTo: 301, level: 22, name: "Skitty" },
    304: { evolvesTo: 305, level: 32, name: "Aron" },
    305: { evolvesTo: 306, level: 42, name: "Lairon" },
    309: { evolvesTo: 310, level: 26, name: "Electrike" },

    // Additional evolutions - Sinnoh Region
    387: { evolvesTo: 388, level: 18, name: "Turtwig" },
    388: { evolvesTo: 389, level: 32, name: "Grotle" },
    390: { evolvesTo: 391, level: 14, name: "Chimchar" },
    391: { evolvesTo: 392, level: 36, name: "Monferno" },
    393: { evolvesTo: 394, level: 16, name: "Piplup" },
    394: { evolvesTo: 395, level: 36, name: "Prinplup" },
    396: { evolvesTo: 397, level: 14, name: "Starly" },
    397: { evolvesTo: 398, level: 34, name: "Staravia" },
    399: { evolvesTo: 400, level: 15, name: "Bidoof" },
    401: { evolvesTo: 402, level: 10, name: "Kricketot" },
    403: { evolvesTo: 404, level: 15, name: "Shinx" },
    404: { evolvesTo: 405, level: 30, name: "Luxio" },
    408: { evolvesTo: 409, level: 30, name: "Cranidos" },
    410: { evolvesTo: 411, level: 30, name: "Shieldon" },
    412: { evolvesTo: [413, 414], level: 20, name: "Burmy" },
    415: { evolvesTo: 416, level: 21, name: "Combee" },
    418: { evolvesTo: 419, level: 26, name: "Buizel" },

    // Additional evolutions - Unova Region
    495: { evolvesTo: 496, level: 17, name: "Snivy" },
    496: { evolvesTo: 497, level: 36, name: "Servine" },
    498: { evolvesTo: 499, level: 17, name: "Tepig" },
    499: { evolvesTo: 500, level: 36, name: "Pignite" },
    501: { evolvesTo: 502, level: 17, name: "Oshawott" },
    502: { evolvesTo: 503, level: 36, name: "Dewott" },
    504: { evolvesTo: 505, level: 20, name: "Patrat" },
    506: { evolvesTo: 507, level: 16, name: "Lillipup" },
    507: { evolvesTo: 508, level: 32, name: "Herdier" },
    509: { evolvesTo: 510, level: 20, name: "Purrloin" },
    511: { evolvesTo: 512, level: 28, name: "Pansage" },
    513: { evolvesTo: 514, level: 28, name: "Pansear" },
    515: { evolvesTo: 516, level: 28, name: "Panpour" },
    517: { evolvesTo: 518, level: 32, name: "Munna" },
    519: { evolvesTo: 520, level: 21, name: "Pidove" },
    520: { evolvesTo: 521, level: 32, name: "Tranquill" },

    // Additional evolutions - Kalos Region
    650: { evolvesTo: 651, level: 16, name: "Chespin" },
    651: { evolvesTo: 652, level: 36, name: "Quilladin" },
    653: { evolvesTo: 654, level: 16, name: "Fennekin" },
    654: { evolvesTo: 655, level: 36, name: "Braixen" },
    656: { evolvesTo: 657, level: 16, name: "Froakie" },
    657: { evolvesTo: 658, level: 36, name: "Frogadier" },
    659: { evolvesTo: 660, level: 20, name: "Bunnelby" },
    661: { evolvesTo: 662, level: 17, name: "Fletchling" },
    662: { evolvesTo: 663, level: 35, name: "Fletchinder" },

    // Additional evolutions - Alola Region
    722: { evolvesTo: 723, level: 17, name: "Rowlet" },
    723: { evolvesTo: 724, level: 34, name: "Dartrix" },
    725: { evolvesTo: 726, level: 17, name: "Litten" },
    726: { evolvesTo: 727, level: 34, name: "Torracat" },
    728: { evolvesTo: 729, level: 17, name: "Popplio" },
    729: { evolvesTo: 730, level: 34, name: "Brionne" },

    // Additional evolutions - Galar Region
    810: { evolvesTo: 811, level: 16, name: "Grookey" },
    811: { evolvesTo: 812, level: 35, name: "Thwackey" },
    813: { evolvesTo: 814, level: 16, name: "Scorbunny" },
    814: { evolvesTo: 815, level: 35, name: "Raboot" },
    816: { evolvesTo: 817, level: 16, name: "Sobble" },
    817: { evolvesTo: 818, level: 35, name: "Drizzile" },
    819: { evolvesTo: 820, level: 24, name: "Skwovet" },
    821: { evolvesTo: 822, level: 18, name: "Rookidee" },
    822: { evolvesTo: 823, level: 38, name: "Corvisquire" },

    // Cross-gen evolutions with unique mechanics
    133: {
      evolvesTo: [134, 135, 136, 196, 197, 470, 471, 700],
      level: 25,
      name: "Eevee",
      evolutionNames: [
        "Vaporeon",
        "Jolteon",
        "Flareon",
        "Espeon",
        "Umbreon",
        "Leafeon",
        "Glaceon",
        "Sylveon",
      ],
    },
    446: { evolvesTo: 143, level: 20, name: "Munchlax" },
    439: { evolvesTo: 122, level: 15, name: "Mime Jr." },
    173: { evolvesTo: 35, level: 10, name: "Cleffa" },
    174: { evolvesTo: 39, level: 10, name: "Igglybuff" },
    440: { evolvesTo: 113, level: 15, name: "Happiny" },
    458: { evolvesTo: 226, level: 25, name: "Mantyke" },
    447: { evolvesTo: 448, level: 32, name: "Riolu" },
    106: { evolvesTo: 107, level: 20, name: "Hitmonlee" },
    107: { evolvesTo: 106, level: 20, name: "Hitmonchan" },
    108: { evolvesTo: 463, level: 30, name: "Lickitung" },
    113: { evolvesTo: 242, level: 30, name: "Chansey" },
    114: { evolvesTo: 465, level: 30, name: "Tangela" },
    123: { evolvesTo: 212, level: 30, name: "Scyther" },
    125: { evolvesTo: 466, level: 30, name: "Electabuzz" },
    126: { evolvesTo: 467, level: 30, name: "Magmar" },
    127: { evolvesTo: 214, level: 30, name: "Pinsir" },
    137: { evolvesTo: 233, level: 30, name: "Porygon" },
    138: { evolvesTo: 139, level: 40, name: "Omanyte" },
    140: { evolvesTo: 141, level: 40, name: "Kabuto" },
    182: { evolvesTo: 45, level: 30, name: "Bellossom" },
    185: { evolvesTo: 477, level: 30, name: "Sudowoodo" },
    190: { evolvesTo: 424, level: 30, name: "Aipom" },
    193: { evolvesTo: 469, level: 30, name: "Yanma" },
    198: { evolvesTo: 430, level: 30, name: "Murkrow" },
    200: { evolvesTo: 429, level: 30, name: "Misdreavus" },
    207: { evolvesTo: 472, level: 30, name: "Gligar" },
    211: { evolvesTo: 462, level: 30, name: "Qwilfish" },
    212: { evolvesTo: 123, level: 30, name: "Scizor" },
    213: { evolvesTo: 213, level: 30, name: "Shuckle" },
    215: { evolvesTo: 461, level: 30, name: "Sneasel" },
    216: { evolvesTo: 217, level: 30, name: "Teddiursa" },
    217: { evolvesTo: 216, level: 30, name: "Ursaring" },
    225: { evolvesTo: 473, level: 30, name: "Delibird" },
    226: { evolvesTo: 226, level: 30, name: "Mantine" },
    227: { evolvesTo: 227, level: 30, name: "Skarmory" },
    233: { evolvesTo: 474, level: 30, name: "Porygon2" },
    234: { evolvesTo: 234, level: 30, name: "Stantler" },
    235: { evolvesTo: 235, level: 30, name: "Smeargle" },
    236: { evolvesTo: [106, 107, 237], level: 20, name: "Tyrogue" },
    237: { evolvesTo: 236, level: 20, name: "Hitmontop" },
    238: { evolvesTo: 124, level: 30, name: "Smoochum" },
    239: { evolvesTo: 125, level: 30, name: "Elekid" },
    240: { evolvesTo: 126, level: 30, name: "Magby" },
    241: { evolvesTo: 241, level: 30, name: "Miltank" },
    242: { evolvesTo: 113, level: 30, name: "Blissey" },
    246: { evolvesTo: 247, level: 30, name: "Larvitar" },
    247: { evolvesTo: 248, level: 55, name: "Pupitar" },
    248: { evolvesTo: 247, level: 30, name: "Tyranitar" },
    290: { evolvesTo: 291, level: 20, name: "Nincada" },
    291: { evolvesTo: 292, level: 20, name: "Ninjask" },
    292: { evolvesTo: 291, level: 20, name: "Shedinja" },
    298: { evolvesTo: 183, level: 15, name: "Azurill" },
    299: { evolvesTo: 476, level: 30, name: "Nosepass" },
    302: { evolvesTo: 302, level: 30, name: "Sableye" },
    303: { evolvesTo: 303, level: 30, name: "Mawile" },
    307: { evolvesTo: 308, level: 37, name: "Meditite" },
    308: { evolvesTo: 307, level: 30, name: "Medicham" },
    311: { evolvesTo: 312, level: 26, name: "Plusle" },
    312: { evolvesTo: 311, level: 26, name: "Minun" },
    313: { evolvesTo: 313, level: 30, name: "Volbeat" },
    314: { evolvesTo: 314, level: 30, name: "Illumise" },
    315: { evolvesTo: 407, level: 30, name: "Roselia" },
    316: { evolvesTo: 317, level: 26, name: "Gulpin" },
    317: { evolvesTo: 316, level: 30, name: "Swalot" },
    318: { evolvesTo: 319, level: 30, name: "Carvanha" },
    319: { evolvesTo: 318, level: 30, name: "Sharpedo" },
    320: { evolvesTo: 321, level: 40, name: "Wailmer" },
    321: { evolvesTo: 320, level: 30, name: "Wailord" },
    322: { evolvesTo: 323, level: 33, name: "Numel" },
    323: { evolvesTo: 322, level: 30, name: "Camerupt" },
    324: { evolvesTo: 324, level: 30, name: "Torkoal" },
    325: { evolvesTo: 326, level: 32, name: "Spoink" },
    326: { evolvesTo: 325, level: 30, name: "Grumpig" },
    327: { evolvesTo: 327, level: 30, name: "Spinda" },
    328: { evolvesTo: 329, level: 35, name: "Trapinch" },
    329: { evolvesTo: 330, level: 45, name: "Vibrava" },
    330: { evolvesTo: 329, level: 30, name: "Flygon" },
    331: { evolvesTo: 332, level: 32, name: "Cacnea" },
    332: { evolvesTo: 331, level: 30, name: "Cacturne" },
    333: { evolvesTo: 334, level: 35, name: "Swablu" },
    334: { evolvesTo: 333, level: 30, name: "Altaria" },
    335: { evolvesTo: 335, level: 30, name: "Zangoose" },
    336: { evolvesTo: 336, level: 30, name: "Seviper" },
    337: { evolvesTo: 337, level: 30, name: "Lunatone" },
    338: { evolvesTo: 338, level: 30, name: "Solrock" },
    339: { evolvesTo: 340, level: 30, name: "Barboach" },
    340: { evolvesTo: 339, level: 30, name: "Whiscash" },
    341: { evolvesTo: 342, level: 30, name: "Corphish" },
    342: { evolvesTo: 341, level: 30, name: "Crawdaunt" },
    343: { evolvesTo: 344, level: 36, name: "Baltoy" },
    344: { evolvesTo: 343, level: 30, name: "Claydol" },
    345: { evolvesTo: 346, level: 40, name: "Lileep" },
    346: { evolvesTo: 345, level: 30, name: "Cradily" },
    347: { evolvesTo: 348, level: 40, name: "Anorith" },
    348: { evolvesTo: 347, level: 30, name: "Armaldo" },
    349: { evolvesTo: 350, level: 40, name: "Feebas" },
    350: { evolvesTo: 349, level: 30, name: "Milotic" },
    351: { evolvesTo: 351, level: 30, name: "Castform" },
    352: { evolvesTo: 352, level: 30, name: "Kecleon" },
    353: { evolvesTo: 354, level: 37, name: "Shuppet" },
    354: { evolvesTo: 353, level: 30, name: "Banette" },
    355: { evolvesTo: 356, level: 37, name: "Duskull" },
    356: { evolvesTo: 477, level: 42, name: "Dusclops" },
    357: { evolvesTo: 357, level: 30, name: "Tropius" },
    358: { evolvesTo: 358, level: 30, name: "Chimecho" },
    359: { evolvesTo: 359, level: 30, name: "Absol" },
    360: { evolvesTo: 202, level: 15, name: "Wynaut" },
    361: { evolvesTo: 362, level: 42, name: "Snorunt" },
    362: { evolvesTo: 361, level: 30, name: "Glalie" },
    363: { evolvesTo: 364, level: 32, name: "Spheal" },
    364: { evolvesTo: 365, level: 44, name: "Sealeo" },
    365: { evolvesTo: 364, level: 30, name: "Walrein" },
    366: { evolvesTo: 367, level: 30, name: "Clamperl" },
    367: { evolvesTo: 366, level: 30, name: "Huntail" },
    368: { evolvesTo: 366, level: 30, name: "Gorebyss" },
    369: { evolvesTo: 369, level: 30, name: "Relicanth" },
    370: { evolvesTo: 370, level: 30, name: "Luvdisc" },
    371: { evolvesTo: 372, level: 30, name: "Bagon" },
    372: { evolvesTo: 373, level: 50, name: "Shelgon" },
    373: { evolvesTo: 372, level: 30, name: "Salamence" },
    374: { evolvesTo: 375, level: 20, name: "Beldum" },
    375: { evolvesTo: 376, level: 45, name: "Metang" },
    376: { evolvesTo: 375, level: 30, name: "Metagross" },
    406: { evolvesTo: 315, level: 18, name: "Budew" },
    407: { evolvesTo: 315, level: 30, name: "Roserade" },
    420: { evolvesTo: 421, level: 25, name: "Cherubi" },
    421: { evolvesTo: 420, level: 30, name: "Cherrim" },
    422: { evolvesTo: 423, level: 30, name: "Shellos" },
    423: { evolvesTo: 422, level: 30, name: "Gastrodon" },
    425: { evolvesTo: 426, level: 28, name: "Drifloon" },
    426: { evolvesTo: 425, level: 30, name: "Drifblim" },
    427: { evolvesTo: 428, level: 30, name: "Buneary" },
    428: { evolvesTo: 427, level: 30, name: "Lopunny" },
    429: { evolvesTo: 200, level: 30, name: "Mismagius" },
    430: { evolvesTo: 198, level: 30, name: "Honchkrow" },
    431: { evolvesTo: 432, level: 38, name: "Glameow" },
    432: { evolvesTo: 431, level: 30, name: "Purugly" },
    433: { evolvesTo: 358, level: 25, name: "Chingling" },
    434: { evolvesTo: 435, level: 34, name: "Stunky" },
    435: { evolvesTo: 434, level: 30, name: "Skuntank" },
    436: { evolvesTo: 437, level: 33, name: "Bronzor" },
    437: { evolvesTo: 436, level: 30, name: "Bronzong" },
    438: { evolvesTo: 185, level: 25, name: "Bonsly" },
    439: { evolvesTo: 122, level: 25, name: "Mime Jr." },
    440: { evolvesTo: 113, level: 25, name: "Happiny" },
    442: { evolvesTo: 442, level: 30, name: "Spiritomb" },
    443: { evolvesTo: 444, level: 24, name: "Gible" },
    444: { evolvesTo: 445, level: 48, name: "Gabite" },
    445: { evolvesTo: 444, level: 30, name: "Garchomp" },
    446: { evolvesTo: 143, level: 25, name: "Munchlax" },
    447: { evolvesTo: 448, level: 30, name: "Riolu" },
    448: { evolvesTo: 447, level: 30, name: "Lucario" },
    449: { evolvesTo: 450, level: 34, name: "Hippopotas" },
    450: { evolvesTo: 449, level: 30, name: "Hippowdon" },
    451: { evolvesTo: 452, level: 40, name: "Skorupi" },
    452: { evolvesTo: 451, level: 30, name: "Drapion" },
    453: { evolvesTo: 454, level: 37, name: "Croagunk" },
    454: { evolvesTo: 453, level: 30, name: "Toxicroak" },
    456: { evolvesTo: 457, level: 31, name: "Finneon" },
    457: { evolvesTo: 456, level: 30, name: "Lumineon" },
    458: { evolvesTo: 226, level: 25, name: "Mantyke" },
    459: { evolvesTo: 460, level: 40, name: "Snover" },
    460: { evolvesTo: 459, level: 30, name: "Abomasnow" },
    461: { evolvesTo: 215, level: 30, name: "Weavile" },
    462: { evolvesTo: 211, level: 30, name: "Magnezone" },
    463: { evolvesTo: 108, level: 30, name: "Lickilicky" },
    464: { evolvesTo: 112, level: 30, name: "Rhyperior" },
    465: { evolvesTo: 114, level: 30, name: "Tangrowth" },
    466: { evolvesTo: 125, level: 30, name: "Electivire" },
    467: { evolvesTo: 126, level: 30, name: "Magmortar" },
    468: { evolvesTo: 176, level: 30, name: "Togekiss" },
    469: { evolvesTo: 193, level: 30, name: "Yanmega" },
    470: { evolvesTo: 133, level: 30, name: "Leafeon" },
    471: { evolvesTo: 133, level: 30, name: "Glaceon" },
    472: { evolvesTo: 207, level: 30, name: "Gliscor" },
    473: { evolvesTo: 473, level: 30, name: "Mamoswine" },
    474: { evolvesTo: 233, level: 30, name: "Porygon-Z" },
    475: { evolvesTo: 282, level: 30, name: "Gallade" },
    476: { evolvesTo: 299, level: 30, name: "Probopass" },
    477: { evolvesTo: 356, level: 30, name: "Dusknoir" },
    478: { evolvesTo: 478, level: 30, name: "Froslass" },
    522: { evolvesTo: 523, level: 27, name: "Blitzle" },
    523: { evolvesTo: 522, level: 30, name: "Zebstrika" },
    524: { evolvesTo: 525, level: 25, name: "Roggenrola" },
    525: { evolvesTo: 526, level: 40, name: "Boldore" },
    526: { evolvesTo: 525, level: 30, name: "Gigalith" },
    527: { evolvesTo: 528, level: 32, name: "Woobat" },
    528: { evolvesTo: 527, level: 30, name: "Swoobat" },
    529: { evolvesTo: 530, level: 31, name: "Drilbur" },
    530: { evolvesTo: 529, level: 30, name: "Excadrill" },
    532: { evolvesTo: 533, level: 25, name: "Timburr" },
    533: { evolvesTo: 534, level: 40, name: "Gurdurr" },
    534: { evolvesTo: 533, level: 30, name: "Conkeldurr" },
    535: { evolvesTo: 536, level: 25, name: "Tympole" },
    536: { evolvesTo: 537, level: 36, name: "Palpitoad" },
    537: { evolvesTo: 536, level: 30, name: "Seismitoad" },
    540: { evolvesTo: 541, level: 20, name: "Sewaddle" },
    541: { evolvesTo: 542, level: 30, name: "Swadloon" },
    542: { evolvesTo: 541, level: 30, name: "Leavanny" },
    543: { evolvesTo: 544, level: 22, name: "Venipede" },
    544: { evolvesTo: 545, level: 30, name: "Whirlipede" },
    545: { evolvesTo: 544, level: 30, name: "Scolipede" },
    551: { evolvesTo: 552, level: 29, name: "Sandile" },
    552: { evolvesTo: 553, level: 40, name: "Krokorok" },
    553: { evolvesTo: 552, level: 30, name: "Krookodile" },
    554: { evolvesTo: 555, level: 35, name: "Darumaka" },
    555: { evolvesTo: 554, level: 30, name: "Darmanitan" },
    562: { evolvesTo: 563, level: 34, name: "Yamask" },
    563: { evolvesTo: 562, level: 30, name: "Cofagrigus" },
    574: { evolvesTo: 575, level: 32, name: "Gothita" },
    575: { evolvesTo: 576, level: 41, name: "Gothorita" },
    576: { evolvesTo: 575, level: 30, name: "Gothitelle" },
    577: { evolvesTo: 578, level: 32, name: "Solosis" },
    578: { evolvesTo: 579, level: 41, name: "Duosion" },
    579: { evolvesTo: 578, level: 30, name: "Reuniclus" },
    605: { evolvesTo: 606, level: 42, name: "Elgyem" },
    606: { evolvesTo: 605, level: 30, name: "Beheeyem" },
    607: { evolvesTo: 608, level: 41, name: "Litwick" },
    608: { evolvesTo: 609, level: 55, name: "Lampent" },
    609: { evolvesTo: 608, level: 30, name: "Chandelure" },
    610: { evolvesTo: 611, level: 38, name: "Axew" },
    611: { evolvesTo: 612, level: 48, name: "Fraxure" },
    612: { evolvesTo: 611, level: 30, name: "Haxorus" },
    619: { evolvesTo: 620, level: 30, name: "Mienfoo" },
    620: { evolvesTo: 619, level: 30, name: "Mienshao" },
    624: { evolvesTo: 625, level: 40, name: "Pawniard" },
    625: { evolvesTo: 624, level: 30, name: "Bisharp" },
    633: { evolvesTo: 634, level: 50, name: "Deino" },
    634: { evolvesTo: 635, level: 64, name: "Zweilous" },
    635: { evolvesTo: 634, level: 30, name: "Hydreigon" },
    636: { evolvesTo: 637, level: 59, name: "Larvesta" },
    637: { evolvesTo: 636, level: 30, name: "Volcarona" },
    664: { evolvesTo: 665, level: 9, name: "Scatterbug" },
    665: { evolvesTo: 666, level: 12, name: "Spewpa" },
    666: { evolvesTo: 665, level: 30, name: "Vivillon" },
    667: { evolvesTo: 668, level: 35, name: "Litleo" },
    668: { evolvesTo: 667, level: 30, name: "Pyroar" },
    669: { evolvesTo: 670, level: 19, name: "Flabébé" },
    670: { evolvesTo: 671, level: 35, name: "Floette" },
    671: { evolvesTo: 670, level: 30, name: "Florges" },
    672: { evolvesTo: 673, level: 32, name: "Skiddo" },
    673: { evolvesTo: 672, level: 30, name: "Gogoat" },
    679: { evolvesTo: 680, level: 35, name: "Honedge" },
    680: { evolvesTo: 681, level: 45, name: "Doublade" },
    681: { evolvesTo: 680, level: 30, name: "Aegislash" },
    684: { evolvesTo: 685, level: 35, name: "Swirlix" },
    685: { evolvesTo: 684, level: 30, name: "Slurpuff" },
    686: { evolvesTo: 687, level: 35, name: "Inkay" },
    687: { evolvesTo: 686, level: 30, name: "Malamar" },
    690: { evolvesTo: 691, level: 37, name: "Skrelp" },
    691: { evolvesTo: 690, level: 30, name: "Dragalge" },
    692: { evolvesTo: 693, level: 37, name: "Clauncher" },
    693: { evolvesTo: 692, level: 30, name: "Clawitzer" },
    696: { evolvesTo: 697, level: 39, name: "Tyrunt" },
    697: { evolvesTo: 696, level: 30, name: "Tyrantrum" },
    698: { evolvesTo: 699, level: 39, name: "Amaura" },
    699: { evolvesTo: 698, level: 30, name: "Aurorus" },
    700: { evolvesTo: 133, level: 30, name: "Sylveon" },
    704: { evolvesTo: 705, level: 40, name: "Goomy" },
    705: { evolvesTo: 706, level: 50, name: "Sliggoo" },
    706: { evolvesTo: 705, level: 30, name: "Goodra" },
    708: { evolvesTo: 709, level: 38, name: "Phantump" },
    709: { evolvesTo: 708, level: 30, name: "Trevenant" },
    710: { evolvesTo: 711, level: 42, name: "Pumpkaboo" },
    711: { evolvesTo: 710, level: 30, name: "Gourgeist" },
    712: { evolvesTo: 713, level: 37, name: "Bergmite" },
    713: { evolvesTo: 712, level: 30, name: "Avalugg" },
    714: { evolvesTo: 715, level: 48, name: "Noibat" },
    715: { evolvesTo: 714, level: 30, name: "Noivern" },
    731: { evolvesTo: 732, level: 17, name: "Pikipek" },
    732: { evolvesTo: 733, level: 28, name: "Trumbeak" },
    733: { evolvesTo: 732, level: 30, name: "Toucannon" },
    734: { evolvesTo: 735, level: 20, name: "Yungoos" },
    735: { evolvesTo: 734, level: 30, name: "Gumshoos" },
    736: { evolvesTo: 737, level: 20, name: "Grubbin" },
    737: { evolvesTo: 738, level: 30, name: "Charjabug" },
    738: { evolvesTo: 737, level: 30, name: "Vikavolt" },
    739: { evolvesTo: 740, level: 27, name: "Crabrawler" },
    740: { evolvesTo: 739, level: 30, name: "Crabominable" },
    742: { evolvesTo: 743, level: 25, name: "Cutiefly" },
    743: { evolvesTo: 742, level: 30, name: "Ribombee" },
    744: { evolvesTo: 745, level: 25, name: "Rockruff" },
    745: { evolvesTo: 744, level: 30, name: "Lycanroc" },
    747: { evolvesTo: 748, level: 38, name: "Mareanie" },
    748: { evolvesTo: 747, level: 30, name: "Toxapex" },
    749: { evolvesTo: 750, level: 30, name: "Mudbray" },
    750: { evolvesTo: 749, level: 30, name: "Mudsdale" },
    751: { evolvesTo: 752, level: 22, name: "Dewpider" },
    752: { evolvesTo: 751, level: 30, name: "Araquanid" },
    753: { evolvesTo: 754, level: 34, name: "Fomantis" },
    754: { evolvesTo: 753, level: 30, name: "Lurantis" },
    755: { evolvesTo: 756, level: 24, name: "Morelull" },
    756: { evolvesTo: 755, level: 30, name: "Shiinotic" },
    757: { evolvesTo: 758, level: 33, name: "Salandit" },
    758: { evolvesTo: 757, level: 30, name: "Salazzle" },
    759: { evolvesTo: 760, level: 27, name: "Stufful" },
    760: { evolvesTo: 759, level: 30, name: "Bewear" },
    761: { evolvesTo: 762, level: 18, name: "Bounsweet" },
    762: { evolvesTo: 763, level: 29, name: "Steenee" },
    763: { evolvesTo: 762, level: 30, name: "Tsareena" },
    767: { evolvesTo: 768, level: 30, name: "Wimpod" },
    768: { evolvesTo: 767, level: 30, name: "Golisopod" },
    769: { evolvesTo: 770, level: 42, name: "Sandygast" },
    770: { evolvesTo: 769, level: 30, name: "Palossand" },
    772: { evolvesTo: 773, level: 40, name: "Type: Null" },
    773: { evolvesTo: 772, level: 30, name: "Silvally" },
    782: { evolvesTo: 783, level: 35, name: "Jangmo-o" },
    783: { evolvesTo: 784, level: 45, name: "Hakamo-o" },
    784: { evolvesTo: 783, level: 30, name: "Kommo-o" },
    824: { evolvesTo: 825, level: 10, name: "Blipbug" },
    825: { evolvesTo: 826, level: 30, name: "Dottler" },
    826: { evolvesTo: 825, level: 30, name: "Orbeetle" },
    827: { evolvesTo: 828, level: 18, name: "Nickit" },
    828: { evolvesTo: 827, level: 30, name: "Thievul" },
    829: { evolvesTo: 830, level: 22, name: "Gossifleur" },
    830: { evolvesTo: 829, level: 30, name: "Eldegoss" },
    831: { evolvesTo: 832, level: 24, name: "Wooloo" },
    832: { evolvesTo: 831, level: 30, name: "Dubwool" },
    833: { evolvesTo: 834, level: 36, name: "Chewtle" },
    834: { evolvesTo: 833, level: 30, name: "Drednaw" },
    835: { evolvesTo: 836, level: 25, name: "Yamper" },
    836: { evolvesTo: 835, level: 30, name: "Boltund" },
    837: { evolvesTo: 838, level: 18, name: "Rolycoly" },
    838: { evolvesTo: 839, level: 34, name: "Carkol" },
    839: { evolvesTo: 838, level: 30, name: "Coalossal" },
    840: { evolvesTo: 841, level: 28, name: "Applin" },
    841: { evolvesTo: 840, level: 30, name: "Flapple" },
    842: { evolvesTo: 840, level: 30, name: "Appletun" },
    843: { evolvesTo: 844, level: 36, name: "Silicobra" },
    844: { evolvesTo: 843, level: 30, name: "Sandaconda" },
    845: { evolvesTo: 845, level: 30, name: "Cramorant" },
    846: { evolvesTo: 847, level: 26, name: "Arrokuda" },
    847: { evolvesTo: 846, level: 30, name: "Barraskewda" },
    848: { evolvesTo: 849, level: 30, name: "Toxel" },
    849: { evolvesTo: 848, level: 30, name: "Toxtricity" },
    850: { evolvesTo: 851, level: 30, name: "Sizzlipede" },
    851: { evolvesTo: 850, level: 30, name: "Centiskorch" },
    852: { evolvesTo: 853, level: 30, name: "Clobbopus" },
    853: { evolvesTo: 852, level: 30, name: "Grapploct" },
    854: { evolvesTo: 855, level: 30, name: "Sinistea" },
    855: { evolvesTo: 854, level: 30, name: "Polteageist" },
    856: { evolvesTo: 857, level: 32, name: "Hatenna" },
    857: { evolvesTo: 858, level: 42, name: "Hattrem" },
    858: { evolvesTo: 857, level: 30, name: "Hatterene" },
    859: { evolvesTo: 860, level: 32, name: "Impidimp" },
    860: { evolvesTo: 861, level: 42, name: "Morgrem" },
    861: { evolvesTo: 860, level: 30, name: "Grimmsnarl" },
    868: { evolvesTo: 869, level: 30, name: "Milcery" },
    869: { evolvesTo: 868, level: 30, name: "Alcremie" },
    870: { evolvesTo: 870, level: 30, name: "Falinks" },
    871: { evolvesTo: 871, level: 30, name: "Pincurchin" },
    872: { evolvesTo: 872, level: 30, name: "Snom" },
    873: { evolvesTo: 872, level: 30, name: "Frosmoth" },
    874: { evolvesTo: 874, level: 30, name: "Stonjourner" },
    875: { evolvesTo: 875, level: 30, name: "Eiscue" },
    878: { evolvesTo: 879, level: 30, name: "Cufant" },
    879: { evolvesTo: 878, level: 30, name: "Copperajah" },
    885: { evolvesTo: 886, level: 50, name: "Dreepy" },
    886: { evolvesTo: 887, level: 60, name: "Drakloak" },
    887: { evolvesTo: 886, level: 30, name: "Dragapult" },
    899: { evolvesTo: 899, level: 30, name: "Wyrdeer" },
    900: { evolvesTo: 900, level: 30, name: "Kleavor" },
    901: { evolvesTo: 901, level: 30, name: "Ursaluna" },
    902: { evolvesTo: 902, level: 30, name: "Basculegion" },
    903: { evolvesTo: 903, level: 30, name: "Sneasler" },
    904: { evolvesTo: 904, level: 30, name: "Overqwil" },
    906: { evolvesTo: 907, level: 16, name: "Sprigatito" },
    907: { evolvesTo: 908, level: 36, name: "Floragato" },
    908: { evolvesTo: 907, level: 30, name: "Meowscarada" },
    909: { evolvesTo: 910, level: 16, name: "Fuecoco" },
    910: { evolvesTo: 911, level: 36, name: "Crocalor" },
    911: { evolvesTo: 910, level: 30, name: "Skeledirge" },
    912: { evolvesTo: 913, level: 16, name: "Quaxly" },
    913: { evolvesTo: 914, level: 36, name: "Quaxwell" },
    914: { evolvesTo: 913, level: 30, name: "Quaquaval" },
    915: { evolvesTo: 916, level: 18, name: "Lechonk" },
    916: { evolvesTo: 915, level: 30, name: "Oinkologne" },
    917: { evolvesTo: 918, level: 15, name: "Tarountula" },
    918: { evolvesTo: 917, level: 30, name: "Spidops" },
    919: { evolvesTo: 920, level: 25, name: "Nymble" },
    920: { evolvesTo: 919, level: 30, name: "Lokix" },
    921: { evolvesTo: 922, level: 18, name: "Pawmi" },
    922: { evolvesTo: 923, level: 32, name: "Pawmo" },
    923: { evolvesTo: 922, level: 30, name: "Pawmot" },
    924: { evolvesTo: 925, level: 24, name: "Tandemaus" },
    925: { evolvesTo: 924, level: 30, name: "Maushold" },
    926: { evolvesTo: 927, level: 30, name: "Fidough" },
    927: { evolvesTo: 926, level: 30, name: "Dachsbun" },
    928: { evolvesTo: 929, level: 35, name: "Smoliv" },
    929: { evolvesTo: 930, level: 45, name: "Dolliv" },
    930: { evolvesTo: 929, level: 30, name: "Arboliva" },
    931: { evolvesTo: 931, level: 30, name: "Squawkabilly" },
    932: { evolvesTo: 933, level: 18, name: "Nacli" },
    933: { evolvesTo: 934, level: 38, name: "Naclstack" },
    934: { evolvesTo: 933, level: 30, name: "Garganacl" },
    935: { evolvesTo: 936, level: 32, name: "Charcadet" },
    936: { evolvesTo: 935, level: 30, name: "Armarouge" },
    937: { evolvesTo: 935, level: 30, name: "Ceruledge" },
  };

  const evolutionData = evolutionChains[pokemon.id];
  const canEvolve =
    evolutionData && calculateLevel(pokemon.exp || 0) >= evolutionData.level;

  const handleEvolveClick = async () => {
    if (!canEvolve) return;

    setIsEvolving(true);
    setEvolutionStage(0);
    setEvolutionCompleted(false);
    console.log(`Starting evolution of ${pokemon.name} (ID: ${pokemon.id})`);

    try {
      setShowSparkles(true);

      setTimeout(() => {
        setEvolutionStage(1);

        let evolutionId = evolutionData.evolvesTo;
        if (Array.isArray(evolutionId)) {
          evolutionId =
            evolutionId[Math.floor(Math.random() * evolutionId.length)];
        }

        console.log(`Evolving to ID: ${evolutionId}`);

        setTimeout(async () => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${evolutionId}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch evolution data: ${response.status}`
            );
          }

          const data = await response.json();
          console.log(`Evolution data fetched for ${data.name}`);

          const moves = pokemon.moves || [];

          const evolvedPokemon = {
            ...pokemon,
            id: data.id,
            originalId: pokemon.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            types: data.types.map((t) => t.type.name),
            stats: data.stats.map((s) => ({
              name: s.stat.name,
              value: s.base_stat,
              upgrades: 0,
            })),
            height: data.height,
            weight: data.weight,
            moves: moves,
            exp: pokemon.exp || 0,
          };

          setEvolutionResult(evolvedPokemon);

          setTimeout(() => {
            setEvolutionStage(2);
            setEvolutionCompleted(true);
            setShowSparkles(false);

            if (typeof onUpdatePokemon === "function") {
              console.log("About to update Pokemon with:", evolvedPokemon);

              onUpdatePokemon(evolvedPokemon);

              const bonusCoins = 100;
              updateCoins(bonusCoins);
            }
          }, 3000);
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error("Evolution failed:", error);
      setIsEvolving(false);
      alert(`Falha na evolução: ${error.message}`);
    }
  };

  const typeColors = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-red-500 to-orange-500",
    water: "from-blue-500 to-blue-600",
    electric: "from-yellow-400 to-yellow-500",
    grass: "from-green-500 to-green-600",
    ice: "from-blue-200 to-blue-300",
    fighting: "from-red-700 to-red-800",
    poison: "from-purple-500 to-purple-600",
    ground: "from-yellow-600 to-yellow-700",
    flying: "from-indigo-400 to-indigo-500",
    psychic: "from-pink-500 to-pink-600",
    bug: "from-lime-500 to-lime-600",
    rock: "from-yellow-800 to-yellow-900",
    ghost: "from-purple-700 to-purple-800",
    dragon: "from-indigo-700 to-indigo-800",
    dark: "from-gray-700 to-gray-800",
    steel: "from-gray-500 to-gray-600",
    fairy: "from-pink-300 to-pink-400",
  };

  const mainType = pokemon.types?.[0] || "normal";

  const MAX_STAT_UPGRADE = 50;
  const UPGRADE_AMOUNT = 5;

  const getUpgradeCost = (statValue, currentUpgrades) => {
    const baseMultiplier = pokemon.isLegendary ? 2 : 1;
    return Math.floor((50 + currentUpgrades * 25) * baseMultiplier);
  };

  const handleUpgrade = (statIndex) => {
    const stat = pokemon.stats[statIndex];
    const currentUpgrades = stat.upgrades || 0;

    if (currentUpgrades >= MAX_STAT_UPGRADE) {
      alert("Limite máximo de melhorias atingido para este status!");
      return;
    }

    const cost = getUpgradeCost(stat.value, currentUpgrades);
    if (coins < cost) {
      alert(`Moedas insuficientes! Necessário: ${cost} moedas`);
      return;
    }

    const updatedStats = [...pokemon.stats];
    updatedStats[statIndex] = {
      ...stat,
      value: stat.value + UPGRADE_AMOUNT,
      upgrades: currentUpgrades + 1,
      originalValue: stat.originalValue || stat.value,
    };

    updateCoins(-cost);
    onUpdatePokemon({
      ...pokemon,
      stats: updatedStats,
    });
  };

  const getXpForNextLevel = (currentLevel) => {
    return 100 * currentLevel;
  };

  const getXpProgress = (totalXp) => {
    if (!totalXp) return 0;

    let remainingXp = totalXp;
    let level = 1;
    let xpForLevel = 100;

    while (remainingXp >= xpForLevel) {
      remainingXp -= xpForLevel;
      level += 1;
      xpForLevel = 100 * level;
    }

    return {
      currentXp: remainingXp,
      requiredXp: xpForLevel,
      percentage: (remainingXp / xpForLevel) * 100,
    };
  };

  const xpProgress = getXpProgress(pokemon.exp || 0);

  const CoinIcon = () => (
    <FaCoins className="h-4 w-4 inline-block align-text-bottom mx-0.5" />
  );

  const handleFinishEvolution = () => {
    setIsEvolving(false);
    onClose();
  };

  const renderSparkles = () => {
    if (!showSparkles) return null;

    const sparkles = [];
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 2;

      sparkles.push(
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
          }}
        >
          <FaStar
            className="text-yellow-300"
            style={{ fontSize: `${size}px` }}
          />
        </div>
      );
    }

    return sparkles;
  };

  // Prevent click propagation on modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {isEvolving ? (
        <div
          className="relative w-[90%] max-w-2xl animate-fade-up z-10"
          onClick={handleModalContentClick}
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-center text-white shadow-xl relative overflow-hidden">
            {renderSparkles()}

            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
              {evolutionStage === 0 && "Preparando Evolução..."}
              {evolutionStage === 1 && "Evoluindo!"}
              {evolutionStage === 2 && "Evolução Completa!"}
            </h2>

            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              {evolutionCompleted
                ? `${pokemon.name} evoluiu para ${evolutionResult?.name}!`
                : `Seu ${pokemon.name} está evoluindo...`}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div
                className={`flex flex-col items-center transition-all duration-1000 ${
                  evolutionStage >= 1 ? "opacity-40 scale-90" : "opacity-100"
                }`}
              >
                <div
                  className={`relative ${
                    evolutionStage === 0 ? "animate-pulse" : ""
                  }`}
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className={`w-24 h-24 sm:w-40 sm:h-40 object-contain ${
                      evolutionStage === 0 ? "animate-float" : ""
                    }`}
                  />
                  {evolutionStage === 0 && (
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                  )}
                </div>
                <p className="mt-1 sm:mt-2 font-semibold capitalize text-xs sm:text-base">
                  {pokemon.name}
                </p>
              </div>

              <div className="text-2xl sm:text-4xl">
                <FaArrowRight
                  className={evolutionStage === 1 ? "animate-pulse" : ""}
                />
              </div>

              {evolutionResult && (
                <div
                  className={`flex flex-col items-center transition-all duration-1000 ${
                    evolutionStage >= 1 ? "opacity-100 scale-110" : "opacity-40"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={evolutionResult.image}
                      alt={evolutionResult.name}
                      className={`w-24 h-24 sm:w-40 sm:h-40 object-contain ${
                        evolutionStage === 2
                          ? "animate-evolve"
                          : "animate-pulse"
                      }`}
                    />
                    {evolutionStage === 2 && (
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <p className="mt-1 sm:mt-2 font-semibold capitalize text-xs sm:text-base">
                    {evolutionResult.name}
                  </p>
                </div>
              )}
            </div>

            {evolutionStage === 2 && (
              <div className="mt-4 sm:mt-8 bg-white/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Evolução Concluída!
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-white/10 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm opacity-80">Recompensa</p>
                    <p className="font-bold flex items-center justify-center text-sm sm:text-base">
                      <FaCoins className="text-yellow-300 mr-1" /> +100 moedas
                    </p>
                  </div>

                  <div className="bg-white/10 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm opacity-80">Status</p>
                    <p className="font-bold flex items-center justify-center text-sm sm:text-base">
                      <FaArrowRight className="text-green-300 mr-1" />{" "}
                      Aumentados
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFinishEvolution}
                  className="bg-white text-purple-700 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-purple-100 transition-all w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaCheck /> Continuar
                </button>
              </div>
            )}

            {evolutionStage < 2 && (
              <div className="mt-4 sm:mt-6">
                <div className="w-full bg-white/20 h-2 sm:h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white animate-pulse"
                    style={{
                      width:
                        evolutionStage === 0
                          ? "30%"
                          : evolutionStage === 1
                          ? "70%"
                          : "100%",
                    }}
                  ></div>
                </div>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm">
                  {evolutionStage === 0 && "Iniciando processo de evolução..."}
                  {evolutionStage === 1 && "Transformando..."}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="relative w-[95%] sm:w-[85%] max-w-2xl animate-fade-up max-h-[85vh]"
          onClick={handleModalContentClick}
        >
          <div
            className={`bg-gradient-to-br ${typeColors[mainType]} rounded-t-2xl p-3 sm:p-6 flex justify-center relative`}
          >
            <button
              onClick={onClose}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:bg-white/20 p-1 sm:p-1.5 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-6">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-28 h-28 sm:w-40 sm:h-40 object-contain drop-shadow-2xl animate-float"
              />
              <div className="text-white text-center sm:text-left">
                <p className="text-xs sm:text-sm font-semibold opacity-90">
                  #{String(pokemon.id).padStart(3, "0")}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold capitalize mb-1 sm:mb-2">
                  {pokemon.name}
                </h2>
                <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start flex-wrap">
                  {pokemon.types?.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-2xl p-3 sm:p-6 shadow-xl max-h-[60vh] overflow-y-auto">
            {evolutionData && (
              <div className="mb-4 sm:mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-indigo-100">
                <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                  Evolução
                </h3>

                {calculateLevel(pokemon.exp || 0) < evolutionData.level ? (
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Este Pokémon pode evoluir no nível {evolutionData.level}.
                    <br />
                    <span className="text-xs font-medium text-indigo-600">
                      Atual: Nível {calculateLevel(pokemon.exp || 0)}
                    </span>
                  </p>
                ) : (
                  <div>
                    <p className="text-green-600 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                      Seu {pokemon.name} está pronto para evoluir!
                    </p>
                    <button
                      onClick={handleEvolveClick}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 sm:py-2 rounded-lg font-bold hover:from-indigo-600 hover:to-purple-600 transition-all text-xs sm:text-sm"
                    >
                      Evoluir Agora!
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mb-3 sm:mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Nível {pokemon.level || 1}
                </h3>
                <span className="text-xs sm:text-sm text-gray-600">
                  {xpProgress.currentXp}/{xpProgress.requiredXp} XP
                </span>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${xpProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                Total de XP: {pokemon.exp || 0}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-gray-500">Height</p>
                <p className="font-semibold text-xs sm:text-base">
                  {pokemon.height / 10}m
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-gray-500">Weight</p>
                <p className="font-semibold text-xs sm:text-base">
                  {pokemon.weight / 10}kg
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-center text-sm sm:text-base">
                Base Stats
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {pokemon.stats?.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs sm:text-sm mb-0.5 sm:mb-1">
                      <span className="capitalize text-gray-600">
                        {stat.name.replace("-", " ")}
                      </span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${typeColors[mainType]} transition-all duration-500`}
                        style={{
                          width: `${(stat.value / 255) * 100}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-center text-sm sm:text-base">
                Status e Melhorias
              </h3>
              {pokemon.stats?.map((stat, index) => {
                const currentUpgrades = stat.upgrades || 0;
                const upgradePercentage =
                  (currentUpgrades / MAX_STAT_UPGRADE) * 100;
                const cost = getUpgradeCost(stat.value, currentUpgrades);

                return (
                  <div key={index} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs sm:text-sm mb-0.5 sm:mb-1">
                        <span className="capitalize text-gray-600">
                          {stat.name.replace("-", " ")}
                        </span>
                        <span className="font-medium">
                          {stat.value}
                          {currentUpgrades > 0 && (
                            <span className="text-green-500 ml-1">
                              (+{currentUpgrades * UPGRADE_AMOUNT})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${upgradePercentage}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpgrade(index)}
                      disabled={currentUpgrades >= MAX_STAT_UPGRADE}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                        currentUpgrades >= MAX_STAT_UPGRADE
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {currentUpgrades >= MAX_STAT_UPGRADE
                        ? "Máximo"
                        : `Melhorar (${cost} `}
                      {currentUpgrades < MAX_STAT_UPGRADE && <CoinIcon />}
                      {currentUpgrades >= MAX_STAT_UPGRADE ? "" : ")"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokeDetails;
