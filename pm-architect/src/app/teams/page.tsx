"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Settings, Trash2 } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
  }>;
  _count: {
    decisions: number;
    members: number;
  };
  createdAt: string;
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadTeams();
  }, [session, status, router]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        const team = await response.json();
        setTeams([team, ...teams]);
        setNewTeam({ name: "", description: "" });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800";
      case "admin": return "bg-blue-100 text-blue-800";
      case "member": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">
            Collaborate with your team members on decisions and projects.
          </p>
        </div>

        {/* Create Team Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Team</h2>
            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team description"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first team to collaborate with others.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                      )}
                      
                      {/* Team Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {team._count.members} members
                        </span>
                        <span>{team._count.decisions} decisions</span>
                      </div>

                      {/* Owner */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xs text-gray-500">Owner:</span>
                        <div className="flex items-center space-x-2">
                          {team.owner.image ? (
                            <img
                              src={team.owner.image}
                              alt={team.owner.name || team.owner.email}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                              {team.owner.name?.charAt(0) || team.owner.email.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {team.owner.name || team.owner.email}
                          </span>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Members:</h4>
                        <div className="space-y-1">
                          {team.members.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {member.user.image ? (
                                  <img
                                    src={member.user.image}
                                    alt={member.user.name || member.user.email}
                                    className="w-5 h-5 rounded-full"
                                  />
                                ) : (
                                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                                    {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                                  </div>
                                )}
                                <span className="text-sm text-gray-900">
                                  {member.user.name || member.user.email}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                {member.role}
                              </span>
                            </div>
                          ))}
                          {team.members.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{team.members.length - 3} more members
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => router.push(`/teams/${team.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Team →
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/teams/${team.id}/settings`)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Team Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      {team.owner.email === session.user?.email && (
                        <button
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete Team"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
