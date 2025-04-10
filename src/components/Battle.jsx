import React, { useState, useEffect } from "react";
import PokemonSelector from "./PokemonSelector";
import {
  FaArrowUp,
  FaTrophy,
  FaCoins,
  FaMapMarkedAlt,
  FaLocationArrow,
  FaRunning,
  FaFlask,
  FaShieldAlt,
  FaCrosshairs,
  FaFire,
} from "react-icons/fa";

function Battle({ inventory, updateCoins, setInventory, items, setItems }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("player");
  const [selectedMove, setSelectedMove] = useState(null);
  const [battleState, setBattleState] = useState("setup"); // setup, selecting, battling, finished
  const [pokemonHealth, setPokemonHealth] = useState({
    player: 100,
    opponent: 100,
  });
  const [showSelector, setShowSelector] = useState(false);
  const [battleSummary, setBattleSummary] = useState(null);
  const [showItemsMenu, setShowItemsMenu] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

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

  const updatePokemonInInventory = (updatedPokemon) => {
    const updatedInventory = inventory.map((p) =>
      p.id === updatedPokemon.id &&
      JSON.stringify(p.moves) === JSON.stringify(updatedPokemon.moves)
        ? updatedPokemon
        : p
    );
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  const typeColors = {
    normal: "gray",
    fire: "red",
    water: "blue",
    electric: "yellow",
    grass: "green",
    ice: "blue",
    fighting: "red",
    poison: "purple",
    ground: "yellow",
    flying: "indigo",
    psychic: "pink",
    bug: "lime",
    rock: "yellow",
    ghost: "purple",
    dragon: "indigo",
    dark: "gray",
    steel: "gray",
    fairy: "pink",
  };

  const battleLocations = [
    {
      id: "route1",
      name: "Rota 1",
      description: "Trilha tranquila com Pokémon de nível baixo",
      image:
        "https://archives.bulbagarden.net/media/upload/6/66/Kanto_Route_1_PE.png",
      minLevel: 5,
      maxLevel: 15,
      regionLimit: "kanto",
      rewardMultiplier: 1,
      unlockLevel: 0,
    },
    {
      id: "viridianForest",
      name: "Floresta Viridian",
      description: "Floresta densa com Pokémon tipo Bug e Grass",
      image:
        "https://archives.bulbagarden.net/media/upload/thumb/a/a2/Viridian_Forest_PE.png/290px-Viridian_Forest_PE.png",
      minLevel: 10,
      maxLevel: 20,
      regionLimit: "kanto",
      typeBias: ["bug", "grass"],
      rewardMultiplier: 1.2,
      unlockLevel: 10,
    },
    {
      id: "mtMoon",
      name: "Mt. Moon",
      description: "Caverna montanhosa com Pokémon tipo Rock",
      image:
        "https://archives.bulbagarden.net/media/upload/2/2e/Mt._Moon_PE.png",
      minLevel: 15,
      maxLevel: 25,
      regionLimit: "kanto",
      typeBias: ["rock", "ground"],
      rewardMultiplier: 1.5,
      unlockLevel: 15,
    },
    {
      id: "powerPlant",
      name: "Central Elétrica",
      description: "Instalação abandonada com fortes Pokémon tipo Electric",
      image:
        "https://archives.bulbagarden.net/media/upload/2/2e/Mt._Moon_PE.png",
      minLevel: 25,
      maxLevel: 40,
      regionLimit: "kanto",
      typeBias: ["electric", "steel"],
      rewardMultiplier: 2,
      unlockLevel: 25,
    },
    {
      id: "victoryRoad",
      name: "Estrada da Vitória",
      description: "Desafiador caminho com Pokémon poderosos",
      image:
        "https://archives.bulbagarden.net/media/upload/thumb/8/8c/Victory_Road_PE.png/290px-Victory_Road_PE.png",
      minLevel: 40,
      maxLevel: 55,
      regionLimit: "all",
      legendaryChance: 0.05,
      rewardMultiplier: 2.5,
      unlockLevel: 40,
    },
    {
      id: "ceruleanCave",
      name: "Caverna Cerulean",
      description: "O mais difícil local de batalha com Pokémon raros e fortes",
      image:
        "https://static.wikia.nocookie.net/smashtopia/images/1/12/Cerulean_Cave.png/revision/latest?cb=20170903075015",
      minLevel: 55,
      maxLevel: 70,
      regionLimit: "all",
      legendaryChance: 0.1,
      rewardMultiplier: 3,
      unlockLevel: 50,
    },
  ];

  const getMaxPokemonLevel = () => {
    if (!inventory || inventory.length === 0) return 0;
    return Math.max(...inventory.map((p) => calculateLevel(p.exp || 0)));
  };

  const availableLocations = battleLocations.filter(
    (location) => getMaxPokemonLevel() >= location.unlockLevel
  );

  const lockedLocations = battleLocations.filter(
    (location) => getMaxPokemonLevel() < location.unlockLevel
  );

  useEffect(() => {
    if (selectedPokemon && battleState === "battling" && selectedLocation) {
      startBattle();
    }
  }, [selectedPokemon, selectedLocation, battleState]);

  useEffect(() => {
    // Add this effect to ensure UI is properly updated after Pokemon selection
    if (selectedPokemon && battleState === "battling") {
      // Reset turn to player when a new Pokemon is selected
      setCurrentTurn("player");
      setBattleLog((prev) => [...prev, `Vá ${selectedPokemon.name}!`]);
    }
  }, [selectedPokemon]);

  const formatMoveName = (name) => {
    if (!name) return "Ataque";

    // Substituir hifens por espaços
    name = name.replace(/-/g, " ");

    // Capitalizar cada palavra
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const selectRandomOpponent = async () => {
    if (!selectedLocation) return null;

    try {
      const minLevel = selectedLocation.minLevel;
      const maxLevel = selectedLocation.maxLevel;
      const level =
        Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

      let idRange = { min: 1, max: 151 };

      if (selectedLocation.regionLimit === "all") {
        idRange = { min: 1, max: 649 };
      } else if (selectedLocation.regionLimit === "johto") {
        idRange = { min: 152, max: 251 };
      } else if (selectedLocation.regionLimit === "hoenn") {
        idRange = { min: 252, max: 386 };
      }

      let id;
      const legendaryIDs = [
        144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379,
        380, 381, 382, 383, 384,
      ];

      if (
        selectedLocation.legendaryChance &&
        Math.random() < selectedLocation.legendaryChance
      ) {
        id = legendaryIDs[Math.floor(Math.random() * legendaryIDs.length)];
      } else {
        id =
          Math.floor(Math.random() * (idRange.max - idRange.min + 1)) +
          idRange.min;
      }

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      const randomMoves = data.moves
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      const moves = await Promise.all(
        randomMoves.map(async (move) => {
          const moveResponse = await fetch(move.move.url);
          const moveData = await moveResponse.json();
          return {
            name: formatMoveName(moveData.name),
            type: moveData.type.name,
            power: moveData.power || 50,
            accuracy: moveData.accuracy || 100,
          };
        })
      );

      const statMultiplier = 1 + (level - 5) / 50;

      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        stats: data.stats.map((s) => ({
          name: s.stat.name,
          value: Math.floor(s.base_stat * statMultiplier),
        })),
        types: data.types.map((t) => t.type.name),
        moves: moves,
        level: level,
        isLegendary: legendaryIDs.includes(data.id),
      };
    } catch (error) {
      console.error("Error fetching opponent:", error);
      return null;
    }
  };

  const startBattle = async () => {
    if (!selectedPokemon || !selectedLocation) return;

    try {
      setBattleLog([`Iniciando batalha em ${selectedLocation.name}...`]);
      const enemyPokemon = await selectRandomOpponent();

      if (!enemyPokemon) {
        setBattleLog(["Erro ao carregar oponente. Tente novamente."]);
        setBattleState("selecting");
        return;
      }

      setOpponent(enemyPokemon);
      setPokemonHealth({ player: 100, opponent: 100 });
      setBattleLog([
        `Batalha em ${selectedLocation.name}!`,
        `${selectedPokemon.name} (Nv.${calculateLevel(
          selectedPokemon.exp || 0
        )}) vs ${enemyPokemon.name} (Nv.${enemyPokemon.level})!`,
      ]);

      setBattleState("battling");
    } catch (error) {
      console.error("Error starting battle:", error);
      setBattleLog(["Erro ao iniciar batalha. Tente novamente."]);
      setBattleState("selecting");
    }
  };

  const handleBattleEnd = (result) => {
    try {
      const locationMultiplier = selectedLocation?.rewardMultiplier || 1;
      const opponentLevel = opponent?.level || 10;

      let baseXP = result === "victory" ? 50 : 20;
      let baseCoins = result === "victory" ? 100 : 10;

      const xpMultiplier = (opponentLevel / 10) * locationMultiplier;
      const coinMultiplier = locationMultiplier;

      const bonusXP = Math.floor(Math.random() * 30);
      const totalXP = Math.floor((baseXP + bonusXP) * xpMultiplier);
      const coinsReward = Math.floor(baseCoins * coinMultiplier);

      if (selectedPokemon) {
        const updatedPokemon = {
          ...selectedPokemon,
          exp: (selectedPokemon.exp || 0) + totalXP,
          level: calculateLevel((selectedPokemon.exp || 0) + totalXP),
        };

        updatePokemonInInventory(updatedPokemon);
      }

      const summary = {
        result: result,
        location: selectedLocation?.name || "Unknown Location",
        playerPokemon: {
          name: selectedPokemon?.name || "Your Pokémon",
          image: selectedPokemon?.image || "",
          remainingHealth: pokemonHealth?.player || 0,
          expGained: totalXP,
          newLevel: calculateLevel((selectedPokemon?.exp || 0) + totalXP),
          previousLevel: calculateLevel(selectedPokemon?.exp || 0),
        },
        opponentPokemon: {
          name: opponent?.name || "Wild Pokémon",
          image: opponent?.image || "",
          level: opponent?.level || 0,
          remainingHealth: pokemonHealth?.opponent || 0,
          isLegendary: opponent?.isLegendary || false,
        },
        reward: coinsReward,
        exp: totalXP,
      };
      setBattleSummary(summary);

      updateCoins(coinsReward);
    } catch (error) {
      console.error("Error creating battle summary:", error);
    }
    setBattleState("finished");
  };

  const startNewBattle = () => {
    setBattleSummary(null);
    setShowLocationSelector(true);
    setBattleState("selecting");
    setSelectedLocation(null);
    setSelectedPokemon(null);
    setOpponent(null);
  };

  const handleSelectPokemon = (pokemon) => {
    if (!pokemon?.name) {
      console.error("Invalid pokemon data");
      return;
    }

    const battlePokemon = {
      ...pokemon,
      health: 100,
    };

    setSelectedPokemon(battlePokemon);
    setShowSelector(false);

    if (selectedLocation) {
      setBattleState("battling");
    } else {
      setShowLocationSelector(true);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setShowLocationSelector(false);

    if (selectedPokemon) {
      setBattleState("battling");
    } else {
      setShowSelector(true);
    }
  };

  const getTypeColorClass = (type) => {
    const typeClasses = {
      normal: "bg-gray-500",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-500",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-600",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-800",
      ghost: "bg-purple-600",
      dragon: "bg-indigo-600",
      dark: "bg-gray-700",
      steel: "bg-gray-400",
      fairy: "bg-pink-300",
    };

    return typeClasses[type] || "bg-gray-500";
  };

  const handlePlayerAttack = (move) => {
    if (!opponent || currentTurn !== "player") return;

    const damage = calculateDamage(move, selectedPokemon, opponent);

    const newHealth = Math.max(0, pokemonHealth.opponent - damage);
    setPokemonHealth((prev) => ({
      ...prev,
      opponent: newHealth,
    }));

    setBattleLog((prev) => [
      ...prev,
      `${selectedPokemon.name} usou ${move.name}!`,
      `Causou ${damage} de dano!`,
    ]);

    if (newHealth <= 0) {
      handleBattleEnd("victory");
    } else {
      setCurrentTurn("opponent");
      setTimeout(() => {
        performOpponentAttack();
      }, 1500);
    }
  };

  const handleMoveSelect = async (move) => {
    if (!selectedPokemon || !opponent || currentTurn !== "player") return;

    // Ensure move is defined
    if (!move || !move.name) {
      console.error("Move is undefined", move);
      return;
    }

    const playerDamage = calculateDamage(move, selectedPokemon, opponent);

    const newHealth = Math.max(0, pokemonHealth.opponent - playerDamage);
    setPokemonHealth((prev) => ({
      ...prev,
      opponent: newHealth,
    }));

    setBattleLog((prev) => [
      ...prev,
      `${selectedPokemon.name} usou ${move.name}!`,
      `Causou ${playerDamage} de dano!`,
    ]);

    if (newHealth <= 0) {
      handleBattleEnd("victory");
    } else {
      setCurrentTurn("opponent");
      setTimeout(() => {
        performOpponentAttack();
      }, 1500);
    }
  };

  const useHealingItem = (item) => {
    if (!selectedPokemon || currentTurn !== "player") return;

    // Verificar se o item é válido
    if (!item || !item.effect) {
      console.error("Item inválido", item);
      return;
    }

    let newHealth = pokemonHealth.player;
    const effectText = [];

    if (item.effect.type === "heal") {
      const healAmount = item.effect.value;
      newHealth = Math.min(100, newHealth + healAmount);
      effectText.push(
        `${selectedPokemon.name} recuperou ${healAmount}% de HP!`
      );
    } else if (item.effect.type === "revive" && pokemonHealth.player <= 0) {
      newHealth = item.effect.value;
      effectText.push(
        `${selectedPokemon.name} foi revivido com ${item.effect.value}% de HP!`
      );
    } else {
      alert("Este item não pode ser usado agora.");
      return;
    }

    setPokemonHealth((prev) => ({
      ...prev,
      player: newHealth,
    }));

    setBattleLog((prev) => [...prev, `Você usou ${item.name}!`, ...effectText]);

    // Atualizar inventário de itens
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((i) => i.id === item.id);

    if (itemIndex >= 0) {
      updatedItems[itemIndex].quantity--;

      if (updatedItems[itemIndex].quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      }

      setItems(updatedItems);
      localStorage.setItem("items", JSON.stringify(updatedItems));
    }

    setShowItemsMenu(false);

    // O oponente ataca após o jogador usar um item
    setTimeout(() => {
      performOpponentAttack();
    }, 1500);
  };

  const performOpponentAttack = () => {
    if (!opponent || !selectedPokemon) return;

    const opponentMoves = opponent.moves.filter((m) => m.power);
    const selectedMove =
      opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

    const damage = calculateDamage(selectedMove, opponent, selectedPokemon);

    const newHealth = Math.max(0, pokemonHealth.player - damage);
    setPokemonHealth((prev) => ({
      ...prev,
      player: newHealth,
    }));

    setBattleLog((prev) => [
      ...prev,
      `${opponent.name} usou ${selectedMove.name}!`,
      `Causou ${damage} de dano!`,
    ]);

    if (newHealth <= 0) {
      handleBattleEnd("defeat");
    } else {
      setCurrentTurn("player");
    }
  };

  const calculateDamage = (move, attacker, defender) => {
    if (!move.power) return 5;

    let damage = move.power;

    if (attacker.types.includes(move.type)) {
      damage *= 1.5;
    }

    let effectiveness = 1;
    for (const type of defender.types) {
      effectiveness *= getTypeEffectiveness(move.type, type);
    }
    damage *= effectiveness;

    damage *= 0.85 + Math.random() * 0.3;

    return Math.floor(damage);
  };

  const runFromBattle = () => {
    const escapeChance = 0.7;

    if (Math.random() < escapeChance) {
      setBattleLog((prev) => [...prev, "Você conseguiu fugir!"]);
      setTimeout(() => {
        setBattleState("selecting");
        setSelectedPokemon(null);
        setOpponent(null);
      }, 1500);
    } else {
      setBattleLog((prev) => [...prev, "Não conseguiu fugir!"]);
      setCurrentTurn("opponent");
      setTimeout(() => {
        performOpponentAttack();
      }, 1500);
    }
  };

  const getTypeEffectiveness = (attackType, defenseType) => {
    const effectivenessChart = {
      water: { fire: 2, ground: 2, rock: 2 },
      fire: { grass: 2, ice: 2, bug: 2, steel: 2 },
      grass: { water: 2, ground: 2, rock: 2 },
      electric: { water: 2, flying: 2 },
    };

    return effectivenessChart[attackType]?.[defenseType] || 1;
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-xl my-6 battle-arena relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64">
          <svg
            viewBox="0 0 200 200"
            fill="currentColor"
            className="text-red-500"
          >
            <path
              d="M55.5,237.2c-23.5-38.7-32.3-82.9-24.9-127.8C38.1,64.4,71.9,26.7,114.2,6.5C154.4-12.6,205-7,244.9,11.7
                   c41.1,19.1,71,58.2,83.2,102.3c13.3,47.9,4.8,100-25.6,138.2c-27.6,34.8-68,44.4-110.6,48.6C157,304.4,123.8,299,95.5,282
                   C80.2,273.1,65.7,256.1,55.5,237.2z"
            ></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 transform rotate-180">
          <svg
            viewBox="0 0 200 200"
            fill="currentColor"
            className="text-blue-500"
          >
            <path
              d="M55.5,237.2c-23.5-38.7-32.3-82.9-24.9-127.8C38.1,64.4,71.9,26.7,114.2,6.5C154.4-12.6,205-7,244.9,11.7
                   c41.1,19.1,71,58.2,83.2,102.3c13.3,47.9,4.8,100-25.6,138.2c-27.6,34.8-68,44.4-110.6,48.6C157,304.4,123.8,299,95.5,282
                   C80.2,273.1,65.7,256.1,55.5,237.2z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCrosshairs className="text-red-500" />
          Arena de Batalha
        </h2>
        <button
          onClick={startNewBattle}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md flex items-center gap-2 transition-all"
        >
          <FaFire className="animate-pulse-soft" /> Nova Batalha
        </button>
      </div>

      {/* Initial state - No Pokémon or location selected */}
      {!selectedPokemon && !selectedLocation && battleState !== "finished" && (
        <div className="text-center py-8 md:py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">
            Preparar para Batalhar
          </h3>
          <p className="text-gray-600 mb-4 md:mb-6 max-w-md mx-auto px-4 text-sm md:text-base">
            Escolha um local de batalha e um Pokémon do seu inventário para
            começar uma batalha emocionante!
          </p>
          <div className="flex flex-wrap justify-center gap-3 px-4">
            <button
              onClick={() => setShowLocationSelector(true)}
              className="w-full sm:w-auto px-4 py-2.5 md:px-5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <FaLocationArrow className="animate-pulse-soft" /> Escolher Local
            </button>
            <button
              onClick={() => setShowSelector(true)}
              className="w-full sm:w-auto px-4 py-2.5 md:px-5 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <FaMapMarkedAlt /> Escolher Pokémon
            </button>
          </div>
        </div>
      )}

      {/* Battle setup state - Displaying selected location and/or Pokémon */}
      {(selectedLocation || selectedPokemon) &&
        battleState !== "battling" &&
        battleState !== "finished" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 rounded-xl overflow-hidden">
            <div
              className={`bg-white rounded-xl shadow-md transition-all ${
                selectedLocation
                  ? "border-2 border-green-500"
                  : "border border-gray-200"
              }`}
            >
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
                  <FaLocationArrow className="text-green-500" /> Local de
                  Batalha
                </h3>
                {selectedLocation && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Selecionado
                  </span>
                )}
              </div>

              <div className="p-4">
                {selectedLocation ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={selectedLocation.image}
                        alt={selectedLocation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {selectedLocation.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {selectedLocation.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Nível {selectedLocation.minLevel}-
                          {selectedLocation.maxLevel}
                        </span>
                        {selectedLocation.legendaryChance > 0 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center">
                            <FaTrophy className="mr-1" />{" "}
                            {Math.round(selectedLocation.legendaryChance * 100)}
                            % chance de lendário
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLocationSelector(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaLocationArrow /> Escolher local
                  </button>
                )}
              </div>
            </div>

            <div
              className={`bg-white rounded-xl shadow-md transition-all ${
                selectedPokemon
                  ? "border-2 border-blue-500"
                  : "border border-gray-200"
              }`}
            >
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
                  <FaMapMarkedAlt className="text-blue-500" /> Pokémon para
                  Batalha
                </h3>
                {selectedPokemon && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Selecionado
                  </span>
                )}
              </div>

              <div className="p-4">
                {selectedPokemon ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={selectedPokemon.image}
                        alt={selectedPokemon.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg capitalize">
                        {selectedPokemon.name}
                      </p>
                      <div className="flex gap-1 mb-2">
                        {selectedPokemon.types.map((type, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded bg-${type}-100 text-${type}-800`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Nível {calculateLevel(selectedPokemon.exp || 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSelector(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaMapMarkedAlt /> Escolher Pokémon
                  </button>
                )}
              </div>
            </div>

            {selectedLocation && selectedPokemon && (
              <div className="col-span-1 md:col-span-2 flex justify-center">
                <button
                  onClick={() => setBattleState("battling")}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <FaFire className="animate-pulse-soft" /> Iniciar Batalha
                </button>
              </div>
            )}
          </div>
        )}

      {/* Active battle UI */}
      {selectedPokemon?.name && battleState === "battling" && (
        <div className="flex flex-col gap-6 relative animate-fade-up">
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-4 py-3 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <FaLocationArrow className="text-blue-200" />
                </div>
                <span className="font-medium">{selectedLocation.name}</span>
              </div>
              <span className="text-sm bg-black/20 px-3 py-1 rounded-full">
                Nível {selectedLocation.minLevel}-{selectedLocation.maxLevel}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-md">
            {!opponent ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
                    <div
                      className="w-16 h-16 border-4 border-red-500 border-dashed rounded-full animate-spin absolute inset-0"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Procurando um oponente...
                  </p>
                  <p className="text-sm text-gray-500">
                    Prepare-se para a batalha!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Player's Pokémon Section */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full mb-3">
                    <div className="absolute left-0 top-0 bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700 capitalize">
                      {selectedPokemon.name}
                    </div>
                    <div className="absolute right-0 top-0 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-700">
                      Nível {calculateLevel(selectedPokemon.exp || 0)}
                    </div>
                  </div>

                  <div className="w-40 h-40 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-100/50 rounded-full"></div>
                    <img
                      src={selectedPokemon.image}
                      alt={selectedPokemon.name}
                      className={`w-36 h-36 object-contain ${
                        currentTurn === "player" ? "animate-float" : ""
                      } z-10`}
                    />
                  </div>

                  <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">HP</span>
                      <span
                        className={
                          pokemonHealth.player < 30
                            ? "text-red-600 font-bold"
                            : ""
                        }
                      >
                        {pokemonHealth.player}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          pokemonHealth.player > 50
                            ? "bg-green-500"
                            : pokemonHealth.player > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${pokemonHealth.player}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-center gap-2 mt-3">
                      {selectedPokemon.types?.map((type, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full bg-${type}-100 text-${type}-800`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Battle Controls */}
                    <div className="mt-3">
                      {currentTurn === "player" ? (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {selectedPokemon.moves &&
                            selectedPokemon.moves.map((move, index) => (
                              <button
                                key={index}
                                onClick={() => handleMoveSelect(move)}
                                className={`p-3 rounded-lg text-white text-sm transition-transform hover:scale-105 shadow-md ${getTypeColorClass(
                                  move.type
                                )}`}
                                disabled={currentTurn !== "player"}
                              >
                                <span className="block font-medium capitalize text-shadow">
                                  {move.name.replace("-", " ")}
                                </span>
                                <div className="flex justify-between items-center text-xs mt-1">
                                  <span className="bg-white/30 px-1.5 rounded text-shadow">
                                    {move.power
                                      ? `Poder: ${move.power}`
                                      : "Status"}
                                  </span>
                                  <span className="capitalize">
                                    {move.type}
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-center animate-pulse mt-3">
                          <span className="font-medium text-gray-700">
                            Aguardando jogada do oponente...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <button
                        onClick={() => setShowItemsMenu(true)}
                        className={`py-2.5 px-4 flex items-center justify-center gap-2 rounded-lg transition-colors ${
                          items.filter((i) => i.category === "healing")
                            .length === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                        disabled={
                          currentTurn !== "player" ||
                          items.filter((i) => i.category === "healing")
                            .length === 0
                        }
                      >
                        <FaFlask /> Usar Item
                      </button>

                      <button
                        onClick={runFromBattle}
                        className="py-2.5 px-4 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <FaRunning /> Fugir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Opponent's Pokémon Section */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full mb-3">
                    <div className="absolute left-0 top-0 bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700 capitalize">
                      {opponent.name}
                    </div>
                    <div className="absolute right-0 top-0 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-700">
                      Nível {opponent.level}
                    </div>
                  </div>

                  <div className="w-40 h-40 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-red-100/50 rounded-full"></div>
                    <img
                      src={opponent.image}
                      alt={opponent.name}
                      className={`w-36 h-36 object-contain ${
                        currentTurn === "opponent" ? "animate-bounce-slow" : ""
                      } z-10`}
                    />
                    {opponent.isLegendary && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <FaTrophy /> LENDÁRIO
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">HP</span>
                      <span
                        className={
                          pokemonHealth.opponent < 30
                            ? "text-red-600 font-bold"
                            : ""
                        }
                      >
                        {pokemonHealth.opponent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          pokemonHealth.opponent > 50
                            ? "bg-green-500"
                            : pokemonHealth.opponent > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${pokemonHealth.opponent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-center gap-2 mt-3">
                      {opponent.types?.map((type, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full bg-${type}-100 text-${type}-800`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Opponent Stats Card */}
                    <div className="mt-5 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <FaShieldAlt className="text-gray-500" /> Dados do
                        Oponente
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {opponent.stats?.slice(0, 4).map((stat, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="capitalize text-gray-500">
                              {stat.name.replace("-", " ")}:
                            </span>
                            <span className="font-medium">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Battle Log */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Registro de Batalha
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    currentTurn === "player"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Turno: {currentTurn === "player" ? "Seu turno" : "Oponente"}
                </span>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {battleLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    A batalha começará em breve...
                  </p>
                ) : (
                  <div className="space-y-1">
                    {battleLog.map((log, index) => (
                      <p
                        key={index}
                        className={`text-sm px-2 py-1 rounded ${
                          log.includes("causou") || log.includes("Causou")
                            ? "text-red-700 bg-red-50"
                            : log.includes("fugiu") || log.includes("errou")
                            ? "text-amber-700 bg-amber-50"
                            : log.includes("usou")
                            ? "text-blue-700 bg-blue-50"
                            : "text-gray-700"
                        }`}
                      >
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Results UI */}
      {battleState === "finished" &&
        battleSummary &&
        selectedPokemon &&
        opponent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 animate-fade-up shadow-xl border border-gray-200">
              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    battleSummary.result === "victory"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {battleSummary.result === "victory" ? (
                    <FaTrophy className="text-4xl text-yellow-500" />
                  ) : (
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>

                <h3
                  className={`text-2xl font-bold mb-1 ${
                    battleSummary.result === "victory"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {battleSummary.result === "victory" ? "Vitória!" : "Derrota"}
                </h3>
                <p className="text-gray-600 mb-3">
                  Batalha em {battleSummary.location}
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={battleSummary.playerPokemon.image}
                        alt={battleSummary.playerPokemon.name}
                        className="w-20 h-20 object-contain"
                      />
                      {battleSummary.result === "victory" && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-medium capitalize mt-1">
                      {battleSummary.playerPokemon.name}
                    </p>
                    <div className="text-xs text-gray-500">Seu Pokémon</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="font-bold text-2xl text-gray-300">
                        VS
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={battleSummary.opponentPokemon.image}
                        alt={battleSummary.opponentPokemon.name}
                        className="w-20 h-20 object-contain"
                      />
                      {battleSummary.result === "defeat" && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-medium capitalize mt-1">
                      {battleSummary.opponentPokemon.name}
                    </p>
                    <div className="text-xs text-gray-500">
                      Nível {battleSummary.opponentPokemon.level}
                    </div>
                  </div>
                </div>

                {battleSummary.playerPokemon.newLevel >
                  battleSummary.playerPokemon.previousLevel && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center text-green-800 animate-pulse-soft mt-3">
                    <div className="font-bold">Pokémon subiu de nível!</div>
                    <div className="flex justify-center items-center gap-2 mt-1 text-sm">
                      <span>
                        Nível {battleSummary.playerPokemon.previousLevel}
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-bold">
                        Nível {battleSummary.playerPokemon.newLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <div className="flex flex-col items-center">
                    <FaArrowUp className="text-blue-500 text-xl mb-1" />
                    <span className="block text-2xl font-bold text-blue-700">
                      {battleSummary.exp}
                    </span>
                    <span className="text-xs text-blue-600">
                      Experiência ganha
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-100">
                  <div className="flex flex-col items-center">
                    <FaCoins className="text-yellow-500 text-xl mb-1" />
                    <span className="block text-2xl font-bold text-yellow-700">
                      {battleSummary.reward}
                    </span>
                    <span className="text-xs text-yellow-600">
                      Moedas ganhas
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpponent(null);
                  setBattleSummary(null);
                  setBattleState("selecting");
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
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
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
                Continuar
              </button>
            </div>
          </div>
        )}

      {showSelector && (
        <PokemonSelector
          inventory={inventory}
          onSelect={handleSelectPokemon}
          onClose={() => setShowSelector(false)}
          modalTitle="Escolha um Pokémon para batalha"
        />
      )}

      {showLocationSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto mx-4 animate-fade-up shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaLocationArrow className="text-green-500" />
                Escolha um Local de Batalha
              </h3>
              <button
                onClick={() => setShowLocationSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {availableLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="bg-white border border-gray-300 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs py-1 px-2 rounded-lg shadow-md">
                      Nível {location.minLevel}-{location.maxLevel}
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-800">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {location.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {location.typeBias &&
                        location.typeBias.map((type) => (
                          <span
                            key={type}
                            className={`text-xs font-medium px-2 py-1 rounded-full bg-${type}-100 text-${type}-800`}
                          >
                            {type}
                          </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        Recompensas x{location.rewardMultiplier}
                      </div>

                      {location.legendaryChance > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaTrophy />{" "}
                          {Math.round(location.legendaryChance * 100)}% lendário
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lockedLocations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Locais Bloqueados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden opacity-75"
                    >
                      <div className="h-28 relative overflow-hidden">
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-full h-full object-cover filter grayscale opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/20 flex items-center justify-center">
                          <div className="bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Desbloqueado no Nível {location.unlockLevel}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-gray-600">
                          {location.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Itens */}
      {showItemsMenu && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-up">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaFlask className="text-green-500" />
                Usar Item
              </h3>
              <button
                onClick={() => setShowItemsMenu(false)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
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

            <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              Selecione um item para usar em {selectedPokemon?.name}:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-[300px] overflow-y-auto">
              {items
                .filter((item) => item.category === "healing")
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => useHealingItem(item)}
                    className="p-3 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-3 text-left"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-green-600">
                          +{item.effect.value}% HP
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {items.filter((item) => item.category === "healing").length ===
              0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <p className="font-medium mb-1">
                  Nenhum item de cura disponível
                </p>
                <p className="text-sm">
                  Visite a loja para comprar itens de cura.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setShowItemsMenu(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this to your existing CSS file */}
      <style jsx>{`
        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default Battle;
