// Nav dropdown toggle + language-aware link & label rewriting
(function () {
  var TRANSLATIONS = {
    fr: {
      'Tools': 'Outils',
      'Image Tools': 'Outils Image',
      'Video Tools': 'Outils Vidéo',
      'Image to Prompt': 'Image vers Prompt',
      'Text to Prompt': 'Texte vers Prompt',
      'Image to Video': 'Image vers Vidéo',
      'Text to Video': 'Texte vers Vidéo',
      'Models': 'Modèles',
      'Blog': 'Blog',
      'Pricing': 'Tarifs',
      'About': 'À propos',
      'Try Free →': 'Essayer →',
      'Languages': 'Langues',
      'Image Prompt Tools': 'Outils Prompt Image',
      'Video Prompt Tools': 'Outils Prompt Vidéo',
      'Resources': 'Ressources',
      'Image to Video Prompt': 'Image vers Prompt Vidéo',
      'Text to Video Prompt': 'Texte vers Prompt Vidéo',
      'Privacy Policy': 'Politique de confidentialité',
      'Terms of Service': "Conditions d'utilisation",
      'Contact': 'Contact'
    },
    ar: {
      'Tools': 'أدوات',
      'Image Tools': 'أدوات الصور',
      'Video Tools': 'أدوات الفيديو',
      'Image to Prompt': 'صورة إلى برومبت',
      'Text to Prompt': 'نص إلى برومبت',
      'Image to Video': 'صورة إلى فيديو',
      'Text to Video': 'نص إلى فيديو',
      'Models': 'النماذج',
      'Blog': 'المدونة',
      'Pricing': 'الأسعار',
      'About': 'حول',
      'Try Free →': '← جرّب مجاناً',
      'Languages': 'اللغات',
      'Image Prompt Tools': 'أدوات برومبت الصور',
      'Video Prompt Tools': 'أدوات برومبت الفيديو',
      'Resources': 'الموارد',
      'Image to Video Prompt': 'صورة إلى برومبت فيديو',
      'Text to Video Prompt': 'نص إلى برومبت فيديو',
      'Privacy Policy': 'سياسة الخصوصية',
      'Terms of Service': 'شروط الخدمة',
      'Contact': 'اتصل بنا'
    }
  };

  function init() {
    // Dropdown toggle
    document.querySelectorAll('.nav-dropdown-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dd = btn.closest('.nav-dropdown');
        var open = dd.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
        dd.classList.remove('open');
        var t = dd.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
          dd.classList.remove('open');
          var t = dd.querySelector('.nav-dropdown-trigger');
          if (t) { t.setAttribute('aria-expanded', 'false'); t.focus(); }
        });
      }
    });

    setActiveLink();
    var lang = detectLang();
    if (lang !== 'en') {
      rewriteLinks(lang);
      translateLabels(lang);
    }
  }

  function detectLang() {
    var match = window.location.pathname.match(/^\/(fr|ar)\//);
    return match ? match[1] : 'en';
  }

  // Auto-detect current page and highlight its nav link
  function setActiveLink() {
    var path = window.location.pathname;
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.length > 1 && path.startsWith(href)) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // Rewrite ALL internal links to stay in the current language
  function rewriteLinks(lang) {
    var prefix = '/' + lang;

    document.querySelectorAll('a[href^="/"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;

      // Skip links already prefixed with this language
      if (href.startsWith(prefix + '/') || href === prefix) return;

      // Skip links to any language root (e.g., /fr/, /ar/, /es/)
      if (/^\/(fr|ar|es|de|ja|zh|ko|pt|it|nl)(\/|$)/.test(href)) return;

      // Skip SPA root
      if (href === '/' || href.startsWith('/?')) return;

      // Skip logo if already language-aware
      if (a.closest('.site-logo')) return;

      a.setAttribute('href', prefix + href);
    });

    // Update "Try Free" CTA to language homepage
    document.querySelectorAll('.nav-try-free').forEach(function (a) {
      a.setAttribute('href', prefix + '/');
    });
  }

  // Translate visible text labels in nav and footer
  function translateLabels(lang) {
    var dict = TRANSLATIONS[lang];
    if (!dict) return;

    // Nav links (direct text children)
    document.querySelectorAll('.site-nav > a, .site-nav .nav-dropdown-trigger').forEach(function (el) {
      var text = el.childNodes[0];
      if (text && text.nodeType === 3) {
        var trimmed = text.textContent.trim();
        if (dict[trimmed]) {
          text.textContent = dict[trimmed] + ' ';
        }
      }
    });

    // Mega menu headings
    document.querySelectorAll('.nav-mega-heading').forEach(function (el) {
      var text = el.textContent.trim();
      // Preserve emoji prefix
      var emoji = text.match(/^[^\w\s]+\s*/);
      var label = text.replace(/^[^\w\s]+\s*/, '');
      if (dict[label]) {
        el.textContent = (emoji ? emoji[0] : '') + dict[label];
      }
    });

    // Mega menu tool labels
    document.querySelectorAll('.nav-mega-tool').forEach(function (a) {
      var spans = a.querySelectorAll('span');
      if (spans.length > 0) {
        // Text is usually in first child text or span
        var textNode = a.childNodes[0];
        if (textNode && textNode.nodeType === 3) {
          var t = textNode.textContent.trim();
          if (dict[t]) textNode.textContent = dict[t] + ' ';
        }
      }
    });

    // Models label
    document.querySelectorAll('.nav-mega-models-label').forEach(function (el) {
      var t = el.textContent.trim();
      if (dict[t]) el.textContent = dict[t];
    });

    // Footer headings
    document.querySelectorAll('.f4-heading').forEach(function (el) {
      var t = el.textContent.trim();
      if (dict[t]) el.textContent = dict[t];
    });

    // Footer links (translate labels, not model names)
    document.querySelectorAll('.f4-section a').forEach(function (a) {
      var t = a.textContent.trim();
      if (dict[t]) a.textContent = dict[t];
    });

    // Footer brand tagline
    document.querySelectorAll('.f4-brand-sub').forEach(function (el) {
      if (lang === 'fr') el.textContent = '— Générateur de Prompts IA Gratuit';
      if (lang === 'ar') el.textContent = '— مولّد برومبتات ذكاء اصطناعي مجاني';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
