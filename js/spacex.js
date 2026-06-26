/* ============================================================
   SpaceX 极简交互脚本 — 星瀚空间（增强版）
   功能：导航滚动效果 · 淡入动画 · 移动端菜单 · 返回顶部
         数字计数动画 · 视差滚动 · 磁性按钮 · Stagger动画
   ============================================================ */
(function(){
  'use strict';

  /* ---- Navigation scroll effect ---- */
  var nav = document.querySelector('.nav');
  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      if(window.scrollY > 30){
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.querySelector('.nav-mobile');
  if(toggle && mobile){
    toggle.addEventListener('click', function(){
      mobile.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    var closeBtn = document.querySelector('.nav-mobile-close');
    if(closeBtn){
      closeBtn.addEventListener('click', closeMobile);
    }
    var mobileLinks = mobile.querySelectorAll('a');
    for(var i=0; i<mobileLinks.length; i++){
      mobileLinks[i].addEventListener('click', closeMobile);
    }
  }
  function closeMobile(){
    if(mobile){
      mobile.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ---- Stagger animation for grids (must run before observer) ---- */
  function initStagger(){
    var grids = document.querySelectorAll('.product-grid, .feature-grid, .value-grid, .service-list');
    for(var g=0; g<grids.length; g++){
      var children = grids[g].children;
      for(var c=0; c<children.length; c++){
        if(!children[c].classList.contains('fade-in')){
          children[c].classList.add('fade-in');
        }
        children[c].classList.add('stagger-' + Math.min(c+1, 5));
      }
    }
  }
  initStagger();

  /* ---- Fade-in animations with stagger support ---- */
  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      for(var i=0; i<entries.length; i++){
        if(entries[i].isIntersecting){
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});

    var fadeSelectors = '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .text-reveal';
    var fadeEls = document.querySelectorAll(fadeSelectors);
    for(var i=0; i<fadeEls.length; i++){
      observer.observe(fadeEls[i]);
    }
  } else {
    var els = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .text-reveal');
    for(var i=0; i<els.length; i++){
      els[i].classList.add('visible');
    }
  }

  /* ---- Number counter animation ---- */
  function animateCounter(el){
    var text = el.textContent.trim();
    var suffix = text.replace(/[0-9.,]/g, '');
    var num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if(isNaN(num)) return;

    var duration = 1800;
    var start = null;
    function step(timestamp){
      if(!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      var current = num * eased;
      if(num % 1 === 0){
        el.textContent = Math.round(current) + suffix;
      } else {
        el.textContent = current.toFixed(1) + suffix;
      }
      if(progress < 1){
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function(entries){
    for(var i=0; i<entries.length; i++){
      if(entries[i].isIntersecting){
        animateCounter(entries[i].target);
        counterObserver.unobserve(entries[i].target);
      }
    }
  }, {threshold:0.5});

  var counters = document.querySelectorAll('.hero-stat-num, .about-stat-num');
  for(var i=0; i<counters.length; i++){
    counterObserver.observe(counters[i]);
  }

  /* ---- Parallax scroll effect ---- */
  var heroContent = document.querySelector('.hero-content');
  var heroHint = document.querySelector('.hero-scroll-hint');
  var parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-fast');
  var parallaxTick = false;

  function onParallaxScroll(){
    if(parallaxTick) return;
    parallaxTick = true;
    requestAnimationFrame(function(){
      var scrollY = window.scrollY;
      var windowH = window.innerHeight;

      // Hero parallax
      if(heroContent && scrollY < windowH){
        heroContent.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        heroContent.style.opacity = Math.max(0.2, 1 - scrollY / (windowH * 0.8));
      }
      if(heroHint && scrollY < windowH){
        heroHint.style.opacity = Math.max(0, 0.6 - scrollY / 300);
      }

      // Generic parallax elements
      for(var i=0; i<parallaxElements.length; i++){
        var el = parallaxElements[i];
        var rect = el.getBoundingClientRect();
        var speed = el.classList.contains('parallax-fast') ? 0.12 : 0.05;
        var offset = (rect.top - windowH / 2) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      }

      parallaxTick = false;
    });
  }
  window.addEventListener('scroll', onParallaxScroll, {passive:true});

  /* ---- Back to top ---- */
  var backBtn = document.querySelector('.back-to-top');
  if(backBtn){
    var scrollThrottle;
    window.addEventListener('scroll', function(){
      if(scrollThrottle) return;
      scrollThrottle = setTimeout(function(){
        scrollThrottle = null;
        if(window.scrollY > 600){
          backBtn.classList.add('visible');
        } else {
          backBtn.classList.remove('visible');
        }
      }, 100);
    }, {passive:true});

    backBtn.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for(var i=0; i<anchors.length; i++){
    anchors[i].addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if(target){
        var navH = nav ? nav.offsetHeight : 0;
        var pos = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({top:pos, behavior:'smooth'});
      }
    });
  }

  /* ---- Expand/collapse (services page) ---- */
  var expandTriggers = document.querySelectorAll('.expand-trigger');
  for(var i=0; i<expandTriggers.length; i++){
    expandTriggers[i].addEventListener('click', function(){
      var targetId = this.getAttribute('data-target');
      var content = document.getElementById(targetId);
      if(content){
        this.classList.toggle('open');
        content.classList.toggle('open');
      }
    });
  }

  /* ---- Magnetic button effect ---- */
  var magneticBtns = document.querySelectorAll('.btn, .nav-cta, .back-to-top');
  for(var i=0; i<magneticBtns.length; i++){
    (function(btn){
      btn.addEventListener('mousemove', function(e){
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = '';
      });
    })(magneticBtns[i]);
  }

  /* ---- External link safety ---- */
  var extLinks = document.querySelectorAll('a[target="_blank"]');
  for(var i=0; i<extLinks.length; i++){
    if(!extLinks[i].getAttribute('rel')){
      extLinks[i].setAttribute('rel', 'noopener noreferrer');
    }
  }

  /* ---- Cursor star trail (desktop only) ---- */
  var isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if(!isTouch){
    var starContainer = document.createElement('div');
    starContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(starContainer);

    var starPool = [];
    var maxStars = 24;
    var lastX = null, lastY = null;
    var starQueued = false;
    var minDistance = 8;

    function createStar(x, y, angle){
      var el;
      if(starPool.length > 0){
        el = starPool.pop();
        el.classList.remove('dying');
      } else {
        el = document.createElement('span');
        el.className = 'cursor-star';
      }

      var size = 3 + Math.random() * 4;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--star-angle', angle + 'deg');

      starContainer.appendChild(el);

      // 强制重绘以重启动画
      void el.offsetWidth;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'star-fade 0.8s ease-out forwards';

      var removeTimer = setTimeout(function(){
        if(el.parentNode){
          el.parentNode.removeChild(el);
          if(starPool.length < maxStars){
            starPool.push(el);
          }
        }
      }, 800);
      el._starTimer = removeTimer;
    }

    document.addEventListener('mousemove', function(e){
      if(starQueued) return;
      starQueued = true;
      requestAnimationFrame(function(){
        starQueued = false;
        var x = e.clientX;
        var y = e.clientY;
        if(lastX === null){
          lastX = x; lastY = y;
          return;
        }
        var dx = x - lastX;
        var dy = y - lastY;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist >= minDistance){
          var angle = Math.atan2(dy, dx) * 180 / Math.PI;
          createStar(x, y, angle);
          lastX = x; lastY = y;
        }
      });
    }, {passive:true});

    // 页面不可见时清理，避免积压
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){
        while(starContainer.firstChild){
          var el = starContainer.firstChild;
          if(el._starTimer) clearTimeout(el._starTimer);
          starContainer.removeChild(el);
          if(starPool.length < maxStars) starPool.push(el);
        }
      }
    });
  }

  /* ---- Detail visual animations (terminal / dashboard) ---- */
  function initDetailVisualAnimations(){
    if(!('IntersectionObserver' in window)) return;

    // Terminal typewriter
    var terminals = document.querySelectorAll('.terminal-animate');
    if(terminals.length){
      var terminalObserver = new IntersectionObserver(function(entries){
        for(var i=0; i<entries.length; i++){
          if(entries[i].isIntersecting){
            revealTerminalLines(entries[i].target);
            terminalObserver.unobserve(entries[i].target);
          }
        }
      }, {threshold:0.25});

      for(var i=0; i<terminals.length; i++){
        terminalObserver.observe(terminals[i]);
      }
    }

    // Dashboard reveal
    var dashboards = document.querySelectorAll('.dashboard-mockup');
    if(dashboards.length){
      var dashboardObserver = new IntersectionObserver(function(entries){
        for(var i=0; i<entries.length; i++){
          if(entries[i].isIntersecting){
            revealDashboard(entries[i].target);
            dashboardObserver.unobserve(entries[i].target);
          }
        }
      }, {threshold:0.2});

      for(var i=0; i<dashboards.length; i++){
        dashboardObserver.observe(dashboards[i]);
      }
    }
  }

  function revealTerminalLines(terminal){
    var lines = terminal.querySelectorAll('.terminal-line');
    var delay = 0;
    for(var i=0; i<lines.length; i++){
      (function(line, d){
        setTimeout(function(){
          line.classList.add('visible');
        }, d);
      })(lines[i], delay);
      delay += 320;
    }
  }

  function revealDashboard(dashboard){
    dashboard.classList.add('visible');
    var items = dashboard.querySelectorAll('.detection-item, .agent-step, .fleet-stat, .fleet-robot, .heat-level, .edge-node');
    var delay = 150;
    for(var i=0; i<items.length; i++){
      (function(item, d){
        setTimeout(function(){
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, d);
      })(items[i], delay);
      delay += 90;
    }
  }

  initDetailVisualAnimations();

  /* ---- Architecture diagram node activation ---- */
  function initArchitectureAnimation(){
    var diagrams = document.querySelectorAll('.architecture-diagram');
    if(!diagrams.length || !('IntersectionObserver' in window)) return;

    var archObserver = new IntersectionObserver(function(entries){
      for(var i=0; i<entries.length; i++){
        if(entries[i].isIntersecting){
          activateArchitectureNodes(entries[i].target);
          archObserver.unobserve(entries[i].target);
        }
      }
    }, {threshold:0.3});

    for(var i=0; i<diagrams.length; i++){
      archObserver.observe(diagrams[i]);
    }
  }

  function activateArchitectureNodes(diagram){
    var nodes = diagram.querySelectorAll('.arch-node, .arch-device');
    var delay = 0;
    for(var i=0; i<nodes.length; i++){
      (function(node, d){
        setTimeout(function(){
          node.classList.add('active');
          setTimeout(function(){
            node.classList.remove('active');
          }, 900);
        }, d);
      })(nodes[i], delay);
      delay += 220;
    }
  }

  initArchitectureAnimation();

})();
