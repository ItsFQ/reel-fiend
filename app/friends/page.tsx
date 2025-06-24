'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search, 
  Star,
  Bell,
  UserCheck,
  Filter,
  Clock,
  Zap
} from 'lucide-react';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentUser] = useState({
    username: 'YourUsername',
    rank: 'Sigma',
    aura: 100
  });

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Sigma': return 'text-purple-400';
      case 'Alpha': return 'text-yellow-400';
      case 'Beta': return 'text-[#36D399]';
      case 'Gamma': return 'text-blue-400';
      case 'NPC': return 'text-pink-400';
      case 'Lost Soul': return 'text-orange-400';
      case 'Unemployed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-emerald-900/10 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 py-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-emerald-400 font-bold text-xl flex items-center gap-3 hover:text-emerald-300 transition-colors group">
              <div className="relative">
                <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full ring-2 ring-emerald-400/50 group-hover:ring-emerald-300/70 transition-all" />
                <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur group-hover:bg-emerald-300/30 transition-all"></div>
              </div>
              ReelsFiend
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Friends
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer" />
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{currentUser.username}</div>
              <div className={`text-sm font-semibold flex items-center gap-1 justify-end ${getRankColor(currentUser.rank)}`}>
                <Star className="w-3 h-3" />
                {currentUser.rank}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-600/50 shadow-lg">
              <span className="text-xl">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Back to Dashboard Button */}
      <div className="relative max-w-6xl mx-auto px-4 pt-6">
        <Link 
          href="/protected"
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-slate-900/50 rounded-2xl p-2 flex gap-2 mb-8 border border-slate-700/50 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === 'friends' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-5 h-5" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === 'requests' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            Requests
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === 'search' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Add Friends
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'search' ? 'Search for new friends...' : 'Search friends...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-xl"
              disabled
            />
          </div>
          
          {activeTab === 'friends' && (
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900/50 border border-slate-700/50 rounded-xl pl-12 pr-8 py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-xl appearance-none cursor-pointer"
                disabled
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          )}
        </div>

        {/* Coming Soon Content */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-16 text-center border border-slate-700/50 shadow-2xl">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              {activeTab === 'friends' && <Users className="w-12 h-12 text-emerald-400" />}
              {activeTab === 'requests' && <UserCheck className="w-12 h-12 text-emerald-400" />}
              {activeTab === 'search' && <UserPlus className="w-12 h-12 text-emerald-400" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-xl"></div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Coming Soon
          </h2>
          
          <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            {activeTab === 'friends' && "Connect with fellow ReelsFiend users, see who's online, and track your friends' scrolling achievements!"}
            {activeTab === 'requests' && "Manage your friend requests, accept new connections, and grow your ReelsFiend network!"}
            {activeTab === 'search' && "Discover new ReelsFiend users, send friend requests, and expand your scrolling community!"}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-8">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Feature in development</span>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Social Features</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Leaderboards</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}