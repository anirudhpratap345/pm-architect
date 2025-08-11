"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Users, Star, Copy } from "lucide-react";

interface DecisionTemplate {
  id: string;
  name: string;
  description?: string;
  framework: string;
  steps: string[];
  questions: string[];
  isPublic: boolean;
  createdBy: string;
  createdByUser: {
    name?: string;
    email: string;
  };
  _count: {
    usages: number;
  };
  createdAt: string;
}

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<DecisionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    framework: "",
    steps: [""],
    questions: [""],
    isPublic: false,
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadTemplates();
  }, [session, status, router]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTemplate,
          steps: newTemplate.steps.filter(step => step.trim() !== ""),
          questions: newTemplate.questions.filter(q => q.trim() !== ""),
        }),
      });

      if (response.ok) {
        const template = await response.json();
        setTemplates([template, ...templates]);
        setNewTemplate({
          name: "",
          description: "",
          framework: "",
          steps: [""],
          questions: [""],
          isPublic: false,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const addStep = () => {
    setNewTemplate({ ...newTemplate, steps: [...newTemplate.steps, ""] });
  };

  const removeStep = (index: number) => {
    const newSteps = newTemplate.steps.filter((_, i) => i !== index);
    setNewTemplate({ ...newTemplate, steps: newSteps });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...newTemplate.steps];
    newSteps[index] = value;
    setNewTemplate({ ...newTemplate, steps: newSteps });
  };

  const addQuestion = () => {
    setNewTemplate({ ...newTemplate, questions: [...newTemplate.questions, ""] });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = newTemplate.questions.filter((_, i) => i !== index);
    setNewTemplate({ ...newTemplate, questions: newQuestions });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...newTemplate.questions];
    newQuestions[index] = value;
    setNewTemplate({ ...newTemplate, questions: newQuestions });
  };

  const useTemplate = (template: DecisionTemplate) => {
    // Navigate to decision creation with template pre-filled
    router.push(`/decision/new?template=${template.id}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Decision Templates</h1>
          <p className="text-gray-600 mt-2">
            Use proven decision-making frameworks to structure your decisions effectively.
          </p>
        </div>

        {/* Create Template Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </button>
        </div>

        {/* Create Template Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Decision Template</h2>
            <form onSubmit={createTemplate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SWOT Analysis"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="framework" className="block text-sm font-medium text-gray-700">
                    Framework Type
                  </label>
                  <input
                    type="text"
                    id="framework"
                    value={newTemplate.framework}
                    onChange={(e) => setNewTemplate({ ...newTemplate, framework: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SWOT Analysis, Decision Matrix"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe when and how to use this template"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision Steps
                </label>
                <div className="space-y-2">
                  {newTemplate.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Step ${index + 1}`}
                      />
                      {newTemplate.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Step
                  </button>
                </div>
              </div>

              {/* Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Questions
                </label>
                <div className="space-y-2">
                  {newTemplate.questions.map((question, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Question ${index + 1}`}
                      />
                      {newTemplate.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Question
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newTemplate.isPublic}
                  onChange={(e) => setNewTemplate({ ...newTemplate, isPublic: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                  Make this template public for other users
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Template
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

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first decision template.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{template.framework}</p>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      )}
                    </div>
                    {template.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Template Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {template._count.usages} uses
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {template.steps.length} steps
                    </span>
                  </div>

                  {/* Steps Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Steps:</h4>
                    <div className="space-y-1">
                      {template.steps.slice(0, 3).map((step, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {index + 1}. {step}
                        </div>
                      ))}
                      {template.steps.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{template.steps.length - 3} more steps
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Questions Preview */}
                  {template.questions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Questions:</h4>
                      <div className="space-y-1">
                        {template.questions.slice(0, 2).map((question, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {question}
                          </div>
                        ))}
                        {template.questions.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{template.questions.length - 2} more questions
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Creator Info */}
                  <div className="text-xs text-gray-500 mb-4">
                    Created by {template.createdByUser.name || template.createdByUser.email}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => useTemplate(template)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Use Template →
                    </button>
                    {template.createdBy === session.user?.email && (
                      <button
                        className="text-gray-400 hover:text-gray-600 text-sm"
                        title="Edit Template"
                      >
                        Edit
                      </button>
                    )}
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
