(() => {
  const thinkers = [
    ["kant", "KANT", "康德", "assets/thinkers/kant.webp", "clamp(92px,11vw,168px)"],
    ["hegel", "HEGEL", "黑格尔", "assets/thinkers/hegel.webp", "clamp(100px,12vw,182px)"],
    ["marx", "MARX", "马克思", "assets/thinkers/marx.webp", "clamp(94px,11vw,172px)"],
    ["rousseau", "ROUSSEAU", "卢梭", "assets/thinkers/rousseau.webp", "clamp(92px,10vw,164px)"],
    ["spinoza", "SPINOZA", "斯宾诺莎", "assets/thinkers/spinoza.webp", "clamp(92px,10vw,164px)"],
    ["nietzsche", "NIETZSCHE", "尼采", "assets/thinkers/nietzsche.webp", "clamp(92px,10vw,164px)"],
    ["lacan", "LACAN", "拉康", "assets/thinkers/lacan.webp", "clamp(96px,11vw,170px)"],
    ["zizek", "ŽIŽEK", "齐泽克", "assets/thinkers/zizek.webp", "clamp(112px,13vw,200px)"],
    ["althusser", "ALTHUSSER", "阿尔都塞", "assets/thinkers/althusser.webp", "clamp(88px,9vw,150px)"],
    ["deleuze", "DELEUZE", "德勒兹", "assets/thinkers/deleuze.webp", "clamp(88px,9vw,150px)"],
    ["freud", "FREUD", "弗洛伊德", "assets/thinkers/freud.webp", "clamp(92px,10vw,164px)"],
    ["hume", "HUME", "休谟", "assets/thinkers/hume.webp", "clamp(94px,10vw,168px)"],
    ["heidegger", "HEIDEGGER", "海德格尔", "assets/thinkers/heidegger.webp", "clamp(96px,11vw,176px)"],
    ["habermas", "HABERMAS", "哈贝马斯", "assets/thinkers/habermas.webp", "clamp(92px,10vw,164px)"],
    ["aristotle", "ARISTOTLE", "亚里士多德", "assets/thinkers/aristotle.webp", "clamp(94px,10vw,170px)"],
    ["socrates", "SOCRATES", "苏格拉底", "assets/thinkers/socrates.webp", "clamp(92px,10vw,166px)"],
  ].map(([id, name, cn, src, width]) => ({ id, name, cn, src, width }));

  const layer = document.querySelector(".floating-layer");
  const count = document.querySelector(".thinker-count");
  const modal = document.querySelector(".limit-modal");
  const activePeople = [];
  let floatingZ = 30;

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function updateCount() {
    count.textContent = `${String(activePeople.length).padStart(2, "0")} / 16`;
  }

  function makeFloating(person) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "floating-thinker";
    element.setAttribute("aria-label", `可拖动人物：${person.cn}`);
    element.dataset.name = `${person.name} / ${person.cn}`;
    element.style.width = person.width;
    element.innerHTML = `<img src="${person.src}" alt="" draggable="false">`;
    layer.appendChild(element);

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = Math.random() * Math.PI * 2;
    const speed = 0.28 + Math.random() * 0.3;
    const motion = {
      x: Math.random() * Math.max(20, innerWidth - 180),
      y: Math.random() * Math.max(20, innerHeight - 230),
      vx: reducedMotion ? 0 : Math.cos(direction) * speed,
      vy: reducedMotion ? 0 : Math.sin(direction) * speed,
      angle: -12 + Math.random() * 24,
      rotation: reducedMotion ? 0 : (Math.random() > .5 ? 1 : -1) * (.018 + Math.random() * .026),
      pointerId: -1,
      offsetX: 0,
      offsetY: 0,
      frame: 0,
      previous: performance.now(),
    };

    function animate(now) {
      const delta = Math.min(2.5, (now - motion.previous) / 16.67);
      motion.previous = now;
      const width = element.offsetWidth || 160;
      const height = element.offsetHeight || 210;
      if (motion.pointerId < 0) {
        motion.x += motion.vx * delta;
        motion.y += motion.vy * delta;
        motion.angle += motion.rotation * delta;
        if (motion.x <= 0 || motion.x + width >= innerWidth) {
          motion.vx *= -1;
          motion.x = Math.min(Math.max(0, motion.x), Math.max(0, innerWidth - width));
        }
        if (motion.y <= 0 || motion.y + height >= innerHeight) {
          motion.vy *= -1;
          motion.y = Math.min(Math.max(0, motion.y), Math.max(0, innerHeight - height));
        }
      }
      element.style.transform = `translate3d(${motion.x}px,${motion.y}px,0) rotate(${motion.angle}deg)`;
      element.style.opacity = "1";
      motion.frame = requestAnimationFrame(animate);
    }

    element.addEventListener("pointerdown", event => {
      event.preventDefault();
      element.setPointerCapture(event.pointerId);
      motion.pointerId = event.pointerId;
      motion.offsetX = event.clientX - motion.x;
      motion.offsetY = event.clientY - motion.y;
      element.style.zIndex = String(++floatingZ);
      element.classList.add("is-dragging");
    });
    element.addEventListener("pointermove", event => {
      if (motion.pointerId !== event.pointerId) return;
      motion.x = Math.min(Math.max(0, event.clientX - motion.offsetX), Math.max(0, innerWidth - element.offsetWidth));
      motion.y = Math.min(Math.max(0, event.clientY - motion.offsetY), Math.max(0, innerHeight - element.offsetHeight));
    });
    const release = event => {
      if (motion.pointerId !== event.pointerId) return;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      motion.pointerId = -1;
      element.classList.remove("is-dragging");
    };
    element.addEventListener("pointerup", release);
    element.addEventListener("pointercancel", release);
    motion.frame = requestAnimationFrame(animate);
    return { person, element, motion };
  }

  function addPerson(person) {
    activePeople.push(makeFloating(person));
    updateCount();
  }

  function removeLast() {
    const item = activePeople.pop();
    if (!item) return;
    cancelAnimationFrame(item.motion.frame);
    item.element.remove();
    updateCount();
  }

  shuffle(thinkers).slice(0, 5).forEach(addPerson);

  document.querySelector(".thinker-add").addEventListener("click", () => {
    if (activePeople.length === 16) {
      modal.hidden = false;
      return;
    }
    const remaining = thinkers.filter(person => !activePeople.some(active => active.person.id === person.id));
    addPerson(remaining[Math.floor(Math.random() * remaining.length)]);
  });

  document.querySelector(".thinker-remove").addEventListener("click", () => {
    if (activePeople.length > 1) {
      removeLast();
      return;
    }
    const oldId = activePeople[0].person.id;
    removeLast();
    const remaining = thinkers.filter(person => person.id !== oldId);
    addPerson(remaining[Math.floor(Math.random() * remaining.length)]);
  });

  document.querySelector(".limit-close").addEventListener("click", () => modal.hidden = true);
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.hidden = true;
  });

  const menuButton = document.querySelector(".menu-button");
  const menu = document.querySelector(".menu-panel");
  menuButton.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  const chapter = document.querySelector(".chapter-counter");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) chapter.textContent = `${entry.target.dataset.index} / 05`;
    });
  }, { threshold: .55 });
  document.querySelectorAll("[data-index]").forEach(section => observer.observe(section));
})();
