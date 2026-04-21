"use client";

import { useState, useEffect } from "react";
import { Trophy, Trash2, Plus, User, AlertCircle } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  email: string;
  score: number;
  totalQuestions: number;
  streak: number;
  date: string;
  createdAt: string;
}

const ADMIN_SECRET = "flinch-admin-2026-xyz";

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newScore, setNewScore] = useState(5);
  const [newStreak, setNewStreak] = useState(1);
  const [adding, setAdding] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/leaderboard?secret=${ADMIN_SECRET}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/leaderboard?id=${id}&secret=${ADMIN_SECRET}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchEntries(); // Refresh the list
      } else {
        alert("Failed to delete entry");
      }
    } catch (error) {
      alert("Error deleting entry");
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    try {
      const response = await fetch(`/api/admin/leaderboard?secret=${ADMIN_SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          score: newScore,
          streak: newStreak,
          date: new Date().toISOString().slice(0, 10), // Today's date
        }),
      });
      
      if (response.ok) {
        setShowAddForm(false);
        setNewEmail("");
        setNewScore(5);
        setNewStreak(1);
        await fetchEntries(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add entry");
      }
    } catch (error) {
      alert("Error adding entry");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Leaderboard Controls
          </h1>
          <p className="text-gray-600 mt-1">
            Manage daily quiz leaderboard entries
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="size-4" />
          Add Entry
        </button>
      </div>

      {/* Warning Notice */}
      <div className="border border-amber-200 rounded-xl bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900">Admin Controls</h3>
            <p className="text-sm text-amber-700 mt-1">
              Use these controls to remove spam entries or add test data. Deleted entries cannot be restored.
            </p>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Add Test Entry</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score (0-5)
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Streak
                </label>
                <input
                  type="number"
                  min={1}
                  value={newStreak}
                  onChange={(e) => setNewStreak(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={adding}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : "Add Entry"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                  </tr>
                ))
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Trophy className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leaderboard entries found.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Entries will appear as users complete daily quizzes.
                    </p>
                  </td>
                </tr>
              ) : (
                entries
                  .sort((a, b) => b.score - a.score || b.streak - a.streak) // Sort by score, then streak
                  .map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="size-4 text-yellow-500" />}
                          <span className="font-medium text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-gray-400" />
                          <span className="text-gray-900">{entry.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {entry.score}/{entry.totalQuestions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          entry.streak >= 7 
                            ? "bg-purple-100 text-purple-800"
                            : entry.streak >= 3
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          🔥 {entry.streak}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleting === entry.id}
                          className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="size-4" />
                          {deleting === entry.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}