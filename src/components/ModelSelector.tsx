import { motion } from 'framer-motion';
import { MODEL_CONFIGS } from '../utils/imageUtils';
import type { AIModel } from '../types';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
}

export default function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="mb-4 font-grotesk text-sm font-600 uppercase tracking-widest text-[var(--text-secondary)]">
        Target AI Model
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {MODEL_CONFIGS.map((model, index) => {
          const isSelected = selected === model.id;
          return (
            <motion.button
              key={model.id}
              onClick={() => onChange(model.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200"
              style={{
                borderColor: isSelected ? model.color : 'var(--border-subtle)',
                backgroundColor: isSelected
                  ? `${model.color}15`
                  : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 20px ${model.color}30` : 'none',
              }}
            >
              {/* Badge */}
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-600 font-inter uppercase tracking-wider"
                style={{
                  backgroundColor: isSelected ? model.color : 'var(--bg-elevated)',
                  color: isSelected ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? model.color : 'var(--border-subtle)'}`,
                }}
              >
                {model.badge}
              </span>

              <span className="text-2xl leading-none mt-1">{model.icon}</span>
              <span
                className="font-grotesk text-xs font-600 leading-tight"
                style={{ color: isSelected ? model.color : 'var(--text-primary)' }}
              >
                {model.name}
              </span>
              <span className="font-inter text-[10px] leading-tight text-[var(--text-secondary)] line-clamp-2">
                {model.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
