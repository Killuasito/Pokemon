import React, { useState } from "react";
import { FaInfoCircle, FaCheck } from "react-icons/fa";
import PokemonSelector from "./PokemonSelector";

function ItemCard({ item, inventory, setInventory, items, setItems }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [useResult, setUseResult] = useState(null);

  // Calculate level function for Pokemon
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

  const useItem = () => {
    if (item.category === "xpBoost") {
      setShowSelector(true);
      return;
    }

    if (["healing", "statBoost"].includes(item.category)) {
      alert(
        "Este item só pode ser usado durante batalhas ou em um Pokémon específico."
      );
      return;
    }

    alert(`${item.name} não pode ser usado diretamente.`);
  };

  const useItemOnPokemon = (pokemon) => {
    setShowSelector(false);

    if (!pokemon || !item) return;

    // Handle XP Boost items
    if (item.category === "xpBoost") {
      const updatedPokemon = { ...pokemon };

      if (item.effect.type === "xp" && item.effect.value === "level_up") {
        // Level up item - like Rare Candy
        const currentLevel = calculateLevel(pokemon.exp);
        const xpForNextLevel = currentLevel * 100;
        updatedPokemon.exp = (pokemon.exp || 0) + xpForNextLevel;

        setUseResult({
          success: true,
          message: `${pokemon.name} subiu para o nível ${calculateLevel(
            updatedPokemon.exp
          )}!`,
        });
      } else if (
        item.effect.type === "xp" &&
        typeof item.effect.value === "number"
      ) {
        // Fixed XP item - like EXP Candies
        updatedPokemon.exp = (pokemon.exp || 0) + item.effect.value;

        const oldLevel = calculateLevel(pokemon.exp);
        const newLevel = calculateLevel(updatedPokemon.exp);

        setUseResult({
          success: true,
          message:
            newLevel > oldLevel
              ? `${pokemon.name} ganhou ${item.effect.value} XP e subiu para o nível ${newLevel}!`
              : `${pokemon.name} ganhou ${item.effect.value} XP!`,
        });
      }

      // Update inventory
      const updatedInventory = inventory.map((p) =>
        p.id === pokemon.id &&
        JSON.stringify(p.moves) === JSON.stringify(pokemon.moves)
          ? updatedPokemon
          : p
      );

      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));

      // Update item quantity
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
    }
  };

  const categoryColors = {
    pokeball: "bg-red-100 text-red-800",
    xpBoost: "bg-green-100 text-green-800",
    healing: "bg-blue-100 text-blue-800",
    statBoost: "bg-purple-100 text-purple-800",
    special: "bg-yellow-100 text-yellow-800",
  };

  const closeResult = () => {
    setUseResult(null);
  };

  return (
    <>
      <div className="card group relative hover:shadow-md transition-all">
        <div className="p-4 flex flex-col h-full">
          <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg flex justify-center mb-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 object-contain"
            />
          </div>

          <div className="flex-grow">
            <h3 className="font-bold text-gray-800">{item.name}</h3>

            <div className="flex justify-between items-center my-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  categoryColors[item.category] || "bg-gray-100 text-gray-800"
                }`}
              >
                {item.category === "pokeball"
                  ? "Pokébola"
                  : item.category === "xpBoost"
                  ? "Experiência"
                  : item.category === "healing"
                  ? "Cura"
                  : item.category === "statBoost"
                  ? "Status"
                  : "Especial"}
              </span>
              <span className="font-medium text-sm">{item.quantity || 1}×</span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {item.description}
            </p>
          </div>

          <div className="mt-auto flex justify-between items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex-1 flex justify-center items-center gap-1"
            >
              <FaInfoCircle /> Info
            </button>

            <button
              onClick={useItem}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-1 flex justify-center items-center gap-1
                ${
                  ["xpBoost", "statBoost"].includes(item.category)
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              disabled={!["xpBoost", "statBoost"].includes(item.category)}
            >
              Usar
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="absolute inset-0 bg-white z-10 p-4 flex flex-col animate-fade-up">
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-sm text-gray-700 mb-2">{item.description}</p>

            {item.effect && (
              <div className="bg-blue-50 p-3 rounded-lg mb-2 text-xs text-blue-800">
                {item.effect.type === "xp" &&
                  item.effect.value === "level_up" &&
                  "Aumenta um nível completo do Pokémon"}
                {item.effect.type === "xp" &&
                  typeof item.effect.value === "number" &&
                  `Concede ${item.effect.value} pontos de experiência`}
                {item.effect.type === "heal" &&
                  `Recupera ${item.effect.value}% de HP em batalha`}
                {item.effect.type === "revive" &&
                  `Revive um Pokémon derrotado com ${item.effect.value}% de HP`}
                {item.effect.type === "stat" &&
                  `Aumenta o status ${item.effect.stat} em ${item.effect.value} pontos`}
              </div>
            )}

            <button
              onClick={() => setShowInfo(false)}
              className="mt-auto px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {showSelector && (
        <PokemonSelector
          inventory={inventory}
          onSelect={useItemOnPokemon}
          onClose={() => setShowSelector(false)}
          modalTitle={`Selecione um Pokémon para usar ${item.name}`}
        />
      )}

      {useResult && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-up"
          onClick={closeResult}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-500 text-2xl" />
              </div>

              <h3 className="text-xl font-bold mb-2">Item Usado!</h3>
              <p className="mb-6">{useResult.message}</p>

              <button
                onClick={closeResult}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemCard;
