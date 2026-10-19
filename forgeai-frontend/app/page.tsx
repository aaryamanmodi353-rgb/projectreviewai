"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, GitPullRequest, AlertTriangle, CheckCircle2, 
  Settings, Terminal, FileCode2, Play, RotateCw, Hammer 
} from 'lucide-react';

// --- MINOR COMPONENTS ---

const StatCard = ({ title, value, trend, icon, color }: any) => (
  <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 bg-${color}-500/10 text-${color}-400 rounded-lg`}>{icon}</div>
      <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
    </div>
  </div>
);

const LegendItem = ({ label, value, color }: any) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center text-gray-400"><div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>{label}</div>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const LogLine = ({ time, level, action, details, color }: any) => (
  <div className="flex text-xs font-mono leading-relaxed border-b border-gray-800/50 pb-2">
    <span className="text-gray-500 w-24 flex-shrink-0">{time}</span>
    <span className={`${color} w-16 flex-shrink-0 font-bold`}>[{level}]</span>
    <span className="text-gray-300 w-48 flex-shrink-0">{action}</span>
    <span className="text-gray-500 flex-1">{details}</span>
  </div>
);

const TableRow = ({ pr, repo, event, action, severity, state, time, type, onClick }: any) => (
  <tr 
    onClick={onClick}
    className="hover:bg-gray-800/50 cursor-pointer transition-colors group border-b border-gray-800 last:border-0"
  >
    <td className="px-6 py-4 flex items-center space-x-3">
      <div className="p-2 bg-gray-800/80 rounded-lg group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
        <GitPullRequest className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" />
      </div>
      <div>
        <div className="font-medium text-white group-hover:text-indigo-300 transition-colors">{pr}</div>
        <div className="text-xs text-gray-500">{repo}</div>
      </div>
    </td>
    <td className="px-6 py-4 text-gray-400">
      <div>{event}</div>
      <div className="text-xs text-gray-500">Action: {action}</div>
    </td>
    <td className="px-6 py-4">
      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-semibold">
        {severity}
      </span>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded">
        {state}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-500 text-xs">
      <div className="flex items-center justify-between">
        <span>{time}</span>
        <span className="text-gray-600 group-hover:text-gray-300 transition-colors">&rarr;</span>
      </div>
    </td>
  </tr>
);

const ToolCard = ({ name, desc, ping }: any) => (
  <div className="flex items-center justify-between bg-[#0B0F19] p-3 rounded-lg border border-gray-800">
    <div className="flex items-center">
      <Terminal className="w-4 h-4 text-gray-500 mr-3" />
      <div>
        <div className="text-xs font-mono text-gray-300">{name}</div>
        <div className="text-[10px] text-gray-500">{desc}</div>
      </div>
    </div>
    <span className="text-[10px] font-mono text-emerald-500">{ping}</span>
  </div>
);

// --- TABS ---

const OverviewTab = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard")
      .then(res => {
        if (!res.ok) throw new Error("Backend returned an error");
        return res.json();
      })
      .then(json => {
        if (!json || !json.metrics) throw new Error("Malformed data");
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading || !data || !data.metrics) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-indigo-400 space-y-4">
        <RotateCw className="w-8 h-8 animate-spin" />
        <p className="text-sm text-gray-500">
          {error ? "Backend connection failed. Is Spring Boot running?" : "Fetching dashboard data..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2 flex items-center"><Activity className="w-3 h-3 mr-2"/> Real-time Telemetry</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Good morning, Aryaman.</h1>
          <p className="text-gray-400 mt-1">Here's what your AI review fleet is processing today.</p>
        </div>
       <button 
          onClick={() => setActiveTab && setActiveTab('studio')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
        >
          <Play className="w-4 h-4 mr-2" /> Open live review
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="PRs Processed" value={data?.metrics?.prsProcessed} trend="+12.4%" icon={<GitPullRequest />} color="indigo" />
        <StatCard title="Avg. Severity" value={data?.metrics?.avgSeverity} trend="-0.7" icon={<AlertTriangle />} color="red" />
        <StatCard title="Execution Success" value={data?.metrics?.successRate} trend="+2.1%" icon={<Activity />} color="emerald" />
        <StatCard title="MCP Tools Loaded" value={data?.metrics?.activeTools} trend="All tools active" icon={<Hammer />} color="purple" />
      </div>

      <div className="grid grid-cols-3 gap-4 h-80">
        <div className="col-span-2 bg-[#151B2B] border border-gray-800 rounded-xl p-5 flex flex-col">
          <h3 className="text-white font-medium mb-1">Review volume</h3>
          <p className="text-xs text-gray-500 mb-6">Pull requests processed over the last 14 days</p>
          <div className="flex-1 flex items-end space-x-2">
            {[30, 45, 70, 55, 85, 65, 50, 80, 60, 100, 85, 65, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-900/40 hover:bg-indigo-600/60 rounded-t-sm transition-colors relative group" style={{ height: `${h}%` }}>
                {i === 9 && <div className="absolute inset-0 bg-indigo-500 rounded-t-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-1">Severity distribution</h3>
          <p className="text-xs text-gray-500 mb-6">Across active repositories</p>
          <div className="flex items-center justify-center py-4">
            <div className="w-32 h-32 rounded-full border-[12px] border-gray-800 relative flex items-center justify-center">
               <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-red-500 border-r-amber-500 border-b-blue-500 border-l-emerald-500 opacity-80" style={{ transform: 'rotate(45deg)'}}></div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-white">{data?.metrics?.avgSeverity}</div>
                 <div className="text-[10px] text-gray-500 font-bold">AVG SCORE</div>
               </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <LegendItem label="Critical" value="14%" color="bg-red-500" />
            <LegendItem label="Warning" value="31%" color="bg-amber-500" />
            <LegendItem label="Moderate" value="38%" color="bg-blue-500" />
            <LegendItem label="Clean" value="17%" color="bg-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-[#151B2B] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium mb-1">Live PR feed</h3>
            <p className="text-xs text-gray-500">Webhook events from connected repositories</p>
          </div>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">View all activity &rarr;</button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-[#0B0F19]/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-3 font-medium">Pull Request</th>
              <th className="px-6 py-3 font-medium">Webhook Event</th>
              <th className="px-6 py-3 font-medium">Severity</th>
              <th className="px-6 py-3 font-medium">Pipeline State</th>
              <th className="px-6 py-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {data?.recentPrs?.map((pr: any, idx: number) => (
              <TableRow 
                key={idx}
                pr={pr.pr} 
                repo={pr.repo} 
                event={pr.event} 
                action={pr.action} 
                severity={pr.severity} 
                state={pr.state} 
                time={pr.time} 
                type={pr.type}
                onClick={() => setActiveTab && setActiveTab('studio')}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReviewStudioTab = () => {
  const [diff, setDiff] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiff = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/review/aaryamanmodi353-rgb/ai-pr-test/11/diff");
        if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);
        
        const data = await res.json();
        
        if (data && typeof data.diff === 'string') {
          const cleanDiff = data.diff.replace(/```diff/g, '').replace(/```/g, '').trim();
          setDiff(cleanDiff);
        } else {
          throw new Error("Backend did not return a valid diff string");
        }
      } catch (e) {
        console.error("Failed to fetch diff", e);
        setDiff("- ERROR: Connection to Spring Boot failed.\n+ Please ensure your backend is running (mvn spring-boot:run).");
      } finally {
        setLoading(false);
      }
    };
    fetchDiff();
  }, []);

const handlePostReport = async () => {
    setIsPosting(true);
    try {
      // ---> THE REPORT TEXT VARIABLE GOES HERE <---
      const reportText = "### ✦ AI Review Report\n\n**10/10 Clean**\n\n**Logic Verified: State Transition Accurate**\nThis pull request successfully implements the status tracking feature by activating the previously pending agent state. The internal tracking state has been safely migrated from `pending` to `active`. No issues found.";

      // 1. Tell Spring Boot to push the comment to GitHub via MCP
      const githubRes = await fetch("http://localhost:8080/api/review/aaryamanmodi353-rgb/ai-pr-test/11/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: reportText })
      });

      if (!githubRes.ok) {
        throw new Error("Failed to post comment to GitHub");
      }

      // 2. Send the event to the Spring Boot Dashboard API (Updates the feed)
      await fetch("http://localhost:8080/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pr: "#11 ai-pr-test",
          repo: "ai-pr-test",
          event: "issue_comment",
          action: "published",
          severity: "10/10",
          state: "Report Posted",
          time: "Just now",
          type: "success"
        })
      });
      
      // 3. Update the UI state to show success
      setPosted(true);
    } catch (err) {
      console.error("Failed to post report:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const renderDiffLines = () => {
    return diff.split('\n').map((line, idx) => {
      if (line.startsWith('+')) {
        return (
          <div key={idx} className="flex bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500 px-2 py-0.5 hover:bg-emerald-500/20">
            <span className="text-gray-500 mr-4 w-6 text-right select-none">+</span>
            <span className="whitespace-pre break-all">{line.substring(1)}</span>
          </div>
        );
      }
      if (line.startsWith('-')) {
        return (
          <div key={idx} className="flex bg-red-500/10 text-red-300 border-l-2 border-red-500 px-2 py-0.5 hover:bg-red-500/20">
            <span className="text-gray-500 mr-4 w-6 text-right select-none">-</span>
            <span className="whitespace-pre break-all">{line.substring(1)}</span>
          </div>
        );
      }
      return (
        <div key={idx} className="flex text-gray-300 px-2 py-0.5 hover:bg-gray-800/50">
          <span className="text-gray-600 mr-4 w-6 text-right select-none"> </span>
          <span className="whitespace-pre break-all">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex space-x-4 max-w-[1600px] mx-auto">
      <div className="flex-1 bg-[#151B2B] border border-gray-800 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0F1423]">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-300">
            <GitPullRequest className="w-4 h-4 text-gray-500" />
            <span>aaryamanmodi353-rgb/ai-pr-test #11</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto font-mono text-sm leading-relaxed bg-[#0B0F19]">
          {loading ? (
             <div className="flex flex-col justify-center items-center h-full text-indigo-400 space-y-4">
               <RotateCw className="w-8 h-8 animate-spin" /> 
               <p>Fetching live diff from GitHub via MCP...</p>
             </div>
          ) : (
             <div className="py-4">
               {renderDiffLines()}
             </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-800 bg-[#0F1423] flex justify-center items-center text-xs text-indigo-400">
          <CheckCircle2 className="w-3 h-3 mr-2" /> Diff synchronized
        </div>
      </div>

      <div className="w-[500px] flex flex-col space-y-4">
        <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-5 flex-1 overflow-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center"><span className="text-indigo-400 mr-2 text-xl">✦</span> AI Review Report</h2>
              <p className="text-xs text-gray-500">Gemini 3.8-flash • 842 tokens</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md text-xs font-bold">10/10 Clean</div>
          </div>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            This pull request successfully implements the status tracking feature by activating the previously pending agent state. The code is clean, idiomatic, and introduces no regressions.
          </p>
          <div className="space-y-4">
            <div className="bg-[#0B0F19] border border-emerald-900/50 rounded-lg p-4 border-l-4 border-l-emerald-500">
              <div className="flex items-center text-emerald-400 text-sm font-bold mb-2">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Logic Verified
              </div>
              <h4 className="text-white font-medium mb-1">State Transition Accurate</h4>
              <p className="text-sm text-gray-400 mb-3">The internal tracking state has been safely migrated from "pending" to "active" as required by the feature specification.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-400">
            <CheckCircle2 className={`w-5 h-5 mr-2 ${posted ? 'text-emerald-400' : 'text-gray-500'}`} />
            {posted ? "Published to GitHub PR #11" : "Ready to publish"}
          </div>
          <button 
            onClick={handlePostReport}
            disabled={isPosting || posted}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              posted 
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
            }`}
          >
            {isPosting ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : posted ? (
              "✓ Posted"
            ) : (
              "Post report →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfigTab = () => {
  const [config, setConfig] = useState({ targetRepositories: "", geminiApiKey: "", systemPrompt: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/config")
      .then(res => {
        if (!res.ok) throw new Error(`Backend error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Only apply the data if it is the actual config object, not an error JSON
        if (data && data.targetRepositories !== undefined) {
          setConfig(data);
        }
      })
      .catch(err => console.error("Failed to load config", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("");
    try {
      await fetch("http://localhost:8080/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Failed to save config", err);
      setSaveStatus("Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Agent Control Plane</p>
          <h1 className="text-2xl font-bold text-white">Agent configuration</h1>
          <p className="text-sm text-gray-400 mt-1">Manage analysis behavior, repository scope, and connected tools.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-emerald-400">{saveStatus}</span>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-50"
          >
            {isSaving ? <RotateCw className="w-4 h-4 mr-2 animate-spin" /> : "✓ Save changes"}
          </button>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="flex-1 space-y-6">
          <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-medium">Runtime settings</h3>
                <p className="text-xs text-gray-500">Credentials and target scope for the review agent</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-md flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div> API Connected
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target repositories</label>
                <input 
                  type="text" 
                  value={config?.targetRepositories || ""}
                  onChange={(e) => setConfig({...config, targetRepositories: e.target.value})}
                  className="w-full bg-[#0B0F19] border border-gray-800 text-sm rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gemini API key</label>
                <input 
                  type="password" 
                  value={config?.geminiApiKey || ""}
                  onChange={(e) => setConfig({...config, geminiApiKey: e.target.value})}
                  className="w-full bg-[#0B0F19] border border-gray-800 text-sm rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Base FDE system prompt</label>
                <textarea 
                  rows={6} 
                  value={config?.systemPrompt || ""}
                  onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                  className="w-full bg-[#0B0F19] border border-gray-800 text-sm rounded-md px-3 py-2 text-gray-400 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="bg-[#151B2B] border border-gray-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-white font-medium">MCP tool registry</h3>
              </div>
              <span className="text-emerald-400 text-xs font-bold">26 active</span>
            </div>
            <div className="space-y-3">
              <ToolCard name="github.get_pull_request_diff" desc="Fetches unified PR diffs" ping="12ms" />
              <ToolCard name="github.create_issue_comment" desc="Publishes Markdown reports" ping="38ms" />
              <ToolCard name="github.get_file_contents" desc="Reads repository context" ping="21ms" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsTab = ({ logs }: { logs: any[] }) => (
  <div className="h-full flex flex-col max-w-5xl mx-auto">
    <div className="mb-6 flex justify-between items-end">
      <div>
        <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">System output</p>
        <h1 className="text-2xl font-bold text-white">Execution logs</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time telemetry from the Spring Boot AI Engine.</p>
      </div>
      <div className="flex space-x-2">
        <button className="bg-[#151B2B] border border-gray-800 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">Clear logs</button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center">
          <Terminal className="w-3 h-3 mr-1.5" /> Connect via SSH
        </button>
      </div>
    </div>
    
    <div className="flex-1 bg-[#0B0F19] border border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      <div className="px-4 py-2 bg-[#0F1423] border-b border-gray-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="text-xs font-mono text-gray-500">forgeai@production-cluster: ~</div>
        <div></div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto space-y-4">
        {logs.map((log, idx) => (
          <LogLine
            key={idx}
            time={log.time}
            level={log.level}
            action={log.action}
            details={log.details}
            color={log.level === 'DONE' ? 'text-emerald-400' : log.level === 'ERROR' ? 'text-red-400' : 'text-gray-400'}
          />
        ))}
        <div className="w-2 h-4 bg-gray-300 animate-pulse mt-2"></div>
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD LAYOUT ---

export default function ForgeAIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/telemetry/stream");

    eventSource.onmessage = (event) => {
      const parts = event.data.split("|");
      if (parts.length >= 3) {
        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          level: parts[0],
          action: parts[1],
          details: parts[2]
        }]);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="flex h-screen bg-[#07090E] text-gray-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      <div className="w-64 bg-[#0B0F19] border-r border-gray-800 flex flex-col z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ForgeAI</span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Workspace</p>
            {[ 
              { id: 'overview', icon: <Activity className="w-4 h-4" />, label: 'Overview' },
              { id: 'studio', icon: <FileCode2 className="w-4 h-4" />, label: 'Review studio' },
              { id: 'config', icon: <Settings className="w-4 h-4" />, label: 'Agent config' },
              { id: 'logs', icon: <Terminal className="w-4 h-4" />, label: 'Execution logs', badge: logs.length > 0 ? logs.length : null }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-[#151B2B] text-white shadow-sm border border-gray-800' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={activeTab === item.id ? 'text-indigo-400' : 'text-gray-500'}>{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-4 space-y-4">
          <div className="bg-[#151B2B] rounded-xl p-4 border border-gray-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div>
                <p className="text-xs font-bold text-white">All systems operational</p>
                <p className="text-[10px] text-gray-500">Last checked 18s ago</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 px-2 py-2 hover:bg-gray-800/30 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-xs font-bold text-indigo-300">
              N
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Aryaman Modi</p>
              <p className="text-xs text-gray-500">Platform engineer</p>
            </div>
            <Settings className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
        <div className="absolute inset-0 bg-[#07090E]/95 z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent z-0 pointer-events-none"></div>
        
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 relative z-10 bg-[#0B0F19]/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>ForgeAI</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-[#0B0F19] border border-gray-800 rounded-lg px-3 py-1.5 text-sm">
              <Terminal className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 font-mono">Search reviews...</span>
              <kbd className="hidden sm:inline-block bg-gray-800 border border-gray-700 rounded px-1.5 text-[10px] font-mono text-gray-400 ml-2">⌘ K</kbd>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 relative z-10 scrollbar-hide">
          {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === 'studio' && <ReviewStudioTab />}
          {activeTab === 'config' && <ConfigTab />}
          {activeTab === 'logs' && <LogsTab logs={logs} />}
        </main>
      </div>
    </div>
  );
}