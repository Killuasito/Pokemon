import React, { useState } from "react";
import {
  FaTrash,
  FaExclamationTriangle,
  FaCog,
  FaUndo,
  FaCoins,
  FaBox,
  FaGift,
  FaLock,
  FaLockOpen,
  FaKey,
  FaCode,
  FaClipboard,
  FaCheck,
} from "react-icons/fa";

function Settings({
  setInventory,
  setItems,
  setCoins,
  resetTutorial,
  inventory,
  items,
  updateCoins,
  addToInventory,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetProgress, setResetProgress] = useState(0);
  const [showSecretCodes, setShowSecretCodes] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const ADMIN_PASSWORD = "poke123";

  // Todos os códigos secretos disponíveis
  const SECRET_CODES = [
    { code: "BEMVINDO", description: "Bônus de boas-vindas - 1000 moedas" },
    { code: "PIKACHUAMIGO", description: "Pikachu especial (nível 25)" },
    { code: "MEWTWOSHOW", description: "Mewtwo lendário (nível 50)" },
    { code: "MUDKIP", description: "Mudkip (nível 15)" },
    { code: "EEVEE", description: "Eevee (nível 15)" },
    { code: "GOLDRUSH", description: "Recompensa de ouro - 2500 moedas" },
    { code: "RARECANDIES", description: "5 Rare Candies" },
    { code: "MASTERBALL", description: "1 Master Ball especial" },
    { code: "CHARMANDER", description: "Charmander inicial (nível 15)" },
    { code: "HEALUP", description: "Pacote de itens de cura" },
    {
      code: "TRESESTARTER",
      description: "Um Pokémon inicial aleatório de Kanto",
    },
    { code: "JOHTOSTART", description: "Três Pokémon iniciais de Johto" },
    {
      code: "ESTATISTICAS",
      description: "Pacote de itens de melhoria de status",
    },
    {
      code: "EEVEELUCAO",
      description: "Eevee especial de alto nível (nível 25)",
    },
    { code: "TREINADOR", description: "Grande bônus de moedas - 5000 moedas" },
    { code: "LENDARIOS", description: "Trio de pássaros lendários" },
    {
      code: "DRAGOES",
      description: "Trio de Pokémon do tipo Dragão pré-evolução",
    },
    { code: "CURAMASTER", description: "Kit de cura premium" },
    { code: "SORTEFELIZ", description: "Chansey de Sorte (nível 30)" },
    { code: "MEWMITICO", description: "Mew mítico (nível 40)" },
    { code: "GALARSTART", description: "Três Pokémon iniciais de Galar" },
    { code: "ALOLASTART", description: "Três Pokémon iniciais de Alola" },
    { code: "KALOSSTART", description: "Três Pokémon iniciais de Kalos" },
    { code: "UNOVALENDAS", description: "Trio das Espadas de Justiça" },
    { code: "LUCARIO", description: "Lucario especial (nível 35)" },
    { code: "GARCHOMP", description: "Garchomp especial (nível 40)" },
    { code: "ULTRABEASTS", description: "Ultrabestas poderosas" },
    { code: "MEGALUCARIO", description: "Mega Lucario especial (nível 50)" },
    { code: "EXTREMEBOOST", description: "Pacote de itens de XP premium" },
    { code: "FOSSEIS", description: "Pokémon fósseis de Kanto" },
    { code: "FOGUELETRICO", description: "Trio de fogo e elétrico" },
    { code: "COINS", description: "Bônus de moedas - 100 moedas" },
    { code: "BIGCOINS", description: "Bônus grande de moedas - 1000 moedas" },
    { code: "MEGACOINS", description: "Mega bônus de moedas - 10000 moedas" },
    {
      code: "HIPERCOINS",
      description: "Hiper bônus de moedas - 100000 moedas",
    },
    { code: "HACK", description: "HACKKKKKK - 100000000000 moedas" },
    { code: "PREMIERBALL", description: "Conjunto de Premier Balls" },
    { code: "ZLEGENDS", description: "Trio de lendários da geração 6" },
    { code: "CREATIONLEGENDS", description: "Trio de lendários da geração 4" },
    { code: "MYTHICAL", description: "Jirachi mítico (nível 50)" },
    { code: "MEGAPOWER", description: "Itens de poder para batalha" },
    { code: "DRAGONITE", description: "Dragonite poderoso (nível 45)" },
    { code: "MASTERTRADE", description: "Pacote de Master Balls (3)" },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleReset = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Simular progresso de reset
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setResetProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // Reset everything
        setInventory([]);
        setItems([]);
        setCoins(1000);
        resetTutorial();
        localStorage.clear();

        // Reset confirmation state after completion
        setTimeout(() => {
          setShowConfirmation(false);
          setResetProgress(0);
        }, 1000);
      }
    }, 500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowSecretCodes(true);
      setPasswordError("");
      setPassword("");
    } else {
      setPasswordError("Senha incorreta");
      setTimeout(() => setPasswordError(""), 3000);
    }
  };

  // Agrupar códigos por categoria
  const groupedCodes = SECRET_CODES.reduce((groups, code) => {
    // Determinar categoria com base em palavras-chave na descrição
    let category = "Outros";

    if (code.description.includes("moedas")) {
      category = "Moedas";
    } else if (
      code.description.includes("lendário") ||
      code.description.includes("mítico")
    ) {
      category = "Lendários";
    } else if (code.description.includes("inicial")) {
      category = "Iniciais";
    } else if (
      code.description.includes("Ball") ||
      code.description.includes("item")
    ) {
      category = "Itens";
    }

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(code);
    return groups;
  }, {});

  const categories = ["Moedas", "Lendários", "Iniciais", "Itens", "Outros"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCog className="text-blue-500" />
          Configurações
        </h2>
        <p className="text-gray-600 mt-2">
          Gerencie suas configurações e dados do jogo
        </p>
      </div>

      <div className="space-y-6">
        {/* Secret Codes Section */}
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2 mb-4">
            {showSecretCodes ? (
              <FaLockOpen className="text-indigo-600" />
            ) : (
              <FaLock className="text-indigo-600" />
            )}
            Lista de Códigos Secretos
          </h3>

          {!showSecretCodes ? (
            <div className="space-y-4">
              <p className="text-indigo-700">
                Esta área é protegida. Insira a senha para acessar a lista
                completa de códigos secretos.
              </p>
              <form onSubmit={handlePasswordSubmit} className="mt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha"
                      className="pl-10 pr-3 py-2 w-full border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FaCode className="inline mr-1" /> Acessar
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-600 text-sm mt-2 animate-pulse">
                    {passwordError}
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-indigo-700 font-medium">
                  Lista completa de códigos disponíveis
                </p>
                <button
                  onClick={() => setShowSecretCodes(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Bloquear novamente
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} className="mb-4">
                    <h4 className="font-bold text-gray-700 mb-2 border-b pb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedCodes[category]?.map((codeData) => (
                        <div
                          key={codeData.code}
                          className="border border-gray-200 hover:border-indigo-300 rounded-lg p-3 bg-white flex justify-between items-center transition-all hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700 font-bold">
                                {codeData.code}
                              </span>
                              {copiedCode === codeData.code && (
                                <span className="text-green-600 text-xs animate-fade-up">
                                  <FaCheck /> Copiado!
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {codeData.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleCopyCode(codeData.code)}
                            className="text-gray-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Copiar código"
                          >
                            <FaClipboard />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Estes códigos podem ser usados na seção "Códigos Secretos"
                      na Loja. Cada código pode ser resgatado apenas uma vez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Section */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <h3 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-4">
            <FaTrash className="text-red-600" />
            Resetar Progresso
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-red-700 font-medium">O que será resetado:</p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2 text-red-600">
                    <FaBox /> Todos os seus Pokémon
                  </li>
                  <li className="flex items-center gap-2 text-red-600">
                    <FaGift /> Todos os seus itens
                  </li>
                  <li className="flex items-center gap-2 text-red-600">
                    <FaCoins /> Suas moedas (voltará para 1000)
                  </li>
                  <li className="flex items-center gap-2 text-red-600">
                    <FaUndo /> Tutorial será reativado
                  </li>
                </ul>
              </div>
            </div>

            {showConfirmation ? (
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-3 text-red-600 mb-3">
                  <FaExclamationTriangle className="text-xl" />
                  <p className="font-bold">Tem certeza?</p>
                </div>

                {resetProgress > 0 ? (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${resetProgress}%` }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm mb-4">
                    Esta ação não pode ser desfeita. Todo seu progresso será
                    perdido.
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                    disabled={resetProgress > 0}
                  >
                    Confirmar Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors"
                    disabled={resetProgress > 0}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash />
                Resetar Todo Progresso
              </button>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Informações do Jogo
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Versão: 1.0.0</p>
            <p>Desenvolvido por: Seu Nome</p>
            <p>Dados salvos localmente no seu navegador</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
