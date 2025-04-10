import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Store from "./components/Store";
import Inventory from "./components/Inventory";
import Battle from "./components/Battle";
import Gyms from "./components/Gyms";
import ItemShop from "./components/ItemShop";
import SafariZone from "./components/SafariZone";
import SecretCodes from "./components/SecretCodes";
import Settings from "./components/Settings";
import {
  FaStore,
  FaShoppingBag,
  FaTree,
  FaFistRaised,
  FaBuilding,
  FaBox,
  FaBars,
  FaTimes,
  FaGift,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaCoins,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";

function App() {
  const [inventory, setInventory] = useState(
    JSON.parse(localStorage.getItem("inventory")) || []
  );
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 1000
  );
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(
    localStorage.getItem("tutorialCompleted") === "true"
  );

  useEffect(() => {
    // Check if it's the user's first time
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [tutorialCompleted]);

  const addToInventory = (pokemon) => {
    const updatedInventory = [...inventory, pokemon];
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  const updateCoins = (amount) => {
    const newBalance = coins + amount;
    setCoins(newBalance);
    localStorage.setItem("coins", newBalance);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem("tutorialCompleted", "true");
  };

  const resetTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
    setTutorialCompleted(false);
    localStorage.setItem("tutorialCompleted", "false");
  };

  // Tutorial content steps
  const tutorialSteps = [
    {
      title: "Bem-vindo ao Mundo Pokémon!",
      content:
        "Este é um jogo onde você pode colecionar, treinar e batalhar com Pokémon! Vamos dar uma olhada em como jogar.",
      image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    },
    {
      title: "Loja de Pokémon",
      content:
        "Comece comprando pacotes de Pokémon na loja. Você vai receber Pokémon aleatórios que podem ser usados em batalhas.",
      image: "/Pacote.png",
    },
    {
      title: "Batalhas",
      content:
        "Use seus Pokémon para batalhar! Vença batalhas para ganhar experiência e moedas. Os Pokémon sobem de nível e ficam mais fortes com a experiência.",
      image: "/Batalha.png",
    },
    {
      title: "Ginásios",
      content:
        "Desafie líderes de ginásio para ganhar insígnias! Cada líder tem Pokémon de tipos específicos, então planeje sua estratégia.",
      image: "/Ginasio.png",
    },
    {
      title: "Itens",
      content:
        "Compre e use itens para ajudar seus Pokémon. Poções curam em batalhas, Pokébolas ajudam a capturar novos Pokémon, e muito mais!",
      image: "/Item.png",
    },
    {
      title: "Safari Zone",
      content:
        "Na Safari Zone você pode capturar Pokémon raros! Use Pokébolas com sabedoria para aumentar suas chances.",
      image: "/Safari.png",
    },
    {
      title: "Códigos Secretos",
      content:
        "Procure por códigos secretos para resgatar recompensas especiais como Pokémon raros, itens e moedas!",
      image: "/Cheats.png",
    },
    {
      title: "Pronto para começar!",
      content:
        "Agora você está pronto para iniciar sua aventura no mundo Pokémon! Boa sorte em sua jornada para se tornar um Mestre Pokémon!",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png",
    },
  ];

  // Navigation items configuration
  const navItems = [
    { id: "store", label: "Loja de Pokémon", icon: <FaStore /> },
    { id: "itemShop", label: "Loja de Itens", icon: <FaShoppingBag /> },
    { id: "safari", label: "Safari Zone", icon: <FaTree /> },
    { id: "battle", label: "Arena de Batalha", icon: <FaFistRaised /> },
    { id: "gyms", label: "Ginásios", icon: <FaBuilding /> },
    {
      id: "inventory",
      label: `Coleção (${inventory.length})`,
      icon: <FaBox />,
    },
    { id: "settings", label: "Configurações", icon: <FaCog /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header coins={coins} onTutorialReset={resetTutorial} />

      <div className="container mx-auto p-4">
        {/* Desktop Navigation Tabs - Hidden on mobile */}
        <div className="hidden md:flex overflow-x-auto mb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === item.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {navItems.find((item) => item.id === activeTab)?.icon}
              <span className="font-medium">
                {navItems.find((item) => item.id === activeTab)?.label}
              </span>
            </span>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 mx-4 bg-white shadow-lg rounded-lg animate-fade-down overflow-hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${
                    item.id !== navItems[navItems.length - 1].id
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === "store" && (
          <Store
            addToInventory={addToInventory}
            inventory={inventory}
            setInventory={setInventory}
            coins={coins}
            updateCoins={updateCoins}
            items={items}
            setItems={setItems}
          />
        )}

        {activeTab === "itemShop" && (
          <ItemShop
            coins={coins}
            updateCoins={updateCoins}
            items={items}
            setItems={setItems}
            inventory={inventory}
            setInventory={setInventory}
          />
        )}

        {activeTab === "safari" && (
          <SafariZone
            inventory={inventory}
            setInventory={setInventory}
            coins={coins}
            updateCoins={updateCoins}
            items={items}
            setItems={setItems}
          />
        )}

        {activeTab === "battle" && (
          <Battle
            inventory={inventory}
            updateCoins={updateCoins}
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
            setInventory={setInventory}
            items={items}
            setItems={setItems}
          />
        )}

        {activeTab === "gyms" && (
          <Gyms
            inventory={inventory}
            updateCoins={updateCoins}
            setInventory={setInventory}
            items={items}
            setItems={setItems}
          />
        )}

        {activeTab === "settings" && (
          <Settings
            setInventory={setInventory}
            setItems={setItems}
            setCoins={setCoins}
            resetTutorial={resetTutorial}
            inventory={inventory}
            items={items}
            updateCoins={updateCoins}
            addToInventory={addToInventory}
          />
        )}

        {activeTab === "inventory" && (
          <Inventory
            inventory={inventory}
            setInventory={setInventory}
            coins={coins}
            updateCoins={updateCoins}
            onSelectForBattle={(pokemon) => {
              setSelectedPokemon(pokemon);
              setActiveTab("battle");
            }}
            items={items}
            setItems={setItems}
          />
        )}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-4 sm:p-6 max-w-3xl w-[95%] sm:w-[90%] animate-fade-up shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
                  <FaInfoCircle className="text-blue-500" />
                  <span className="line-clamp-1">
                    {tutorialSteps[tutorialStep].title}
                  </span>
                </h2>
                {tutorialStep === tutorialSteps.length - 1 && (
                  <div className="bg-green-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                    <FaCheck /> Final
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                <div className="w-full md:w-1/2 bg-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-center">
                  <img
                    src={tutorialSteps[tutorialStep].image}
                    alt="Tutorial illustration"
                    className="h-36 sm:max-h-64 object-contain mx-auto"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {tutorialSteps[tutorialStep].content}
                  </p>

                  {tutorialStep === 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaCoins className="text-yellow-500" />
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-yellow-700">
                            Você começará com{" "}
                            <span className="font-bold">1000 moedas</span> para
                            comprar seus primeiros Pokémon e itens. Use-as com
                            sabedoria!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {tutorialStep === 1 && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaMapMarkedAlt className="text-blue-500" />
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-blue-700">
                            <span className="font-bold">Dica:</span> Comece
                            comprando o Pacote Básico na loja para conseguir
                            seus primeiros Pokémon.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {tutorialStep > 0 && (
                          <button
                            onClick={() => setTutorialStep(tutorialStep - 1)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                          >
                            <FaArrowLeft /> Anterior
                          </button>
                        )}
                      </div>

                      <div className="flex gap-1 sm:gap-2">
                        {tutorialStep < tutorialSteps.length - 1 ? (
                          <button
                            onClick={() => setTutorialStep(tutorialStep + 1)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            Próximo <FaArrowRight />
                          </button>
                        ) : (
                          <button
                            onClick={handleCloseTutorial}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            Começar jornada <FaCheck />
                          </button>
                        )}

                        {tutorialStep < tutorialSteps.length - 1 && (
                          <button
                            onClick={handleCloseTutorial}
                            className="px-2 py-1.5 sm:px-4 sm:py-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                          >
                            Pular
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTutorialStep(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        index === tutorialStep
                          ? "w-4 sm:w-6 bg-blue-600"
                          : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
