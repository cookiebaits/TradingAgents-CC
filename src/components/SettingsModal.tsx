import React, { useEffect, useState } from 'react';
import { Bot, Check, Cpu, Sparkles, X } from 'lucide-react';
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
  const [providersData, setProvidersData] = useState<any[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  useEffect(() => {
    fetch('/api/providers')
      .then((r) => r.json())
      .then((d) => setProvidersData(d.providers || []))
      .catch((e) => console.error(e));
  }, []);

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
      <div className="bg-[#182026] border border-[#263238] rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-[#263238] mb-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#14c290]" />
            <h2 className="text-base font-bold text-[#e4e8eb]">
              TradingAgents Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#9aa6af] hover:text-[#e4e8eb] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Deep Think Tier */}
          <div className="bg-[#131a1f] p-3.5 rounded-xl border border-[#263238]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#e4e8eb] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#14c290]" />
                Deep Think Tier (Managers & Researchers)
              </span>
              <span className="text-[10px] text-[#14c290] bg-[#14c290]/15 px-2 py-0.5 rounded">
                High Reasoning
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
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aa6af] mb-1">Model ID</label>
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

          {/* Quick Think Tier */}
          <div className="bg-[#131a1f] p-3.5 rounded-xl border border-[#263238]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#e4e8eb] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#14c290]" />
                Quick Think Tier (Parallel Analysts)
              </span>
              <span className="text-[10px] text-[#9aa6af] bg-[#182026] px-2 py-0.5 rounded">
                High Throughput
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
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aa6af] mb-1">Model ID</label>
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

          {/* Graph Knobs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9aa6af] mb-1">
                Max Bull/Bear Debate Rounds
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
                Max Risk Committee Rounds
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
                Temperature (0.0 - 1.0)
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
              <label className="block text-[#9aa6af] mb-1">Benchmark Ticker</label>
              <input
                type="text"
                value={formData.benchmarkTicker}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benchmarkTicker: e.target.value.toUpperCase(),
                  })
                }
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
                  <span>Config Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
