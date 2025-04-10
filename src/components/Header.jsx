import React from "react";
import { FaCoins, FaQuestion } from "react-icons/fa";

function Header({ coins, onTutorialReset }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="PokeBall"
            className="h-8 w-8"
          />
          <h1 className="text-xl md:text-2xl font-bold">Pokémon Collector</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onTutorialReset}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
            title="Abrir tutorial novamente"
          >
            <FaQuestion />
            <span className="hidden md:inline">Tutorial</span>
          </button>

          <div className="flex items-center bg-white/20 px-3 py-1.5 rounded-lg">
            <FaCoins className="text-yellow-300 mr-2" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
