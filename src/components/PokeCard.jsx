import React, { useState } from "react";
import PokeDetails from "./PokeDetails";

function PokeCard({ pokemon, coins, updateCoins, onUpdatePokemon }) {
  const [showDetails, setShowDetails] = useState(false);

  const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  // Função para calcular o nível baseado na experiência
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

  return (
    <>
      <div
        className="card card-hover p-4 relative group"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative overflow-hidden rounded-lg bg-gray-50 p-2">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-full h-32 object-contain transition-transform group-hover:scale-110 duration-300"
          />

          {/* Pokeball background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-full h-full"
            >
              <circle cx="50" cy="50" r="50" />
              <rect x="0" y="47" width="100" height="6" fill="white" />
              <circle
                cx="50"
                cy="50"
                r="15"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <circle cx="50" cy="50" r="8" />
            </svg>
          </div>

          {/* Level Badge */}
          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            Lvl {calculateLevel(pokemon.exp || 0)}
          </div>
        </div>

        <h3 className="text-center font-bold mt-3 capitalize text-lg">
          {pokemon.name}
        </h3>

        <div className="flex gap-1 justify-center mt-2 flex-wrap">
          {pokemon.types?.map((type, index) => (
            <span
              key={index}
              className={`${typeColors[type]} px-2 py-0.5 rounded-full text-white text-xs mb-4`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* View details hint */}
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Toque para ver detalhes
        </div>
      </div>

      {showDetails && (
        <PokeDetails
          pokemon={{
            ...pokemon,
            level: calculateLevel(pokemon.exp || 0),
          }}
          onClose={() => setShowDetails(false)}
          coins={coins}
          updateCoins={updateCoins}
          onUpdatePokemon={onUpdatePokemon}
        />
      )}
    </>
  );
}

export default PokeCard;
