import React, { useState, useEffect } from "react";
import GymBattle from "./GymBattle";
import {
  GiRock,
  GiWaterDrop,
  GiElectric,
  GiGrass,
  GiPoisonBottle,
  GiCrystalBall,
  GiFire,
  GiEarthAmerica,
} from "react-icons/gi";

function Gyms({ inventory, updateCoins, setInventory, items, setItems }) {
  const [selectedGym, setSelectedGym] = useState(null);
  const [showBattle, setShowBattle] = useState(false);
  const [playerHighestLevel, setPlayerHighestLevel] = useState(1);
  const [earnedBadges, setEarnedBadges] = useState(
    JSON.parse(localStorage.getItem("badges")) || []
  );

  // Calcula o nível mais alto entre todos os Pokémon
  useEffect(() => {
    if (inventory.length > 0) {
      const highestLevel = inventory.reduce((max, pokemon) => {
        const level = calculateLevel(pokemon.exp || 0);
        return level > max ? level : max;
      }, 1);
      setPlayerHighestLevel(highestLevel);
    }
  }, [inventory]);

  // Função para calcular o nível de um Pokémon
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

  // Lista de ginásios do jogo
  const gyms = [
    {
      id: 1,
      name: "Ginásio Pewter",
      badge: "BoulderBadge",
      badgeColor: "from-gray-500 to-gray-700",
      badgeIcon: <GiRock className="text-xl" />,
      description: "Especialidade: Pokémon tipo Pedra",
      leader: "Brock",
      leaderImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2_xzSNoZK9m_Ivy1nfycdRRuWlyBAL-nyzA&s",
      requiredLevel: 5,
      pokemon: [
        { id: 74, name: "Geodude", level: 7 },
        { id: 95, name: "Onix", level: 10 },
      ],
      rewards: { coins: 500, exp: 200 },
    },
    {
      id: 2,
      name: "Ginásio Cerulean",
      badge: "CascadeBadge",
      badgeColor: "from-blue-400 to-blue-600",
      badgeIcon: <GiWaterDrop className="text-xl" />,
      description: "Especialidade: Pokémon tipo Água",
      leader: "Misty",
      leaderImage:
        "https://i.kinja-img.com/image/upload/c_fit,q_60,w_645/f8b4e26d50a9aaf515818a69aa1d9fb2.jpg",
      requiredLevel: 10,
      pokemon: [
        { id: 120, name: "Staryu", level: 12 },
        { id: 121, name: "Starmie", level: 15 },
      ],
      rewards: { coins: 750, exp: 350 },
    },
    {
      id: 3,
      name: "Ginásio Vermilion",
      badge: "ThunderBadge",
      badgeColor: "from-yellow-400 to-yellow-600",
      badgeIcon: <GiElectric className="text-xl" />,
      description: "Especialidade: Pokémon tipo Elétrico",
      leader: "Lt. Surge",
      leaderImage:
        "https://cdn.costumewall.com/wp-content/uploads/2017/10/lt-surge.jpg",
      requiredLevel: 15,
      pokemon: [
        { id: 25, name: "Pikachu", level: 17 },
        { id: 26, name: "Raichu", level: 20 },
      ],
      rewards: { coins: 1000, exp: 500 },
    },
    {
      id: 4,
      name: "Ginásio Celadon",
      badge: "RainbowBadge",
      badgeColor: "from-green-400 to-green-600",
      badgeIcon: <GiGrass className="text-xl" />,
      description: "Especialidade: Pokémon tipo Planta",
      leader: "Erika",
      leaderImage:
        "https://assets.mycast.io/actor_images/actor-erika-pokemon-598747_large.jpg?1668896763",
      requiredLevel: 20,
      pokemon: [
        { id: 114, name: "Tangela", level: 22 },
        { id: 45, name: "Vileplume", level: 25 },
      ],
      rewards: { coins: 1500, exp: 750 },
    },
    {
      id: 5,
      name: "Ginásio Fuchsia",
      badge: "SoulBadge",
      badgeColor: "from-purple-400 to-purple-600",
      badgeIcon: <GiPoisonBottle className="text-xl" />,
      description: "Especialidade: Pokémon tipo Venenoso",
      leader: "Koga",
      leaderImage:
        "https://media.pocketmonsters.net/characters/2/203.png/t/325.png",
      requiredLevel: 25,
      pokemon: [
        { id: 109, name: "Koffing", level: 27 },
        { id: 110, name: "Weezing", level: 30 },
        { id: 49, name: "Venomoth", level: 32 },
      ],
      rewards: { coins: 2000, exp: 1000 },
    },
    {
      id: 6,
      name: "Ginásio Saffron",
      badge: "MarshBadge",
      badgeColor: "from-pink-400 to-pink-600",
      badgeIcon: <GiCrystalBall className="text-xl" />,
      description: "Especialidade: Pokémon tipo Psíquico",
      leader: "Sabrina",
      leaderImage:
        "https://daily.pokecommunity.com/wp-content/uploads/2021/08/medium_2021-07-17-e675e8b999.jpg",
      requiredLevel: 30,
      pokemon: [
        { id: 64, name: "Kadabra", level: 32 },
        { id: 122, name: "Mr. Mime", level: 35 },
        { id: 65, name: "Alakazam", level: 38 },
      ],
      rewards: { coins: 2500, exp: 1500 },
    },
    {
      id: 7,
      name: "Ginásio Cinnabar",
      badge: "VolcanoBadge",
      badgeColor: "from-red-500 to-red-700",
      badgeIcon: <GiFire className="text-xl" />,
      description: "Especialidade: Pokémon tipo Fogo",
      leader: "Blaine",
      leaderImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIcZRW2yp3q5HM1VhuNGKUAqCevL5bXPX-2XQTNHbhaIn8aSFGlvfUesdY9o3UkwlgJiM&usqp=CAU",
      requiredLevel: 35,
      pokemon: [
        { id: 58, name: "Growlithe", level: 37 },
        { id: 78, name: "Rapidash", level: 40 },
        { id: 59, name: "Arcanine", level: 42 },
      ],
      rewards: { coins: 3000, exp: 2000 },
    },
    {
      id: 8,
      name: "Ginásio Viridian",
      badge: "EarthBadge",
      badgeColor: "from-green-600 to-green-800",
      badgeIcon: <GiEarthAmerica className="text-xl" />,
      description: "Especialidade: Pokémon tipo Terra",
      leader: "Giovanni",
      leaderImage:
        "https://archives.bulbagarden.net/media/upload/thumb/a/a7/Lets_Go_Pikachu_Eevee_Giovanni.png/220px-Lets_Go_Pikachu_Eevee_Giovanni.png",
      requiredLevel: 40,
      pokemon: [
        { id: 51, name: "Dugtrio", level: 42 },
        { id: 31, name: "Nidoqueen", level: 45 },
        { id: 34, name: "Nidoking", level: 45 },
        { id: 112, name: "Rhydon", level: 48 },
      ],
      rewards: { coins: 5000, exp: 3000 },
    },
  ];

  const handleGymSelect = (gym) => {
    setSelectedGym(gym);
    setShowBattle(true);
  };

  const handleBattleEnd = (result) => {
    // Se ganhou a batalha
    if (result.victory) {
      // Adiciona o emblema se não tiver ainda
      if (!earnedBadges.includes(selectedGym.id)) {
        const updatedBadges = [...earnedBadges, selectedGym.id];
        setEarnedBadges(updatedBadges);
        localStorage.setItem("badges", JSON.stringify(updatedBadges));
      }

      // Distribui as recompensas
      updateCoins(selectedGym.rewards.coins);

      // Dá experiência para o Pokémon usado na batalha
      if (result.pokemonUsed) {
        const updatedInventory = inventory.map((pokemon) => {
          if (
            pokemon.id === result.pokemonUsed.id &&
            JSON.stringify(pokemon.moves) ===
              JSON.stringify(result.pokemonUsed.moves)
          ) {
            const newExp = (pokemon.exp || 0) + selectedGym.rewards.exp;
            const newLevel = calculateLevel(newExp);
            const oldLevel = calculateLevel(pokemon.exp || 0);

            // Se subiu de nível, aumenta os stats
            let updatedStats = [...pokemon.stats];
            if (newLevel > oldLevel) {
              updatedStats = updatedStats.map((stat) => ({
                ...stat,
                value: stat.value + (newLevel - oldLevel) * 2,
              }));
            }

            return {
              ...pokemon,
              exp: newExp,
              stats: updatedStats,
            };
          }
          return pokemon;
        });

        setInventory(updatedInventory);
        localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      }
    }

    setShowBattle(false);
  };

  const isBadgeEarned = (gymId) => {
    return earnedBadges.includes(gymId);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl my-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ginásios Pokémon
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Seus Emblemas</h3>
        <div className="flex flex-wrap gap-3">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg
                ${
                  isBadgeEarned(gym.id)
                    ? `bg-gradient-to-br ${gym.badgeColor} text-white shadow-md`
                    : "bg-gray-200 text-gray-400"
                }`}
              title={
                isBadgeEarned(gym.id)
                  ? `${gym.badge} - Conquistado!`
                  : "Não conquistado"
              }
            >
              {gym.badgeIcon}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.map((gym) => {
          const isUnlocked = playerHighestLevel >= gym.requiredLevel;
          const hasBadge = isBadgeEarned(gym.id);

          return (
            <div
              key={gym.id}
              className={`border border-gray-300 rounded-xl overflow-hidden shadow-md 
                ${isUnlocked ? "bg-white" : "bg-gray-100"}`}
            >
              <div
                className={`bg-gradient-to-r ${gym.badgeColor} text-white p-4`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{gym.name}</h3>
                  {hasBadge && (
                    <span className="bg-white text-gray-500 text-2xl p-1 rounded-full">
                      {gym.badgeIcon}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{gym.description}</p>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={gym.leaderImage}
                    alt={gym.leader}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">Líder: {gym.leader}</p>
                    <p className="text-sm text-gray-600">
                      Nível necessário: {gym.requiredLevel}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-semibold mb-1">Pokémon do Líder:</p>
                  <div className="flex flex-wrap gap-2">
                    {gym.pokemon.map((pokemon) => (
                      <span
                        key={pokemon.id}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {pokemon.name} (N{pokemon.level})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-semibold mb-1">Recompensas:</p>
                  <div className="flex gap-3">
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {gym.rewards.coins} moedas
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {gym.rewards.exp} XP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleGymSelect(gym)}
                  disabled={!isUnlocked}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    isUnlocked
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  {isUnlocked
                    ? hasBadge
                      ? "Desafiar Novamente"
                      : "Desafiar Ginásio"
                    : `Desbloqueado no Nível ${gym.requiredLevel}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showBattle && selectedGym && (
        <GymBattle
          gym={selectedGym}
          inventory={inventory}
          items={items || []} // Ensure items is never undefined
          setItems={setItems}
          onClose={() => setShowBattle(false)}
          onBattleEnd={handleBattleEnd}
        />
      )}
    </div>
  );
}

export default Gyms;
