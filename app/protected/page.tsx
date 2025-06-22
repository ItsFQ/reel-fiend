'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image'
import Link from 'next/link';
import { Trophy, Medal, Crown, Users, Globe } from 'lucide-react';

const supabase = createClient();

export default function Dashboard() {
	const router = useRouter();
	const [leaderboardTab, setLeaderboardTab] = useState('global');
	const [currentUser, setCurrentUser] = useState({
		username: '',
		rank: 'Sigma',
		aura: 100,
		reelsToday: 0,
		reelsWeek: 0,
		reelsTotal: 0,
		joinDate: '',
		bestStreak: 0,
		currentStreak: 0,
		avgDaily: 0,
		timeWasted: '0h 0m',
		achievements: []
	});
	const [todayProgress, setTodayProgress] = useState(0);

	// Mock leaderboard data
	const globalLeaderboard = [
		{ id: 1, username: 'ScrollKing', rank: 'Alpha', aura: 95, reelsWeek: 420, country: '🇺🇸', isCurrentUser: false },
		{ id: 2, username: 'ReelMaster', rank: 'Alpha', aura: 89, reelsWeek: 380, country: '🇬🇧', isCurrentUser: false },
		{ id: 3, username: 'ThumbWarrior', rank: 'Beta', aura: 82, reelsWeek: 356, country: '🇨🇦', isCurrentUser: false },
		{ id: 4, username: 'SwipeGod', rank: 'Beta', aura: 78, reelsWeek: 334, country: '🇦🇺', isCurrentUser: false },
		{ id: 5, username: 'InfiniteScroll', rank: 'Beta', aura: 75, reelsWeek: 312, country: '🇩🇪', isCurrentUser: false }
	];

	const friendsLeaderboard = [
		{ id: 1, username: 'BestFriend', rank: 'Alpha', aura: 87, reelsWeek: 298, status: 'online', isCurrentUser: false },
		{ id: 2, username: currentUser.username || 'You', rank: currentUser.rank, aura: currentUser.aura, reelsWeek: currentUser.reelsWeek, status: 'online', isCurrentUser: true },
		{ id: 3, username: 'College Buddy', rank: 'Beta', aura: 68, reelsWeek: 245, status: 'away', isCurrentUser: false },
		{ id: 4, username: 'Work Friend', rank: 'Gamma', aura: 54, reelsWeek: 189, status: 'offline', isCurrentUser: false },
		{ id: 5, username: 'Cousin Mike', rank: 'Delta', aura: 42, reelsWeek: 156, status: 'online', isCurrentUser: false }
	];

	useEffect(() => {
		supabase.auth.getUser().then(async ({ data: { user } }) => {
			if (!user) {
				router.push("/auth/login");
				return;
			}
			let username = user.user_metadata?.username || '';
			setCurrentUser((prev) => ({ ...prev, username }));
		});
	}, [router]);

	const getRankColor = (rank: string) => {
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

	const getAuraColor = (aura: number) => {
		if (aura > 80) return 'text-purple-400';
		if (aura > 60) return 'text-blue-400';
		if (aura > 40) return 'text-[#36D399]';
		if (aura > 20) return 'text-yellow-400';
		return 'text-red-400';
	};

	const getRankIcon = (rank: number) => {
		if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
		if (rank === 2) return <Trophy className="w-4 h-4 text-gray-300" />;
		if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
		return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-400">#{rank}</span>;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'online': return 'bg-green-500';
			case 'away': return 'bg-yellow-500';
			case 'offline': return 'bg-gray-500';
			default: return 'bg-gray-500';
		}
	};

	const getRoastMessage = (reels: number) => {
		if (reels > 100) return "Your phone is filing a restraining order. 📱⚖️";
		if (reels > 50) return "You've seen more Reels than a film festival. 🎬";
		if (reels > 20) return "Your thumb is applying for workers' comp. 👍💼";
		return "Not bad... for a Beta. 🤨";
	};

	const achievements = [
		{ name: 'First Scroll', desc: 'Watched your first Reel', unlocked: true, icon: '🍼' },
		{ name: 'Century Club', desc: 'Watched 100 Reels in a day', unlocked: false, icon: '💯' },
		{ name: 'Scroll Master', desc: 'Maintained a 7-day streak', unlocked: false, icon: '🏆' },
		{ name: 'Digital Monk', desc: 'Went 24h without Reels', unlocked: false, icon: '🧘‍♂️' },
	];

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			router.push('/');
		} else {
			console.error('Error logging out:', error.message);
		}
	};

	const currentLeaderboard = leaderboardTab === 'global' ? globalLeaderboard : friendsLeaderboard;

	return (
		<div className="bg-base-100 min-h-screen font-sans">
			{/* Header */}
			<header className="bg-[#1B2028] border-b border-[#232733] px-4 py-6">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full border-2 border-[#36D399] flex items-center justify-center bg-[#232733]">
							<span className="text-2xl">🤳</span>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-[#36D399]">ReelFiend Dashboard</h1>
							<p className="text-gray-400 text-sm">Your digital shame, quantified</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right">
							<div className="text-lg font-bold text-white">{currentUser ? currentUser.username : ''}</div>
							<div className="text-sm font-semibold">
								{currentUser && currentUser.rank ? (
									<span className={getRankColor(currentUser.rank)}>Rank: {currentUser.rank}</span>
								) : (
									<span className="text-gray-400">Rank: -</span>
								)}
							</div>
						</div>
						<div className="w-10 h-10 rounded-full bg-[#232733] flex items-center justify-center">
							<span className="text-lg">👤</span>
						</div>
						<button onClick={handleLogout} className="ml-4 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Logout</button>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-4 py-8">
				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Aura Level</span>
							<span className="text-lg">⚡</span>
						</div>
						<div className={`text-3xl font-bold ${getAuraColor(currentUser.aura)}`}>{currentUser.aura}</div>
						<div className="text-xs text-gray-500 mt-1">{currentUser.aura > 50 ? '↗ Rising' : '↘ Falling'}</div>
					</div>
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Today&apos;s Reels</span>
							<span className="text-lg">🎯</span>
						</div>
						<div className="text-3xl font-bold text-white">{currentUser.reelsToday}</div>
						<div className="text-xs text-red-400 mt-1 flex items-center gap-1">
							<span>📈</span>
							+12 from yesterday
						</div>
					</div>
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Weekly Total</span>
							<span className="text-lg">📅</span>
						</div>
						<div className="text-3xl font-bold text-white">{currentUser.reelsWeek}</div>
						<div className="text-xs text-gray-500 mt-1">Avg: {Math.round(currentUser.reelsWeek / 7)}/day</div>
					</div>
					<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">Time Wasted</span>
							<span className="text-lg">⏰</span>
						</div>
						<div className="text-3xl font-bold text-white">{currentUser.timeWasted}</div>
						<div className="text-xs text-gray-500 mt-1">This week</div>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Today's Roast */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-lg">🔥</span>
								<h2 className="text-xl font-bold text-[#36D399]">Today&apos;s Personal Roast</h2>
							</div>
							<div className="bg-[#1B2028] rounded-lg p-4 border border-[#232733]">
								<p className="text-lg text-gray-200 italic">&quot;{getRoastMessage(currentUser?.reelsToday || 0)}&quot;</p>
							</div>
							<div className="mt-4 text-sm text-gray-400">Based on your {currentUser.reelsToday} Reels today</div>
						</div>
						
						{/* Leaderboard Section */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<span className="text-lg">🏆</span>
									<h2 className="text-xl font-bold text-[#36D399]">Leaderboard</h2>
								</div>
								<div className="bg-[#1B2028] rounded-lg p-1 flex gap-1">
									<button
										onClick={() => setLeaderboardTab('global')}
										className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
											leaderboardTab === 'global' 
												? 'bg-[#36D399] text-black' 
												: 'text-gray-400 hover:text-white'
										}`}
									>
										<Globe className="w-4 h-4" />
										Global
									</button>
									<button
										onClick={() => setLeaderboardTab('friends')}
										className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
											leaderboardTab === 'friends' 
												? 'bg-[#36D399] text-black' 
												: 'text-gray-400 hover:text-white'
										}`}
									>
										<Users className="w-4 h-4" />
										Friends
									</button>
								</div>
							</div>
							
							<div className="space-y-3">
								{currentLeaderboard.slice(0, 5).map((user, index) => (
									<div 
										key={user.id} 
										className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
											user.isCurrentUser 
												? 'bg-[#1B2028] border-[#36D399]' 
												: 'bg-[#1B2028] border-[#1B2028] hover:border-[#232733]'
										}`}
									>
										<div className="flex items-center justify-center w-6">
											{getRankIcon(index + 1)}
										</div>
										
										<div className="relative">
											<div className="w-8 h-8 rounded-full bg-[#232733] flex items-center justify-center text-sm">
												{user.isCurrentUser ? '👤' : ['🎮', '🚀', '🎨', '⚡', '🌈'][index]}
											</div>
											{leaderboardTab === 'friends' && user.status && (
												<div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#1B2028] ${getStatusColor(user.status)}`}></div>
											)}
										</div>
										
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<span className={`font-semibold text-sm ${user.isCurrentUser ? 'text-[#36D399]' : 'text-white'}`}>
													{user.username}
												</span>
												{user.isCurrentUser && <span className="text-xs bg-[#36D399] text-black px-1.5 py-0.5 rounded">You</span>}
												{leaderboardTab === 'global' && user.country && <span className="text-xs">{user.country}</span>}
											</div>
											<div className={`text-xs ${getRankColor(user.rank)}`}>{user.rank}</div>
										</div>
										
										<div className="flex gap-4 text-right">
											<div>
												<div className={`text-sm font-bold ${getAuraColor(user.aura)}`}>{user.aura}</div>
												<div className="text-xs text-gray-400">Aura</div>
											</div>
											<div>
												<div className="text-sm font-bold text-white">{user.reelsWeek}</div>
												<div className="text-xs text-gray-400">Week</div>
											</div>
										</div>
									</div>
								))}
							</div>
							
							<div className="mt-4 text-center">
								<div className="text-sm text-gray-400">
									Your position: <span className="text-[#36D399] font-semibold">#{leaderboardTab === 'global' ? '7' : '2'}</span>
									{leaderboardTab === 'global' && <span className="text-gray-500"> out of 10,247 users</span>}
								</div>
							</div>
						</div>

						{/* Progress Chart */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<h2 className="text-xl font-bold text-[#36D399] mb-4">Weekly Progress</h2>
							<div className="space-y-3">
								{[
									{ day: 'Mon', reels: 45 },
									{ day: 'Tue', reels: 67 },
									{ day: 'Wed', reels: 23 },
									{ day: 'Thu', reels: 89 },
									{ day: 'Fri', reels: 56 },
									{ day: 'Sat', reels: 78 },
									{ day: 'Sun', reels: 34 }
								].map((dayData, index) => {
									const width = Math.min((dayData.reels / 100) * 100, 100);
									return (
										<div key={dayData.day} className="flex items-center gap-4">
											<span className="text-sm text-gray-400 w-8">{dayData.day}</span>
											<div className="flex-1 bg-[#1B2028] rounded-full h-4 relative">
												<div
													className={`h-full rounded-full transition-all duration-500 ${dayData.reels > 60 ? 'bg-red-400' : dayData.reels > 30 ? 'bg-yellow-400' : 'bg-[#36D399]'}`}
													style={{ width: `${width}%` }}
												/>
											</div>
											<span className="text-sm text-white w-8 text-right">{dayData.reels}</span>
										</div>
									);
								})}
							</div>
						</div>
						{/* Achievements */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-lg">🏆</span>
								<h2 className="text-xl font-bold text-[#36D399]">Achievements</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{achievements.map((achievement, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border ${achievement.unlocked ? 'bg-[#1B2028] border-[#36D399] text-white' : 'bg-[#1B2028] border-gray-600 text-gray-500'}`}
									>
										<div className="flex items-center gap-3">
											<span className="text-2xl">{achievement.icon}</span>
											<div>
												<div className="font-semibold">{achievement.name}</div>
												<div className="text-sm opacity-70">{achievement.desc}</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					{/* Sidebar */}
					<div className="space-y-6">
						{/* Rank Progress */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<h3 className="text-lg font-bold text-[#36D399] mb-4">Rank Progress</h3>
							<div className="text-center mb-4">
								<div className={`text-2xl font-bold ${getRankColor(currentUser.rank)}`}>{currentUser.rank}</div>
								<div className="text-sm text-gray-400">Current Rank</div>
							</div>
							<div className="bg-[#1B2028] rounded-full h-3 mb-2">
								<div
									className="bg-gradient-to-r from-red-400 to-[#36D399] h-full rounded-full transition-all duration-500"
									style={{ width: `${currentUser.aura}%` }}
								/>
							</div>
							<div className="text-xs text-gray-400 text-center">{currentUser.aura > 60 ? 'Rising to Beta' : 'Falling to Delta'}</div>
						</div>
						{/* Quick Stats */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<h3 className="text-lg font-bold text-[#36D399] mb-4">Quick Stats</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-400">Total Reels</span>
									<span className="text-white font-semibold">{currentUser.reelsTotal.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-400">Best Streak</span>
									<span className="text-white font-semibold">{currentUser.bestStreak} days</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-400">Current Streak</span>
									<span className="text-red-400 font-semibold">{currentUser.currentStreak} days</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-400">Daily Average</span>
									<span className="text-white font-semibold">{currentUser.avgDaily}</span>
								</div>
							</div>
						</div>
						{/* Leaderboard Position */}
						<div className="bg-[#232733] rounded-xl p-6 shadow-lg border border-[#232733]">
							<h3 className="text-lg font-bold text-[#36D399] mb-4">Your Position</h3>
							<div className="text-center">
								<div className="text-3xl font-bold text-yellow-400 mb-1">#7</div>
								<div className="text-sm text-gray-400 mb-3">Today's Leaderboard</div>
								<div className="text-xs text-gray-500">You're ahead of 847 other scrollers</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}