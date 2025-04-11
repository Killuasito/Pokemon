import React, { useState, useEffect } from "react";
import {
  FaCoins,
  FaShoppingBag,
  FaInfoCircle,
  FaMinus,
  FaPlus,
  FaCheck,
} from "react-icons/fa";

function ItemShop({ coins, updateCoins, items, setItems }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [notification, setNotification] = useState(null);
  const [purchaseQuantities, setPurchaseQuantities] = useState({});
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const ITEM_CATEGORIES = {
    pokeball: "Pokébolas",
    xpBoost: "Boosters de XP",
    healing: "Itens de Cura",
    statBoost: "Boosters de Status",
    megaStone: "Pedras de Mega Evolução",
    all: "Todos os Itens",
  };

  const SHOP_ITEMS = [
    {
      id: "pokeball",
      name: "Poké Ball",
      description: "Pokébola básica para capturar Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
      price: 200,
      category: "pokeball",
      effect: { catchRate: 1 },
    },
    {
      id: "greatball",
      name: "Great Ball",
      description: "Pokébola com taxa de captura melhorada",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
      price: 600,
      category: "pokeball",
      effect: { catchRate: 1.5 },
    },
    {
      id: "ultraball",
      name: "Ultra Ball",
      description: "Pokébola com alta taxa de captura",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
      price: 1200,
      category: "pokeball",
      effect: { catchRate: 2 },
    },
    {
      id: "master_ball",
      name: "Master Ball",
      description: "Garante a captura de qualquer Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
      price: 10000,
      category: "pokeball",
      effect: { catchRate: 255 },
    },
    {
      id: "rare_candy",
      name: "Rare Candy",
      description: "Aumenta instantaneamente um nível do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png",
      price: 3000,
      category: "xpBoost",
      effect: { type: "xp", value: "level_up" },
    },
    {
      id: "exp_candy_s",
      name: "EXP Candy S",
      description: "Dá uma pequena quantidade de EXP ao Pokémon",
      image:
        "https://archives.bulbagarden.net/media/upload/9/96/Bag_Exp._Candy_XL_SV_Sprite.png",
      price: 800,
      category: "xpBoost",
      effect: { type: "xp", value: 500 },
    },
    {
      id: "exp_candy_m",
      name: "EXP Candy M",
      description: "Dá uma quantidade média de EXP ao Pokémon",
      image:
        "https://archives.bulbagarden.net/media/upload/b/bf/Bag_Exp._Candy_M_SV_Sprite.png",
      price: 1500,
      category: "xpBoost",
      effect: { type: "xp", value: 1500 },
    },
    {
      id: "potion",
      name: "Potion",
      description: "Recupera 20 HP de um Pokémon em batalha",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png",
      price: 300,
      category: "healing",
      effect: { type: "heal", value: 20 },
    },
    {
      id: "super_potion",
      name: "Super Potion",
      description: "Recupera 50 HP de um Pokémon em batalha",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png",
      price: 700,
      category: "healing",
      effect: { type: "heal", value: 50 },
    },
    {
      id: "hyper_potion",
      name: "Hyper Potion",
      description: "Recupera 120 HP de um Pokémon em batalha",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png",
      price: 1500,
      category: "healing",
      effect: { type: "heal", value: 120 },
    },
    {
      id: "max_potion",
      name: "Max Potion",
      description: "Recupera todo o HP de um Pokémon em batalha",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png",
      price: 2500,
      category: "healing",
      effect: { type: "heal", value: 100 },
    },
    {
      id: "revive",
      name: "Revive",
      description: "Revive um Pokémon derrotado com 50% de HP",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png",
      price: 1500,
      category: "healing",
      effect: { type: "revive", value: 50 },
    },
    {
      id: "max_revive",
      name: "Max Revive",
      description: "Revive um Pokémon derrotado com 100% de HP",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png",
      price: 3000,
      category: "healing",
      effect: { type: "revive", value: 100 },
    },
    {
      id: "protein",
      name: "Protein",
      description: "Aumenta permanentemente o Attack do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png",
      price: 5000,
      category: "statBoost",
      effect: { type: "stat", stat: "attack", value: 10 },
    },
    {
      id: "calcium",
      name: "Calcium",
      description: "Aumenta permanentemente o Special Attack do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/calcium.png",
      price: 5000,
      category: "statBoost",
      effect: { type: "stat", stat: "special-attack", value: 10 },
    },
    {
      id: "iron",
      name: "Iron",
      description: "Aumenta permanentemente o Defense do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron.png",
      price: 5000,
      category: "statBoost",
      effect: { type: "stat", stat: "defense", value: 10 },
    },
    {
      id: "zinc",
      name: "Zinc",
      description: "Aumenta permanentemente o Special Defense do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zinc.png",
      price: 5000,
      category: "statBoost",
      effect: { type: "stat", stat: "special-defense", value: 10 },
    },
    {
      id: "carbos",
      name: "Carbos",
      description: "Aumenta permanentemente o Speed do Pokémon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/carbos.png",
      price: 5000,
      category: "statBoost",
      effect: { type: "stat", stat: "speed", value: 10 },
    },
    {
      id: "charizardite_x",
      name: "Charizardite X",
      description: "Permite a Mega Evolução de Charizard para Mega Charizard X",
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftf0k-b8e6e594-6c62-45b3-9b9b-b9743888658e.png/v1/fit/w_375,h_375/charizardite_x_by_jormxdos_dfftf0k-375w.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGYway1iOGU2ZTU5NC02YzYyLTQ1YjMtOWI5Yi1iOTc0Mzg4ODY1OGUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.UQMi2MjruZpfyL_P31T36e7umCgqwGVmYowWn6UI-6s",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "charizard",
        variant: "x",
        statsBoost: { attack: 30, defense: 20, "special-attack": 10 },
        typeChange: ["fire", "dragon"],
      },
    },
    {
      id: "charizardite_y",
      name: "Charizardite Y",
      description: "Permite a Mega Evolução de Charizard para Mega Charizard Y",
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftf0q-dababa25-40c8-43b8-aaeb-65bb6be03f48.png/v1/fill/w_1280,h_1280/charizardite_y_by_jormxdos_dfftf0q-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGYwcS1kYWJhYmEyNS00MGM4LTQzYjgtYWFlYi02NWJiNmJlMDNmNDgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.cE6-DL7lRAMaKwkqXfzipx-cV5JvAxJo14M0c4_r90E",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "charizard",
        variant: "y",
        statsBoost: { attack: 10, "special-attack": 40 },
        typeChange: ["fire", "flying"],
      },
    },
    {
      id: "venusaurite",
      name: "Venusaurite",
      description: "Permite a Mega Evolução de Venusaur para Mega Venusaur",
      image:
        "https://archives.bulbagarden.net/media/upload/7/7e/Bag_Venusaurite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "venusaur",
        statsBoost: { defense: 20, "special-defense": 30 },
      },
    },
    {
      id: "blastoisinite",
      name: "Blastoisinite",
      description: "Permite a Mega Evolução de Blastoise para Mega Blastoise",
      image:
        "https://archives.bulbagarden.net/media/upload/d/da/Bag_Blastoisinite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "blastoise",
        statsBoost: { "special-attack": 30, "special-defense": 20 },
      },
    },
    {
      id: "alakazite",
      name: "Alakazite",
      description: "Permite a Mega Evolução de Alakazam para Mega Alakazam",
      image:
        "https://archives.bulbagarden.net/media/upload/c/c5/Bag_Alakazite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "alakazam",
        statsBoost: { "special-attack": 40, speed: 10 },
      },
    },
    {
      id: "gengarite",
      name: "Gengarite",
      description: "Permite a Mega Evolução de Gengar para Mega Gengar",
      image:
        "https://archives.bulbagarden.net/media/upload/0/0d/Bag_Gengarite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "gengar",
        statsBoost: { "special-attack": 30, speed: 20 },
      },
    },
    {
      id: "mewtwo_x",
      name: "Mewtwonite X",
      description: "Permite a Mega Evolução de Mewtwo para Mega Mewtwo X",
      image:
        "https://archives.bulbagarden.net/media/upload/c/c1/Bag_Mewtwonite_X_Sprite.png",
      price: 30000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "mewtwo",
        variant: "x",
        statsBoost: { attack: 40, defense: 20, "special-attack": 10 },
        typeChange: ["psychic", "fighting"],
      },
    },
    {
      id: "mewtwo_y",
      name: "Mewtwonite Y",
      description: "Permite a Mega Evolução de Mewtwo para Mega Mewtwo Y",
      image:
        "https://archives.bulbagarden.net/media/upload/8/85/Bag_Mewtwonite_Y_Sprite.png",
      price: 30000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "mewtwo",
        variant: "y",
        statsBoost: { "special-attack": 40, speed: 20 },
      },
    },
    {
      id: "lucarionite",
      name: "Lucarionite",
      description: "Permite a Mega Evolução de Lucario para Mega Lucario",
      image:
        "https://archives.bulbagarden.net/media/upload/7/70/Bag_Lucarionite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "lucario",
        statsBoost: { attack: 25, "special-attack": 25 },
      },
    },
    {
      id: "gyaradosite",
      name: "Gyaradosite",
      description: "Permite a Mega Evolução de Gyarados para Mega Gyarados",
      image:
        "https://archives.bulbagarden.net/media/upload/e/ea/Bag_Gyaradosite_Sprite.png",
      price: 15000,
      category: "megaStone",
      effect: {
        type: "megaEvolution",
        pokemon: "gyarados",
        statsBoost: { attack: 30, defense: 20 },
        typeChange: ["water", "dark"],
      },
    },
  ];

  const buyItem = (item, quantity = 1) => {
    const totalPrice = item.price * quantity;

    if (coins < totalPrice) {
      setNotification({
        type: "error",
        message: "Moedas insuficientes para comprar este item!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Pay for the item
    updateCoins(-totalPrice);

    // Add it to inventory
    const updatedItems = [...items];
    const existingItem = updatedItems.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      updatedItems.push({
        ...item,
        quantity: quantity,
      });
    }

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    setNotification({
      type: "success",
      message: `${quantity}x ${item.name} adicionado ao inventário!`,
    });
    setTimeout(() => setNotification(null), 3000);

    // Reset quantity selector
    setPurchaseQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setShowQuantitySelector(false);
    setSelectedItem(null);
  };

  const openQuantitySelector = (item) => {
    // Initialize quantity to 1 if not already set
    if (!purchaseQuantities[item.id]) {
      setPurchaseQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    }
    setSelectedItem(item);
    setShowQuantitySelector(true);
  };

  const handleQuantityChange = (increase) => {
    if (!selectedItem) return;

    setPurchaseQuantities((prev) => {
      const currentQty = prev[selectedItem.id] || 1;
      const maxAffordable = Math.floor(coins / selectedItem.price);

      let newQty = increase
        ? Math.min(currentQty + 1, maxAffordable, 99)
        : Math.max(currentQty - 1, 1);

      return { ...prev, [selectedItem.id]: newQty };
    });
  };

  const displayedItems =
    activeCategory === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="card p-6 my-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaShoppingBag className="text-indigo-500" />
          Loja de Itens
        </h2>

        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg">
          <FaCoins className="text-yellow-600 text-xl" />
          <span className="font-bold text-yellow-800">{coins}</span>
          <span className="text-yellow-800">moedas</span>
        </div>
      </div>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex overflow-x-auto scrollbar-thin mb-8 pb-2">
        {Object.entries(ITEM_CATEGORIES).map(([category, label]) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap font-medium transition-colors border-b-2 ${
              activeCategory === category
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <span className="flex items-center text-sm font-medium text-indigo-600">
                  <FaCoins className="mr-1" /> {item.price}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-800">
                  {ITEM_CATEGORIES[item.category]}
                </span>
                <button
                  onClick={() => openQuantitySelector(item)}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <p className="text-blue-800 text-sm">
            Os itens comprados podem ser acessados através da aba "Inventário".
            Itens de cura só funcionam durante batalhas, enquanto itens de
            status e XP podem ser usados a qualquer momento.
          </p>
        </div>
      </div>

      {/* Quantity Selector Modal */}
      {showQuantitySelector && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Selecionar quantidade
            </h3>

            <div className="flex items-center justify-center gap-4 my-6">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="h-16 w-16 object-contain"
              />

              <div>
                <p className="font-medium text-gray-900">{selectedItem.name}</p>
                <div className="flex items-center text-indigo-600">
                  <FaCoins className="mr-1" />
                  <span>{selectedItem.price} por unidade</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Preço total:</span>
                <div className="flex items-center text-indigo-600 font-bold">
                  <FaCoins className="mr-1" />
                  <span>
                    {selectedItem.price *
                      (purchaseQuantities[selectedItem.id] || 1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleQuantityChange(false)}
                  disabled={(purchaseQuantities[selectedItem.id] || 1) <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaMinus />
                </button>

                <div className="w-16 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold">
                  {purchaseQuantities[selectedItem.id] || 1}
                </div>

                <button
                  onClick={() => handleQuantityChange(true)}
                  disabled={
                    (purchaseQuantities[selectedItem.id] || 1) >=
                    Math.min(99, Math.floor(coins / selectedItem.price))
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {[1, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => {
                      const maxAffordable = Math.floor(
                        coins / selectedItem.price
                      );
                      const newQty = Math.min(qty, maxAffordable);
                      setPurchaseQuantities((prev) => ({
                        ...prev,
                        [selectedItem.id]: newQty,
                      }));
                    }}
                    disabled={Math.floor(coins / selectedItem.price) < qty}
                    className="py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                  >
                    {qty}x
                  </button>
                ))}
                {[20, 50, 99].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => {
                      const maxAffordable = Math.floor(
                        coins / selectedItem.price
                      );
                      const newQty = Math.min(qty, maxAffordable);
                      setPurchaseQuantities((prev) => ({
                        ...prev,
                        [selectedItem.id]: newQty,
                      }));
                    }}
                    disabled={Math.floor(coins / selectedItem.price) < qty}
                    className="py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                  >
                    {qty}x
                  </button>
                ))}
              </div>

              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowQuantitySelector(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={() =>
                    buyItem(
                      selectedItem,
                      purchaseQuantities[selectedItem.id] || 1
                    )
                  }
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FaCheck />
                  Confirmar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemShop;
