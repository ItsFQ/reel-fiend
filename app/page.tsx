"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import Image from 'next/image'

export default function Home() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  const features = [
    { emoji: "📊", text: "Daily Reel Counter", desc: "Track your daily scroll habits" },
    { emoji: "🏆", text: "Leaderboard of Shame", desc: "See who's winning at losing" },
    { emoji: "🔥", text: "Roast of the Day", desc: "Daily reality checks" },
    { emoji: "🎯", text: "Goal Setting", desc: "Set limits and break them" },
  ];

  const emojiBackdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!emojiBackdropRef.current) return;
      const hero = document.getElementById("hero-section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      let opacity = 1;
      if (rect.bottom < 0) opacity = 0;
      else if (rect.top < 0) opacity = 1 + rect.top / rect.height;
      emojiBackdropRef.current.style.opacity = opacity.toString();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] min-h-screen text-gray-100">
      <Navbar isGameOpen={isGameOpen} setIsGameOpen={setIsGameOpen} />

      {/* Subway Surfers Video Sidebar */}
      {isGameOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0F0F23] to-[#1A1A2E] border-r border-[#00D4AA]/20 z-40 shadow-2xl backdrop-blur-xl">
          <div className="p-4 border-b border-[#00D4AA]/20 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#00D4AA] flex items-center gap-2">
              🚇 Weak attention span?
            </h3>
            <button
              onClick={() => setIsGameOpen(false)}
              className="text-gray-400 hover:text-white text-xl font-bold transition-colors"
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

      <div className={`transition-all duration-300 ${isGameOpen ? 'ml-80' : 'ml-0'}`}>
        <main className="font-sans">
          {/* HERO SECTION */}
          <section id="hero-section" className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-72 h-72 bg-[#00D4AA]/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#4ECDC4]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Emojis */}
            <div
              ref={emojiBackdropRef}
              className="pointer-events-none absolute inset-0 w-full h-full z-0"
              aria-hidden="true"
            >
              <div className="absolute animate-bounce left-1/4 top-20 text-[4rem] opacity-20 select-none">😂</div>
              <div className="absolute animate-bounce delay-100 right-1/4 top-32 text-[3rem] opacity-15 select-none">🔥</div>
              <div className="absolute animate-bounce delay-200 left-1/3 bottom-20 text-[5rem] opacity-25 select-none">🤳</div>
              <div className="absolute animate-bounce delay-300 right-1/3 bottom-32 text-[3.5rem] opacity-20 select-none">💀</div>
              <div className="absolute animate-bounce delay-500 left-16 top-1/2 text-[3rem] opacity-15 select-none">😅</div>
              <div className="absolute animate-bounce delay-700 right-16 top-1/3 text-[3rem] opacity-20 select-none">👑</div>
              <div className="absolute animate-bounce delay-1000 right-1/5 top-1/5 text-[3rem] opacity-15 select-none">🙈</div>
              <div className="absolute animate-bounce delay-150 left-1/5 bottom-1/3 text-[4rem] opacity-25 select-none">🚇</div>
            </div>

            <div className="flex flex-col items-center w-full relative z-10 max-w-4xl mx-auto">
              {/* Logo */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#00D4AA] flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] to-[#16213E] shadow-2xl shadow-[#00D4AA]/20">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] rounded-full blur opacity-20"></div>
              </div>

              {/* Title */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[#00D4AA] via-[#4ECDC4] to-[#00D4AA] bg-clip-text text-transparent animate-gradient-x">
                  ReelsFiend
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-lg bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] bg-clip-text text-transparent font-bold px-4 py-2 rounded-full border border-[#00D4AA]/30 backdrop-blur-sm">
                    Sigma Ranker
                  </span>
                  <div className="flex items-center gap-2 text-[#00D4AA] text-xl font-mono">
                    <span className="animate-pulse text-2xl">∞</span>
                    <span className="opacity-80">Aura</span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-3xl mx-auto text-gray-300 leading-relaxed">
                Start as a <span className="text-[#00D4AA] font-bold">Sigma</span> with infinite aura. 
                The more reels you watch, the lower your rank falls. 
                <span className="block mt-2 text-[#FF6B6B] font-semibold">Can you resist the endless scroll?</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/protected"
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-[#0F0F23] bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00D4AA]/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#4ECDC4] to-[#00D4AA] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    Enter Dashboard
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>

                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#9253ff] to-[#43047a] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B6B]/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#9253ff] to-[#43047a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    🧩 Get Chrome Extension
                    <span className="group-hover:translate-x-1 transition-transform">↗</span>
                  </span>
                </a>
              </div>

              <div className="mt-6 text-sm opacity-60 text-gray-400">
                No judgment. Just brutal honesty. 💀
              </div>
            </div>
          </section>

          {/* CHROME EXTENSION SECTION */}
          <section className="py-24 px-4 bg-gradient-to-b from-transparent to-[#0F0F23]/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9253ff] to-[#43047a] bg-clip-text text-transparent flex items-center justify-center gap-3">
                  🧩 Chrome Extension
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Automatic tracking that follows you everywhere. No manual logging, just pure reality.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Features */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    {[
                      { 
                        icon: "🔄", 
                        title: "Auto-Sync", 
                        desc: "Seamlessly tracks your Instagram Reels without lifting a finger" 
                      },
                      { 
                        icon: "⚡", 
                        title: "Real-Time Updates", 
                        desc: "Watch your aura drop in real-time as you scroll through endless content" 
                      },
                     
                    ].map((feature, index) => (
                      <div key={index} className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-[#1A1A2E]/50 to-transparent hover:from-[#1A1A2E]/80 transition-all duration-300">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#592fc1] mb-2 group-hover:text-[#29246f] transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - CTA and Visual */}
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF8E53]/20 rounded-3xl border-2 border-[#FF6B6B]/30 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-8xl animate-pulse">🧩</div>
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#9253ff] to-[#43047a] rounded-3xl blur opacity-20"></div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      Install Once, Track Forever
                    </h3>
                    <p className="text-gray-400 max-w-sm mx-auto">
                      No more manual counting. Let the extension do the shameful work for you.
                    </p>
                  </div>

                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#9253ff] to-[#43047a] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B6B]/25"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#9253ff] to-[#43047a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-2">
                      Add to Chrome
                      <span className="group-hover:translate-x-1 transition-transform">↗</span>
                    </span>
                  </a>

                  <div className="text-sm text-gray-500">
                    Free • Works with Chrome & Edge
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="py-24 px-4 bg-gradient-to-b from-transparent to-[#0F0F23]/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] bg-clip-text text-transparent">
                Features That Hit Different
              </h2>
              <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Everything you need to track your digital shame and compete with fellow scroll addicts
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-[#1A1A2E]/80 to-[#16213E]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#00D4AA]/20 hover:border-[#00D4AA]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#00D4AA]/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.emoji}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-[#00D4AA] group-hover:text-[#4ECDC4] transition-colors">
                        {feature.text}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* LEADERBOARD SECTION */}
          <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] bg-clip-text text-transparent flex items-center justify-center gap-3">
                🏆 Hall of Shame
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                The brave souls who aren't afraid to show their scroll stats
              </p>
              
              <div className="space-y-4">
                {[
                  { rank: 1, user: '@doomscroll_king', reels: 237,  rankName: 'Unemployed', gradient: 'from-[#FFD700] to-[#FFA500]', emoji: '🔥' },
                  { rank: 2, user: '@scrollinator', reels: 201,  rankName: 'Unemployed', gradient: 'from-[#C0C0C0] to-[#A0A0A0]', emoji: '😳' },
                  { rank: 3, user: '@reel_addict', reels: 180,  rankName: 'Lost Soul', gradient: 'from-[#CD7F32] to-[#B8860B]', emoji: '🤦‍♂️' },
                ].map((entry) => (
                  <div key={entry.rank} className="group bg-gradient-to-r from-[#1A1A2E]/80 to-[#16213E]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#00D4AA]/20 hover:border-[#00D4AA]/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${entry.gradient} flex items-center justify-center font-bold text-black text-lg shadow-lg`}>
                          #{entry.rank}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#00D4AA] text-lg">{entry.user}</span>
                          <span className="text-2xl">{entry.emoji}</span>
                          <span className="font-bold text-white">{entry.reels} Reels</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Rank:</span>
                          <span className="font-bold text-[#FF6B6B]">{entry.rankName}</span>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-gray-400">
                Ready to join the leaderboard? 👀
              </div>
            </div>
          </section>

          {/* PRICING SECTION */}
          <section className="py-24 px-4 bg-gradient-to-b from-[#0F0F23]/50 to-transparent">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] bg-clip-text text-transparent">
                Choose Your Shame Level
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-[#1A1A2E]/80 to-[#16213E]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#00D4AA]/20 hover:border-[#00D4AA]/40 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-[#00D4AA]">Sigma</h3>
                    <div className="text-5xl font-black mb-4 text-white">FREE</div>
                    <p className="text-gray-400">Start your journey to shame</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-[#00D4AA]">✓</span>
                      Start with infinite aura
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#00D4AA]">✓</span>
                      Basic shame tracking
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#00D4AA]">✓</span>
                      Leaderboard access
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#00D4AA]">✓</span>
                      Daily roasts
                    </li>
                  </ul>
                  <Link
                    href="/protected"
                    className="w-full bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] text-[#0F0F23] font-bold rounded-full py-3 text-center block hover:scale-105 transition-transform duration-200"
                  >
                    Start Free
                  </Link>
                </div>

                <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-2xl p-8 border-2 border-[#FFD700] scale-105 shadow-2xl shadow-[#FFD700]/20">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F23] px-4 py-1 rounded-full text-sm font-bold">
                    COMING SOON
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-[#FFD700] flex items-center justify-center gap-2">
                      Alpha ★
                    </h3>
                    <div className="text-5xl font-black mb-4 text-white">
                      $5<span className="text-lg font-normal text-gray-400">/mo</span>
                    </div>
                    <p className="text-gray-400">Premium shame experience</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-[#FFD700]">★</span>
                      All Sigma features
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#FFD700]">★</span>
                      Custom roast generator
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#FFD700]">★</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#FFD700]">★</span>
                      Exclusive badges
                    </li>
                  </ul>
                  <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0F0F23] font-bold rounded-full py-3 hover:scale-105 transition-transform duration-200 cursor-not-allowed opacity-75">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ROAST SECTION */}
          <section className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] bg-clip-text text-transparent">
                🔥 Daily Roasts
              </h2>
              <p className="text-xl text-gray-400 text-center mb-16">
                We serve reality checks daily. No sugar-coating.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  "You've watched enough Reels to produce a Netflix series. 🎬",
                  "Your thumb deserves a gym membership at this point. 💪",
                  "Instagram called. They want their bandwidth back. 📶"
                ].map((roast, index) => (
                  <div key={index} className="group bg-gradient-to-br from-[#1A1A2E]/80 to-[#16213E]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FF6B6B]/20 hover:border-[#FF6B6B]/40 transition-all duration-300 hover:scale-105">
                    <div className="text-lg text-gray-200 italic leading-relaxed">
                      "{roast}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* CTA SECTION */}
          <section className="py-24 px-4 bg-gradient-to-br from-[#0F0F23] to-[#1A1A2E]">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] bg-clip-text text-transparent">
                Ready to Face Reality?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of brave souls tracking their digital shame. 
                Start your journey from Sigma to... well, let's see how far you'll fall.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/signup"
                  className="group relative px-8 py-4 text-lg font-bold text-[#0F0F23] bg-gradient-to-r from-[#00D4AA] to-[#4ECDC4] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00D4AA]/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#4ECDC4] to-[#00D4AA] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Start Your Shame Journey</span>
                </Link>
                
                <Link
                  href="/protected"
                  className="px-8 py-4 text-lg font-bold text-[#00D4AA] border-2 border-[#00D4AA] rounded-full hover:bg-[#00D4AA] hover:text-[#0F0F23] transition-all duration-300 hover:scale-105"
                >
                  Already Shameful? Login
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="py-12 px-4 border-t border-[#00D4AA]/20 bg-gradient-to-r from-[#0F0F23] to-[#1A1A2E]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                Made with <span className="text-[#FF6B6B]">🤡</span> and brutal honesty by 
                <span className="font-bold text-[#00D4AA] ml-1">ReelsFiend Team</span>
              </div>
              <div className="text-sm text-gray-500">
                Not affiliated with Instagram, Meta, or your therapist.
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                Powered by <span className="font-semibold text-[#00D4AA]">Next.js</span> & 
                <span className="font-semibold text-[#4ECDC4]">Supabase</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
