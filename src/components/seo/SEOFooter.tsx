import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { UILanguage } from '../../i18n';

const imgLinkCls = 'font-inter text-[0.8125rem] text-[var(--text-muted)] hover:text-[#e040fb] transition-colors duration-150 leading-snug';
const vidLinkCls = 'font-inter text-[0.8125rem] text-[var(--text-muted)] hover:text-[#00e5ff] transition-colors duration-150 leading-snug';
const defLinkCls = 'font-inter text-[0.8125rem] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150 leading-snug';

interface FooterColProps {
  heading: string;
  icon: ReactNode;
  headingColor: string;
  links: { href: string; label: string }[];
  linkCls: string;
}

function FooterCol({ heading, icon, headingColor, links, linkCls }: FooterColProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: headingColor, display: 'flex', flexShrink: 0 }}>{icon}</span>
        <p className="font-grotesk text-[0.5625rem] font-700 uppercase tracking-[0.12em] m-0 whitespace-nowrap" style={{ color: headingColor }}>
          {heading}
        </p>
        <span className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
      </div>
      {links.map(({ href, label }) => (
        <a key={href} href={href} className={linkCls}>{label}</a>
      ))}
    </div>
  );
}

export default function SEOFooter() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.substring(0, 2) || 'en') as UILanguage;

  /** Prefix path with language. English stays at root. */
  const lp = (path: string) => {
    if (lang === 'en') return path;
    if (path === '/' || path.startsWith('/?')) return path;
    return `/${lang}${path}`;
  };

  return (
    <footer
      className="mt-8 relative"
      style={{ background: 'var(--bg-void)', padding: '3rem 1.5rem 2rem' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,64,251,0.35), rgba(0,229,255,0.35), transparent)' }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div className="flex items-center gap-2.5 mb-8">
          <img src="/favicon.svg" alt="" width="28" height="28" className="rounded-lg opacity-75 flex-shrink-0" />
          <span className="font-grotesk text-sm font-700 text-[var(--text-primary)] whitespace-nowrap">
            ImageTo<span className="gradient-clip" style={{ background: 'linear-gradient(135deg, #e040fb, #f06292)' }}>Prompt</span>
          </span>
          <span className="font-inter text-[0.6875rem] text-[var(--text-secondary)]/35 whitespace-nowrap hidden sm:block">
            — {t('footer.tagline')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8" style={{ gap: '2rem 1.5rem', marginBottom: '2rem' }}>
          <FooterCol
            heading={t('footer.imageTools')}
            icon={<span style={{ fontSize: '0.625rem', lineHeight: 1 }}>🖼</span>}
            headingColor="rgba(224,100,251,0.75)"
            linkCls={imgLinkCls}
            links={[
              { href: lp('/'),                                    label: t('footer.imageToPrompt') },
              { href: lp('/text-to-prompt/'),                     label: t('footer.textToPrompt')  },
              { href: lp('/midjourney-prompt-generator/'),        label: 'Midjourney'              },
              { href: lp('/stable-diffusion-prompt-generator/'), label: 'Stable Diffusion'        },
              { href: lp('/flux-prompt-generator/'),              label: 'Flux'                    },
              { href: lp('/dall-e-prompt-generator/'),            label: 'DALL-E 3'                },
              { href: lp('/adobe-firefly-prompt-generator/'),     label: 'Adobe Firefly'           },
              { href: lp('/leonardo-ai-prompt-generator/'),       label: 'Leonardo AI'             },
              { href: lp('/ideogram-prompt-generator/'),          label: 'Ideogram'                },
            ]}
          />
          {/* Resources visible on mobile too (Blog, About, Pricing) */}
          <FooterCol
            heading={t('footer.resources')}
            icon={<span style={{ fontSize: '0.625rem', lineHeight: 1 }}>📚</span>}
            headingColor="rgba(136,136,187,0.65)"
            linkCls={defLinkCls}
            links={[
              { href: lp('/blog/'),             label: t('footer.blog')    },
              { href: lp('/about/'),            label: t('footer.about')   },
              { href: lp('/pricing/'),          label: t('footer.pricing') },
              { href: '/contact/',              label: t('footer.contact') },
              { href: '/privacy-policy/',       label: t('footer.privacy') },
              { href: '/terms-of-service/',     label: t('footer.terms')   },
            ]}
          />
          {/* Video Tools — hidden on mobile to reduce DOM size */}
          <div className="hidden sm:block">
            <FooterCol
              heading={t('footer.videoTools')}
              icon={<span style={{ fontSize: '0.625rem', lineHeight: 1 }}>🎬</span>}
              headingColor="rgba(0,210,255,0.75)"
              linkCls={vidLinkCls}
              links={[
                { href: lp('/image-to-video-prompt/'),              label: t('footer.imageToVideo')  },
                { href: lp('/text-to-video-prompt/'),               label: t('footer.textToVideo')   },
                { href: lp('/veo-prompt-generator/'),               label: 'Veo / Flow Studio'       },
                { href: lp('/kling-prompt-generator/'),             label: 'Kling AI'                },
                { href: lp('/runway-prompt-generator/'),            label: 'Runway Gen-3'            },
                { href: lp('/pika-prompt-generator/'),              label: 'Pika'                    },
                { href: lp('/luma-prompt-generator/'),              label: 'Luma Dream Machine'      },
                { href: lp('/sora-prompt-generator/'),              label: 'Sora'                    },
                { href: lp('/minimax-prompt-generator/'),           label: 'Minimax'                 },
                { href: lp('/stable-video-prompt-generator/'),      label: 'Stable Video'            },
              ]}
            />
          </div>
          {/* Languages — hidden on mobile */}
          <div className="hidden sm:block">
            <FooterCol
              heading={t('footer.languages')}
              icon={<span style={{ fontSize: '0.625rem', lineHeight: 1 }}>🌐</span>}
              headingColor="rgba(136,136,187,0.65)"
              linkCls={defLinkCls}
              links={[
                { href: '/',    label: 'English'   },
                { href: '/fr/', label: 'Français'  },
                { href: '/ar/', label: 'العربية'   },
                { href: '/es/', label: 'Español'   },
                { href: '/ja/', label: '日本語'     },
                { href: '/ko/', label: '한국어'     },
                { href: '/ru/', label: 'Русский'   },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <p className="font-inter text-xs m-0" style={{ color: 'var(--text-muted)' }}>
            {t('footer.copyright')}
          </p>
          <p className="font-inter text-xs m-0" style={{ color: 'var(--text-muted)' }}>
            {t('footer.privacyNote')}
          </p>
        </div>

      </div>
    </footer>
  );
}
