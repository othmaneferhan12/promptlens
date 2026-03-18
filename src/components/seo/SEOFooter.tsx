import type { ReactNode } from 'react';
import { Image as ImageIcon, Video as VideoIcon, BookOpen, Globe } from 'lucide-react';

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
  return (
    <footer
      className="mt-8 relative"
      style={{ background: 'var(--bg-void)', padding: '3rem 1.5rem 2rem' }}
    >
      {/* Gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,64,251,0.35), rgba(0,229,255,0.35), transparent)' }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Brand row */}
        <div className="flex items-center gap-2.5 mb-8">
          <img src="/favicon.svg" alt="" width="28" height="28" className="rounded-lg opacity-75 flex-shrink-0" />
          <span className="font-grotesk text-sm font-700 text-[var(--text-primary)] whitespace-nowrap">
            ImageTo<span style={{ background: 'linear-gradient(135deg, #e040fb, #f06292)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prompt</span>
          </span>
          <span className="font-inter text-[0.6875rem] text-[var(--text-secondary)]/35 whitespace-nowrap hidden sm:block">
            — Free AI Prompt Generator
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8" style={{ gap: '2rem 1.5rem', marginBottom: '2rem' }}>
          <FooterCol
            heading="Image Tools"
            icon={<ImageIcon size={11} />}
            headingColor="rgba(224,100,251,0.75)"
            linkCls={imgLinkCls}
            links={[
              { href: '/',                                    label: 'Image to Prompt'    },
              { href: '/text-to-prompt/',                     label: 'Text to Prompt'     },
              { href: '/midjourney-prompt-generator/',        label: 'Midjourney'         },
              { href: '/stable-diffusion-prompt-generator/', label: 'Stable Diffusion'   },
              { href: '/flux-prompt-generator/',              label: 'Flux'               },
              { href: '/dall-e-prompt-generator/',            label: 'DALL-E 3'           },
              { href: '/adobe-firefly-prompt-generator/',     label: 'Adobe Firefly'      },
              { href: '/leonardo-ai-prompt-generator/',       label: 'Leonardo AI'        },
              { href: '/ideogram-prompt-generator/',          label: 'Ideogram'           },
            ]}
          />
          <FooterCol
            heading="Video Tools"
            icon={<VideoIcon size={11} />}
            headingColor="rgba(0,210,255,0.75)"
            linkCls={vidLinkCls}
            links={[
              { href: '/image-to-video-prompt/',              label: 'Image to Video Prompt' },
              { href: '/text-to-video-prompt/',               label: 'Text to Video Prompt'  },
              { href: '/veo-prompt-generator/',               label: 'Veo / Flow Studio'     },
              { href: '/kling-prompt-generator/',             label: 'Kling AI'              },
              { href: '/runway-prompt-generator/',            label: 'Runway Gen-3'          },
              { href: '/pika-prompt-generator/',              label: 'Pika'                  },
              { href: '/luma-prompt-generator/',              label: 'Luma Dream Machine'    },
              { href: '/sora-prompt-generator/',              label: 'Sora'                  },
              { href: '/minimax-prompt-generator/',           label: 'Minimax'               },
              { href: '/stable-video-prompt-generator/',      label: 'Stable Video'          },
            ]}
          />
          <FooterCol
            heading="Resources"
            icon={<BookOpen size={11} />}
            headingColor="rgba(136,136,187,0.65)"
            linkCls={defLinkCls}
            links={[
              { href: '/blog/',             label: 'Blog'            },
              { href: '/about/',            label: 'About'           },
              { href: '/pricing/',          label: 'Pricing'         },
              { href: '/contact/',          label: 'Contact'         },
              { href: '/privacy-policy/',   label: 'Privacy Policy'  },
              { href: '/terms-of-service/', label: 'Terms of Service'},
            ]}
          />
          <FooterCol
            heading="Languages"
            icon={<Globe size={11} />}
            headingColor="rgba(136,136,187,0.65)"
            linkCls={defLinkCls}
            links={[
              { href: '/',    label: 'English'   },
              { href: '/fr/', label: 'Français'  },
              { href: '/ar/', label: 'العربية'   },
              { href: '/es/', label: 'Español'   },
              { href: '/ko/', label: '한국어'     },
              { href: '/ja/', label: '日本語'     },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <p className="font-inter text-xs m-0" style={{ color: 'var(--text-muted)' }}>
            © 2026 ImageToPrompt.dev — Free AI Prompt Generator
          </p>
          <p className="font-inter text-xs m-0" style={{ color: 'var(--text-muted)' }}>
            Your images are never stored. All analysis is ephemeral and private.
          </p>
        </div>

      </div>
    </footer>
  );
}
