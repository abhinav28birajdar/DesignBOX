import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProjectStore } from "@/store/projectStore";
import type { ProjectTab } from "@/types";

interface RecentProject {
  id: string;
  name: string;
  timestamp: number;
  width: number;
  height: number;
}

interface HomePageProps {
  onNewProject: (tab: ProjectTab) => void;
  onOpenProject: (id: string) => void;
}

const createNewTab = (name = "Untitled", width = 1920, height = 1080, background = "#ffffff"): ProjectTab => ({
  id: crypto.randomUUID(),
  name,
  width,
  height,
  dpi: 72,
  background,
  modified: false,
});

export default function HomePage({ onNewProject, onOpenProject }: HomePageProps) {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("designbox_recent_projects");
    if (stored) {
      try {
        setRecentProjects(JSON.parse(stored).slice(0, 6));
      } catch {
        console.error("Failed to load recent projects");
      }
    }
  }, []);

  const templates = [
    { name: "1080p Video", width: 1920, height: 1080 },
    { name: "Social Media", width: 1080, height: 1080 },
    { name: "A4 Document", width: 2480, height: 3508 },
    { name: "Mobile App", width: 540, height: 1080 },
    { name: "Poster", width: 2000, height: 3000 },
    { name: "Presentation", width: 1920, height: 1440 },
  ];

  const handleNewProject = (template?: { width: number; height: number }) => {
    const tab = createNewTab(
      template?.width ? `${template.width}x${template.height}` : "Untitled",
      template?.width || 1920,
      template?.height || 1080
    );
    onNewProject(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-700 bg-slate-900/50 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DesignBox
          </h1>
          <p className="text-slate-400 mt-2">Design Without Limits</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleNewProject()}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-left transition hover:shadow-lg hover:shadow-indigo-500/50"
            >
              <div className="relative z-10">
                <div className="text-2xl font-bold mb-2">+ New Project</div>
                <p className="text-indigo-100">Start with a blank canvas</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 transition group-hover:opacity-100" />
            </button>

            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".designbox,.json";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      try {
                        const data = JSON.parse(reader.result as string);
                        const newTab: ProjectTab = {
                          id: crypto.randomUUID(),
                          name: file.name.replace(/\.[^.]*$/, ""),
                          width: data.width || 1920,
                          height: data.height || 1080,
                          dpi: data.dpi || 72,
                          background: data.background || "#ffffff",
                          modified: false,
                        };
                        onOpenProject(newTab.id);
                      } catch {
                        alert("Failed to open project");
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 p-6 text-left transition hover:shadow-lg hover:shadow-slate-500/50"
            >
              <div className="relative z-10">
                <div className="text-2xl font-bold mb-2">📂 Open Project</div>
                <p className="text-slate-300">Open an existing project file</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 opacity-0 transition group-hover:opacity-100" />
            </button>
          </div>
        </motion.section>

        {/* Templates */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template, idx) => (
              <motion.button
                key={template.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onClick={() => handleNewProject(template)}
                className="group overflow-hidden rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700 hover:shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded mb-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-white opacity-75">
                    {template.width}x{template.height}
                  </span>
                </div>
                <div className="font-semibold group-hover:text-indigo-400 transition">{template.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentProjects.map((project, idx) => (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => onOpenProject(project.id)}
                  className="group overflow-hidden rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded mb-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">{project.width}x{project.height}</span>
                  </div>
                  <div className="font-semibold truncate group-hover:text-indigo-400 transition">{project.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(project.timestamp).toLocaleDateString()}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
