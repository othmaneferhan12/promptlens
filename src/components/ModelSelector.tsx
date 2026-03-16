import { MODEL_CONFIGS } from '../utils/imageUtils';
import type { AIModel } from '../types';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
}

export default function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  return (
    <div>
      <p className="mb-2 font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        Target Model
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MODEL_CONFIGS.map((model) => {
          const isSelected = selected === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                borderColor: isSelected ? model.color : 'var(--border-subtle)',
                backgroundColor: isSelected ? `${model.color}18` : 'var(--bg-elevated)',
                boxShadow: isSelected ? `0 0 12px ${model.color}28` : 'none',
              }}
            >
              <span className="text-base leading-none shrink-0">{model.icon}</span>
              <div className="min-w-0 flex-1">
                <div
                  className="font-grotesk text-xs font-600 leading-tight truncate"
                  style={{ color: isSelected ? model.color : 'var(--text-primary)' }}
                >
                  {model.name}
                </div>
                <div className="font-inter text-[10px] leading-tight text-[var(--text-secondary)] truncate">
                  {model.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
