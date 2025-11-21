import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { gamificationService } from '../lib/gamification.service';

const GamificationContext = createContext();

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [streak, setStreak] = useState(null);
  const [xp, setXp] = useState(null);
  const [level, setLevel] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all gamification data
  const fetchGamificationData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [streakData, xpData, achievementsData, leaderboardData, rankData] = 
        await Promise.all([
          gamificationService.getStreakInfo(),
          gamificationService.getXPInfo(),
          gamificationService.getAchievements(),
          gamificationService.getLeaderboard(),
          gamificationService.getUserRank()
        ]);

      setStreak(streakData);
      setXp(xpData);
      setLevel(xpData?.level);
      setAchievements(achievementsData);
      setLeaderboard(leaderboardData);
      setUserRank(rankData);
    } catch (err) {
      setError(err.message || 'Failed to fetch gamification data');
      console.error('Error fetching gamification data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add XP
  const addXP = async (amount, action = 'custom') => {
    setError(null);
    try {
      const result = await gamificationService.addXP(amount, action);
      setXp(result);
      setLevel(result?.level);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to add XP');
      console.error('Error adding XP:', err);
    }
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId) => {
    setError(null);
    try {
      const result = await gamificationService.unlockAchievement(achievementId);
      setAchievements(prev => 
        prev.map(ach => ach.id === achievementId ? result : ach)
      );
      return result;
    } catch (err) {
      setError(err.message || 'Failed to unlock achievement');
      console.error('Error unlocking achievement:', err);
    }
  };

  // Fetch streak info
  const getStreakInfo = async () => {
    setError(null);
    try {
      const data = await gamificationService.getStreakInfo();
      setStreak(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch streak info');
      console.error('Error fetching streak:', err);
    }
  };

  // Fetch achievements
  const getAchievements = async () => {
    setError(null);
    try {
      const data = await gamificationService.getAchievements();
      setAchievements(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch achievements');
      console.error('Error fetching achievements:', err);
    }
  };

  // Fetch leaderboard
  const getLeaderboard = async (limit = 10) => {
    setError(null);
    try {
      const data = await gamificationService.getLeaderboard(limit);
      setLeaderboard(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard');
      console.error('Error fetching leaderboard:', err);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load data on mount
  useEffect(() => {
    fetchGamificationData();
  }, []);

  const value = {
    streak,
    xp,
    level,
    achievements,
    leaderboard,
    userRank,
    isLoading,
    error,
    fetchGamificationData,
    addXP,
    unlockAchievement,
    getStreakInfo,
    getAchievements,
    getLeaderboard,
    clearError
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

GamificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GamificationContext;
