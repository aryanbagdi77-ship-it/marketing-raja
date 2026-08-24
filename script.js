(function(){
  "use strict";

  /* ---------- Entrance overlay ---------- */
  var entrance = document.getElementById('entrance');
  var enterBtn = document.getElementById('enter-btn');
  var body = document.body;

  function enterSite(){
    // Hook point: trigger the future animation + audio sequence here
    // e.g. playIntroAnimation(); introAudio.play();
    entrance.classList.add('hide');
    body.classList.remove('locked');
    setTimeout(function(){ entrance.style.display = 'none'; }, 1100);
  }

  enterBtn.addEventListener('click', enterSite);
  entrance.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ enterSite(); }
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  /* ---------- Ticker: duplicate content for seamless loop ---------- */
  var track = document.getElementById('tickerTrack');
  if(track){ track.innerHTML += track.innerHTML; }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Card stack: slow, gentle tilt on mousemove (desktop only) ---------- */
  var stack = document.querySelector('.card-stack');
  if(stack && window.matchMedia('(hover: hover)').matches){
    var rafId = null;
    var targetRX = 0, targetRY = 0;

    stack.addEventListener('mousemove', function(e){
      var rect = stack.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      // Reduced magnitude for a subtler, slower-feeling tilt
      targetRX = y * -2.5;
      targetRY = x * 2.5;
      if(rafId === null){
        rafId = requestAnimationFrame(applyTilt);
      }
    });

    function applyTilt(){
      stack.querySelectorAll('.pcard').forEach(function(card){
        card.style.transform = 'rotateX(' + targetRX + 'deg) rotateY(' + targetRY + 'deg)';
      });
      rafId = null;
    }

    stack.addEventListener('mouseleave', function(){
      stack.querySelectorAll('.pcard').forEach(function(card){
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* ---------- Our Plans: tab switching ---------- */
  var planTabs = document.querySelectorAll('.plan-tab');
  var planGroups = document.querySelectorAll('.plan-group');
  planTabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-target');
      planTabs.forEach(function(t){ t.classList.remove('active'); });
      planGroups.forEach(function(g){ g.classList.remove('active'); });
      tab.classList.add('active');
      var group = document.getElementById(target);
      if(group){ group.classList.add('active'); }
    });
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function(other){ other.classList.remove('open'); });
      if(!isOpen){ item.classList.add('open'); }
    });
  });

  /* ---------- Marketing Badshah AI chat widget ---------- */
  var chatToggle = document.getElementById('chatToggle');
  var chatPanel = document.getElementById('chatPanel');
  var chatMessages = document.getElementById('chatMessages');
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var chatQuick = document.getElementById('chatQuick');
  var chatIconOpen = document.getElementById('chatIconOpen');
  var chatIconClose = document.getElementById('chatIconClose');

  if(chatToggle && chatPanel){

    var TELEGRAM_URL = 'https://t.me/marketingbadshah';

    var CANNED = [
      {
        keys: ['package', 'plan', 'pricing', 'price', 'tier', 'bronze', 'silver', 'gold'],
        reply: "We run Bronze, Silver and Gold tiers for Meta and Google Ads (₹9L, ₹15L and ₹30L monthly ad spend), plus Ad Account Replacement, SEO and AI Video packages. Check the \"Our Plans\" section above for the full breakdown."
      },
      {
        keys: ['minimum', 'min spend', 'how much', 'budget', 'start with'],
        reply: "Our Meta and Google Ads packages start at ₹9,00,000/month on Bronze and scale to ₹30,00,000/month on Gold. If your budget is smaller, our SEO or AI Video packages are a good place to start."
      },
      {
        keys: ['fee', 'commission', 'management fee', 'charge'],
        reply: "Management fees are ₹1,20,000/month on standard packages and ₹1,50,000/month on high-spend packages, plus a 9% vendor commission on total ad spend for Meta and Google Ads."
      },
      {
        keys: ['api', 'replace', 'banned', 'restricted', 'account'],
        reply: "Our Ad Account Replacement plans cover this — Starter gives you 5 replacements over 10 days, up to 10 replacements over 20 days on the Elite plan."
      },
      {
        keys: ['seo'],
        reply: "SEO is quoted per brand based on your site and competition — it covers keyword strategy, on-page and technical fixes, backlinks, and monthly reporting."
      },
      {
        keys: ['video', 'ai video', 'celebrity'],
        reply: "AI Video packages start at ₹5,000 for a single celebrity-style AI video and scale up to 5 videos with elite VFX on the Empire package."
      },
      {
        keys: ['about', 'who are you', 'what do you do', 'services'],
        reply: "We're Marketing Badshah — we build brands with quality leads, SEO, WhatsApp API, influencer marketing, AI videos, graphic design and website development, all under one roof."
      },
      {
        keys: ['contact', 'human', 'talk to someone', 'reach', 'call', 'email'],
        reply: "You can fill out the contact form on this page and we'll reply within 48 hours, or tap \"Chat with us on Telegram\" below for the fastest response."
      },
      {
        keys: ['hi', 'hello', 'hey'],
        reply: "Hey! I'm the Marketing Badshah AI. Ask me about our packages, pricing, or services — or tap Telegram below to reach the team directly."
      }
    ];

    var FALLBACK = "I can help with quick questions on packages, pricing, fees and services. For anything more specific, tap \"Chat with us on Telegram\" below and our team will jump in.";

    function addMessage(text, who){
      var el = document.createElement('div');
      el.className = 'chat-msg ' + who;
      el.textContent = text;
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function findReply(text){
      var lower = text.toLowerCase();
      if(lower.indexOf('telegram') !== -1 || lower.indexOf('human') !== -1){
        return "Tap \"Chat with us on Telegram\" below any time — a real person from the team will pick it up.";
      }
      for(var i=0; i<CANNED.length; i++){
        var entry = CANNED[i];
        for(var j=0; j<entry.keys.length; j++){
          if(lower.indexOf(entry.keys[j]) !== -1){ return entry.reply; }
        }
      }
      return FALLBACK;
    }

    var greeted = false;
    function openChat(){
      chatPanel.classList.add('open');
      chatPanel.setAttribute('aria-hidden', 'false');
      chatToggle.setAttribute('aria-expanded', 'true');
      chatIconOpen.style.display = 'none';
      chatIconClose.style.display = 'block';
      if(!greeted){
        greeted = true;
        setTimeout(function(){
          addMessage("Welcome to Marketing Badshah! I'm here to answer quick questions about our packages, pricing and services. For anything detailed, I'll point you to our team on Telegram.", 'bot');
        }, 300);
      }
    }
    function closeChat(){
      chatPanel.classList.remove('open');
      chatPanel.setAttribute('aria-hidden', 'true');
      chatToggle.setAttribute('aria-expanded', 'false');
      chatIconOpen.style.display = 'block';
      chatIconClose.style.display = 'none';
    }

    chatToggle.addEventListener('click', function(){
      if(chatPanel.classList.contains('open')){ closeChat(); } else { openChat(); }
    });

    function handleUserText(text){
      if(!text.trim()) return;
      addMessage(text, 'user');
      var reply = findReply(text);
      setTimeout(function(){ addMessage(reply, 'bot'); }, 450);
    }

    if(chatForm){
      chatForm.addEventListener('submit', function(e){
        e.preventDefault();
        var text = chatInput.value;
        chatInput.value = '';
        handleUserText(text);
      });
    }

    if(chatQuick){
      chatQuick.querySelectorAll('button').forEach(function(btn){
        btn.addEventListener('click', function(){
          handleUserText(btn.getAttribute('data-q'));
        });
      });
    }
  }

  /* ---------- Contact form (front-end placeholder) ---------- */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sent — we will reply within 48h';
      btn.disabled = true;
      setTimeout(function(){ btn.textContent = original; btn.disabled = false; form.reset(); }, 3200);
    });
  }

})();
