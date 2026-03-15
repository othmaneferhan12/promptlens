(function () {
  var STORAGE_KEY = 'itp_nl_submitted';

  var html =
    '<section class="newsletter-section" aria-label="Newsletter signup">' +
    '<div style="max-width:600px;margin:48px auto;padding:32px;' +
    'background:linear-gradient(145deg,rgba(124,58,237,0.08),rgba(124,58,237,0.02));' +
    'border:1px solid rgba(124,58,237,0.2);border-radius:20px;text-align:center;">' +
    '<div id="nl-content"></div>' +
    '</div></section>';

  var footer = document.querySelector('.site-footer');
  if (!footer) return;
  footer.insertAdjacentHTML('beforebegin', html);

  var content = document.getElementById('nl-content');
  if (!content) return;

  if (localStorage.getItem(STORAGE_KEY)) {
    content.innerHTML =
      '<p style="font-family:\'Space Grotesk\',sans-serif;font-size:1.25rem;font-weight:700;color:#f5f5ff;margin-bottom:0.5rem">You\'re subscribed! 🎉</p>' +
      '<p style="color:#8888bb;font-size:0.875rem">Weekly prompt tips coming to your inbox.</p>';
    return;
  }

  content.innerHTML =
    '<h3 style="font-family:\'Space Grotesk\',sans-serif;font-size:1.375rem;font-weight:700;' +
    'color:#f5f5ff;margin-bottom:0.75rem">Get Weekly AI Prompt Tips</h3>' +
    '<p style="color:#8888bb;font-size:0.9375rem;line-height:1.6;margin-bottom:1.25rem">' +
    'One email per week with prompt engineering techniques, new model updates, and creative examples. No spam.</p>' +
    '<form id="nl-form" action="#" method="POST" style="display:flex;gap:8px;max-width:400px;margin:0 auto 12px;">' +
    '<input type="email" id="nl-email" placeholder="your@email.com" required ' +
    'style="flex:1;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);' +
    'background:rgba(0,0,0,0.3);color:white;font-size:0.875rem;outline:none;" />' +
    '<button type="submit" ' +
    'style="padding:12px 24px;border-radius:10px;background:#7C3AED;color:white;' +
    'border:none;font-weight:700;cursor:pointer;font-size:0.875rem;white-space:nowrap;">' +
    'Subscribe</button></form>' +
    '<p id="nl-error" role="alert" style="color:#ff6b6b;font-size:0.75rem;min-height:1em;margin-bottom:4px"></p>' +
    '<p style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:4px">Join 0+ prompt engineers. Unsubscribe anytime.</p>';

  document.getElementById('nl-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('nl-email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('nl-error').textContent = 'Please enter a valid email address.';
      return;
    }
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (err) {}
    content.innerHTML =
      '<p style="font-family:\'Space Grotesk\',sans-serif;font-size:1.25rem;font-weight:700;color:#f5f5ff;margin-bottom:0.5rem">You\'re in! 🎉</p>' +
      '<p style="color:#8888bb;font-size:0.875rem">Check your inbox for your first prompt templates.</p>';
  });
})();
