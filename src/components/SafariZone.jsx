import React, { useState, useEffect } from "react";
import {
  FaTree,
  FaWater,
  FaMountain,
  FaCampground,
  FaSearch,
  FaDice,
  FaCoins,
  FaCopy,
} from "react-icons/fa";

function SafariZone({
  inventory,
  setInventory,
  coins,
  updateCoins,
  items,
  setItems,
}) {
  const [environment, setEnvironment] = useState(null);
  const [searching, setSearching] = useState(false);
  const [encounter, setEncounter] = useState(null);
  const [catchResult, setCatchResult] = useState(null);
  const [searchCooldown, setSearchCooldown] = useState(false);
  const [catchAttempts, setCatchAttempts] = useState(0);
  const [runAwayChance, setRunAwayChance] = useState(0);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [selectedPokeball, setSelectedPokeball] = useState(null);
  const [showPokeballSelector, setShowPokeballSelector] = useState(false);

  // Define environments and their Pokemon distribution
  const environments = {
    forest: {
      name: "Floresta Viridian",
      description:
        "Uma floresta densa com muitos Pokémon do tipo Inseto e Planta",
      icon: <FaTree className="text-green-600" />,
      background: "bg-gradient-to-b from-green-800 to-green-500",
      types: ["bug", "grass", "normal", "poison"],
      regions: ["kanto"],
      rarityBoost: 0,
      searchCost: 50,
    },
    lake: {
      name: "Lago Lágrimas",
      description: "Um lago cristalino habitado por Pokémon aquáticos",
      icon: <FaWater className="text-blue-600" />,
      background: "bg-gradient-to-b from-blue-600 to-blue-400",
      types: ["water", "flying", "dragon"],
      regions: ["kanto", "johto"],
      rarityBoost: 5,
      searchCost: 80,
    },
    mountain: {
      name: "Monte Lunar",
      description: "Uma região montanhosa com Pokémon raros de pedra e terra",
      icon: <FaMountain className="text-gray-700" />,
      background: "bg-gradient-to-b from-gray-800 to-gray-500",
      types: ["rock", "ground", "fighting", "steel"],
      regions: ["kanto", "hoenn"],
      rarityBoost: 10,
      searchCost: 100,
    },
    cave: {
      name: "Caverna Desconhecida",
      description:
        "Uma caverna misteriosa onde habitam Pokémon raros e lendários",
      icon: <FaCampground className="text-purple-600" />,
      background: "bg-gradient-to-b from-purple-900 to-purple-700",
      types: ["psychic", "ghost", "dark", "dragon"],
      regions: ["kanto", "johto", "hoenn", "sinnoh"],
      rarityBoost: 20,
      searchCost: 200,
    },
  };

  // Regional Pokemon data
  const REGIONAL_POKEMON = {
    kanto: Array.from({ length: 151 }, (_, i) => i + 1),
    johto: Array.from({ length: 100 }, (_, i) => i + 152),
    hoenn: Array.from({ length: 135 }, (_, i) => i + 252),
    sinnoh: Array.from({ length: 107 }, (_, i) => i + 387),
  };

  // Legendary Pokemon IDs for rarity checks
  const LEGENDARY_IDS = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251];

  // Search for a Pokemon in the selected environment
  const searchForPokemon = async () => {
    if (!environment) return;

    // Check if player has enough coins
    if (coins < environments[environment].searchCost) {
      alert(
        `Você precisa de pelo menos ${environments[environment].searchCost} moedas para procurar aqui.`
      );
      return;
    }

    setSearching(true);
    setLoadingPokemon(true);
    setEncounter(null);
    setCatchResult(null);
    setCatchAttempts(0);

    // Charge the search cost
    updateCoins(-environments[environment].searchCost);

    try {
      // Select regions based on environment
      const regionPool = environments[environment].regions;
      const availableIds = regionPool.flatMap(
        (region) => REGIONAL_POKEMON[region]
      );

      // Filter by types in this environment
      const filteredIds = await filterPokemonByTypes(
        availableIds,
        environments[environment].types
      );

      // Add rarity calculation
      const rarityBoost = environments[environment].rarityBoost;
      let selectedId;

      // Small chance for legendary based on environment
      if (Math.random() < 0.005 + rarityBoost / 1000) {
        // Select from legendary pool
        const legendaries = LEGENDARY_IDS.filter((id) =>
          availableIds.includes(id)
        );
        selectedId =
          legendaries[Math.floor(Math.random() * legendaries.length)];
      } else {
        // Regular Pokemon
        selectedId =
          filteredIds[Math.floor(Math.random() * filteredIds.length)];
      }

      // Fetch Pokemon data
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${selectedId}`
      );
      const pokemonData = await response.json();

      // Generate random level based on environment (higher for rare environments)
      const baseLevel = Math.floor(Math.random() * 15) + 5;
      const environmentBonus = Math.floor(rarityBoost / 5);
      const level = baseLevel + environmentBonus;

      // Create encounter object
      const newEncounter = {
        id: pokemonData.id,
        name: pokemonData.name,
        image: pokemonData.sprites.other["official-artwork"].front_default,
        level,
        types: pokemonData.types.map((t) => t.type.name),
        isLegendary: LEGENDARY_IDS.includes(pokemonData.id),
        catchRate: calculateCatchRate(pokemonData, level),
        runRate: Math.floor(Math.random() * 20) + 10, // 10-30% chance of running per turn
      };

      // Set initial run away chance
      setRunAwayChance(newEncounter.runRate);

      // Delay for suspense
      setTimeout(() => {
        setEncounter(newEncounter);
        setLoadingPokemon(false);

        // Set search cooldown (prevents spamming)
        setSearchCooldown(true);
        setTimeout(() => setSearchCooldown(false), 2000);
      }, 1500);
    } catch (error) {
      console.error("Error searching for Pokemon:", error);
      setLoadingPokemon(false);
      setSearching(false);
    }
  };

  // Filter Pokemon by types (returns Pokemon IDs that match environment types)
  const filterPokemonByTypes = async (pokemonIds, targetTypes) => {
    // This would ideally be done server-side for efficiency
    // For this demo, we'll use a simplified version that checks a subset
    const sampleSize = Math.min(50, pokemonIds.length);
    const sampleIds = pokemonIds
      .sort(() => 0.5 - Math.random())
      .slice(0, sampleSize);

    const validIds = [];

    // Check if we have at least 10 Pokemon IDs
    if (sampleIds.length < 10) return sampleIds;

    for (const id of sampleIds) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        const types = data.types.map((t) => t.type.name);

        // Check if any of the Pokemon's types match our target types
        if (types.some((type) => targetTypes.includes(type))) {
          validIds.push(id);
          // Once we have enough, return early
          if (validIds.length >= 10) break;
        }
      } catch (err) {
        console.error(`Error fetching Pokemon ${id}:`, err);
      }
    }

    // If we don't have enough type matches, add some random ones
    if (validIds.length < 5) {
      return [...validIds, ...sampleIds.slice(0, 10 - validIds.length)];
    }

    return validIds;
  };

  // Calculate catch rate based on Pokemon stats and level
  const calculateCatchRate = (pokemon, level) => {
    // Base catch rate (lower for rare/powerful Pokemon)
    const isLegendary = LEGENDARY_IDS.includes(pokemon.id);
    let baseCatchRate = isLegendary ? 5 : 40;

    // Reduce catch rate based on highest base stat
    const highestStat = Math.max(...pokemon.stats.map((s) => s.base_stat));
    baseCatchRate -= Math.floor(highestStat / 20);

    // Reduce catch rate based on level
    baseCatchRate -= Math.floor(level / 5);

    // Ensure catch rate is at least 1%
    return Math.max(baseCatchRate, 1);
  };

  // Try to catch the encountered Pokemon
  const tryToCatch = async () => {
    if (!encounter) return;

    // Check if player has any pokeballs
    const pokeballs = items.filter((item) => item.category === "pokeball");

    if (pokeballs.length === 0) {
      alert("Você não possui pokébolas! Visite a loja para comprar.");
      return;
    }

    // Show pokeball selector
    setShowPokeballSelector(true);
  };

  // Function to attempt catch with selected ball
  const attemptCatchWithBall = async (pokeball) => {
    setShowPokeballSelector(false);

    if (!pokeball || !encounter) return;

    setCatchAttempts((prev) => prev + 1);

    // Use up one pokeball
    const updatedItems = [...items];
    const pokeballIndex = updatedItems.findIndex((i) => i.id === pokeball.id);

    if (pokeballIndex === -1 || updatedItems[pokeballIndex].quantity <= 0) {
      alert("Você não possui mais esta pokébola!");
      return;
    }

    // Decrease pokeball quantity
    updatedItems[pokeballIndex].quantity -= 1;
    if (updatedItems[pokeballIndex].quantity <= 0) {
      updatedItems.splice(pokeballIndex, 1);
    }

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    // Apply pokeball catch rate bonus
    const catchRateBonus = pokeball.effect.catchRate || 1;
    const effectiveCatchRate = Math.min(
      100,
      encounter.catchRate * catchRateBonus
    );

    // Master Ball has 100% catch rate
    const isMasterBall = pokeball.id === "master_ball";

    // Calculate catch success
    const catchRoll = Math.random() * 100;
    const success = isMasterBall || catchRoll <= effectiveCatchRate;

    // Show animation and continue with existing catch logic
    if (success) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encounter.id}`
        );
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

        let totalXp = 0;
        for (let i = 1; i < encounter.level; i++) {
          totalXp += i * 100;
        }

        const capturedPokemon = {
          id: encounter.id,
          name: encounter.name,
          image: encounter.image,
          types: encounter.types,
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          height: data.height,
          weight: data.weight,
          moves: moves,
          exp: totalXp,
          caughtAt: new Date().toISOString(),
          caughtIn: environments[environment].name,
        };

        const updatedInventory = [...inventory, capturedPokemon];
        setInventory(updatedInventory);
        localStorage.setItem("inventory", JSON.stringify(updatedInventory));

        const bonusCoins = encounter.isLegendary ? 500 : 50;
        updateCoins(bonusCoins);

        setCatchResult({
          success: true,
          message: `Você capturou ${encounter.name.toUpperCase()}!`,
          bonusCoins,
          pokemon: capturedPokemon,
        });

        setTimeout(() => {
          setSearching(false);
          setEncounter(null);
        }, 3000);
      } catch (error) {
        console.error("Error capturing Pokemon:", error);
      }
    } else {
      setRunAwayChance((prev) => Math.min(prev + 10, 80));

      const runRoll = Math.random() * 100;
      if (runRoll <= runAwayChance) {
        setCatchResult({
          success: false,
          message: `${encounter.name.toUpperCase()} fugiu!`,
          ranAway: true,
        });

        setTimeout(() => {
          setSearching(false);
          setEncounter(null);
        }, 2000);
      } else {
        setCatchResult({
          success: false,
          message: `${encounter.name.toUpperCase()} escapou da Pokébola!`,
          ranAway: false,
        });
      }
    }
  };

  // Run from the encounter
  const runAway = () => {
    setSearching(false);
    setEncounter(null);
    setCatchResult(null);
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-xl my-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Safari Zone
      </h2>

      {!searching ? (
        <div>
          <p className="text-gray-600 mb-6">
            Explore diferentes ambientes para encontrar e capturar Pokémon
            selvagens! Cada área tem diferentes tipos de Pokémon e níveis de
            raridade.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {Object.entries(environments).map(([id, env]) => (
              <div
                key={id}
                className={`${
                  env.background
                } text-white p-4 md:p-5 rounded-xl shadow-md transition-all cursor-pointer ${
                  environment === id
                    ? "ring-4 ring-yellow-400 transform scale-105"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setEnvironment(id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{env.icon}</div>
                  <h3 className="font-bold text-lg">{env.name}</h3>
                </div>
                <p className="text-sm mb-3 text-white/90">{env.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {env.types.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 bg-white/20 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mt-auto text-sm font-medium flex justify-between items-center">
                  <span>
                    Custo: {env.searchCost}{" "}
                    <FaCoins className="inline text-yellow-300" />
                  </span>
                  <span className="flex items-center gap-1">
                    Raridade:{" "}
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < env.rarityBoost / 5
                            ? "bg-yellow-300"
                            : "bg-white/30"
                        }`}
                      ></span>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={searchForPokemon}
              disabled={!environment || searchCooldown}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 font-semibold ${
                environment && !searchCooldown
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaSearch /> Procurar Pokémon
              {environment && (
                <span className="ml-1">
                  ({environments[environment].searchCost}{" "}
                  <FaCoins className="inline" />)
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div
            className={`w-full h-48 md:h-60 ${environments[environment].background} rounded-xl flex justify-center items-center relative overflow-hidden mb-4 md:mb-6`}
          >
            {/* Environment decorations */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 text-white"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${0.5 + Math.random()}) rotate(${
                      Math.random() * 360
                    }deg)`,
                  }}
                >
                  {environments[environment].icon}
                </div>
              ))}
            </div>

            {/* Loading or Pokemon display */}
            {loadingPokemon ? (
              <div className="text-center text-white">
                <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold">Procurando...</p>
              </div>
            ) : encounter ? (
              <div className="text-center">
                <img
                  src={encounter.image}
                  alt={encounter.name}
                  className="w-40 h-40 object-contain drop-shadow-lg animate-bounce-slow"
                />
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <p className="text-white text-xl font-bold capitalize">
                    {encounter.name}
                  </p>
                  <p className="text-white/80 text-sm">
                    Nível {encounter.level}
                  </p>
                  <div className="flex justify-center gap-2 mt-1">
                    {encounter.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs px-2 py-0.5 bg-white/20 rounded-full capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Legendary indicator */}
                  {encounter.isLegendary && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold animate-pulse">
                      LENDÁRIO
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Catch controls */}
          {encounter && !catchResult?.ranAway && (
            <div className="flex flex-col items-center mb-4 md:mb-6 w-full">
              <div className="flex gap-3 mb-4 w-full">
                <button
                  onClick={tryToCatch}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  <span className="md:inline">Lançar Pokébola</span>
                </button>
                <button
                  onClick={runAway}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                  <span className="md:inline">Fugir</span>
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Taxa Base de Captura:</span>
                  <span className="ml-1 font-medium">
                    {encounter.catchRate}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Chance de Fuga:</span>
                  <span className="ml-1 font-medium">{runAwayChance}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Tentativas:</span>
                  <span className="ml-1 font-medium">{catchAttempts}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Suas Pokébolas:</span>
                {items.filter((item) => item.category === "pokeball").length >
                0 ? (
                  <div className="flex items-center gap-2">
                    {items
                      .filter((item) => item.category === "pokeball")
                      .map((ball) => (
                        <div
                          key={ball.id}
                          className="flex items-center gap-1"
                          title={ball.name}
                        >
                          <img
                            src={ball.image}
                            alt={ball.name}
                            className="w-4 h-4"
                          />
                          <span className="text-xs">{ball.quantity}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <span className="text-xs text-red-500">
                    Nenhuma disponível
                  </span>
                )}
              </div>
            </div>
          )}

          {catchResult && (
            <div
              className={`p-4 rounded-lg mb-6 text-center ${
                catchResult.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="text-lg font-bold">{catchResult.message}</p>

              {catchResult.success && (
                <div className="mt-2">
                  <p>Ganhou {catchResult.bonusCoins} moedas de bônus!</p>
                  <p className="text-sm mt-2 text-gray-600">
                    O Pokémon foi adicionado ao seu inventário.
                  </p>
                </div>
              )}

              {catchResult.ranAway && (
                <button
                  onClick={() => {
                    setSearching(false);
                    setEncounter(null);
                    setCatchResult(null);
                  }}
                  className="mt-3 px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm"
                >
                  Continuar
                </button>
              )}
            </div>
          )}

          <div className="bg-gray-100 p-3 rounded-lg text-sm w-full">
            <p>
              <span className="font-medium">Local:</span>{" "}
              {environments[environment].name}
            </p>
          </div>
        </div>
      )}

      {showPokeballSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Escolha uma Pokébola</h3>
              <button
                onClick={() => setShowPokeballSelector(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
              >
                <svg
                  className="w-5 h-5"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {items
                .filter((item) => item.category === "pokeball")
                .map((pokeball) => {
                  const catchBonus = pokeball.effect.catchRate;
                  const effectiveCatchRate =
                    pokeball.id === "master_ball"
                      ? "100%"
                      : `${Math.min(
                          100,
                          Math.round(encounter.catchRate * catchBonus)
                        )}%`;

                  return (
                    <button
                      key={pokeball.id}
                      onClick={() => attemptCatchWithBall(pokeball)}
                      className="flex items-center p-3 border rounded-lg text-left hover:border-blue-500 hover:bg-blue-50"
                    >
                      <img
                        src={pokeball.image}
                        alt={pokeball.name}
                        className="w-12 h-12 mr-3 object-contain"
                      />
                      <div>
                        <h4 className="font-medium">{pokeball.name}</h4>
                        <p className="text-xs text-gray-600">
                          {pokeball.description}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-blue-600">
                            Quantidade: {pokeball.quantity}
                          </p>
                          <p className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Taxa: {effectiveCatchRate}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            {items.filter((item) => item.category === "pokeball").length ===
              0 && (
              <div className="text-center py-6 text-gray-500">
                Você não possui pokébolas. Visite a loja para comprar!
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPokeballSelector(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SafariZone;
