import React, { useState, useMemo } from "react";
import PokeCard from "./PokeCard";
import ItemCard from "./ItemCard";

function Inventory({
  inventory,
  onSelectForBattle,
  coins,
  updateCoins,
  setInventory,
  items,
  setItems,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pokemon"); // "pokemon" or "items"
  const itemsPerPage = 15;

  const types = [
    "all",
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const filteredPokemon = useMemo(() => {
    return inventory.filter((pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        !filterType ||
        filterType === "all" ||
        pokemon.types.includes(filterType);
      return matchesSearch && matchesType;
    });
  }, [inventory, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
  const currentPokemon = filteredPokemon.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdatePokemon = (updatedPokemon) => {
    console.log("Updating Pokemon in inventory:", updatedPokemon);

    // Store the original ID that's being evolved so we can log it
    const originalId = updatedPokemon.originalId || updatedPokemon.id;

    const newInventory = inventory.map((p) => {
      // First try to match by originalId if it's an evolution
      if (updatedPokemon.originalId && p.id === updatedPokemon.originalId) {
        console.log(
          `Evolution: Replacing ${p.name} (ID: ${p.id}) with ${updatedPokemon.name} (ID: ${updatedPokemon.id})`
        );
        // Remove the temporary originalId property before saving
        const { originalId, ...finalPokemon } = updatedPokemon;
        return finalPokemon;
      }

      // Then try the regular match by ID and moves
      else if (
        p.id === updatedPokemon.id &&
        JSON.stringify(p.moves) === JSON.stringify(updatedPokemon.moves)
      ) {
        console.log(`Updating: ${p.name} with new stats/attributes`);
        return updatedPokemon;
      }

      return p;
    });

    console.log("Updated inventory length:", newInventory.length);
    console.log(
      "Pokemon was evolved from ID:",
      originalId,
      "to ID:",
      updatedPokemon.id
    );

    // Save to state and local storage
    setInventory(newInventory);
    localStorage.setItem("inventory", JSON.stringify(newInventory));
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 p-4 md:p-6 shadow-xl rounded-xl my-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1">
          Sua Coleção
        </h2>
        <div className="text-sm bg-blue-50 p-2 rounded-lg text-blue-700 font-medium shadow-sm">
          <span>
            Total: {inventory.length} Pokémon | {items.length} itens
          </span>
        </div>
      </div>

      {/* Tabs for Pokemon/Items */}
      <div className="flex border-b-2 border-gray-200 mb-6 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setActiveTab("pokemon")}
          className={`px-5 py-3 mr-2 transition-all duration-200 rounded-t-lg font-medium ${
            activeTab === "pokemon"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Pokémon
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-5 py-3 transition-all duration-200 rounded-t-lg font-medium ${
            activeTab === "items"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Itens
        </button>
      </div>

      {activeTab === "pokemon" ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize shadow-sm cursor-pointer transition-all duration-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {types.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {currentPokemon.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 font-medium">
                Nenhum Pokémon encontrado com os critérios selecionados.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {currentPokemon.map((pokemon, index) => (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="relative transition-all duration-200  rounded-lg"
                  >
                    <PokeCard
                      pokemon={pokemon}
                      onClick={onSelectForBattle}
                      coins={coins}
                      updateCoins={updateCoins}
                      onUpdatePokemon={handleUpdatePokemon}
                      items={items}
                      setItems={setItems}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 bg-gray-50 py-3 px-4 rounded-lg">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Anterior</span>
                  </button>
                  <span className="px-4 py-2 font-medium bg-white border border-gray-200 rounded-md shadow-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-1"
                  >
                    <span>Próxima</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Items Tab - Update grid for mobile */
        <div>
          {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <p className="text-gray-600 font-medium">
                Você não possui itens no momento. Visite a loja para comprar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative transition-all duration-200 hover:shadow-lg rounded-lg"
                >
                  <ItemCard
                    item={item}
                    inventory={inventory}
                    setInventory={setInventory}
                    items={items}
                    setItems={setItems}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Inventory;
