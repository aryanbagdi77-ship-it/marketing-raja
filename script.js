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
    setTimeout(function(){ entrance.style.display = 'none'; }, 1050);
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
  track.innerHTML += track.innerHTML;

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

  /* ---------- Card stack subtle tilt on mousemove (desktop only) ---------- */
  var stack = document.querySelector('.card-stack');
  if(stack && window.matchMedia('(hover: hover)').matches){
    stack.addEventListener('mousemove', function(e){
      var rect = stack.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      stack.style.setProperty('--rx', (y * -6) + 'deg');
      stack.style.setProperty('--ry', (x * 6) + 'deg');
      stack.querySelectorAll('.pcard').forEach(function(card){
        card.style.transform += ' rotateX(var(--rx)) rotateY(var(--ry))';
      });
    });
  }

  /* ---------- Contact form (front-end placeholder) ---------- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.textContent = 'Sent — we will reply within 48h';
    btn.disabled = true;
    setTimeout(function(){ btn.textContent = original; btn.disabled = false; form.reset(); }, 3200);
  });

})();
