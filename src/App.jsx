// Royal Mining Game - With Persistent State (Local Storage)

import React, { useState, useEffect } from 'react';
import coin from './assets/coin.png';
import cover from './assets/COVER.png';

const API_URL = "https://royal-mining-backend.onrender.com";
const userId = "demo_user";

export default function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(() => Number(localStorage.getItem('score')) || 0);
  const [exp, setExp] = useState(() => Number(localStorage.getItem('exp')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('level')) || 1);
  const [rank, setRank] = useState(() => localStorage.getItem('rank') || 'مبتدئ');
  const [multiplier, setMultiplier] = useState(() => Number(localStorage.getItem('multiplier')) || 1);
  const [storeOpen, setStoreOpen] = useState(false);
  const [upgradePage, setUpgradePage] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    handleLoadFromServer();
  }, []);

  useEffect(() => {
    handleSaveToServer();
    localStorage.setItem('score', score);
    localStorage.setItem('exp', exp);
    localStorage.setItem('level', level);
    localStorage.setItem('rank', rank);
    localStorage.setItem('multiplier', multiplier);
  }, [score, exp, level, rank, multiplier]);
  

  const handleStart = () => {
    setStarted(true);
  };

  const handleMine = () => {
    const newScore = score + multiplier;
    const newExp = exp + multiplier;
    setScore(newScore);
    setExp(newExp);

    const newLevel = Math.floor(newExp / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }

    if (newLevel >= 50) setRank('خبير');
    else if (newLevel >= 30) setRank('محترف');
    else if (newLevel >= 15) setRank('متوسط');
    else setRank('مبتدئ');
  };

  const handleBuyMultiplier = () => {
    if (score >= 100) {
      setScore(score - 100);
      setMultiplier(multiplier * 2);
    }
  };

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleSaveToServer = () => {
    fetch(`${API_URL}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_id: userId,
        telegram_id: userId,
        score,
        exp,
        level,
        rank,
        multiplier
      })
    });
  };
  
  const handleLoadFromServer = () => {
    fetch(`${API_URL}/load?wallet_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setScore(data.score);
          setExp(data.exp);
          setLevel(data.level);
          setRank(data.rank);
          setMultiplier(data.multiplier);
        }
      });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center p-6 space-y-6"
      style={{ backgroundImage: `url(${cover})` }}
    >
      {!started ? (
        <div className="flex flex-col items-center space-y-4">
          <img src={coin} alt="Royal Ape Coin" className="w-40 h-40 animate-bounce" />
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">Royal Mining Game</h1>
          <p className="text-gray-300 text-center max-w-md">
            استعد لخوض تجربة تعدين ممتعة داخل تيليجرام وجمّع $RAP! 👑💰
          </p>
          <button
            onClick={handleStart}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-2xl text-lg shadow-lg transition-all duration-300"
          >
            ابدأ اللعب
          </button>
        </div>
      ) : upgradePage ? (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">🛠️ مركز الترقيات</h2>
          <p className="text-gray-300 text-sm text-center max-w-md">
            قم بفتح مناجم جديدة، ترقية المهارات، أو الاشتراك بخطة VIP المتقدمة! 💎
          </p>
          <ul className="text-left text-sm bg-gray-800 p-4 rounded-xl w-full max-w-md space-y-2">
            <li>🌋 فتح منجم خاص (يتطلب المستوى 5)</li>
            <li>⚡ تسريع التعدين (يتطلب 500 🪙)</li>
            <li>💎 VIP PRO - 7$ شهريًا (يُفعّل المزيد من الميزات)</li>
          </ul>
          <button onClick={() => setUpgradePage(false)} className="bg-gray-700 px-6 py-2 rounded-full mt-4">🔙 عودة</button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 bg-black bg-opacity-60 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-yellow-300">رصيدك: {score.toLocaleString()} 🪙</h2>
          <h3 className="text-lg text-yellow-200">المستوى: {level} | الرتبة: {rank}</h3>

          <button onClick={handleMine} className="hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer">
            <img
              src={coin}
              alt="Mining Coin"
              className="w-32 h-32 rounded-full shadow-2xl hover:rotate-6"
            />
          </button>

          <p className="text-gray-300 max-w-sm text-center">
            اضغط على العملة الملكية لتعدين $RAP. كل نقرة = {multiplier} 🪙 / +{multiplier} XP
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => setStoreOpen(!storeOpen)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full shadow-md"
            >
              {storeOpen ? 'إغلاق المتجر' : 'فتح المتجر 🛒'}
            </button>
            <button
              onClick={() => setUpgradePage(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-md"
            >
              مركز الترقيات ✨
            </button>
            <button
              onClick={handleWalletConnect}
              className={`px-4 py-2 ${walletConnected ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-full shadow-md`}
            >
              {walletConnected ? '✅ المحفظة متصلة' : '🔗 ربط محفظة تيليجرام'}
            </button>
          </div>

          {storeOpen && (
            <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-inner w-full max-w-md space-y-3">
              <h4 className="text-lg font-semibold text-yellow-400">متجر الترقيات</h4>
              <div className="flex justify-between items-center text-sm">
                <span>🌀 مضاعفة التعدين</span>
                <button
                  onClick={handleBuyMultiplier}
                  disabled={score < 100}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-1 rounded disabled:opacity-50"
                >
                  شراء بـ 100 🪙
                </button>
              </div>
              <p className="text-gray-400 text-xs">المميزات القادمة: فتح مناجم خاصة، اشتراك VIP بـ 7 دولار شهريًا 💎</p>
            </div>
          )}
        </div>
      )}

      <footer className="text-sm text-gray-400 mt-12 text-center">
        © 2025 Royal Ape Project. Made for Telegram Mini App
      </footer>
    </div>
  );
}
