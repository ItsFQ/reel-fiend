"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isGameOpen, setIsGameOpen] = useState(false);
  
  const features = [
    { emoji: "📊", text: "Daily Reel Counter" },
    { emoji: "🏆", text: "Leaderboard of Shame" },
    { emoji: "🔥", text: "Roast of the Day" },
    { emoji: "🔒", text: "Privacy (just kidding!)" },
  ];

  const emojiBackdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!emojiBackdropRef.current) return;
      const hero = document.getElementById("hero-section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      // Fade out as hero scrolls out of view (top < 0)
      let opacity = 1;
      if (rect.bottom < 0) opacity = 0;
      else if (rect.top < 0) opacity = 1 + rect.top / rect.height;
      emojiBackdropRef.current.style.opacity = opacity.toString();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#181C23] min-h-screen text-gray-100">
      {/* Simple Auth Header */}
      <nav className="w-full flex justify-center border-b border-[#232733] h-16 bg-[#1B2028]">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="text-[#36D399] font-bold text-lg">
              ReelFiend
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Subway Surfers Toggle Button */}
            <button
              onClick={() => setIsGameOpen(!isGameOpen)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm border-2 border-transparent hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            >
              🚇 {isGameOpen ? 'Close' : 'Weak attention span?'}
            </button>
            <Link
              href="/protected"
              className="bg-gradient-to-r from-[#36D399] to-[#23b37a] text-[#181C23] px-6 py-2 rounded-full font-bold shadow-lg hover:from-[#23b37a] hover:to-[#36D399] transition-all text-base border-2 border-transparent hover:border-[#36D399] focus:outline-none focus:ring-2 focus:ring-[#36D399] focus:ring-offset-2"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Subway Surfers Video Sidebar */}
      {isGameOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-[#181C23] border-r-2 border-[#36D399] z-40 shadow-2xl">
          <div className="p-4 border-b border-[#232733] flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#36D399] flex items-center gap-2">
              🚇 Weak attention span?
            </h3>
            <button
              onClick={() => setIsGameOpen(false)}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/zZ7AimPACzc?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=zZ7AimPACzc"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Subway Surfers Gameplay"
            />
          </div>
        </div>
      )}
      
      {/* Content wrapper with left margin when sidebar is open */}
      <div className={`transition-all duration-300 ${isGameOpen ? 'ml-80' : 'ml-0'}`}>

      <main className="font-sans">
        {/* HERO */}
        <section id="hero-section" className="relative flex flex-col items-center justify-center py-32 px-4 text-center gap-4">
          {/* Emoji Backdrop */}
          <div
            ref={emojiBackdropRef}
            className="pointer-events-none absolute inset-0 w-full h-full z-0"
            aria-hidden="true"
          >
            {/* Animated floating emojis */}
            <div className="absolute animate-bounce left-1/4 top-10 text-[3rem] opacity-30 select-none">😂</div>
            <div className="absolute animate-pulse right-1/4 top-24 text-[2.5rem] opacity-20 select-none">🔥</div>
            <div className="absolute animate-bounce left-1/3 bottom-10 text-[4rem] opacity-25 select-none">🤳</div>
            <div className="absolute animate-pulse right-1/3 bottom-20 text-[3.5rem] opacity-20 select-none">💀</div>
            <div className="absolute animate-bounce left-10 top-1/2 text-[2.5rem] opacity-20 select-none">😅</div>
            <div className="absolute animate-pulse right-10 top-1/3 text-[2.5rem] opacity-25 select-none">👑</div>
            <div className="absolute animate-bounce right-1/5 top-1/5 text-[2.5rem] opacity-20 select-none">🙈</div>
            {/* Add subway surfer emoji */}
            <div className="absolute animate-bounce left-1/5 bottom-1/3 text-[3rem] opacity-25 select-none">🚇</div>
          </div>
          <div className="flex flex-col items-center w-full relative z-10">
            <div className="mx-auto mb-4 flex items-center justify-center w-32 h-32">
              <div className="w-32 h-32 rounded-full border-4 border-[#36D399] flex items-center justify-center bg-[#232733] shadow-lg">
                <span className="text-6xl">🤳</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-1 text-[#36D399] flex flex-col items-center w-full">
                ReelFiend
                <span className="text-base bg-[#232733] px-3 py-1 rounded-full border border-[#36D399] font-bold mt-2">Sigma Ranker</span>
              </h1>
              <div className="flex items-center gap-2 text-[#36D399] text-lg font-mono">
                <span className="animate-pulse">∞</span> <span className="opacity-70">Aura</span>
              </div>
            </div>
          </div>
          <p className="text-lg md:text-xl opacity-80 mb-6 max-w-xl mx-auto text-gray-300 relative z-10">
            Start as a <span className="text-[#36D399] font-bold">Sigma</span> with infinite aura. The more reels you watch, the lower your rank and aura fall. Can you resist the scroll?
          </p>
          <Link
            href="/protected"
            className="inline-block bg-[#36D399] text-[#181C23] font-bold border-0 shadow-xl rounded-full px-10 py-4 mt-2 transition-transform duration-200 hover:scale-105 hover:rotate-1 active:scale-95 relative z-10 text-center"
          >
            Enter Dashboard
          </Link>
          <div className="mt-4 text-xs opacity-60 max-w-xs mx-auto text-gray-400 relative z-10">
            No judgment. Just memes. 
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-4 bg-[#1B2028] border-t border-[#232733]">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#36D399]">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#232733] rounded-xl p-6 shadow-lg flex items-center gap-4">
                <span className="text-4xl">{feature.emoji}</span>
                <span className="text-lg md:text-xl font-semibold">{feature.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* LEADERBOARD TEASER */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#36D399] flex items-center justify-center gap-2">
            🏆 Leaderboard of Shame
          </h2>
          <p className="mb-8 opacity-80 text-base md:text-lg text-gray-300">
            See who's watched the most Reels today.<br />
            Will you top the charts or escape unnoticed?
          </p>
          <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
            {[
              { rank: 1, user: '@doomscroll_king', reels: 237, aura: 12, rankName: 'Beta', color: 'bg-[#36D399]', text: 'text-[#181C23]', emoji: '🔥' },
              { rank: 2, user: '@scrollinator', reels: 201, aura: 18, rankName: 'Gamma', color: 'bg-pink-400', text: 'text-white', emoji: '😳' },
              { rank: 3, user: '@reel_addict', reels: 180, aura: 25, rankName: 'Delta', color: 'bg-yellow-400', text: 'text-[#181C23]', emoji: '🤦‍♂️' },
            ].map((entry) => (
              <div key={entry.rank} className="bg-[#232733] rounded-xl px-6 py-5 shadow-md font-mono text-xl md:text-2xl border border-[#232733] flex flex-col md:flex-row md:items-center md:justify-between w-full mb-2">
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  <span className={`inline-block ${entry.color} ${entry.text} font-bold rounded-full px-4 py-1`}>#{entry.rank}</span>
                  <span className="font-bold text-[#36D399]">{entry.user}</span>
                  <span className="ml-3 font-bold">{entry.emoji} {entry.reels} Reels</span>
                </div>
                <div className="flex items-center gap-2 text-[#36D399] text-base md:text-lg font-mono">
                  <span>Rank:</span> <span className="font-bold">{entry.rankName}</span> <span className="ml-2">Aura:</span> <span className="font-bold text-yellow-400">{entry.aura}</span>
                </div>
              </div>
            ))}
            <div className="text-gray-400 text-base mt-2">Will you be next? 👀</div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-20 px-4 bg-[#1B2028] border-t border-[#232733]">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#36D399]">Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto justify-center">
            <div className="flex-1 bg-[#232733] rounded-xl p-8 shadow border border-[#232733] flex flex-col items-center">
              <div className="text-2xl font-bold mb-2 text-[#36D399]">Sigma (Free)</div>
              <div className="text-5xl font-extrabold mb-4 text-white">$0</div>
              <ul className="mb-6 text-gray-300 text-left list-disc list-inside">
                <li>Start with infinite aura</li>
                <li>Track your shame</li>
                <li>Leaderboard access</li>
                <li>Basic roasts</li>
              </ul>
              <Link
                href="/signup"
                className="w-full bg-[#36D399] text-[#181C23] font-bold rounded-full border-0 hover:bg-[#23b37a] inline-block text-center py-3 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="flex-1 bg-[#232733] rounded-xl p-8 shadow border border-[#36D399] flex flex-col items-center scale-105">
              <div className="text-2xl font-bold mb-2 text-[#FFD700] flex items-center gap-2">Alpha <span className="text-[#FFD700]">★</span></div>
              <div className="text-5xl font-extrabold mb-4 text-white">$5<span className="text-lg font-normal">/mo</span></div>
              <ul className="mb-6 text-gray-300 text-left list-disc list-inside">
                <li>All Sigma features</li>
                <li>Custom roasts</li>
                <li>Advanced stats</li>
                <li>Priority support</li>
                <li>Exclusive badge</li>
              </ul>
              <button className="w-full bg-[#FFD700] text-[#181C23] font-bold rounded-full border-0 hover:bg-yellow-400 py-3 transition-colors">
                Upgrade Soon
              </button>
            </div>
          </div>
        </section>

        {/* ROAST PREVIEWS */}
        <section className="py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-[#36D399]">🔥 Today's Roasts</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="bg-[#232733] rounded-lg p-6 shadow text-lg md:text-xl flex-1 border border-[#232733] text-gray-200">
              "You've watched enough Reels to fill a feature film. 🎬"
            </div>
            <div className="bg-[#232733] rounded-lg p-6 shadow text-lg md:text-xl flex-1 border border-[#232733] text-gray-200">
              "Your thumb deserves a gym membership. 💪"
            </div>
            <div className="bg-[#232733] rounded-lg p-6 shadow text-lg md:text-xl flex-1 border border-[#232733] text-gray-200">
              "Instagram called. They want their bandwidth back. 📶"
            </div>
          </div>
        </section>

        {/* SETUP NOTICE */}
        <section className="py-16 px-4 bg-[#1B2028] border-t border-[#232733]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#36D399]">Ready to Track Your Shame?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of users who are bravely facing their reel addiction.
              Start your journey from Sigma to... well, we'll see how far you fall.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-[#36D399] text-[#181C23] px-8 py-3 rounded-full font-bold hover:bg-[#23b37a] transition-colors"
              >
                Start Tracking
              </Link>
              <Link
                href="/protected"
                className="border border-[#36D399] text-[#36D399] px-8 py-3 rounded-full font-bold hover:bg-[#36D399] hover:text-[#181C23] transition-colors"
              >
                Already Shameful?
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-sm opacity-60 mt-8 text-gray-400 border-t border-[#232733]">
          <div className="flex flex-col items-center gap-2">
            <div>
              Made with <span className="inline-block">🤡</span> by <span className="font-bold text-[#36D399]">Reel Shame Tracker</span>. Not affiliated with Instagram.
            </div>
            <div className="flex items-center gap-2">
              Powered by{" "}
              <span className="font-bold text-[#36D399]">Next.js & Supabase</span>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </div>
  );
}