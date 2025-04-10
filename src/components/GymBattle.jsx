import React, { useState, useEffect } from "react";
import PokemonSelector from "./PokemonSelector";
import {
  FaCoins,
  FaArrowUp,
  FaMedal,
  FaExchangeAlt,
  FaTrophy,
  FaShieldAlt,
  FaRunning,
  FaFlask,
  FaBolt,
  FaUser,
} from "react-icons/fa";

function GymBattle({
  gym,
  inventory,
  items = [],
  setItems,
  onClose,
  onBattleEnd,
}) {
  const [step, setStep] = useState("teamSelect"); // teamSelect, battle, result
  const [playerTeam, setPlayerTeam] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [pokemonHealth, setPokemonHealth] = useState({
    player: {},
    opponent: 100,
  });
  const [currentTurn, setCurrentTurn] = useState("player");
  const [result, setResult] = useState({ victory: false, pokemonUsed: [] });
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [maxTeamSize] = useState(Math.min(6, gym.pokemon.length + 1));
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [showItemsMenu, setShowItemsMenu] = useState(false);

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

  useEffect(() => {
    if (step === "battle" && gym.pokemon[opponentIndex]) {
      loadOpponent(gym.pokemon[opponentIndex]);
    }
  }, [step, opponentIndex, gym]);

  useEffect(() => {
    if (playerTeam.length > 0 && !currentPokemon) {
      const firstPokemon = playerTeam[0];
      setCurrentPokemon(firstPokemon);

      const initialHealth = {};
      playerTeam.forEach((pokemon) => {
        initialHealth[pokemon.id] = 100;
      });

      setPokemonHealth((prev) => ({
        ...prev,
        player: initialHealth,
      }));
    }
  }, [playerTeam]);

  useEffect(() => {
    if (step === "teamSelect" && playerTeam.length > 0) {
      const initialHealth = {};
      playerTeam.forEach((pokemon) => {
        initialHealth[pokemon.id] = 100;
      });

      setPokemonHealth((prev) => ({
        ...prev,
        player: initialHealth,
        opponent: 100,
      }));
    }
  }, [step, playerTeam]);

  useEffect(() => {
    // When currentPokemon changes, update the battle log and reset turn to player
    if (currentPokemon && step === "battle" && currentTurn !== "player") {
      setTimeout(() => {
        setCurrentTurn("player");
      }, 1000);
    }
  }, [currentPokemon, step]);

  const loadOpponent = async (opponentInfo) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${opponentInfo.id}`
      );
      const data = await response.json();

      const randomMoves = data.moves
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      const moves = await Promise.all(
        randomMoves.map(async (move) => {
          const moveResponse = await fetch(move.move.url);
          const moveData = await moveResponse.json();
          return {
            name: moveData.name,
            type: moveData.type.name,
            power: moveData.power || 50,
            accuracy: moveData.accuracy || 100,
          };
        })
      );

      const levelMultiplier = opponentInfo.level / 5;

      const stats = data.stats.map((s) => ({
        name: s.stat.name,
        value: Math.floor(s.base_stat * (1 + levelMultiplier * 0.15)),
      }));

      const opponent = {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        stats: stats,
        types: data.types.map((t) => t.type.name),
        moves: moves,
        level: opponentInfo.level,
      };

      setCurrentOpponent(opponent);
      setPokemonHealth((prev) => ({
        ...prev,
        opponent: 100,
      }));
      setBattleLog([
        `${gym.leader} envia ${opponent.name} (Nível ${opponent.level})!`,
        `Vá ${currentPokemon.name}!`,
      ]);
    } catch (error) {
      console.error("Error loading opponent:", error);
      setBattleLog(["Erro ao carregar oponente. Tente novamente."]);
    }
  };

  const addToTeam = (pokemon) => {
    if (playerTeam.length >= maxTeamSize) {
      alert(`Você só pode ter até ${maxTeamSize} Pokémon no seu time!`);
      return;
    }

    if (
      playerTeam.some(
        (p) =>
          p.id === pokemon.id &&
          JSON.stringify(p.moves) === JSON.stringify(pokemon.moves)
      )
    ) {
      alert("Este Pokémon já está no seu time!");
      return;
    }

    setPlayerTeam([...playerTeam, pokemon]);
  };

  const removeFromTeam = (index) => {
    const newTeam = [...playerTeam];
    newTeam.splice(index, 1);
    setPlayerTeam(newTeam);

    if (currentPokemon && currentPokemon === playerTeam[index]) {
      if (newTeam.length > 0) {
        setCurrentPokemon(newTeam[0]);
      } else {
        setCurrentPokemon(null);
      }
    }
  };

  const switchPokemon = (pokemon) => {
    if (pokemonHealth.player[pokemon.id] <= 0) {
      alert("Este Pokémon foi derrotado!");
      return;
    }

    if (pokemonHealth.player[pokemon.id] === undefined) {
      setPokemonHealth((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          [pokemon.id]: 100,
        },
      }));
    }

    const previousPokemonName = currentPokemon ? currentPokemon.name : "";

    setCurrentPokemon(pokemon);
    setShowSwitchDialog(false);

    if (step === "battle" && previousPokemonName) {
      setBattleLog((prev) => [
        ...prev,
        `${previousPokemonName} retorna! ${pokemon.name}, eu escolho você!`,
      ]);

      if (currentTurn === "player") {
        performOpponentTurn();
      }
    }
  };

  const areAllPlayerPokemonDefeated = () => {
    return playerTeam.every((pokemon) => {
      const health = pokemonHealth.player[pokemon.id];
      return health !== undefined && health <= 0;
    });
  };

  const calculateTypeEffectiveness = (moveType, defenderType) => {
    const effectivenessChart = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 2,
        bug: 2,
        rock: 0.5,
        dragon: 0.5,
        steel: 2,
      },
      water: {
        fire: 2,
        water: 0.5,
        grass: 0.5,
        ground: 2,
        rock: 2,
        dragon: 0.5,
      },
      electric: {
        water: 2,
        electric: 0.5,
        grass: 0.5,
        ground: 0,
        flying: 2,
        dragon: 0.5,
      },
      grass: {
        fire: 0.5,
        water: 2,
        grass: 0.5,
        poison: 0.5,
        ground: 2,
        flying: 0.5,
        bug: 0.5,
        rock: 2,
        dragon: 0.5,
        steel: 0.5,
      },
      ice: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 0.5,
        ground: 2,
        flying: 2,
        dragon: 2,
        steel: 0.5,
      },
      fighting: {
        normal: 2,
        ice: 2,
        poison: 0.5,
        flying: 0.5,
        psychic: 0.5,
        bug: 0.5,
        rock: 2,
        ghost: 0,
        dark: 2,
        steel: 2,
        fairy: 0.5,
      },
      poison: {
        grass: 2,
        poison: 0.5,
        ground: 0.5,
        rock: 0.5,
        ghost: 0.5,
        steel: 0,
        fairy: 2,
      },
      ground: {
        fire: 2,
        electric: 2,
        grass: 0.5,
        poison: 2,
        flying: 0,
        bug: 0.5,
        rock: 2,
        steel: 2,
      },
      flying: {
        electric: 0.5,
        grass: 2,
        fighting: 2,
        bug: 2,
        rock: 0.5,
        steel: 0.5,
      },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: {
        fire: 0.5,
        grass: 2,
        fighting: 0.5,
        poison: 0.5,
        flying: 0.5,
        psychic: 2,
        ghost: 0.5,
        dark: 2,
        steel: 0.5,
        fairy: 0.5,
      },
      rock: {
        fire: 2,
        ice: 2,
        fighting: 0.5,
        ground: 0.5,
        flying: 2,
        bug: 2,
        steel: 0.5,
      },
      ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0 },
      dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: {
        fire: 0.5,
        water: 0.5,
        electric: 0.5,
        ice: 2,
        rock: 2,
        steel: 0.5,
        fairy: 2,
      },
      fairy: {
        fire: 0.5,
        fighting: 2,
        poison: 0.5,
        dragon: 2,
        dark: 2,
        steel: 0.5,
      },
    };

    return effectivenessChart[moveType]?.[defenderType] || 1;
  };

  const calculateDamage = (move, attacker, defender) => {
    if (!move.power) return 10;

    let damage = move.power;
    const attackerLevel = attacker.level || calculateLevel(attacker.exp || 0);

    if (attacker.types.includes(move.type)) {
      damage *= 1.5;
    }

    let effectiveness = 1;
    defender.types.forEach((defenderType) => {
      effectiveness *= calculateTypeEffectiveness(move.type, defenderType);
    });

    const attackStat =
      attacker.stats.find((s) => s.name === "attack")?.value || 50;
    const defenseStat =
      defender.stats.find((s) => s.name === "defense")?.value || 50;

    damage =
      ((((2 * attackerLevel) / 5 + 2) * damage * (attackStat / defenseStat)) /
        50 +
        2) *
      effectiveness;

    damage *= Math.random() * 0.2 + 0.9;

    return Math.round(damage);
  };

  const executeMove = (move, attacker, defender, isPlayer) => {
    const accuracy = move.accuracy || 100;
    if (Math.random() * 100 > accuracy) {
      setBattleLog((prev) => [...prev, `${attacker.name} errou o ataque!`]);
      return 0;
    }

    const damage = calculateDamage(move, attacker, defender);
    const healthKey = isPlayer ? "opponent" : "player";
    const effectiveness = calculateTypeEffectiveness(
      move.type,
      defender.types[0]
    );

    if (isPlayer) {
      setPokemonHealth((prev) => {
        const newHealth = Math.max(0, prev[healthKey] - damage);
        return {
          ...prev,
          [healthKey]: newHealth,
        };
      });
    } else {
      setPokemonHealth((prev) => {
        const currentHealth = prev.player[currentPokemon.id] ?? 100;
        const newHealth = Math.max(0, currentHealth - damage);
        return {
          ...prev,
          player: {
            ...prev.player,
            [currentPokemon.id]: newHealth,
          },
        };
      });
    }

    let effectivenessMessage = "";
    if (effectiveness > 1.5) {
      effectivenessMessage = "É super efetivo!";
    } else if (effectiveness < 0.5) {
      effectivenessMessage = "Não é muito efetivo...";
    } else if (effectiveness === 0) {
      effectivenessMessage = "Não teve efeito!";
    }

    setBattleLog((prev) =>
      [
        ...prev,
        `${attacker.name} usou ${move.name}!`,
        effectivenessMessage,
        `Causou ${damage} de dano!`,
      ].filter(Boolean)
    );

    return damage;
  };

  const performOpponentTurn = async () => {
    if (!currentOpponent || !currentPokemon) return;

    setCurrentTurn("opponent");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const opponentMoves = currentOpponent.moves.filter((m) => m.power);
    const opponentMove =
      opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

    if (!opponentMove) {
      setBattleLog((prev) => [
        ...prev,
        `${currentOpponent.name} falhou ao atacar!`,
      ]);
      setCurrentTurn("player");
      return;
    }

    const opponentDamage = executeMove(
      opponentMove,
      currentOpponent,
      currentPokemon,
      false
    );

    const newPlayerHealth = Math.max(
      0,
      pokemonHealth.player[currentPokemon.id] - opponentDamage
    );

    setPokemonHealth((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        [currentPokemon.id]: newPlayerHealth,
      },
    }));

    if (newPlayerHealth <= 0) {
      setBattleLog((prev) => [
        ...prev,
        `${currentPokemon.name} foi derrotado!`,
      ]);

      if (areAllPlayerPokemonDefeated()) {
        setBattleLog((prev) => [
          ...prev,
          `${gym.leader}: "Você precisa treinar mais!"`,
        ]);

        setTimeout(() => {
          setResult({
            victory: false,
            pokemonUsed: playerTeam,
          });
          setStep("result");
        }, 2000);
        return;
      } else {
        setShowSwitchDialog(true);
        return;
      }
    }

    setCurrentTurn("player");
  };

  const handleMoveSelect = async (move) => {
    if (!currentPokemon || !currentOpponent || currentTurn !== "player") return;

    const playerDamage = executeMove(
      move,
      currentPokemon,
      currentOpponent,
      true
    );

    const newOpponentHealth = Math.max(
      0,
      pokemonHealth.opponent - playerDamage
    );

    setPokemonHealth((prev) => ({
      ...prev,
      opponent: newOpponentHealth,
    }));

    if (newOpponentHealth <= 0) {
      setBattleLog((prev) => [
        ...prev,
        `${currentOpponent.name} foi derrotado!`,
      ]);

      if (opponentIndex < gym.pokemon.length - 1) {
        setTimeout(() => {
          setOpponentIndex((prevIndex) => prevIndex + 1);
          setPokemonHealth((prev) => ({ ...prev, opponent: 100 }));
        }, 2000);
      } else {
        setBattleLog((prev) => [
          ...prev,
          `Você derrotou o líder ${gym.leader}!`,
          `Você ganhou o ${gym.badge}!`,
          `Recompensa: ${gym.rewards.coins} moedas, ${gym.rewards.exp} EXP`,
        ]);

        setTimeout(() => {
          setResult({
            victory: true,
            pokemonUsed: playerTeam,
          });
          setStep("result");
        }, 3000);
      }
      return;
    }

    performOpponentTurn();
  };

  const isTeamReady = () => {
    return playerTeam.length > 0;
  };

  const useHealingItem = (item) => {
    if (!currentPokemon || currentTurn !== "player") return;

    const healingItems =
      items && items.filter
        ? items.filter(
            (i) =>
              i.category === "healing" &&
              (i.effect.type === "heal" ||
                (i.effect.type === "revive" &&
                  pokemonHealth.player[currentPokemon.id] <= 0))
          )
        : [];

    if (healingItems.length === 0) {
      alert("Você não possui itens de cura!");
      return;
    }

    const selectedItem = items.find((i) => i.id === item.id);
    if (!selectedItem) return;

    let newHealth = pokemonHealth.player[currentPokemon.id] || 0;
    const effectText = [];

    if (selectedItem.effect.type === "heal") {
      const healAmount = selectedItem.effect.value;
      newHealth = Math.min(100, newHealth + healAmount);
      effectText.push(`${currentPokemon.name} recuperou ${healAmount}% de HP!`);
    } else if (selectedItem.effect.type === "revive") {
      if (pokemonHealth.player[currentPokemon.id] > 0) {
        alert("Este Pokémon não está desmaiado!");
        return;
      }

      newHealth = selectedItem.effect.value;
      effectText.push(
        `${currentPokemon.name} foi revivido com ${selectedItem.effect.value}% de HP!`
      );
    }

    setPokemonHealth((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        [currentPokemon.id]: newHealth,
      },
    }));

    setBattleLog((prev) => [
      ...prev,
      `Você usou ${selectedItem.name}!`,
      ...effectText,
    ]);

    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((i) => i.id === selectedItem.id);

    if (itemIndex >= 0) {
      updatedItems[itemIndex].quantity--;

      if (updatedItems[itemIndex].quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      }

      setItems(updatedItems);
      localStorage.setItem("items", JSON.stringify(updatedItems));
    }

    setShowItemsMenu(false);

    performOpponentTurn();
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl max-w-5xl w-[95%] h-[95vh] overflow-auto animate-fade-up shadow-2xl border border-gray-200">
        {step === "teamSelect" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                  <FaUser className="text-blue-500" />
                  Monte sua equipe para o Ginásio
                </h3>
                <p className="text-gray-600">
                  Escolha até {maxTeamSize} Pokémon para enfrentar o Líder{" "}
                  <span className="font-semibold text-indigo-600">
                    {gym.leader}
                  </span>
                  .
                </p>
              </div>
              <div className="bg-indigo-100 p-2 px-3 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-indigo-700">
                  Ginásio: {gym.name}
                </span>
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span className="bg-blue-500 p-1.5 rounded-full text-white">
                  <FaShieldAlt />
                </span>
                Seu Time ({playerTeam.length}/{maxTeamSize})
              </h4>
              {playerTeam.length === 0 ? (
                <div className="bg-white/70 p-6 rounded-lg text-center text-gray-500 border border-gray-200">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-1">
                    Nenhum Pokémon selecionado
                  </p>
                  <p className="text-sm text-gray-500">
                    Escolha Pokémon para formar sua equipe
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {playerTeam.map((pokemon, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 relative shadow-md hover:shadow-lg transition-all"
                    >
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm shadow-md hover:bg-red-600 transition-colors"
                        onClick={() => removeFromTeam(index)}
                      >
                        ×
                      </button>
                      <div className="bg-gray-50 rounded-lg mb-2 p-1">
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          className="w-full h-20 object-contain"
                        />
                      </div>
                      <p className="text-center capitalize truncate font-medium">
                        {pokemon.name}
                      </p>
                      <p className="text-center text-xs text-blue-600 font-medium bg-blue-50 rounded-full mt-1 py-0.5">
                        Nv. {calculateLevel(pokemon.exp || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowTeamSelector(true)}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors flex items-center gap-2 mx-auto"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Adicionar Pokémon
              </button>
            </div>

            <div className="border-t pt-4 mt-6 flex justify-between">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
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
                Cancelar
              </button>

              <button
                onClick={() => setStep("battle")}
                disabled={!isTeamReady()}
                className={`px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-colors ${
                  isTeamReady()
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }`}
              >
                <FaBolt className={isTeamReady() ? "animate-pulse" : ""} />
                Iniciar Batalha
              </button>
            </div>
          </div>
        )}

        {step === "battle" && currentPokemon && currentOpponent && (
          <div className="animate-fade-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{gym.name}</h3>
                    <p className="text-sm text-blue-100">Líder: {gym.leader}</p>
                  </div>
                </div>
                <div className="bg-indigo-800/50 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner">
                  <FaTrophy className="text-yellow-300" />
                  <span className="font-medium">
                    Pokémon {opponentIndex + 1}/{gym.pokemon.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player's Pokémon Section */}
                  <div className="bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-md">
                    <div className="relative w-full mb-3">
                      <div className="absolute left-0 top-0 bg-blue-100 px-2.5 py-1 rounded-md text-xs font-medium text-blue-800 capitalize flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {currentPokemon.name}
                      </div>
                      <div className="absolute right-0 top-0 bg-blue-600 px-2.5 py-1 rounded-md text-xs font-medium text-white">
                        Nível {calculateLevel(currentPokemon.exp || 0)}
                      </div>
                    </div>

                    <div className="w-40 h-40 mx-auto flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-blue-100/50 rounded-full"></div>
                      <img
                        src={currentPokemon.image}
                        alt={currentPokemon.name}
                        className={`w-36 h-36 object-contain ${
                          currentTurn === "player" ? "animate-float" : ""
                        } z-10`}
                      />
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          HP
                        </span>
                        <span
                          className={
                            pokemonHealth.player[currentPokemon.id] < 30
                              ? "text-red-600 font-bold"
                              : ""
                          }
                        >
                          {pokemonHealth.player[currentPokemon.id]}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pokemonHealth.player[currentPokemon.id] > 50
                              ? "bg-green-500"
                              : pokemonHealth.player[currentPokemon.id] > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${
                              pokemonHealth.player[currentPokemon.id]
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-center gap-2 mt-3">
                        {currentPokemon.types?.map((type, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2.5 py-1 rounded-full bg-${type}-100 text-${type}-800`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>

                      {/* Battle Controls */}
                      <div className="mt-4">
                        {currentTurn === "player" ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setShowSwitchDialog(true)}
                                className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              >
                                <FaExchangeAlt /> Trocar Pokémon
                              </button>

                              <button
                                onClick={() => setShowItemsMenu(true)}
                                className={`p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                                  items.filter((i) => i.category === "healing")
                                    .length === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                                disabled={
                                  items.filter((i) => i.category === "healing")
                                    .length === 0
                                }
                              >
                                <FaFlask /> Usar Item
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {currentPokemon.moves &&
                                currentPokemon.moves.map((move, index) => {
                                  const typeClass = getTypeColorClass(
                                    move.type
                                  );
                                  return (
                                    <button
                                      key={index}
                                      onClick={() => handleMoveSelect(move)}
                                      className={`p-3 rounded-lg text-white text-sm transition-transform hover:scale-105 shadow-md ${typeClass}`}
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
                                  );
                                })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 bg-gray-100 border border-gray-200 rounded-lg text-center animate-pulse mt-3">
                            <span className="font-medium text-gray-700">
                              Aguardando jogada do oponente...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Opponent's Pokémon Section */}
                  <div className="bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-md">
                    <div className="relative w-full mb-3">
                      <div className="absolute left-0 top-0 bg-red-100 px-2.5 py-1 rounded-md text-xs font-medium text-red-800 capitalize flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {currentOpponent.name}
                      </div>
                      <div className="absolute right-0 top-0 bg-red-600 px-2.5 py-1 rounded-md text-xs font-medium text-white">
                        Nível {currentOpponent.level}
                      </div>
                    </div>

                    <div className="w-40 h-40 mx-auto flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-red-100/50 rounded-full"></div>
                      <img
                        src={currentOpponent.image}
                        alt={currentOpponent.name}
                        className={`w-36 h-36 object-contain ${
                          currentTurn === "opponent"
                            ? "animate-bounce-slow"
                            : ""
                        } z-10`}
                      />
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          HP
                        </span>
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
                        {currentOpponent.types?.map((type, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2.5 py-1 rounded-full bg-${type}-100 text-${type}-800`}
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
                          {currentOpponent.stats
                            ?.slice(0, 4)
                            .map((stat, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="capitalize text-gray-500">
                                  {stat.name.replace("-", " ")}:
                                </span>
                                <span className="font-medium">
                                  {stat.value}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Battle Log */}
                <div className="bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-1.5">
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
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentTurn === "player"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Turno:{" "}
                      {currentTurn === "player" ? "Seu turno" : "Oponente"}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {battleLog.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        A batalha começará em breve...
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {battleLog.map((log, i) => (
                          <p
                            key={i}
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
          </div>
        )}

        {step === "result" && (
          <div className="p-6 animate-fade-up">
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  result.victory ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {result.victory ? (
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
                className={`text-3xl font-bold mb-2 ${
                  result.victory ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.victory ? "Vitória!" : "Derrota"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {result.victory
                  ? `Você derrotou o líder ${gym.leader} e conquistou o emblema do ginásio!`
                  : `Você foi derrotado pelo líder ${gym.leader}. Treine mais e tente novamente!`}
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-md">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="relative">
                      <img
                        src={
                          gym.leaderImage ||
                          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leader.png"
                        }
                        alt={gym.leader}
                        className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                      />
                      {!result.victory && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-white"
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
                    <p className="font-medium mt-2">Líder {gym.leader}</p>
                    <p className="text-xs text-gray-500">{gym.name}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {result.victory ? (
                        <svg
                          className="w-8 h-8 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 17l-5-5m0 0l5-5m-5 5h12"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-400 mt-1">
                      VS
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="relative">
                      <img
                        src={
                          playerTeam[0]?.image ||
                          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png"
                        }
                        alt="Your team"
                        className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                      />
                      {result.victory && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-white"
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
                    <p className="font-medium mt-2">Você</p>
                    <p className="text-xs text-gray-500">
                      {playerTeam.length} Pokémon
                    </p>
                  </div>
                </div>

                {result.victory && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                    <div className="font-bold text-blue-800 mb-1">
                      Conquista Desbloqueada!
                    </div>
                    <div className="text-sm text-blue-700">
                      Emblema {gym.badge} adicionado à sua coleção.
                    </div>
                  </div>
                )}
              </div>

              {result.victory && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100 shadow-sm">
                    <div className="flex flex-col items-center">
                      <FaArrowUp className="text-blue-500 text-xl mb-1" />
                      <span className="block text-2xl font-bold text-blue-700">
                        {gym.rewards.exp}
                      </span>
                      <span className="text-xs text-blue-600">
                        Experiência ganha
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-100 shadow-sm">
                    <div className="flex flex-col items-center">
                      <FaCoins className="text-yellow-500 text-xl mb-1" />
                      <span className="block text-2xl font-bold text-yellow-700">
                        {gym.rewards.coins}
                      </span>
                      <span className="text-xs text-yellow-600">
                        Moedas ganhas
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100 shadow-sm">
                    <div className="flex flex-col items-center">
                      <FaMedal className="text-purple-500 text-xl mb-1" />
                      <span className="block text-2xl font-bold text-purple-700">
                        1
                      </span>
                      <span className="text-xs text-purple-600">
                        Emblema ganho
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onBattleEnd(result)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
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
                {result.victory ? "Receber Recompensas" : "Voltar ao Ginásio"}
              </button>
            </div>
          </div>
        )}

        {/* Switch Pokémon Dialog */}
        {showSwitchDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm animate-fade-up">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaExchangeAlt className="text-blue-500" />
                  Trocar Pokémon
                </h3>
                {!areAllPlayerPokemonDefeated() && (
                  <button
                    onClick={() => setShowSwitchDialog(false)}
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
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                Selecione outro Pokémon para continuar a batalha
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {playerTeam.map((pokemon, index) => {
                  const health = pokemonHealth.player[pokemon.id] ?? 100;
                  const isDefeated = health <= 0;
                  const isActive = pokemon === currentPokemon;

                  return (
                    <button
                      key={index}
                      onClick={() => switchPokemon(pokemon)}
                      disabled={isDefeated || isActive}
                      className={`p-4 border rounded-lg transition-all ${
                        isActive
                          ? "border-green-500 bg-green-50 ring-2 ring-green-400"
                          : isDefeated
                          ? "border-red-300 bg-red-50 opacity-60"
                          : "border-gray-300 hover:border-blue-500 hover:shadow-md"
                      }`}
                    >
                      <div className="relative">
                        <div className="bg-gray-50 p-1 rounded-lg">
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-full h-24 object-contain"
                          />
                        </div>
                        <span
                          className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs font-medium rounded-md shadow-sm ${
                            isActive
                              ? "bg-green-500 text-white"
                              : isDefeated
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {isDefeated
                            ? "Derrotado"
                            : isActive
                            ? "Ativo"
                            : "Disponível"}
                        </span>
                      </div>
                      <p className="font-medium capitalize mt-2">
                        {pokemon.name}
                      </p>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">
                          Nv.{calculateLevel(pokemon.exp || 0)}
                        </span>
                        <span
                          className={
                            isDefeated
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          HP: {health}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDefeated
                              ? "bg-red-500"
                              : health > 50
                              ? "bg-green-500"
                              : health > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${health}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {!areAllPlayerPokemonDefeated() && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSwitchDialog(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg shadow-md transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Selector Modal */}
        {showTeamSelector && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Monte sua Equipe</h3>
                  <p className="text-sm text-gray-600">
                    Escolha até {maxTeamSize} Pokémon para enfrentar o Líder{" "}
                    {gym.leader}
                  </p>
                </div>
                <button
                  onClick={() => setShowTeamSelector(false)}
                  className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
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

              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-lg">
                    Dica: {gym.description}
                  </span>
                </div>
                <p className="text-gray-700 ml-10">
                  Os Pokémon com{" "}
                  <span className="font-bold text-yellow-600">
                    borda amarela
                  </span>{" "}
                  têm vantagem de tipo contra este ginásio.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xl font-semibold">
                    Sua Equipe ({playerTeam.length}/{maxTeamSize})
                  </h4>
                  {playerTeam.length > 0 && (
                    <button
                      className="text-sm text-red-600 hover:text-red-800 hover:underline flex items-center"
                      onClick={() => setPlayerTeam([])}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Limpar equipe
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-28">
                  {playerTeam.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                      <svg
                        className="w-8 h-8 mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>Nenhum Pokémon selecionado</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {playerTeam.map((pokemon, index) => (
                        <div
                          key={index}
                          className="bg-white border rounded-lg p-3 relative shadow-sm"
                        >
                          <button
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm shadow hover:bg-red-600"
                            onClick={() => removeFromTeam(index)}
                          >
                            ×
                          </button>
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-full h-20 object-contain"
                          />
                          <p className="font-medium text-center capitalize truncate mt-1">
                            {pokemon.name}
                          </p>
                          <div className="flex justify-center gap-1 mt-1">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              Nv.{calculateLevel(pokemon.exp || 0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xl font-semibold">Pokémon Disponíveis</h4>
                  <span className="text-sm text-gray-600">
                    Clique para adicionar à equipe
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {inventory.map((pokemon, index) => {
                    const isInTeam = playerTeam.some(
                      (p) =>
                        p.id === pokemon.id &&
                        JSON.stringify(p.moves) ===
                          JSON.stringify(pokemon.moves)
                    );
                    const level = calculateLevel(pokemon.exp || 0);

                    const gymType =
                      gym.description.split(":")[1]?.trim().toLowerCase() || "";
                    const primaryGymType = gymType.includes(" tipo ")
                      ? gymType.split(" tipo ")[1].toLowerCase()
                      : "";

                    const hasTypeAdvantage = pokemon.types.some((type) => {
                      if (
                        primaryGymType.includes("pedra") &&
                        [
                          "water",
                          "grass",
                          "fighting",
                          "ground",
                          "steel",
                        ].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("água") &&
                        ["electric", "grass"].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("fogo") &&
                        ["water", "rock", "ground"].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("elétrico") &&
                        ["ground"].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("planta") &&
                        ["fire", "ice", "poison", "flying", "bug"].includes(
                          type
                        )
                      )
                        return true;
                      if (
                        primaryGymType.includes("venenoso") &&
                        ["ground", "psychic"].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("psíquico") &&
                        ["bug", "ghost", "dark"].includes(type)
                      )
                        return true;
                      if (
                        primaryGymType.includes("terra") &&
                        ["water", "grass", "ice"].includes(type)
                      )
                        return true;
                      return false;
                    });

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          !isInTeam &&
                          playerTeam.length < maxTeamSize &&
                          addToTeam(pokemon)
                        }
                        className={`border rounded-lg p-3 relative transition-all ${
                          isInTeam
                            ? "border-green-500 bg-green-50 shadow"
                            : playerTeam.length >= maxTeamSize
                            ? "border-gray-200 opacity-60 cursor-not-allowed"
                            : "border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md"
                        } ${hasTypeAdvantage ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          className="w-full h-24 object-contain transition-transform hover:scale-105"
                        />

                        {hasTypeAdvantage && (
                          <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-800 text-xs font-bold px-1.5 py-0.5 rounded shadow">
                            Vantagem!
                          </div>
                        )}

                        <p className="font-semibold text-center capitalize mt-2 text-sm">
                          {pokemon.name}
                        </p>

                        <div className="flex justify-center flex-wrap gap-1 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            Nv.{level}
                          </span>
                          {pokemon.types.map((type, i) => (
                            <span
                              key={i}
                              className={`text-xs px-1.5 py-0.5 rounded bg-${type}-100 text-${type}-800`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>

                        {isInTeam && (
                          <div className="mt-2 bg-green-100 text-center rounded py-1 text-xs font-medium text-green-800">
                            Na equipe
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex justify-between border-t pt-4">
                <button
                  onClick={() => setShowTeamSelector(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowTeamSelector(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={playerTeam.length === 0}
                >
                  Confirmar Equipe
                  <span className="bg-white text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {playerTeam.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Menu Modal */}
        {showItemsMenu && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Usar Item</h3>
                <button
                  onClick={() => setShowItemsMenu(false)}
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

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Selecione um item para usar em {currentPokemon?.name}:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {items
                  .filter((item) => item.category === "healing")
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => useHealingItem(item)}
                      disabled={
                        (item.effect.type === "revive" &&
                          pokemonHealth.player[currentPokemon?.id] > 0) ||
                        (item.effect.type === "heal" &&
                          pokemonHealth.player[currentPokemon?.id] <= 0)
                      }
                      className={`
                        flex items-center p-3 border rounded-lg text-left
                        ${
                          (item.effect.type === "revive" &&
                            pokemonHealth.player[currentPokemon?.id] > 0) ||
                          (item.effect.type === "heal" &&
                            pokemonHealth.player[currentPokemon?.id] <= 0)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-500 hover:bg-blue-50"
                        }
                      `}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>

              {items.filter((item) => item.category === "healing").length ===
                0 && (
                <div className="text-center py-6 text-gray-500">
                  Você não possui itens de cura. Visite a loja para comprar!
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowItemsMenu(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add this to your existing CSS or component */}
        <style jsx>{`
          .text-shadow {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(-5px);
            }
            50% {
              transform: translateY(5px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }

          .animate-fade-up {
            animation: fadeUp 0.5s ease-out forwards;
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-pulse-soft {
            animation: pulseSoft 2s infinite;
          }

          @keyframes pulseSoft {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// Helper function for type colors
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

export default GymBattle;
