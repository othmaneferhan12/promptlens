const linkCls = 'font-inter text-[0.8125rem] text-[var(--text-secondary)]/40 hover:text-[var(--text-secondary)] transition-colors duration-150 leading-snug';
const headingCls = 'font-grotesk text-[0.5625rem] font-700 uppercase tracking-[0.12em] text-[var(--text-secondary)]/40 mb-2.5';

function FooterCol({ heading, links }: { heading: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className={headingCls}>{heading}</p>
      {links.map(({ href, label }) => (
        <a key={href} href={href} className={linkCls}>{label}</a>
      ))}
    </div>
  );
}

export default function SEOFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] mt-8">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-8 sm:px-6">

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <FooterCol
            heading="Image Prompt Tools"
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
            heading="Video Prompt Tools"
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
            links={[
              { href: '/blog/',             label: 'Blog'            },
              { href: '/privacy-policy/',   label: 'Privacy Policy'  },
              { href: '/terms-of-service/', label: 'Terms of Service'},
            ]}
          />
          <FooterCol
            heading="Languages"
            links={[
              { href: '/',    label: 'English'   },
              { href: '/fr/', label: 'Français'  },
              { href: '/ar/', label: 'العربية'   },
            ]}
          />
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-inter text-xs text-[var(--text-secondary)]/30">
            © 2026 ImageToPrompt.dev — Free AI Prompt Generator
          </p>
          <p className="font-inter text-xs text-[var(--text-secondary)]/25">
            Your images are never stored. All analysis is ephemeral and private.
          </p>
        </div>

      </div>
    </footer>
  );
}
