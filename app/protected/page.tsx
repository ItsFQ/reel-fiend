'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image'
import Link from 'next/link';
import { Trophy, Medal, Crown, Users, Globe, TrendingUp, TrendingDown, Flame, Zap, Target, Calendar, Clock, Star } from 'lucide-react';

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
			case 'NPC': return 'text-pink-400';
			case 'Lost Soul': return 'text-orange-400';
			case 'Unemployed': return 'text-red-400';
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
		if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" />;
		if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300 drop-shadow-lg" />;
		if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 drop-shadow-lg" />;
		return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-700 rounded-full">#{rank}</span>;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'online': return 'bg-green-500 shadow-green-500/50';
			case 'away': return 'bg-yellow-500 shadow-yellow-500/50';
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
		<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen font-sans">
			{/* Animated Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-emerald-900/10 pointer-events-none"></div>
			
			{/* Header */}
			<header className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 py-6 shadow-2xl">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
					{/* Left: Logo + Titles */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
						<Link href="/" className="text-emerald-400 font-bold text-xl flex items-center gap-3 hover:text-emerald-300 transition-colors group">
							<div className="relative">
								<Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full ring-2 ring-emerald-400/50 group-hover:ring-emerald-300/70 transition-all" />
								<div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur group-hover:bg-emerald-300/30 transition-all"></div>
							</div>
							ReelsFiend
						</Link>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
								ReelFiend Dashboard
							</h1>
							<p className="text-slate-400 text-sm mt-1 font-medium">Your digital shame, beautifully quantified</p>
						</div>
					</div>

					{/* Right: User Info + Logout */}
					<div className="flex items-center gap-4">
						<div className="text-right">
							<div className="text-xl font-bold text-white">{currentUser.username}</div>
							<div className={`text-sm font-semibold flex items-center gap-1 justify-end ${getRankColor(currentUser.rank)}`}>
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
				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
						<div className="flex items-center justify-between mb-3">
							<span className="text-slate-400 text-sm font-medium">Aura Level</span>
							<Zap className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
						</div>
						<div className={`text-4xl font-bold ${getAuraColor(currentUser.aura)} mb-1`}>{currentUser.aura}</div>
						<div className="flex items-center gap-1 text-xs text-slate-500">
							{currentUser.aura > 50 ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
							{currentUser.aura > 50 ? 'Rising' : 'Falling'}
						</div>
					</div>
					
					<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
						<div className="flex items-center justify-between mb-3">
							<span className="text-slate-400 text-sm font-medium">Today's Reels</span>
							<Target className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
						</div>
						<div className="text-4xl font-bold text-white mb-1">{currentUser.reelsToday}</div>
						<div className="flex items-center gap-1 text-xs text-red-400">
							<TrendingUp className="w-3 h-3" />
							+12 from yesterday
						</div>
					</div>
					
					<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
						<div className="flex items-center justify-between mb-3">
							<span className="text-slate-400 text-sm font-medium">Weekly Total</span>
							<Calendar className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
						</div>
						<div className="text-4xl font-bold text-white mb-1">{currentUser.reelsWeek}</div>
						<div className="text-xs text-slate-500">Avg: {Math.round(currentUser.reelsWeek / 7)}/day</div>
					</div>
					
					<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
						<div className="flex items-center justify-between mb-3">
							<span className="text-slate-400 text-sm font-medium">Time Wasted</span>
							<Clock className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
						</div>
						<div className="text-4xl font-bold text-white mb-1">{currentUser.timeWasted}</div>
						<div className="text-xs text-slate-500">This week</div>
					</div>
				</div>
				
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Today's Roast */}
						<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-orange-500/20 rounded-xl">
									<Flame className="w-6 h-6 text-orange-400" />
								</div>
								<h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Today's Personal Roast</h2>
							</div>
							<div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-6 border border-slate-700/50 shadow-inner">
								<p className="text-lg text-slate-200 italic font-medium leading-relaxed">"{getRoastMessage(currentUser?.reelsToday || 0)}"</p>
							</div>
							<div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
								<Target className="w-4 h-4" />
								Based on your {currentUser.reelsToday} Reels today
							</div>
						</div>
						
						{/* Leaderboard Section */}
						<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-yellow-500/20 rounded-xl">
										<Trophy className="w-6 h-6 text-yellow-400" />
									</div>
									<h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Leaderboard</h2>
								</div>
								<div className="bg-slate-900/50 rounded-xl p-1 flex gap-1 border border-slate-700/50">
									<button
										onClick={() => setLeaderboardTab('global')}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
											leaderboardTab === 'global' 
												? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
												: 'text-slate-400 hover:text-white hover:bg-slate-800/50'
										}`}
									>
										<Globe className="w-4 h-4" />
										Global
									</button>
									<button
										onClick={() => setLeaderboardTab('friends')}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
											leaderboardTab === 'friends' 
												? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
												: 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
										className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
											user.isCurrentUser 
												? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-emerald-500/50 shadow-emerald-500/10 shadow-lg' 
												: 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50'
										}`}
									>
										<div className="flex items-center justify-center w-8">
											{getRankIcon(index + 1)}
										</div>
										
										<div className="relative">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm border-2 border-slate-600/50 shadow-lg">
												{user.isCurrentUser ? '👤' : ['🎮', '🚀', '🎨', '⚡', '🌈'][index]}
											</div>
											{leaderboardTab === 'friends' && user.status && (
												<div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 shadow-sm ${getStatusColor(user.status)}`}></div>
											)}
										</div>
										
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className={`font-bold text-base ${user.isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
													{user.username}
												</span>
												{user.isCurrentUser && <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-medium">You</span>}
												{leaderboardTab === 'global' && user.country && <span className="text-sm">{user.country}</span>}
											</div>
											<div className={`text-xs font-medium ${getRankColor(user.rank)}`}>{user.rank}</div>
										</div>
										
										<div className="flex gap-6 text-right">
											<div>
												<div className={`text-base font-bold ${getAuraColor(user.aura)}`}>{user.aura}</div>
												<div className="text-xs text-slate-400">Aura</div>
											</div>
											<div>
												<div className="text-base font-bold text-white">{user.reelsWeek}</div>
												<div className="text-xs text-slate-400">Week</div>
											</div>
										</div>
									</div>
								))}
							</div>
							
							<div className="mt-6 text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
								<div className="text-sm text-slate-300">
									Your position: <span className="text-emerald-400 font-bold text-lg">#{leaderboardTab === 'global' ? '7' : '2'}</span>
									{leaderboardTab === 'global' && <span className="text-slate-500 ml-2">out of 10,247 users</span>}
								</div>
							</div>
						</div>

						{/* Progress Chart */}
						<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-blue-500/20 rounded-xl">
									<TrendingUp className="w-6 h-6 text-blue-400" />
								</div>
								<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Weekly Progress</h2>
							</div>
							<div className="space-y-4">
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
											<span className="text-sm font-medium text-slate-300 w-10">{dayData.day}</span>
											<div className="flex-1 bg-slate-900/50 rounded-full h-5 relative border border-slate-700/50 overflow-hidden">
												<div
													className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${
														dayData.reels > 60 
															? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30' 
															: dayData.reels > 30 
																? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30' 
																: 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30'
													}`}
													style={{ 
														width: `${width}%`,
														animationDelay: `${index * 100}ms`
													}}
												/>
											</div>
											<span className="text-sm font-bold text-white w-10 text-right">{dayData.reels}</span>
										</div>
									);
								})}
							</div>
						</div>
						
						{/* Achievements */}
						<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-purple-500/20 rounded-xl">
									<Trophy className="w-6 h-6 text-purple-400" />
								</div>
								<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Achievements</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{achievements.map((achievement, index) => (
									<div
										key={index}
										className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${
											achievement.unlocked 
												? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-500/50 text-white shadow-emerald-500/10 shadow-lg' 
												: 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50'
										}`}
									>
										<div className="flex items-center gap-4">
											<span className="text-3xl filter drop-shadow-lg">{achievement.icon}</span>
											<div>
												<div className="font-bold text-base mb-1">{achievement.name}</div>
												<div className="text-sm opacity-80">{achievement.desc}</div>
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
						<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
							<h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
								<Star className="w-5 h-5" />
								Rank Progress
							</h3>
							<div className="text-center mb-6">
								<div className={`text-3xl font-bold mb-2 ${getRankColor(currentUser.rank)}`}>{currentUser.rank}</div>
								<div className="text-sm text-slate-400 font-medium">Current Rank</div>
							</div>
							<div className="bg-slate-900/50 rounded-full h-4 mb-3 border border-slate-700/50 overflow-hidden">
								<div
									className="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 h-full rounded-full transition-all duration-1000 shadow-lg"
									style={{ width: `${currentUser.aura}%` }}
								/>
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
									<span className="text-slate-400 font-medium">Total Reels</span>
									<span className="text-white font-bold text-lg">{currentUser.reelsTotal.toLocaleString()}</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-slate-700/30">
									<span className="text-slate-400 font-medium">Best Streak</span>
									<span className="text-emerald-400 font-bold text-lg">{currentUser.bestStreak} days</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-slate-700/30">
									<span className="text-slate-400 font-medium">Current Streak</span>
									<span className="text-red-400 font-bold text-lg">{currentUser.currentStreak} days</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-slate-400 font-medium">Daily Average</span>
									<span className="text-white font-bold text-lg">{currentUser.avgDaily}</span>
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
								<div className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-lg">#7</div>
								<div className="text-sm text-slate-400 mb-4 font-medium">Today's Leaderboard</div>
								<div className="text-xs text-slate-500 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50">
									You're ahead of 847 other scrollers
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);