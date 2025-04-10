import React, { useState, useEffect } from "react";
import { FaGift, FaCoins, FaPlusSquare, FaGem, FaStar } from "react-icons/fa";

function SecretCodes({
  updateCoins,
  addToInventory,
  setInventory,
  inventory,
  items,
  setItems,
  adminMode = false,
}) {
  const [code, setCode] = useState("");
  const [recentRewards, setRecentRewards] = useState([]);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [codeStatus, setCodeStatus] = useState({ message: "", type: "" }); // "success", "error", "info"
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Load redeemed codes from local storage
    const storedCodes = localStorage.getItem("redeemedCodes");
    if (storedCodes) {
      setRedeemedCodes(JSON.parse(storedCodes));
    }
  }, []);

  // Secret codes database
  // In a real app, these would be stored securely on a server
  const SECRET_CODES = {
    BEMVINDO: {
      type: "coins",
      amount: 1000,
      description: "Bônus de boas-vindas",
    },
    PIKACHUAMIGO: {
      type: "pokemon",
      pokemon: {
        id: 25, // Pikachu
        name: "pikachu",
        level: 25,
        special: true,
      },
      description: "Pikachu especial",
    },
    MEWTWOSHOW: {
      type: "pokemon",
      pokemon: {
        id: 150, // Mewtwo
        name: "mewtwo",
        level: 50,
        special: true,
      },
      description: "Mewtwo Lendário",
    },
    MUDKIP: {
      type: "pokemon",
      pokemon: {
        id: 258, // Mewtwo
        name: "mudkip",
        level: 15,
        special: true,
      },
      description: "Mudkip",
    },
    EEVEE: {
      type: "pokemon",
      pokemon: {
        id: 133,
        name: "eevee",
        level: 15,
        special: true,
      },
      description: "Eevee",
    },
    GOLDRUSH: {
      type: "coins",
      amount: 2500,
      description: "Recompensa de ouro",
    },
    RARECANDIES: {
      type: "item",
      item: {
        id: "rare_candy",
        name: "Rare Candy",
        description: "Aumenta 1 nível de um Pokémon",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png",
        category: "xpBoost",
        effect: { type: "xp", value: "level_up" },
        quantity: 5,
      },
      description: "5 Rare Candies",
    },
    MASTERBALL: {
      type: "item",
      item: {
        id: "master_ball",
        name: "Master Ball",
        description: "A pokébola definitiva com 100% de chance de captura",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
        category: "special",
        quantity: 1,
      },
      description: "Master Ball Especial",
    },
    CHARMANDER: {
      type: "pokemon",
      pokemon: {
        id: 4, // Charmander
        name: "charmander",
        level: 15,
        special: true,
      },
      description: "Charmander Inicial",
    },
    HEALUP: {
      type: "itemBundle",
      items: [
        {
          id: "sitrus_berry",
          name: "Sitrus Berry",
          description: "Recupera 50% de HP em batalha",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png",
          category: "healing",
          effect: { type: "heal", value: 50 },
          quantity: 3,
        },
        {
          id: "revive",
          name: "Revive",
          description: "Revive um Pokémon derrotado com 50% de HP",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png",
          category: "healing",
          effect: { type: "revive", value: 50 },
          quantity: 2,
        },
      ],
      description: "Pacote de Itens de Cura",
    },
    TRESESTARTER: {
      type: "pokemon", // Changed from pokemonBundle to pokemon
      pokemon: (() => {
        const starters = [
          { id: 1, name: "bulbasaur", level: 15, special: true },
          { id: 4, name: "charmander", level: 15, special: true },
          { id: 7, name: "squirtle", level: 15, special: true },
        ];
        // Randomly select one of the three starters
        return starters[Math.floor(Math.random() * starters.length)];
      })(),
      description: "Pokémon inicial aleatório de Kanto",
    },
    JOHTOSTART: {
      type: "pokemonBundle",
      pokemons: [
        { id: 152, name: "chikorita", level: 15, special: true },
        { id: 155, name: "cyndaquil", level: 15, special: true },
        { id: 158, name: "totodile", level: 15, special: true },
      ],
      description: "Três Pokémon iniciais de Johto",
    },
    ESTATISTICAS: {
      type: "itemBundle",
      items: [
        {
          id: "protein",
          name: "Protein",
          description: "Aumenta permanentemente o Attack do Pokémon",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png",
          category: "statBoost",
          effect: { type: "stat", stat: "attack", value: 10 },
          quantity: 3,
        },
        {
          id: "calcium",
          name: "Calcium",
          description: "Aumenta permanentemente o Special Attack do Pokémon",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/calcium.png",
          category: "statBoost",
          effect: { type: "stat", stat: "special-attack", value: 10 },
          quantity: 3,
        },
        {
          id: "iron",
          name: "Iron",
          description: "Aumenta permanentemente o Defense do Pokémon",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron.png",
          category: "statBoost",
          effect: { type: "stat", stat: "defense", value: 10 },
          quantity: 3,
        },
      ],
      description: "Pacote de itens de melhoria de status",
    },
    EEVEELUCAO: {
      type: "pokemon",
      pokemon: {
        id: 133, // Eevee
        name: "eevee",
        level: 25,
        special: true,
      },
      description: "Eevee especial de alto nível",
    },
    TREINADOR: {
      type: "coins",
      amount: 5000,
      description: "Grande bônus de moedas para treinador",
    },
    LENDARIOS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 144, name: "articuno", level: 50, special: true },
        { id: 145, name: "zapdos", level: 50, special: true },
        { id: 146, name: "moltres", level: 50, special: true },
      ],
      description: "Trio de pássaros lendários",
    },
    DRAGOES: {
      type: "pokemonBundle",
      pokemons: [
        { id: 147, name: "dratini", level: 20, special: true },
        { id: 246, name: "larvitar", level: 20, special: true },
        { id: 371, name: "bagon", level: 20, special: true },
      ],
      description: "Trio de Pokémon do tipo Dragão pré-evolução",
    },
    CURAMASTER: {
      type: "itemBundle",
      items: [
        {
          id: "max_potion",
          name: "Max Potion",
          description: "Recupera todo o HP de um Pokémon",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png",
          category: "healing",
          effect: { type: "heal", value: 100 },
          quantity: 5,
        },
        {
          id: "max_revive",
          name: "Max Revive",
          description: "Revive um Pokémon com HP completo",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png",
          category: "healing",
          effect: { type: "revive", value: 100 },
          quantity: 3,
        },
      ],
      description: "Kit de cura premium",
    },
    SORTEFELIZ: {
      type: "pokemon",
      pokemon: {
        id: 113, // Chansey
        name: "chansey",
        level: 30,
        special: true,
      },
      description: "Chansey de Sorte",
    },
    MEWMITICO: {
      type: "pokemon",
      pokemon: {
        id: 151, // Mew
        name: "mew",
        level: 40,
        special: true,
      },
      description: "Mew mítico",
    },
    GALARSTART: {
      type: "pokemonBundle",
      pokemons: [
        { id: 810, name: "grookey", level: 15, special: true },
        { id: 813, name: "scorbunny", level: 15, special: true },
        { id: 816, name: "sobble", level: 15, special: true },
      ],
      description: "Três Pokémon iniciais de Galar",
    },
    ALOLASTART: {
      type: "pokemonBundle",
      pokemons: [
        { id: 722, name: "rowlet", level: 15, special: true },
        { id: 725, name: "litten", level: 15, special: true },
        { id: 728, name: "popplio", level: 15, special: true },
      ],
      description: "Três Pokémon iniciais de Alola",
    },
    KALOSSTART: {
      type: "pokemonBundle",
      pokemons: [
        { id: 650, name: "chespin", level: 15, special: true },
        { id: 653, name: "fennekin", level: 15, special: true },
        { id: 656, name: "froakie", level: 15, special: true },
      ],
      description: "Três Pokémon iniciais de Kalos",
    },
    UNOVALENDAS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 638, name: "cobalion", level: 50, special: true },
        { id: 639, name: "terrakion", level: 50, special: true },
        { id: 640, name: "virizion", level: 50, special: true },
      ],
      description: "Trio das Espadas de Justiça",
    },
    LUCARIO: {
      type: "pokemon",
      pokemon: {
        id: 448, // Lucario
        name: "lucario",
        level: 35,
        special: true,
      },
      description: "Lucario especial",
    },
    GARCHOMP: {
      type: "pokemon",
      pokemon: {
        id: 445, // Garchomp
        name: "garchomp",
        level: 40,
        special: true,
      },
      description: "Garchomp especial",
    },
    ULTRABEASTS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 793, name: "nihilego", level: 55, special: true },
        { id: 794, name: "buzzwole", level: 55, special: true },
        { id: 795, name: "pheromosa", level: 55, special: true },
      ],
      description: "Ultrabestas poderosas",
    },
    MEGALUCARIO: {
      type: "pokemon",
      pokemon: {
        id: 448, // Lucario
        name: "lucario",
        level: 50,
        special: true,
      },
      description: "Mega Lucario especial",
    },
    EXTREMEBOOST: {
      type: "itemBundle",
      items: [
        {
          id: "exp_candy_xl",
          name: "EXP Candy XL",
          description: "Aumenta muito a experiência de um Pokémon",
          image:
            "https://archives.bulbagarden.net/media/upload/9/96/Bag_Exp._Candy_XL_SV_Sprite.png",
          category: "xpBoost",
          effect: { type: "xp", value: 3000 },
          quantity: 5,
        },
        {
          id: "rare_candy",
          name: "Rare Candy",
          description: "Aumenta instantaneamente um nível do Pokémon",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png",
          category: "xpBoost",
          effect: { type: "xp", value: "level_up" },
          quantity: 10,
        },
      ],
      description: "Pacote de itens de XP premium",
    },
    FOSSEIS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 138, name: "omanyte", level: 25, special: true },
        { id: 140, name: "kabuto", level: 25, special: true },
        { id: 142, name: "aerodactyl", level: 25, special: true },
      ],
      description: "Pokémon fósseis de Kanto",
    },
    FOGUELETRICO: {
      type: "pokemonBundle",
      pokemons: [
        { id: 156, name: "quilava", level: 30, special: true },
        { id: 125, name: "electabuzz", level: 30, special: true },
        { id: 126, name: "magmar", level: 30, special: true },
      ],
      description: "Trio de fogo e elétrico",
    },
    COINS: {
      type: "coins",
      amount: 100,
      description: "Bônus de moedas",
    },
    BIGCOINS: {
      type: "coins",
      amount: 1000,
      description: "Bônus grande de moedas",
    },
    MEGACOINS: {
      type: "coins",
      amount: 10000,
      description: "Mega bônus de moedas",
    },
    HIPERCOINS: {
      type: "coins",
      amount: 100000,
      description: "Hiper bônus de moedas",
    },
    HACK: {
      type: "coins",
      amount: 100000000000,
      description: "HACKKKKKK",
    },
    PREMIERBALL: {
      type: "itemBundle",
      items: [
        {
          id: "premier_ball",
          name: "Premier Ball",
          description: "Uma rara Poké Ball comemorativa",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png",
          category: "pokeball",
          effect: { catchRate: 1.2 },
          quantity: 10,
        },
      ],
      description: "Conjunto de Premier Balls",
    },
    ZLEGENDS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 717, name: "yveltal", level: 60, special: true },
        { id: 716, name: "xerneas", level: 60, special: true },
        { id: 718, name: "zygarde", level: 60, special: true },
      ],
      description: "Trio de lendários da geração 6",
    },
    CREATIONLEGENDS: {
      type: "pokemonBundle",
      pokemons: [
        { id: 483, name: "dialga", level: 60, special: true },
        { id: 484, name: "palkia", level: 60, special: true },
        { id: 487, name: "giratina", level: 60, special: true },
      ],
      description: "Trio de lendários da geração 4",
    },
    MYTHICAL: {
      type: "pokemon",
      pokemon: {
        id: 385, // Jirachi
        name: "jirachi",
        level: 50,
        special: true,
      },
      description: "Jirachi mítico",
    },
    MEGAPOWER: {
      type: "itemBundle",
      items: [
        {
          id: "life_orb",
          name: "Life Orb",
          description: "Aumenta o poder dos ataques, mas causa dano ao usuário",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png",
          category: "battleItem",
          effect: { type: "powerBoost", value: 30 },
          quantity: 1,
        },
        {
          id: "choice_band",
          name: "Choice Band",
          description: "Aumenta o Attack, mas limita a um movimento",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png",
          category: "battleItem",
          effect: { type: "statBoost", stat: "attack", value: 50 },
          quantity: 1,
        },
      ],
      description: "Itens de poder para batalha",
    },
    DRAGONITE: {
      type: "pokemon",
      pokemon: {
        id: 149, // Dragonite
        name: "dragonite",
        level: 45,
        special: true,
      },
      description: "Dragonite poderoso",
    },
    MASTERTRADE: {
      type: "itemBundle",
      items: [
        {
          id: "master_ball",
          name: "Master Ball",
          description: "A pokébola definitiva com 100% de chance de captura",
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
          category: "pokeball",
          effect: { catchRate: 255 },
          quantity: 3,
        },
      ],
      description: "Pacote de Master Balls",
    },
  };

  const redeemCode = async () => {
    if (!code.trim()) {
      setCodeStatus({
        message: "Por favor, insira um código",
        type: "error",
      });
      return;
    }

    const upperCode = code.trim().toUpperCase();

    // Check if code has already been redeemed
    if (redeemedCodes.includes(upperCode)) {
      setCodeStatus({
        message: "Este código já foi resgatado",
        type: "error",
      });
      return;
    }

    // Check if code exists
    const reward = SECRET_CODES[upperCode];
    if (!reward) {
      setCodeStatus({
        message: "Código inválido ou expirado",
        type: "error",
      });
      return;
    }

    // Process the reward
    try {
      setShowAnimation(true);

      // Process based on reward type
      switch (reward.type) {
        case "coins":
          updateCoins(reward.amount);
          setRecentRewards([
            {
              type: "coins",
              icon: <FaCoins className="text-yellow-500" />,
              description: `${reward.amount} moedas`,
              details: reward.description,
            },
            ...recentRewards.slice(0, 4),
          ]);
          break;

        case "pokemon":
          await addPokemonToInventory(reward.pokemon);
          setRecentRewards([
            {
              type: "pokemon",
              icon: <FaPlusSquare className="text-green-500" />,
              description: `${reward.pokemon.name.toUpperCase()}`,
              details: reward.description,
            },
            ...recentRewards.slice(0, 4),
          ]);
          break;

        case "pokemonBundle":
          try {
            console.log(
              `Starting to process bundle with ${reward.pokemons.length} Pokémon`
            );
            const addedPokemonNames = [];
            const addedPokemon = [];

            // Set code status to show progress
            setCodeStatus({
              message: `Processando pacote com ${reward.pokemons.length} Pokémon...`,
              type: "info",
            });

            // Process each pokemon one at a time with a delay between requests
            for (let i = 0; i < reward.pokemons.length; i++) {
              const pokemonData = reward.pokemons[i];
              try {
                console.log(
                  `Processing Pokémon ${i + 1}/${reward.pokemons.length}: ${
                    pokemonData.name
                  } (ID: ${pokemonData.id})`
                );

                // Add the pokémon to inventory
                const pokemon = await addPokemonToInventory(pokemonData);
                addedPokemonNames.push(pokemon.name.toUpperCase());
                addedPokemon.push(pokemon);

                console.log(`Successfully added ${pokemon.name} to inventory`);

                // Update code status to show progress
                setCodeStatus({
                  message: `Adicionado ${i + 1}/${
                    reward.pokemons.length
                  }: ${pokemon.name.toUpperCase()}`,
                  type: "info",
                });

                // Short delay between API calls to prevent rate limiting
                if (i < reward.pokemons.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }
              } catch (err) {
                console.error(`Failed to add ${pokemonData.name}:`, err);
              }
            }

            console.log(
              `Total Pokémon successfully added: ${addedPokemon.length} of ${reward.pokemons.length}`
            );

            // Final results check
            if (addedPokemon.length === 0) {
              throw new Error("Nenhum Pokémon foi adicionado ao inventário");
            }

            setRecentRewards([
              {
                type: "pokemonBundle",
                icon: <FaPlusSquare className="text-blue-500" />,
                description: `${addedPokemonNames.join(", ")}`,
                details: `${addedPokemonNames.length} Pokémon: ${reward.description}`,
              },
              ...recentRewards.slice(0, 4),
            ]);
          } catch (error) {
            console.error("Error processing Pokémon bundle:", error);
            setCodeStatus({
              message: `Erro ao processar pacote: ${error.message}`,
              type: "error",
            });
            throw error;
          }
          break;

        case "item":
          addItemToInventory(reward.item);
          setRecentRewards([
            {
              type: "item",
              icon: <FaGift className="text-purple-500" />,
              description: `${reward.item.name} (${reward.item.quantity}x)`,
              details: reward.description,
            },
            ...recentRewards.slice(0, 4),
          ]);
          break;

        case "itemBundle":
          reward.items.forEach((item) => addItemToInventory(item));
          setRecentRewards([
            {
              type: "itemBundle",
              icon: <FaGift className="text-indigo-500" />,
              description: `Pacote de Itens (${reward.items.length})`,
              details: reward.description,
            },
            ...recentRewards.slice(0, 4),
          ]);
          break;

        default:
          console.error("Unknown reward type");
      }

      // Mark code as redeemed
      const updatedRedeemedCodes = [...redeemedCodes, upperCode];
      setRedeemedCodes(updatedRedeemedCodes);
      localStorage.setItem(
        "redeemedCodes",
        JSON.stringify(updatedRedeemedCodes)
      );

      setCodeStatus({
        message: `Código resgatado com sucesso: ${reward.description}!`,
        type: "success",
      });

      // Clear input
      setCode("");

      setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } catch (error) {
      console.error("Error redeeming code:", error);
      setCodeStatus({
        message: "Erro ao processar recompensa",
        type: "error",
      });
    }
  };

  const addPokemonToInventory = async (pokemonData) => {
    try {
      console.log(
        `Starting to add Pokémon: ${pokemonData.name} (ID: ${pokemonData.id})`
      );

      // Try the API call with retries
      let response;
      let data;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon data: ${response.status}`);
          }

          data = await response.json();
          console.log(`Successfully fetched data for ${data.name}`);
          break; // Success, exit the retry loop
        } catch (err) {
          retryCount++;
          console.warn(`Fetch attempt ${retryCount} failed: ${err.message}`);

          if (retryCount >= maxRetries) {
            throw err; // Max retries reached, propagate the error
          }

          // Wait before retrying (with increasing delay)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }

      // Get moves with a simplified approach to avoid rate limiting
      const moveUrls = data.moves
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map((m) => m.move.url);

      const moves = moveUrls.map((url, index) => {
        // Use placeholder moves without making API calls
        return {
          name: url.split("/").filter(Boolean).pop() || `move_${index + 1}`,
          type: ["normal", "fire", "water", "electric"][index % 4] || "normal",
          power: 50 + index * 10,
          accuracy: 95,
        };
      });

      // Calculate XP based on desired level
      let totalXp = 0;
      let level = 1;
      while (level < pokemonData.level) {
        totalXp += level * 100;
        level++;
      }

      const newPokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map((t) => t.type.name),
        height: data.height,
        weight: data.weight,
        stats: data.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat + pokemonData.level * 2,
        })),
        moves: moves,
        exp: totalXp,
        isSpecial: pokemonData.special || false,
      };

      // Create a copy of the inventory and add the new Pokemon
      const updatedInventory = [...inventory, newPokemon];
      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));

      console.log(`Added ${newPokemon.name} to inventory successfully`);
      return newPokemon;
    } catch (error) {
      console.error(
        `Error adding Pokémon ${pokemonData?.name || pokemonData?.id}: ${
          error.message
        }`
      );
      throw error;
    }
  };

  const addItemToInventory = (itemData) => {
    const updatedItems = [...items];
    const existingItem = updatedItems.find((i) => i.id === itemData.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + itemData.quantity;
    } else {
      updatedItems.push(itemData);
    }

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  return (
    <div className={`${adminMode ? "" : "card p-6 my-6"}`}>
      {!adminMode && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaGem className="text-indigo-500" />
          Códigos Secretos
        </h2>
      )}

      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <p className="text-gray-700 mb-4">
          Insira um código secreto para obter recompensas exclusivas como
          Pokémon especiais, itens raros ou moedas!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Digite o código secreto"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase bg-white"
            />
            {code && (
              <span className="absolute right-3 top-3 text-xs font-medium text-indigo-600">
                {code.length} caracteres
              </span>
            )}
          </div>
          <button
            onClick={redeemCode}
            className="btn-secondary px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 sm:w-auto"
          >
            <FaGift className="animate-pulse-soft" /> Resgatar
          </button>
        </div>

        {codeStatus.message && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              codeStatus.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : codeStatus.type === "error"
                ? "bg-red-100 text-red-800 border-l-4 border-red-500"
                : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
            }`}
          >
            {codeStatus.message}
          </div>
        )}
      </div>

      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-8xl text-yellow-500 animate-ping">
            <FaStar />
          </div>
        </div>
      )}

      {/* History of redeemed rewards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaGift className="text-indigo-500" /> Recompensas Recentes
        </h3>

        {recentRewards.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-gray-500 text-center border border-dashed border-gray-200">
            <FaGift className="mx-auto text-3xl text-gray-300 mb-2" />
            As recompensas resgatadas aparecerão aqui
          </div>
        ) : (
          <div className="space-y-3">
            {recentRewards.map((reward, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl flex-shrink-0 bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  {reward.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium truncate text-lg">
                    {reward.description}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {reward.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SecretCodes;
