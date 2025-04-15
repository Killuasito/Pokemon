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
  const [megaEvolved, setMegaEvolved] = useState(false);
  const [canMegaEvolve, setCanMegaEvolve] = useState(false);
  const [megaEvolutionAnimation, setMegaEvolutionAnimation] = useState(false);
  const [activeItemTab, setActiveItemTab] = useState("healing");

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

  const isTeamReady = () => {
    return playerTeam.length > 0 && playerTeam.length <= maxTeamSize;
  };

  const removeFromTeam = (index) => {
    const updatedTeam = [...playerTeam];
    updatedTeam.splice(index, 1);
    setPlayerTeam(updatedTeam);
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
    if (currentPokemon && step === "battle") {
      checkMegaEvolution();

      if (currentTurn !== "player") {
        setTimeout(() => {
          setCurrentTurn("player");
        }, 1000);
      }
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

  const checkMegaEvolution = () => {
    if (!currentPokemon || !items || items.length === 0) {
      setCanMegaEvolve(false);
      return;
    }

    console.log("Checking mega evolution for:", currentPokemon.name);
    console.log("Available items:", items);

    const availableMegaStones = items.filter((item) => {
      const isMatch =
        item.category === "megaStone" &&
        item.effect?.pokemon?.toLowerCase() ===
          currentPokemon.name.toLowerCase();

      console.log("Checking item:", item.name, "isMatch:", isMatch);
      return isMatch;
    });

    console.log("Available mega stones:", availableMegaStones);
    setCanMegaEvolve(availableMegaStones.length > 0);
  };

  const handleMegaEvolution = (megaStone) => {
    if (!currentPokemon || megaEvolved || !megaStone) {
      console.log(
        "Cannot mega evolve:",
        !currentPokemon
          ? "No Pokémon"
          : megaEvolved
          ? "Already mega evolved"
          : !megaStone
          ? "No mega stone"
          : "Unknown reason"
      );
      return;
    }

    console.log("Starting mega evolution with:", megaStone);
    setMegaEvolutionAnimation(true);

    setTimeout(() => {
      setMegaEvolutionAnimation(false);

      let megaImage = currentPokemon.image;

      if (currentPokemon.name.toLowerCase() === "charizard") {
        if (megaStone.effect.variant === "x") {
          megaImage =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png";
        } else if (megaStone.effect.variant === "y") {
          megaImage =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png";
        }
      } else if (currentPokemon.name.toLowerCase() === "mewtwo") {
        if (megaStone.effect.variant === "x") {
          megaImage =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png";
        } else if (megaStone.effect.variant === "y") {
          megaImage =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png";
        }
      } else if (currentPokemon.name.toLowerCase() === "venusaur") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png";
      } else if (currentPokemon.name.toLowerCase() === "blastoise") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png";
      } else if (currentPokemon.name.toLowerCase() === "alakazam") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png";
      } else if (currentPokemon.name.toLowerCase() === "gengar") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png";
      } else if (currentPokemon.name.toLowerCase() === "gyarados") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png";
      } else if (currentPokemon.name.toLowerCase() === "lucario") {
        megaImage =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10059.png";
      }

      const megaBoosts = megaStone.effect.statsBoost || {
        attack: 20,
        defense: 20,
        "special-attack": 20,
        "special-defense": 20,
        speed: 10,
      };

      if (!currentPokemon.stats) {
        currentPokemon.stats = [
          { name: "hp", value: 100 },
          { name: "attack", value: 80 },
          { name: "defense", value: 80 },
          { name: "special-attack", value: 80 },
          { name: "special-defense", value: 80 },
          { name: "speed", value: 80 },
        ];
      }

      const originalStats = currentPokemon.stats
        ? JSON.parse(JSON.stringify(currentPokemon.stats))
        : [];

      const megaStats = originalStats.map((stat) => {
        const boost = megaBoosts[stat.name] || 0;
        return {
          ...stat,
          originalValue: stat.value,
          value: Math.floor(stat.value * (1 + boost / 100)),
        };
      });

      const megaEvolvedPokemon = {
        ...currentPokemon,
        isMega: true,
        megaVariant: megaStone.effect.variant || "",
        originalTypes: [...currentPokemon.types],
        types: megaStone.effect.typeChange || [...currentPokemon.types],
        originalImage: currentPokemon.image,
        image: megaImage,
        originalStats: originalStats,
        stats: megaStats,
        megaStats: megaBoosts,
      };

      setBattleLog((prev) => [
        ...prev,
        `${currentPokemon.name} mega evoluiu para Mega ${currentPokemon.name}${
          megaStone.effect.variant
            ? " " + megaStone.effect.variant.toUpperCase()
            : ""
        }!`,
        `Seus atributos aumentaram drasticamente!`,
      ]);

      const statBoostMessages = Object.entries(megaBoosts)
        .filter(([_, value]) => value > 0)
        .map(([stat, boost]) => {
          const statName = stat
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return `${statName} +${boost}%`;
        });

      if (statBoostMessages.length > 0) {
        setBattleLog((prev) => [
          ...prev,
          `Aumentos: ${statBoostMessages.join(", ")}`,
        ]);
      }

      setCurrentPokemon(megaEvolvedPokemon);
      setMegaEvolved(true);
      setShowItemsMenu(false);
    }, 2000);
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

    if (attacker.isMega) {
      if (
        [
          "normal",
          "fighting",
          "poison",
          "ground",
          "rock",
          "bug",
          "ghost",
          "steel",
        ].includes(move.type)
      ) {
        const attackBoost = attacker.megaStats?.attack || 0;
        damage *= 1 + attackBoost / 100;
      } else {
        const spAttackBoost = attacker.megaStats?.["special-attack"] || 0;
        damage *= 1 + spAttackBoost / 100;
      }
    }

    damage *= Math.random() * 0.2 + 0.9;

    return Math.round(damage);
  };

  const useHealingItem = (item) => {
    if (!currentPokemon || currentTurn !== "player") return;

    if (!item || !item.effect) {
      console.error("Item inválido", item);
      return;
    }

    console.log("Using item:", item);
    console.log("Item effect:", item.effect);
    console.log("Item category:", item.category);

    if (item.category === "megaStone") {
      console.log("Attempting to use mega stone:", item.name);
      console.log("For Pokémon:", currentPokemon.name);
      console.log("Effect Pokemon:", item.effect.pokemon);
      console.log(
        "Is match:",
        item.effect.pokemon.toLowerCase() === currentPokemon.name.toLowerCase()
      );

      if (
        item.effect.pokemon.toLowerCase() === currentPokemon.name.toLowerCase()
      ) {
        console.log("Mega evolution is valid, executing");
        handleMegaEvolution(item);
        setShowItemsMenu(false);
        return;
      } else {
        console.log("Mega evolution not possible with this stone");
        alert("Esta pedra não é compatível com este Pokémon!");
        return;
      }
    }

    let newHealth = pokemonHealth.player[currentPokemon.id] || 0;
    const effectText = [];

    if (item.effect.type === "heal") {
      const healAmount = item.effect.value;
      newHealth = Math.min(100, newHealth + healAmount);
      effectText.push(`${currentPokemon.name} recuperou ${healAmount}% de HP!`);

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
    } else if (item.effect.type === "revive") {
      if (pokemonHealth.player[currentPokemon.id] > 0) {
        alert("Este Pokémon não está desmaiado!");
        return;
      }

      newHealth = item.effect.value;
      effectText.push(
        `${currentPokemon.name} foi revivido com ${item.effect.value}% de HP!`
      );

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
    } else if (item.effect.type === "megaEvolution") {
      console.log("Mega evolution through effect type");
      handleMegaEvolution(item);
      return;
    } else {
      alert("Este item não pode ser usado agora.");
      return;
    }

    setPokemonHealth((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        [currentPokemon.id]: newHealth,
      },
    }));

    setBattleLog((prev) => [...prev, `Você usou ${item.name}!`, ...effectText]);

    setShowItemsMenu(false);

    performOpponentTurn();
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

    setMegaEvolved(false);
    setCurrentPokemon(pokemon);
    setShowSwitchDialog(false);

    if (step === "battle" && previousPokemonName) {
      setBattleLog((prev) => [
        ...prev,
        `${previousPokemonName} retorna! ${pokemon.name}, eu escolho você!`,
      ]);

      checkMegaEvolution();

      if (currentTurn === "player") {
        performOpponentTurn();
      }
    }
  };

  const handleBattleEnd = () => {
    if (currentPokemon && currentPokemon.isMega) {
      const resetPokemon = {
        ...currentPokemon,
        isMega: false,
        image: currentPokemon.originalImage || currentPokemon.image,
        types: currentPokemon.originalTypes || currentPokemon.types,
        stats: currentPokemon.originalStats || currentPokemon.stats,
      };
      delete resetPokemon.megaVariant;
      delete resetPokemon.originalTypes;
      delete resetPokemon.originalImage;
      delete resetPokemon.originalStats;
      delete resetPokemon.megaStats;

      setCurrentPokemon(resetPokemon);
    }
    setMegaEvolved(false);
  };

  const handleMoveSelect = (move) => {
    if (!currentPokemon || !currentOpponent || currentTurn !== "player") return;

    const damage = calculateDamage(move, currentPokemon, currentOpponent);

    const newHealth = Math.max(0, pokemonHealth.opponent - damage);
    setPokemonHealth((prev) => ({
      ...prev,
      opponent: newHealth,
    }));

    setBattleLog((prev) => [
      ...prev,
      `${currentPokemon.name} usou ${move.name}!`,
      `Causou ${damage} de dano!`,
    ]);

    if (newHealth <= 0) {
      if (opponentIndex + 1 < gym.pokemon.length) {
        // Go to next opponent if there are more
        setOpponentIndex(opponentIndex + 1);
        setPokemonHealth((prev) => ({
          ...prev,
          opponent: 100,
        }));
      } else {
        // Victory - all opponents defeated
        const used = playerTeam.filter(
          (p) => pokemonHealth.player[p.id] !== undefined
        );
        setResult({ victory: true, pokemonUsed: used });
        setStep("result");
      }
    } else {
      setCurrentTurn("opponent");
      setTimeout(() => {
        performOpponentTurn();
      }, 1500);
    }
  };

  const performOpponentTurn = () => {
    if (!currentOpponent || !currentPokemon) return;

    const opponentMoves = currentOpponent.moves.filter((m) => m.power);
    const selectedMove =
      opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

    const damage = calculateDamage(
      selectedMove,
      currentOpponent,
      currentPokemon
    );

    const newHealth = Math.max(
      0,
      pokemonHealth.player[currentPokemon.id] - damage
    );
    setPokemonHealth((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        [currentPokemon.id]: newHealth,
      },
    }));

    setBattleLog((prev) => [
      ...prev,
      `${currentOpponent.name} usou ${selectedMove.name}!`,
      `Causou ${damage} de dano!`,
    ]);

    if (newHealth <= 0) {
      // Check if player has any Pokémon left
      const activePokemon = playerTeam.filter(
        (p) => pokemonHealth.player[p.id] > 0
      );

      if (activePokemon.length === 0) {
        // Defeat - all player Pokémon are defeated
        setResult({ victory: false, pokemonUsed: playerTeam });
        setStep("result");
      } else {
        // Force player to switch Pokémon
        setBattleLog((prev) => [
          ...prev,
          `${currentPokemon.name} foi derrotado!`,
          `Escolha outro Pokémon para continuar.`,
        ]);
        setShowSwitchDialog(true);
      }
    } else {
      setCurrentTurn("player");
    }
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
                                    .length > 0 ||
                                  (canMegaEvolve &&
                                    !megaEvolved &&
                                    items.filter(
                                      (i) =>
                                        i.category === "megaStone" &&
                                        i.effect?.pokemon?.toLowerCase() ===
                                          currentPokemon.name.toLowerCase()
                                    ).length > 0)
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={
                                  currentTurn !== "player" ||
                                  (items.filter((i) => i.category === "healing")
                                    .length === 0 &&
                                    !(
                                      canMegaEvolve &&
                                      !megaEvolved &&
                                      items.filter(
                                        (i) =>
                                          i.category === "megaStone" &&
                                          i.effect?.pokemon?.toLowerCase() ===
                                            currentPokemon.name.toLowerCase()
                                      ).length > 0
                                    ))
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

        {showTeamSelector && (
          <PokemonSelector
            inventory={inventory}
            onSelect={addToTeam}
            onClose={() => setShowTeamSelector(false)}
            modalTitle="Escolha Pokémon para sua equipe"
          />
        )}

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

              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 border-b-2 ${
                    activeItemTab === "healing"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveItemTab("healing")}
                >
                  Itens de Cura
                </button>
                {canMegaEvolve && !megaEvolved && (
                  <button
                    className={`px-4 py-2 border-b-2 ${
                      activeItemTab === "mega"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setActiveItemTab("mega")}
                  >
                    Mega Evolução
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {activeItemTab === "healing" &&
                  items
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

                {activeItemTab === "mega" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {items
                      .filter(
                        (item) =>
                          item.category === "megaStone" &&
                          item.effect?.pokemon?.toLowerCase() ===
                            currentPokemon.name.toLowerCase()
                      )
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => useHealingItem(item)}
                          className="p-3 border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-3 text-left"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full">
                                Mega {currentPokemon.name}
                                {item.effect.variant
                                  ? ` ${item.effect.variant.toUpperCase()}`
                                  : ""}
                              </span>
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {((activeItemTab === "healing" &&
                items.filter((item) => item.category === "healing").length ===
                  0) ||
                (activeItemTab === "mega" &&
                  items.filter(
                    (item) =>
                      item.category === "megaStone" &&
                      item.effect?.pokemon?.toLowerCase() ===
                        currentPokemon?.name?.toLowerCase()
                  ).length === 0)) && (
                <div className="text-center py-6 text-gray-500">
                  {activeItemTab === "healing" ? (
                    <div>
                      <p className="font-medium mb-1">
                        Você não possui itens de cura.
                      </p>
                      <p className="text-sm">Visite a loja para comprar!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">
                        Nenhuma pedra de mega evolução disponível para{" "}
                        {currentPokemon?.name}
                      </p>
                      <p className="text-sm">
                        Visite a loja para comprar pedras de mega evolução.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeItemTab === "mega" && (
                <div className="text-xs p-2 mb-2 bg-blue-50 rounded-lg">
                  <strong>Debug info:</strong>
                  <br />
                  Can mega evolve: {canMegaEvolve ? "Yes" : "No"}
                  <br />
                  Current Pokémon: {currentPokemon?.name}
                  <br />
                  Total mega stones:{" "}
                  {items.filter((i) => i.category === "megaStone").length}
                  <br />
                  Matching stones:{" "}
                  {
                    items.filter(
                      (i) =>
                        i.category === "megaStone" &&
                        i.effect?.pokemon?.toLowerCase() ===
                          currentPokemon?.name?.toLowerCase()
                    ).length
                  }
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

        {showSwitchDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full animate-fade-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Trocar Pokémon</h3>
                {currentTurn === "player" && (
                  <button
                    onClick={() => setShowSwitchDialog(false)}
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
                )}
              </div>

              <p className="text-gray-600 mb-4">
                Selecione um Pokémon para enviar à batalha:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {playerTeam.map((pokemon, index) => (
                  <button
                    key={index}
                    onClick={() => switchPokemon(pokemon)}
                    disabled={
                      pokemon.id === currentPokemon?.id ||
                      pokemonHealth.player[pokemon.id] <= 0
                    }
                    className={`
                      flex items-center p-3 border rounded-lg
                      ${
                        pokemon.id === currentPokemon?.id
                          ? "bg-blue-50 border-blue-500"
                          : pokemonHealth.player[pokemon.id] <= 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-green-500 hover:bg-green-50"
                      }
                    `}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-3 text-left">
                      <h4 className="font-medium capitalize">{pokemon.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex gap-1">
                          {pokemon.types?.map((type, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-1.5 py-0.5 rounded bg-${type}-100 text-${type}-800`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            pokemonHealth.player[pokemon.id] < 30
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          HP: {pokemonHealth.player[pokemon.id] || 0}%
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {currentTurn !== "player" && (
                <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <p className="font-medium">
                    Você precisa escolher um Pokémon!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {megaEvolutionAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 flex flex-col items-center animate-pulse">
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-spin-slow"></div>
              <img
                src={currentPokemon.image}
                alt={currentPokemon.name}
                className="absolute w-36 h-36 object-contain animate-bounce-slow"
              />
              <div className="text-white text-2xl font-bold mt-8 text-center">
                MEGA EVOLUÇÃO!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
