import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import SecretCodes from "./SecretCodes";
import {
  FaShoppingBag,
  FaGift,
  FaCoins,
  FaCrown,
  FaStar,
  FaBoxOpen,
} from "react-icons/fa";

function Store({
  addToInventory,
  inventory,
  setInventory,
  coins,
  updateCoins,
  items,
  setItems,
}) {
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState([]);
  const [recentlyObtained, setRecentlyObtained] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [activeTab, setActiveTab] = useState("packs"); // "packs" or "codes"

  useEffect(() => {
    const stored = localStorage.getItem("recentlyObtained");
    if (stored) {
      setRecentlyObtained(JSON.parse(stored));
    }
  }, []);

  const PACK_TYPES = {
    basic: {
      cost: 100,
      legendaryChance: 0.05,
      maxLegendary: 1,
      name: "Pacote Básico",
      description: "5% de chance de Lendário (máx: 1)",
    },
    advanced: {
      cost: 250,
      legendaryChance: 0.15,
      maxLegendary: 2,
      name: "Pacote Avançado",
      description: "15% de chance de Lendário (máx: 2)",
    },
    legendary: {
      cost: 500,
      legendaryChance: 0.35,
      maxLegendary: 3,
      name: "Pacote Lendário",
      description: "35% de chance + 1 Lendário Garantido (máx: 3)",
    },
    master: {
      cost: 1000,
      legendaryChance: 0.5,
      maxLegendary: 4,
      name: "Pacote Mestre",
      description: "50% de chance + 2 Lendários Garantidos (máx: 4)",
    },
  };

  const LEGENDARY_IDS = [
    144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380,
    381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488,
    489, 490, 491, 492, 493, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647,
    648, 649,
  ];

  const REGIONAL_POKEMON = {
    kanto: Array.from({ length: 151 }, (_, i) => i + 1),
    johto: Array.from({ length: 100 }, (_, i) => i + 152),
    hoenn: Array.from({ length: 135 }, (_, i) => i + 252),
    sinnoh: Array.from({ length: 107 }, (_, i) => i + 387),
    unova: Array.from({ length: 156 }, (_, i) => i + 494),
    kalos: Array.from({ length: 72 }, (_, i) => i + 650),
    alola: Array.from({ length: 88 }, (_, i) => i + 722),
    galar: Array.from({ length: 89 }, (_, i) => i + 810),
  };

  const GENERATIONS = {
    gen1: ["kanto"],
    gen2: ["johto"],
    gen3: ["hoenn"],
    gen4: ["sinnoh"],
    gen5: ["unova"],
    gen6: ["kalos"],
    gen7: ["alola"],
    gen8: ["galar"],
    all: [
      "kanto",
      "johto",
      "hoenn",
      "sinnoh",
      "unova",
      "kalos",
      "alola",
      "galar",
    ],
  };

  const PSEUDO_LEGENDARY_IDS = [149, 248, 373, 376, 445, 635, 706, 784, 887];

  const getRandomPokemonId = (isLegendary, packType) => {
    if (isLegendary) {
      let availableLegendaries = [...LEGENDARY_IDS];
      if (selectedGeneration !== "all") {
        const regionIds = GENERATIONS[selectedGeneration].flatMap(
          (region) => REGIONAL_POKEMON[region]
        );
        availableLegendaries = availableLegendaries.filter((id) =>
          regionIds.includes(id)
        );
        if (availableLegendaries.length === 0) {
          availableLegendaries = [...LEGENDARY_IDS];
        }
      }
      const recentLegendaries = recentlyObtained.filter(
        (id) => LEGENDARY_IDS.includes(id) || PSEUDO_LEGENDARY_IDS.includes(id)
      );
      if (recentLegendaries.length < availableLegendaries.length) {
        const filteredLegendaries = availableLegendaries.filter(
          (id) => !recentLegendaries.includes(id)
        );
        if (filteredLegendaries.length > 0) {
          availableLegendaries = filteredLegendaries;
        }
      }
      return availableLegendaries[
        Math.floor(Math.random() * availableLegendaries.length)
      ];
    }

    // Get available regions based on pack type and selected generation
    let availableRegions = [];

    // For non-legendary Pokémon, respect the selected generation first
    if (selectedGeneration !== "all") {
      availableRegions = GENERATIONS[selectedGeneration];
    } else {
      // If no specific generation is selected, use pack-based regions
      switch (packType) {
        case "basic":
          availableRegions = ["kanto"];
          break;
        case "advanced":
          availableRegions = ["kanto", "johto", "hoenn"];
          break;
        case "legendary":
          availableRegions = ["kanto", "johto", "hoenn", "sinnoh", "unova"];
          break;
        case "master":
          availableRegions = [
            "kanto",
            "johto",
            "hoenn",
            "sinnoh",
            "unova",
            "kalos",
            "alola",
            "galar",
          ];
          break;
        default:
          availableRegions = ["kanto"];
      }
    }

    // Get all Pokémon IDs from the available regions
    let availablePokemon = availableRegions
      .flatMap((region) => REGIONAL_POKEMON[region])
      .filter((id) => !LEGENDARY_IDS.includes(id));

    // Handle pseudo-legendary Pokémon chance
    const includePseudoLegendary =
      (packType === "advanced" ||
        packType === "legendary" ||
        packType === "master") &&
      Math.random() < 0.1;

    if (includePseudoLegendary) {
      const pseudoLegendaries = PSEUDO_LEGENDARY_IDS.filter((id) => {
        for (const region of availableRegions) {
          if (REGIONAL_POKEMON[region].includes(id)) {
            return true;
          }
        }
        return false;
      });
      if (pseudoLegendaries.length > 0) {
        return pseudoLegendaries[
          Math.floor(Math.random() * pseudoLegendaries.length)
        ];
      }
    }

    // Apply recently obtained filter if possible
    if (recentlyObtained.length < availablePokemon.length / 2) {
      const filteredPool = availablePokemon.filter(
        (id) => !recentlyObtained.includes(id)
      );
      if (filteredPool.length > 0) {
        availablePokemon = filteredPool;
      }
    }

    return availablePokemon[
      Math.floor(Math.random() * availablePokemon.length)
    ];
  };

  // Function to determine starting level based on Pokémon attributes and pack type
  const determineStartingLevel = (pokemonId, isLegendary, packType) => {
    // Base level ranges by pack type
    const levelRanges = {
      basic: { min: 5, max: 15 },
      advanced: { min: 10, max: 25 },
      legendary: { min: 15, max: 35 },
      master: { min: 20, max: 45 },
    };

    let baseLevel = Math.floor(
      Math.random() *
        (levelRanges[packType].max - levelRanges[packType].min + 1) +
        levelRanges[packType].min
    );

    // Legendary Pokémon get a significant level boost
    if (isLegendary) {
      baseLevel += Math.floor(Math.random() * 15) + 10; // +10-25 levels
    }

    // Pseudo-legendary Pokémon get a moderate boost
    if (PSEUDO_LEGENDARY_IDS.includes(pokemonId)) {
      baseLevel += Math.floor(Math.random() * 10) + 5; // +5-15 levels
    }

    // Higher generation Pokémon tend to start at higher levels
    if (pokemonId > 649) {
      // Gen 6+
      baseLevel += Math.floor(Math.random() * 5) + 3;
    } else if (pokemonId > 493) {
      // Gen 5
      baseLevel += Math.floor(Math.random() * 4) + 2;
    } else if (pokemonId > 386) {
      // Gen 4
      baseLevel += Math.floor(Math.random() * 3) + 1;
    }

    // Some specific Pokémon that are typically found at higher levels
    const highLevelPokemon = [130, 149, 248, 373, 376, 445, 635, 706, 784, 887]; // Gyarados, Dragonite, etc.
    if (highLevelPokemon.includes(pokemonId)) {
      baseLevel += Math.floor(Math.random() * 8) + 5;
    }

    // Baby Pokémon are typically lower level
    const babyPokemon = [
      172, 173, 174, 175, 236, 238, 239, 240, 298, 360, 406, 433, 438, 439, 440,
      446, 447,
    ];
    if (babyPokemon.includes(pokemonId)) {
      baseLevel = Math.floor(baseLevel * 0.7); // 70% of calculated level
      baseLevel = Math.max(baseLevel, 5); // Minimum level 5
    }

    // Cap the level
    const maxLevel = isLegendary ? 65 : 55;
    return Math.min(baseLevel, maxLevel);
  };

  // Function to convert level to experience points
  const levelToExperiencePoints = (level) => {
    let totalExp = 0;
    for (let i = 1; i < level; i++) {
      totalExp += 100 * i;
    }
    return totalExp;
  };

  const openPack = async (packType) => {
    const packConfig = PACK_TYPES[packType];
    if (coins < packConfig.cost) {
      alert(
        `Moedas insuficientes! Você precisa de ${packConfig.cost} moedas para abrir este pacote.`
      );
      return;
    }

    setLoading(true);
    updateCoins(-packConfig.cost);

    const newPack = [];
    const newlyObtainedIds = [];
    try {
      const config = PACK_TYPES[packType];

      let legendaryCount = Array(5)
        .fill(0)
        .filter(() => Math.random() < config.legendaryChance).length;

      if (packType === "legendary") {
        legendaryCount = Math.max(1, legendaryCount);
      } else if (packType === "master") {
        legendaryCount = Math.max(2, legendaryCount);
      }

      legendaryCount = Math.min(legendaryCount, config.maxLegendary);

      const legendaryPositions = Array(5)
        .fill(false)
        .map((_, index) => index)
        .sort(() => Math.random() - 0.5)
        .slice(0, legendaryCount);

      for (let i = 0; i < 5; i++) {
        const isLegendary = legendaryPositions.includes(i);
        const id = getRandomPokemonId(isLegendary, packType);
        newlyObtainedIds.push(id);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        const randomMoveUrls = data.moves
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map((m) => m.move.url);

        const moves = await Promise.all(
          randomMoveUrls.map(async (url) => {
            const moveResponse = await fetch(url);
            const moveData = await moveResponse.json();
            return {
              name: moveData.name,
              type: moveData.type.name,
              power: moveData.power || 50,
              accuracy: moveData.accuracy || 100,
            };
          })
        );

        // Determine the starting level and calculate corresponding experience
        const startingLevel = determineStartingLevel(id, isLegendary, packType);
        const experiencePoints = levelToExperiencePoints(startingLevel);

        newPack.push({
          id: data.id,
          name: data.name,
          image: data.sprites.other["official-artwork"].front_default,
          types: data.types.map((t) => t.type.name),
          height: data.height,
          weight: data.weight,
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          moves: moves,
          isLegendary: isLegendary,
          exp: experiencePoints, // Add experience points based on level
          level: startingLevel, // Add the level directly for display purposes
        });
      }

      const updatedRecentlyObtained = [
        ...newlyObtainedIds,
        ...recentlyObtained,
      ].slice(0, 50);

      setRecentlyObtained(updatedRecentlyObtained);
      localStorage.setItem(
        "recentlyObtained",
        JSON.stringify(updatedRecentlyObtained)
      );

      setPack(newPack);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
    setLoading(false);
  };

  const clearRecentlyObtained = () => {
    setRecentlyObtained([]);
    localStorage.removeItem("recentlyObtained");
    alert(
      "Cache de Pokémon recentes foi limpo. Você terá mais variedade nos próximos pacotes."
    );
  };

  const handleAddToInventory = () => {
    const uniquePokemon = [];
    const duplicates = [];

    pack.forEach((packPokemon) => {
      const pokemonKey = JSON.stringify({
        id: packPokemon.id,
        moves: packPokemon.moves
          .map((m) => ({
            name: m.name,
            type: m.type,
            power: m.power,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      });

      const existsInInventory = inventory.some((invPokemon) => {
        const invKey = JSON.stringify({
          id: invPokemon.id,
          moves: invPokemon.moves
            .map((m) => ({
              name: m.name,
              type: m.type,
              power: m.power,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        });
        return pokemonKey === invKey;
      });

      if (!existsInInventory) {
        uniquePokemon.push(packPokemon);
      } else {
        duplicates.push({
          name: packPokemon.name,
          refundValue: getDuplicateRefundValue(packPokemon),
          isLegendary: packPokemon.isLegendary,
        });
      }
    });

    const totalRefund = duplicates.reduce(
      (sum, dupe) => sum + dupe.refundValue,
      0
    );

    if (uniquePokemon.length === 0) {
      const duplicateNames = duplicates
        .map(
          (d) =>
            `${d.name} (${d.refundValue} moedas${
              d.isLegendary ? " - Lendário" : ""
            })`
        )
        .join(", ");

      alert(
        `Todos os Pokémon já estão no seu inventário!\n` +
          `Duplicatas encontradas: ${duplicateNames}\n` +
          `Você recebeu ${totalRefund} moedas como reembolso!`
      );
      updateCoins(totalRefund);
      setPack([]);
      return;
    }

    const updatedInventory = [...inventory, ...uniquePokemon];
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));

    if (duplicates.length > 0) {
      const duplicateNames = duplicates
        .map(
          (d) =>
            `${d.name} (${d.refundValue} moedas${
              d.isLegendary ? " - Lendário" : ""
            })`
        )
        .join(", ");

      alert(
        `Pokémon duplicados convertidos em moedas: ${duplicateNames}\n` +
          `Reembolso total: ${totalRefund} moedas\n` +
          `Adicionados ${uniquePokemon.length} novo(s) Pokémon ao inventário!`
      );
      updateCoins(totalRefund);
    }

    setPack([]);

    if (uniquePokemon.length > 0 && Math.random() < 0.2) {
      const bonus = Math.floor(Math.random() * 50) + 25;
      updateCoins(bonus);
      alert(`Parabéns! Você ganhou ${bonus} moedas de bônus!`);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-xl my-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          fill="currentColor"
          className="text-blue-500"
        >
          <path d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z M100,50 C72.386,50 50,72.386 50,100 C50,127.614 72.386,150 100,150 C127.614,150 150,127.614 150,100 C150,72.386 127.614,50 100,50 Z" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaShoppingBag className="mr-2 text-blue-500" />
          Loja de Pokémon
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs navigation with enhanced styling */}
          <div className="flex border rounded-lg overflow-hidden w-full md:w-auto shadow-sm">
            <button
              onClick={() => setActiveTab("packs")}
              className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "packs"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaBoxOpen />
              <span>Pacotes</span>
            </button>
            <button
              onClick={() => setActiveTab("codes")}
              className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "codes"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaGift />
              <span>Códigos</span>
            </button>
          </div>

          {activeTab === "packs" && (
            <div className="flex gap-2 items-center w-full md:w-auto">
              <select
                value={selectedGeneration}
                onChange={(e) => setSelectedGeneration(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm flex-grow md:flex-grow-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas Gerações</option>
                <option value="gen1">Geração 1 (Kanto)</option>
                <option value="gen2">Geração 2 (Johto)</option>
                <option value="gen3">Geração 3 (Hoenn)</option>
                <option value="gen4">Geração 4 (Sinnoh)</option>
                <option value="gen5">Geração 5 (Unova)</option>
                <option value="gen6">Geração 6 (Kalos)</option>
                <option value="gen7">Geração 7 (Alola)</option>
                <option value="gen8">Geração 8 (Galar)</option>
              </select>

              {recentlyObtained.length > 0 && (
                <button
                  onClick={clearRecentlyObtained}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                  title="Limpar cache para ter mais variedade"
                >
                  Resetar Cache
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {activeTab === "packs" ? (
        <>
          <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-700 flex items-center">
              <FaCoins className="mr-2 text-yellow-500" />
              <span>
                Seu saldo: <span className="font-bold">{coins} moedas</span>
              </span>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Geração atual:{" "}
              <span className="font-medium">
                {selectedGeneration === "all"
                  ? "Todas"
                  : `Geração ${selectedGeneration.replace("gen", "")}`}
              </span>
              {selectedGeneration !== "all" && (
                <span className="ml-1">
                  (
                  {GENERATIONS[selectedGeneration]
                    .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                    .join(", ")}
                  )
                </span>
              )}
            </p>

            {/* Add information about pack contents */}
            <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-200">
              <p className="mb-1 font-medium">Conteúdo dos pacotes:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>Básico:</strong> Pokémon da região de Kanto (1-151)
                </li>
                <li>
                  <strong>Avançado:</strong> Pokémon de Kanto, Johto e Hoenn
                  (1-386)
                </li>
                <li>
                  <strong>Lendário:</strong> Pokémon de Kanto até Unova (1-649)
                </li>
                <li>
                  <strong>Mestre:</strong> Todos os Pokémon até Galar (1-898)
                </li>
                <li>
                  Filtrando por geração, apenas Pokémon da geração selecionada
                  aparecerão
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {Object.entries(PACK_TYPES).map(([type, config]) => {
              const canAfford = coins >= config.cost;

              return (
                <div
                  key={type}
                  className={`relative overflow-hidden rounded-xl ${
                    type === "master"
                      ? "border-2 border-yellow-400"
                      : "border border-gray-200"
                  } transition-all hover:shadow-lg group`}
                >
                  {/* Pack style background */}
                  <div
                    className={`h-2 w-full ${
                      type === "basic"
                        ? "bg-blue-400"
                        : type === "advanced"
                        ? "bg-green-500"
                        : type === "legendary"
                        ? "bg-purple-500"
                        : "bg-gradient-to-r from-yellow-400 to-amber-500"
                    }`}
                  ></div>

                  <div className="p-5 text-center bg-white">
                    <div className="flex justify-center mb-3">
                      {type === "basic" && (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaBoxOpen className="text-blue-500 text-xl" />
                        </div>
                      )}
                      {type === "advanced" && (
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <FaBoxOpen className="text-green-500 text-xl" />
                        </div>
                      )}
                      {type === "legendary" && (
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaCrown className="text-purple-500 text-xl" />
                        </div>
                      )}
                      {type === "master" && (
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <FaStar className="text-amber-500 text-xl" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {config.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 h-10 flex items-center justify-center">
                      {config.description}
                    </p>

                    <div className="flex justify-center items-center gap-2 mb-4">
                      <FaCoins className="text-yellow-500" />
                      <span
                        className={`text-lg font-semibold ${
                          canAfford ? "text-gray-700" : "text-red-500"
                        }`}
                      >
                        {config.cost}
                      </span>
                    </div>

                    <button
                      onClick={() => openPack(type)}
                      disabled={loading || !canAfford}
                      className={`px-6 py-3 rounded-lg font-semibold w-full transition-all ${
                        canAfford
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          : "bg-gray-300 cursor-not-allowed text-gray-500"
                      } ${loading ? "animate-pulse" : ""}`}
                    >
                      {loading ? "Abrindo..." : `Abrir Pacote`}
                    </button>
                  </div>

                  {type === "master" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-xs text-white font-bold px-2 py-1 rounded-full shadow-md">
                      MELHOR!
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {pack.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-blue-100 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 text-indigo-100 opacity-50 transform rotate-12">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" />
                </svg>
              </div>

              <h3 className="font-bold text-lg text-blue-800 mb-3 flex items-center">
                <FaBoxOpen className="mr-2" />
                Pacote Aberto!
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center">
                  <span className="text-sm mr-2">Pokémon Lendários:</span>
                  <span className="font-bold text-purple-700">
                    {pack.filter((p) => p.isLegendary).length}
                  </span>
                </div>

                <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center">
                  <span className="text-sm mr-2">Tipos encontrados:</span>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(pack.flatMap((p) => p.types)))
                      .slice(0, 3)
                      .map((type) => (
                        <span
                          key={type}
                          className={`text-xs bg-${type}-100 text-${type}-800 px-1.5 py-0.5 rounded capitalize`}
                        >
                          {type}
                        </span>
                      ))}
                    {Array.from(new Set(pack.flatMap((p) => p.types))).length >
                      3 && (
                      <span className="text-xs text-gray-500">
                        +
                        {Array.from(new Set(pack.flatMap((p) => p.types)))
                          .length - 3}{" "}
                        mais
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-4">
            {pack.map((pokemon) => (
              <div
                key={pokemon.id}
                className={`relative ${
                  pokemon.isLegendary ? "animate-pulse-soft" : ""
                }`}
              >
                <PokeCard pokemon={pokemon} />
                {pokemon.isLegendary && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                    LENDÁRIO
                  </div>
                )}
              </div>
            ))}
          </div>

          {pack.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleAddToInventory}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Adicionar ao Inventário
              </button>
            </div>
          )}
        </>
      ) : (
        <SecretCodes
          updateCoins={updateCoins}
          addToInventory={addToInventory}
          inventory={inventory}
          setInventory={setInventory}
          items={items}
          setItems={setItems}
        />
      )}
    </div>
  );
}

export default Store;
