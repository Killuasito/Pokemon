import React, { useState, useEffect } from "react";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

function PokemonSelector({
  inventory,
  onSelect,
  onClose,
  modalTitle = "Escolha seu Pokémon",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  // Track if selection is in progress to prevent multiple selections
  const [isSelecting, setIsSelecting] = useState(false);

  // Filter pokemon by search term and type
  const filteredPokemon = inventory.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || pokemon.types.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  // Get unique types from inventory
  const allTypes = Array.from(
    new Set(inventory.flatMap((pokemon) => pokemon.types))
  );

  // Function to calculate level
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

  const handlePokemonSelect = (pokemon) => {
    if (isSelecting) return; // Prevent multiple selections
    setIsSelecting(true);

    // Ensure we pass a complete pokemon object with all properties
    const completeData = inventory.find(
      (p) =>
        p.id === pokemon.id &&
        JSON.stringify(p.moves) === JSON.stringify(pokemon.moves)
    );

    if (completeData) {
      onSelect(completeData);
    } else {
      onSelect(pokemon);
    }

    // Reset selection state after a delay
    setTimeout(() => {
      setIsSelecting(false);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimesCircle className="text-gray-500 w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-2 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
            >
              <option value="">Todos os tipos</option>
              {allTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-168px)]">
          {filteredPokemon.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2 text-lg">Nenhum Pokémon encontrado</p>
              <p className="text-sm">Tente outro termo de busca ou filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPokemon.map((pokemon, index) => {
                const level = calculateLevel(pokemon.exp || 0);
                return (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="card card-hover cursor-pointer"
                    onClick={() => handlePokemonSelect(pokemon)}
                  >
                    <div className="bg-gray-50 p-3 rounded-t-lg flex justify-center items-center h-32">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-center font-bold capitalize text-gray-800">
                        {pokemon.name}
                      </h3>
                      <div className="flex justify-center mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Nível {level}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {pokemon.types.map((type, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 bg-${type}-100 text-${type}-700 rounded-full capitalize`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonSelector;
