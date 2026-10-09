import React, { useEffect, useState } from 'react';
import {
  Bot,
  Check,
  Cpu,
  ExternalLink,
  HelpCircle,
  KeyRound,
  Server,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig;
  onSaveConfig: (cfg: SystemConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<SystemConfig>(config);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDokployGuide, setShowDokployGuide] = useState(true);

  useEffect(() => {
    setFormData(config);
    // Fetch key status from backend
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHasGeminiKey(!!d.geminiKeySet))
      .catch((e) => console.error(e));
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#182026] border border-[#263238] rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#263238]">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#14c290]" />
            <div>
              <h2 className="text-base font-bold text-[#e4e8eb]">
                Settings & API Keys
              </h2>
              <p className="text-[11px] text-[#9aa6af] font-mono">
                Dokploy environment & AI model settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9aa6af] hover:text-[#e4e8eb] p-1 rounded-lg hover:bg-[#131a1f]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Dokploy & GEMINI_API_KEY Secrets Status Card */}
        <div className="bg-[#131a1f] p-4 rounded-xl border border-[#263238] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#e4e8eb] flex items-center gap-1.5 font-mono">
              <KeyRound className="w-4 h-4 text-[#14c290]" />
              Dokploy & Secrets Status
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                hasGeminiKey
                  ? 'bg-[#14c290]/15 text-[#14c290] border border-[#14c290]/30'
                  : 'bg-[#e5a93b]/15 text-[#e5a93b] border border-[#e5a93b]/30'
              }`}
            >
              {hasGeminiKey ? 'GEMINI_API_KEY Active' : 'Key Missing in Secrets'}
            </span>
          </div>

          <p className="text-xs text-[#9aa6af] leading-relaxed">
            {hasGeminiKey ? (
              <span className="text-[#14c290]">
                ✓ Your <code className="bg-[#182026] px-1 rounded text-[#e4e8eb]">GEMINI_API_KEY</code> is loaded and actively powering all trading agents.
              </span>
            ) : (
              <span>
                To run live Gemini AI reasoning, set <code className="bg-[#182026] px-1 rounded text-[#14c290]">GEMINI_API_KEY</code> in your Dokploy Environment Settings or AI Studio Secrets tab.
              </span>
            )}
          </p>

          {/* Step-by-Step Dokploy Guide */}
          <div className="p-3 bg-[#182026] rounded-lg border border-[#263238] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#e4e8eb] flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-[#14c290]" />
                How to set in Dokploy:
              </span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#14c290] hover:underline flex items-center gap-1 font-mono"
              >
                <span>Get Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside text-[#9aa6af] space-y-1 text-[11px]">
              <li>Go to your Dokploy project dashboard.</li>
              <li>Navigate to the <strong>Environment / Variables</strong> tab.</li>
              <li>Add variable name: <code className="text-[#14c290]">GEMINI_API_KEY</code></li>
              <li>Paste your key as the value and click <strong>Save & Deploy</strong>.</li>
            </ol>
          </div>
        </div>

        {/* 2. Model Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Deep Think Tier (Managers) */}
          <div className="bg-[#131a1f] p-3.5 rounded-xl border border-[#263238]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#e4e8eb] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#14c290]" />
                Strategy Leaders (Research & Portfolio Managers)
              </span>
              <span className="text-[10px] text-[#14c290] bg-[#14c290]/15 px-2 py-0.5 rounded">
                Deep Reasoning
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-[#9aa6af] mb-1">Provider</label>
                <select
                  value={formData.deepThinkProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, deepThinkProvider: e.target.value })
                  }
                  className="w-full bg-[#182026] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
                >
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="ollama">Ollama (Local / Self-hosted)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aa6af] mb-1">Model Name</label>
                <input
                  type="text"
                  value={formData.deepThinkModel}
                  onChange={(e) =>
                    setFormData({ ...formData, deepThinkModel: e.target.value })
                  }
                  className="w-full bg-[#182026] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
                />
              </div>
            </div>
          </div>

          {/* Quick Think Tier (Data Analysts) */}
          <div className="bg-[#131a1f] p-3.5 rounded-xl border border-[#263238]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#e4e8eb] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#14c290]" />
                Fast Analysts (Charts, Financials, Social Sentiment)
              </span>
              <span className="text-[10px] text-[#9aa6af] bg-[#182026] px-2 py-0.5 rounded">
                High Speed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-[#9aa6af] mb-1">Provider</label>
                <select
                  value={formData.quickThinkProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, quickThinkProvider: e.target.value })
                  }
                  className="w-full bg-[#182026] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
                >
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="ollama">Ollama (Local / Self-hosted)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aa6af] mb-1">Model Name</label>
                <input
                  type="text"
                  value={formData.quickThinkModel}
                  onChange={(e) =>
                    setFormData({ ...formData, quickThinkModel: e.target.value })
                  }
                  className="w-full bg-[#182026] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
                />
              </div>
            </div>
          </div>

          {/* Graph Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9aa6af] mb-1">
                Debate Rounds (1 - 5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.maxDebateRounds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDebateRounds: parseInt(e.target.value) || 2,
                  })
                }
                className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
              />
            </div>

            <div>
              <label className="block text-[#9aa6af] mb-1">
                Risk Review Rounds (1 - 5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.maxRiskRounds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxRiskRounds: parseInt(e.target.value) || 2,
                  })
                }
                className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
              />
            </div>

            <div>
              <label className="block text-[#9aa6af] mb-1">
                Creativity / Temp (0.0 - 1.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.0"
                max="1.0"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    temperature: parseFloat(e.target.value) || 0.7,
                  })
                }
                className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
              />
            </div>

            <div>
              <label className="block text-[#9aa6af] mb-1">Benchmark Market</label>
              <input
                type="text"
                value={formData.benchmarkTicker}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benchmarkTicker: e.target.value.toUpperCase(),
                  })
                }
                placeholder="SPY or QQQ"
                className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#263238] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#131a1f] text-[#9aa6af] hover:text-[#e4e8eb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] font-bold flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
