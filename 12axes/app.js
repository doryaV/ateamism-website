(() => {
  "use strict";

  const STORAGE = "ateamism-12axes-v1";
  const axisMeta = [
    ["结构", "联邦制", "单一制", ["邦联制","联邦化","联邦制","中间立场","单一制","中央集权","极端中央集权"]],
    ["代表机制", "民主", "专制", ["流动民主","直接民主","代议民主","中间立场","两院制","寡头制","专制"]],
    ["国际干预", "国际主义", "民族主义", ["世界政府","国际主义","合作主义","不干预","反干预","民族主义","极端民族主义"]],
    ["外交", "尚武", "和平", ["扩张主义","军国主义","重视军事","中立","非侵略","和平主义","反战"]],
    ["权力", "安全", "自由", ["极权主义","威权主义","国家主义","中间立场","自由主义","自由意志主义","无政府主义"]],
    ["经济所有制", "平等／公有", "私有／市场", ["共产主义","社会主义","社会民主","混合经济","经济自由主义","资本主义","极端资本主义"]],
    ["宗教", "世俗", "宗教", ["反神论","无神论","不可知论","中间立场","灵性主义","宗教主义","极端宗教主义"]],
    ["文化", "进步", "传统", ["革命派","文化左翼","进步派","中间立场","保守派","传统主义","反动派"]],
    ["移民与文化", "同化", "多元文化", ["族裔民族主义","单一文化","同化主义","中间立场","多文化并存","多元文化主义","种族无差别"]],
    ["经济控制", "计划", "自由放任", ["计划经济","干预主义","监管主义","平衡","市场取向","自由市场","自由放任"]],
    ["贸易", "保护主义", "全球化", ["孤立主义","保护主义","有限贸易","中间立场","自由贸易","全球主义","全球经济"]],
    ["技术", "加速发展", "生物保守", ["超人类主义","加速主义","技术主义","中立","生物保守主义","减速主义","原始主义"]],
  ];
  const choices = [[2,"强烈同意"],[1,"同意"],[.5,"部分同意"],[0,"中立／不确定"],[-.5,"部分反对"],[-1,"反对"],[-2,"强烈反对"]];
  const $ = id => document.getElementById(id);
  const screens = [$("intro"), $("quiz"), $("results")];
  let state = null;

  function show(screen) {
    screens.forEach(item => item.hidden = item !== screen);
    window.scrollTo(0, 0);
  }
  function allQuestions() {
    const out = [];
    window.QUESTIONS.forEach((axis, a) => axis.forEach((level, l) => level.forEach((q, i) => out.push({ ...q, a, l, i }))));
    return out;
  }
  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function save() { localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function start() {
    state = { order: shuffle(allQuestions()), answers: [], index: 0, scores: Array(12).fill(0) };
    save(); renderQuestion(); show($("quiz"));
  }
  function resume() {
    try { state = JSON.parse(localStorage.getItem(STORAGE)); } catch { state = null; }
    if (!state || state.order?.length !== 288) return start();
    if (state.index >= 288 && state.completed) return renderResults();
    renderQuestion(); show($("quiz"));
  }
  function answer(multiplier) {
    const q = state.order[state.index];
    state.scores[q.a] += multiplier * (q.l < 4 ? 1 : -1);
    state.answers[state.index] = multiplier;
    state.index += 1;
    save();
    if (state.index === 288) renderResults(); else renderQuestion();
  }
  function back() {
    if (!state?.index) return;
    state.index -= 1;
    const q = state.order[state.index];
    state.scores[q.a] -= state.answers[state.index] * (q.l < 4 ? 1 : -1);
    state.answers.length = state.index;
    save(); renderQuestion();
  }
  function renderQuestion() {
    const q = state.order[state.index];
    $("current").textContent = state.index + 1;
    $("progress").style.width = `${(state.index / 288) * 100}%`;
    $("question-code").textContent = `Q / ${String(state.index + 1).padStart(3, "0")}`;
    $("question-zh").textContent = q.zh;
    $("question-en").textContent = q.en;
    $("back").disabled = state.index === 0;
  }
  function labelFor(value, labels) {
    if (value > 90) return labels[0];
    if (value > 75) return labels[1];
    if (value > 60) return labels[2];
    if (value >= 40) return labels[3];
    if (value >= 25) return labels[4];
    if (value >= 10) return labels[5];
    return labels[6];
  }
  function values() { return state.scores.map(score => 50 + score); }
  function nearestIdeology(vals) {
    if (!Array.isArray(window.ideologies)) return null;
    return window.ideologies.reduce((best, item) => {
      const dist = (item.stats.econ - vals[5]) ** 2 + (item.stats.govt - vals[4]) ** 2 +
        (item.stats.dipl - vals[10]) ** 2 + (item.stats.scty - vals[7]) ** 2;
      return !best || dist < best.dist ? { ...item, dist } : best;
    }, null);
  }
  function renderResults() {
    const vals = values();
    $("result-list").innerHTML = axisMeta.map((axis, index) => {
      const left = vals[index]; const right = +(100 - left).toFixed(1);
      return `<article class="axis-result"><div class="axis-head"><h2>${String(index + 1).padStart(2,"0")} — ${axis[0]}</h2><p>${labelFor(left, axis[3])}</p></div><div class="bar"><div class="bar-left" style="width:${left}%">${axis[1]} ${left}%</div><div class="bar-right" style="width:${right}%">${right}% ${axis[2]}</div></div></article>`;
    }).join("");
    const closest = nearestIdeology(vals);
    if (closest) {
      $("closest").hidden = false; $("closest-name").textContent = closest.name;
      $("closest-desc").textContent = "原版仅用经济所有制、权力、贸易和文化四轴计算此匹配；这一标签无法概括全部十二轴结果。";
      $("closest-link").href = closest.link;
    }
    state.completed = true; save(); show($("results"));
  }
  function reset() {
    if (!confirm("确定要清除当前答题进度并重新开始吗？")) return;
    localStorage.removeItem(STORAGE); state = null; show($("intro")); $("resume").hidden = true;
  }
  async function copyResult() {
    const vals = values();
    const text = ["Ateamism 12Axes 中文 288 题结果", ...axisMeta.map((axis, i) => `${axis[0]}：${axis[1]} ${vals[i]}% / ${axis[2]} ${100 - vals[i]}%`), "https://ateamism.com/12axes/"].join("\n");
    await navigator.clipboard.writeText(text); $("copy-result").textContent = "已复制";
  }

  $("axis-index").innerHTML = axisMeta.map((axis, i) => `<li><span>${String(i + 1).padStart(2,"0")}</span>${axis[1]} / ${axis[2]}</li>`).join("");
  $("answers").innerHTML = choices.map(([value, label]) => `<button type="button" data-value="${value}">${label}</button>`).join("");
  $("answers").addEventListener("click", event => { const button = event.target.closest("button"); if (button) answer(Number(button.dataset.value)); });
  $("start").addEventListener("click", start); $("resume").addEventListener("click", resume); $("back").addEventListener("click", back);
  $("restart").addEventListener("click", reset); $("restart-top").addEventListener("click", reset); $("copy-result").addEventListener("click", copyResult);
  const saved = localStorage.getItem(STORAGE);
  $("resume").hidden = !saved;
  if (saved) {
    try {
      const previous = JSON.parse(saved);
      if (previous.completed) $("resume").textContent = "查看上次结果";
    } catch { /* A corrupt save will be replaced when a new test starts. */ }
  }
  window.__12AXES__ = { labelFor, score: raw => 50 + raw, axisMeta };
})();
