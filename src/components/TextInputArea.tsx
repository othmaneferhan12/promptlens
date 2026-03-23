import { useTranslation } from 'react-i18next';

interface TextInputAreaProps {
  text: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export default function TextInputArea({ text, onChange, disabled = false }: TextInputAreaProps) {
  const { t } = useTranslation();
  const nearLimit = text.length > 400;
  const atLimit = text.length >= 500;

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={500}
        placeholder={t('textInput.placeholder')}
        className="w-full rounded-xl px-4 py-3 font-inter text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        style={{
          minHeight: '120px',
          resize: 'vertical',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-accent)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      />
      <div className="flex justify-end">
        <span
          className="font-inter text-xs"
          style={{
            color: atLimit
              ? 'var(--error)'
              : nearLimit
              ? 'var(--accent-lens)'
              : 'var(--text-secondary)',
          }}
        >
          {text.length} / 500
        </span>
      </div>
    </div>
  );
}
