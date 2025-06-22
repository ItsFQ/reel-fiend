'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Medal, Award, Users, Globe, Crown } from 'lucide-react';

const supabase = createClient();

export default function Leaderboard() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('global');
	const [currentUser] = useState({
		username: '@scrollmaster2024',
		rank: 'Delta',
		aura: 42
	});

	// Sample global leaderboard data
	const globalLeaderboard = [
		{ id: 1, username: '@reelking2024', rank: 'Sigma', aura: 98, reelsToday: 156, reelsWeek: 892, reelsTotal: 4520, timeWasted: '287h 45m', country: '🇺🇸' },
		{ id: 2, username: '@scrollqueen', rank: 'Sigma', aura: 95, reelsToday: 134, reelsWeek: 823, reelsTotal: 4102, timeWasted: '265h 12m', country: '🇬🇧' },
		{ id: 3, username: '@digitalnomad', rank: 'Alpha', aura: 87, reelsToday: 98, reelsWeek: 678, reelsTotal: 3890, timeWasted: '234h 56m', country: '🇨🇦' },
		{ id: 4, username: '@midnightscroller', rank: 'Alpha', aura: 83, reelsToday: 87, reelsWeek: 634, reelsTotal: 3456, timeWasted: '198h 23m', country: '🇦🇺' },
		{ id: 5, username: '@reelmaster', rank: 'Alpha', aura: 79, reelsToday: 76, reelsWeek: 587, reelsTotal: 3124, timeWasted: '187h 34m', country: '🇩🇪' },
		{ id: 6, username: '@scrollsage', rank: 'Beta', aura: 72, reelsWeek: 534, reelsTotal: 2890, timeWasted: '156h 45m', country: '🇫🇷' },
		{ id: 7, username: '@scrollmaster2024', rank: 'Delta', aura: 42, reelsToday: 23, reelsWeek: 217, reelsTotal: 1247, timeWasted: '127h 32m', country: '🇺🇸', isCurrentUser: true },
		{ id: 8, username: '@reelwatcher', rank: 'Gamma', aura: 38, reelsWeek: 198, reelsTotal: 987, timeWasted: '98h 12m', country: '🇯🇵' },
		{ id: 9, username: '@digitalzombie', rank: 'Delta', aura: 35, reelsWeek: 167, reelsTotal: 876, timeWasted: '87h 23m', country: '🇰🇷' },
		{ id: 10, username: '@scrollninja', rank: 'Delta', aura: 31, reelsWeek: 145, reelsTotal: 734, timeWasted: '76h 45m', country: '🇮🇳' }
	];

	// Sample friends leaderboard data
	const friendsLeaderboard = [
		{ id: 1, username: '@bestfriend2024', rank: 'Beta', aura: 68, reelsToday: 45, reelsWeek: 298, reelsTotal: 1890, timeWasted: '145h 23m', status: 'online' },
		{ id: 2, username: '@scrollmaster2024', rank: 'Delta', aura: 42, reelsToday: 23, reelsWeek: 217, reelsTotal: 1247, timeWasted: '127h 32m', isCurrentUser: true, status: 'online' },
		{ id: 3, username: '@collegefriend', rank: 'Gamma', aura: 39, reelsToday: 18, reelsWeek: 156, reelsTotal: 934, timeWasted: '98h 12m', status: 'away' },
		{ id: 4, username: '@workbuddy', rank: 'Delta', aura: 35, reelsToday: 12, reelsWeek: 134, reelsTotal: 876, timeWasted: '87h 45m', status: 'offline' },
		{ id: 5, username: '@gymmate', rank: 'Delta', aura: 28, reelsToday: 8, reelsWeek: 98, reelsTotal: 567, timeWasted: '65h 23m', status: 'online' },
		{ id: 6, username: '@neighbor', rank: 'Omega', aura: 15, reelsToday: 3, reelsWeek: 45, reelsTotal: 234, timeWasted: '34h 12m', status: 'offline' }
	];

	const getRankColor = (rank) => {
		switch (rank) {
			case 'Sigma': return 'text-purple-400';
			case 'Alpha': return 'text-yellow-400';
			case 'Beta': return 'text-[#36D399]';
			case 'Gamma': return 'text-pink-400';
			case 'Delta': return 'text-orange-400';
			case 'Omega': return 'text-red-400';
			default: return 'text-gray-400';
		}
	};

	const getAuraColor = (aura) => {
		if (aura > 80) return 'text-purple-400';
		if (aura > 60) return 'text-blue-400';
		if (aura > 40) return 'text-[#36D399]';
		if (aura > 20) return 'text-yellow-400';
		return 'text-red-400';
	};

	const getRankIcon = (rank) => {
		if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
		if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300" />;
		if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
		return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>;
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'online': return 'bg-green-500';
			case 'away': return 'bg-yellow-500';
			case 'offline': return 'bg-gray-500';
			default: return 'bg-gray-500';
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			router.push('/');
		} else {
			console.error('Error logging out:', error.message);
		}
	};

	const currentData = activeTab === 'global' ? globalLeaderboard : friendsLeaderboard;

	return (
		<div className="bg-base-100 min-h-screen font-sans">
			{/* Header */}
			<header className="bg-[#1B2028] border-b border-[#232733] px-4 py-6">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
					{/* Left: Logo + Titles */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
						<Link href="/" className="text-[#36D399] font-bold text-lg flex items-center gap-2">
							<Image src="/images/logo.png" alt="Logo" width={30} height={30} className="rounded-full" />
							ReelsFiend
						</Link>
						<h1 className="text-2xl font-bold text-[#36D399]">Leaderboard</h1>
						<p className="text-gray-400 text-sm">See how you stack up against other addicts</p>
					</div>

					{/* Right: User Info + Logout */}
					<div className="flex items-center gap-4">
						<div className="text-right">
							<div className="text-lg font-bold text-white">{currentUser.username}</div>
							<div className={`text-sm font-semibold ${getRankColor(currentUser.rank)}`}>Rank: {currentUser.rank}</div>
						</div>
						<div className="w-10 h-10 rounded-full bg-[#232733] flex items-center justify-center">
							<span className="text-lg">👤</span>
						</div>
						<button
							onClick={handleLogout}
							className="ml-4 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-4 py-8">
				{/* Navigation Tabs */}
				<div className="flex justify-center mb-8">
					<div className="bg-[#232733] rounded-xl p-2 flex gap-2">
						<button
							onClick={() => setActiveTab('global')}
							className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
								activeTab === 'global' 
									? 'bg-[#36D399] text-black' 
									: 'text-gray-400 hover:text-white hover:bg-[#1B2028]'
							}`}
						>
							<Globe className="w-5 h-5" />
							Global Leaderboard
						</button>
						<button
							onClick={() => setActiveTab('friends')}
							className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
								activeTab === 'friends' 
									? 'bg-[#36D399] text-black' 
									: 'text-gray-400 hover:text-white hover:bg-[#1B2028]'
							}`}
						>
							<Users className="w-5 h-5" />
							Friends
						</button>
					</div>
				</div>

				{/* Stats Header */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Your Position</span>
							<span className="text-lg">📍</span>
						</div>
						<div className="text-3xl font-bold text-[#36D399]">
							#{activeTab === 'global' ? '7' : '2'}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{activeTab === 'global' ? 'Out of 10,247 users' : 'Among your friends'}
						</div>
					</div>
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Top Performer</span>
							<span className="text-lg">👑</span>
						</div>
						<div className="text-lg font-bold text-purple-400">
							{currentData[0]?.username || 'Unknown'}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{currentData[0]?.aura || 0} aura points
						</div>
					</div>
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Average Aura</span>
							<span className="text-lg">⚡</span>
						</div>
						<div className="text-3xl font-bold text-yellow-400">
							{Math.round(currentData.reduce((sum, user) => sum + (user.aura || 0), 0) / currentData.length)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{activeTab === 'global' ? 'Global average' : 'Friends average'}
						</div>
					</div>
				</div>

				{/* Leaderboard */}
				<div className="bg-[#232733] rounded-xl shadow-lg border border-[#232733] overflow-hidden">
					<div className="p-6 border-b border-[#1B2028]">
						<h2 className="text-xl font-bold text-[#36D399] flex items-center gap-2">
							{activeTab === 'global' ? <Globe className="w-5 h-5" /> : <Users className="w-5 h-5" />}
							{activeTab === 'global' ? 'Global Rankings' : 'Friends Rankings'}
						</h2>
						<p className="text-gray-400 text-sm mt-1">
							{activeTab === 'global' 
								? 'The most dedicated scroll addicts worldwide' 
								: 'See how you compare to your friends'
							}
						</p>
					</div>
					
					<div className="divide-y divide-[#1B2028]">
						{currentData.map((user, index) => (
							<div 
								key={user.id} 
								className={`p-6 flex items-center gap-4 hover:bg-[#1B2028] transition-colors ${
									user.isCurrentUser ? 'bg-[#1B2028] border-l-4 border-[#36D399]' : ''
								}`}
							>
								{/* Rank */}
								<div className="flex items-center justify-center w-8">
									{getRankIcon(index + 1)}
								</div>

								{/* User Info */}
								<div className="flex-1 flex items-center gap-4">
									<div className="relative">
										<div className="w-12 h-12 rounded-full bg-[#1B2028] flex items-center justify-center border-2 border-[#232733]">
											<span className="text-lg">
												{user.isCurrentUser ? '👤' : ['🎮', '🚀', '🎨', '⚡', '🌈', '🎵', '🔥', '💎', '🌟', '👑'][index]}
											</span>
										</div>
										{activeTab === 'friends' && user.status && (
											<div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#232733] ${getStatusColor(user.status)}`}></div>
										)}
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className={`font-bold ${user.isCurrentUser ? 'text-[#36D399]' : 'text-white'}`}>
												{user.username}
											</span>
											{user.isCurrentUser && <span className="text-xs bg-[#36D399] text-black px-2 py-1 rounded">You</span>}
											{activeTab === 'global' && user.country && <span className="text-sm">{user.country}</span>}
										</div>
										<div className={`text-sm font-semibold ${getRankColor(user.rank)}`}>
											{user.rank} Rank
										</div>
									</div>
								</div>

								{/* Stats */}
								<div className="flex gap-6 text-center">
									<div>
										<div className={`text-lg font-bold ${getAuraColor(user.aura)}`}>{user.aura}</div>
										<div className="text-xs text-gray-400">Aura</div>
									</div>
									{user.reelsToday && (
										<div>
											<div className="text-lg font-bold text-white">{user.reelsToday}</div>
											<div className="text-xs text-gray-400">Today</div>
										</div>
									)}
									<div>
										<div className="text-lg font-bold text-white">{user.reelsWeek}</div>
										<div className="text-xs text-gray-400">Week</div>
									</div>
									<div>
										<div className="text-lg font-bold text-white">{user.reelsTotal.toLocaleString()}</div>
										<div className="text-xs text-gray-400">Total</div>
									</div>
									<div>
										<div className="text-sm font-bold text-red-400">{user.timeWasted}</div>
										<div className="text-xs text-gray-400">Wasted</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Navigation Back to Dashboard */}
				<div className="mt-8 text-center">
					<Link 
						href="/protected" 
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#36D399] text-black font-semibold rounded-lg hover:bg-[#2BB380] transition-colors"
					>
						← Back to Dashboard
					</Link>
				</div>
			</main>
		</div>
	);
}