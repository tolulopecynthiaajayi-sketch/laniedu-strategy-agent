const fs = require('fs');
const path = './src/components/StrategyBriefView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add onUpdateBrief prop
content = content.replace(
  'interface StrategyBriefViewProps {\n  brief: ClientStrategyBrief;\n}',
  'interface StrategyBriefViewProps {\n  brief: ClientStrategyBrief;\n  onUpdateBrief?: (newBrief: ClientStrategyBrief) => void;\n}'
);

content = content.replace(
  'export const StrategyBriefView: React.FC<StrategyBriefViewProps> = ({ brief }) => {',
  'export const StrategyBriefView: React.FC<StrategyBriefViewProps> = ({ brief, onUpdateBrief }) => {\n  const [aiPrompt, setAiPrompt] = useState("");\n  const [isGenerating, setIsGenerating] = useState(false);\n\n  const handleAiRegenerate = async () => {\n    if (!aiPrompt.trim() || !onUpdateBrief) return;\n    setIsGenerating(true);\n    try {\n      const res = await fetch("https://laniedu-strategy-agent.vercel.app/api/copilot", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ intakeData: brief.intakeData, prompt: aiPrompt, currentBrief: brief })\n      });\n      const data = await res.json();\n      if (data.success && data.brief) {\n        onUpdateBrief(data.brief);\n        setAiPrompt("");\n      } else {\n        alert("AI Error: " + data.error);\n      }\n    } catch(err) {\n      console.error(err);\n    } finally {\n      setIsGenerating(false);\n    }\n  };'
);

const copilotHtml = `
        {/* Section 7: AI Strategy Co-Pilot */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-emerald-500/30">
          <h3 className="text-xs font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            7. AI Strategy Co-Pilot
          </h3>
          <p className="text-xs text-slate-300">
            Tell the AI how to adjust this strategy (e.g., "Find more schools in Brazil", "Remove Malaysia", "Increase budget to €6000").
          </p>
          <div className="flex gap-2">
            <input 
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g. Focus exclusively on South America..."
              className="flex-1 rounded-xl glass-input p-3 text-xs font-mono"
            />
            <button 
              onClick={handleAiRegenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isGenerating ? 'Regenerating...' : 'Regenerate Strategy'}
            </button>
          </div>
        </div>
`;

content = content.replace(
  '{/* Footer Disclaimer */}',
  copilotHtml + '\n        {/* Footer Disclaimer */}'
);

fs.writeFileSync(path, content);
console.log('StrategyBriefView patched.');
