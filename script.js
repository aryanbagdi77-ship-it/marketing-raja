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
