"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleGenAI } from "@google/genai";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Crown,
  Users,
  Globe,
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  Target,
  Calendar,
  Clock,
  Star,
  Download,
  Chrome,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const supabase = createClient();

type LeaderboardUser = {
  id?: number;
  username: string;
  watchedReels: number;
  rank?: string;
  country?: string;
  status?: string;
  isCurrentUser?: boolean;
};

function getRank(watchedReels: number) {
  if (watchedReels === 0) return "Sigma";
  if (watchedReels < 20) return "Alpha";
  if (watchedReels < 50) return "Beta";
  if (watchedReels < 100) return "NPC";
  if (watchedReels < 200) return "Lost Soul";
  return "Unemployed";
}

export default function Dashboard() {
  const router = useRouter();
  const [leaderboardTab, setLeaderboardTab] = useState("global");
  const [currentUser, setCurrentUser] = useState({
    username: "",
    rank: "Sigma",
    reelsTotal: 0,
    joinDate: "",
    timeWasted: "0h 0m",
  });
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>(
    []
  );
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<
    LeaderboardUser[]
  >([]);
  const [roastMessage, setRoastMessage] = useState(
    "Loading your personalized roast..."
  );
  const [isLoadingRoast, setIsLoadingRoast] = useState(false);

  const generateRoast = async (rank: string, reelsCount: number) => {
    setIsLoadingRoast(true);
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
      });

      const prompt = `Generate a funny, sarcastic roast for someone with the rank "${rank}" who has watched ${reelsCount} Instagram Reels. The rank system goes from best to worst: Sigma (0 reels) → Alpha (1-19) → Beta (20-49) → NPC (50-99) → Lost Soul (100-199) → Unemployed (200+). Lower ranks are worse, so roast accordingly. The roast should be witty and humorous but not mean-spirited. Keep it under 100 characters and include an emoji. Make it specific to their rank and reel count.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setRoastMessage(response.text ?? "No roast available");
    } catch (error) {
      console.error("Error generating roast:", error);
      setRoastMessage(getRoastMessage(reelsCount)); // Fallback to original function
    } finally {
      setIsLoadingRoast(false);
    }
  };

  const getRoastMessage = (reels: number) => {
    if (reels > 1000) return "Your phone is filing a restraining order. 📱⚖️";
    if (reels > 500) return "You've seen more Reels than a film festival. 🎬";
    if (reels > 100) return "Your thumb is applying for workers' comp. 👍💼";
    return "Not bad... for a Beta. 🤨";
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const username = user.user_metadata?.username || "";

      // Fetch current user stats
      const { data: stats } = await supabase
        .from("mainData")
        .select("watchedReels, timeWasted")
        .eq("username", username)
        .single();

      const watchedReels = stats?.watchedReels ?? 0;
      const timeWasted = stats?.timeWasted ?? "0h 0m";
      const rank = getRank(watchedReels);

      setCurrentUser({
        username,
        rank,
        reelsTotal: watchedReels,
        joinDate: "",
        timeWasted,
      });

      // Fetch global leaderboard
      const { data: globalLb } = await supabase
        .from("mainData")
        .select("username, watchedReels")
        .order("watchedReels", { ascending: false })
        .limit(10);

      if (globalLb) {
        const processedGlobalLb = globalLb.map((user, index) => ({
          id: index + 1,
          username: user.username,
          watchedReels: user.watchedReels,
          rank: getRank(user.watchedReels),
          country: ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇯🇵", "🇰🇷", "🇮🇳", "🇧🇷"][
            index % 10
          ],
          isCurrentUser: user.username === username,
          reelsWeek: user.watchedReels, // For compatibility with existing UI
        }));
        setGlobalLeaderboard(processedGlobalLb);
      }

      // Friends leaderboard will be empty for now
      setFriendsLeaderboard([]);
    });
  }, [router]);

  // Generate roast when user data loads
  useEffect(() => {
    if (currentUser.username && currentUser.reelsTotal >= 0) {
      generateRoast(currentUser.rank, currentUser.reelsTotal);
    }
  }, [currentUser.username, currentUser.rank, currentUser.reelsTotal]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Sigma":
        return "text-purple-400";
      case "Alpha":
        return "text-yellow-400";
      case "Beta":
        return "text-[#36D399]";
      case "NPC":
        return "text-pink-400";
      case "Lost Soul":
        return "text-orange-400";
      case "Unemployed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" />;
    if (rank === 2)
      return <Trophy className="w-5 h-5 text-gray-300 drop-shadow-lg" />;
    if (rank === 3)
      return <Medal className="w-5 h-5 text-amber-600 drop-shadow-lg" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-700 rounded-full">
        #{rank}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 shadow-green-500/50";
      case "away":
        return "bg-yellow-500 shadow-yellow-500/50";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  const currentLeaderboard =
    leaderboardTab === "global" ? globalLeaderboard : friendsLeaderboard;

  // Find current user's position in global leaderboard
  const currentUserGlobalPosition =
    globalLeaderboard.findIndex((user) => user.isCurrentUser) + 1;
  const currentUserFriendsPosition =
    friendsLeaderboard.findIndex((user) => user.isCurrentUser) + 1;
  const currentUserPosition =
    leaderboardTab === "global"
      ? currentUserGlobalPosition || "N/A"
      : currentUserFriendsPosition || "N/A";

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-emerald-900/10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 py-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Titles */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Link
              href="/"
              className="text-emerald-400 font-bold text-xl flex items-center gap-3 hover:text-emerald-300 transition-colors group"
            >
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-emerald-400/50 group-hover:ring-emerald-300/70 transition-all"
                />
                <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur group-hover:bg-emerald-300/30 transition-all"></div>
              </div>
              ReelsFiend
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Your digital shame, beautifully quantified
              </p>
            </div>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {currentUser.username}
              </div>
              <div
                className={`text-sm font-semibold flex items-center gap-1 justify-end ${getRankColor(
                  currentUser.rank
                )}`}
              >
                <Star className="w-3 h-3" />
                Rank: {currentUser.rank}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-600/50 shadow-lg">
              <span className="text-xl">👤</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Chrome Extension Call-to-Action */}
        {currentUser.reelsTotal === 0 && (
          <div className="mb-8 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Chrome className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  Get Started with ReelsFiend!
                </h2>
                <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                  Install our Chrome extension to automatically track your
                  Instagram Reels and compete with friends on the leaderboard of
                  digital shame.
                </p>
                <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Automatic tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Privacy focused</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Download Extension</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm font-medium">
                Total Reels Watched
              </span>
              <Target className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {currentUser.reelsTotal}
            </div>
            <div className="flex items-center gap-1 text-xs text-red-400">
              <TrendingUp className="w-3 h-3" />
              All time total
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm font-medium">
                Time Wasted (h)
              </span>
              <Clock className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {((Number(currentUser.timeWasted) || 0) / 3600).toFixed(1)}
            </div>
            <div className="text-xs text-slate-500">Total time spent</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Personal Roast */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  AI Personal Roast
                </h2>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-6 border border-slate-700/50 shadow-inner">
                <div className="text-lg text-slate-200 italic font-medium leading-relaxed">
                  {isLoadingRoast ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full"></div>
                      Crafting your digital shame...
                    </span>
                  ) : (
                    `"${roastMessage}"`
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                AI-generated roast based on your {currentUser.rank} rank and{" "}
                {currentUser.reelsTotal} total Reels
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>

                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Leaderboard of Shame
                  </h2>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-1 flex gap-1 border border-slate-700/50">
                  <button
                    onClick={() => setLeaderboardTab("global")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      leaderboardTab === "global"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Global
                  </button>
                  <button
                    onClick={() => setLeaderboardTab("friends")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      leaderboardTab === "friends"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Friends
                  </button>
                </div>

                <button
                  onClick={() => router.push("/friends")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl transition-all duration-200 group"
                >
                  <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    Add Friends
                  </span>
                </button>
              </div>

              {leaderboardTab === "friends" ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-400 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Friends leaderboard feature is currently in development
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentLeaderboard.slice(0, 5).map((user, index) => (
                    <div
                      key={user.username}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                        user.isCurrentUser
                          ? "bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-emerald-500/50 shadow-emerald-500/10 shadow-lg"
                          : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index + 1)}
                      </div>

                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm border-2 border-slate-600/50 shadow-lg">
                          {user.isCurrentUser
                            ? "👤"
                            : ["🎮", "🚀", "🎨", "⚡", "🌈"][index]}
                        </div>
                        {leaderboardTab === "friends" && user.status && (
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 shadow-sm ${getStatusColor(
                              user.status
                            )}`}
                          ></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-bold text-base ${
                              user.isCurrentUser
                                ? "text-emerald-400"
                                : "text-white"
                            }`}
                          >
                            {user.username}
                          </span>
                          {user.isCurrentUser && (
                            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-medium">
                              You
                            </span>
                          )}
                          {leaderboardTab === "global" && user.country && (
                            <span className="text-sm">{user.country}</span>
                          )}
                        </div>
                        <div
                          className={`text-xs font-medium ${getRankColor(
                            user.rank || ""
                          )}`}
                        >
                          {user.rank}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-white">
                          {user.watchedReels}
                        </div>
                        <div className="text-xs text-slate-400">Reels</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {leaderboardTab === "global" && (
                <div className="mt-6 text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="text-sm text-slate-300">
                    Your position:{" "}
                    <span className="text-emerald-400 font-bold text-lg">
                      #{currentUserPosition}
                    </span>
                    {globalLeaderboard.length > 0 && (
                      <span className="text-slate-500 ml-2">
                        out of {globalLeaderboard.length} users
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Extension Download (Sidebar version for users with data) */}
            {currentUser.reelsTotal > 0 && (
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-blue-500/30">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Chrome className="w-5 h-5" />
                  Chrome Extension
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Keep tracking your Reels automatically with our extension.
                </p>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold text-sm shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download Now
                </a>
              </div>
            )}

            {/* Rank Progress */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Current Rank
              </h3>
              <div className="text-center mb-6">
                <div
                  className={`text-3xl font-bold mb-2 ${getRankColor(
                    currentUser.rank
                  )}`}
                >
                  {currentUser.rank}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Your Current Rank
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                  <span className="text-slate-400 font-medium">
                    Total Reels
                  </span>
                  <span className="text-white font-bold text-lg">
                    {currentUser.reelsTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">
                    Time Wasted (h)
                  </span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {(Number(currentUser.timeWasted) / 3600).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Leaderboard Position */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Your Position
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
                  #{currentUserPosition}
                </div>
                <div className="text-sm text-slate-400 mb-4 font-medium">
                  {leaderboardTab === "global" ? "Global" : "Friends"}{" "}
                  Leaderboard
                </div>
                {leaderboardTab === "global" &&
                  globalLeaderboard.length > 0 &&
                  currentUserGlobalPosition > 0 && (
                    <div className="text-xs text-slate-500 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50">
                      You're ahead of{" "}
                      {globalLeaderboard.length - currentUserGlobalPosition}{" "}
                      other scrollers
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
