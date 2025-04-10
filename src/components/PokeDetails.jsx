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
