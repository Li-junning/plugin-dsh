/* Original fan-made presentation. CREST_URI and CSS are embedded by scripts/build.mjs. */
window.__ModuleLoader__.load({
  id: "dsh-bayern-boot",
  factory: (require) => {
    "use strict";
    const React = require("react");
    const PLUGIN_ID = "dsh-bayern-boot";
    const ROOT_ID = "bb-root";
    const EVALUATED_AT = performance.now();
    const CSS = __BOOT_CSS__;
    const CREST_URI = __CREST_URI__;
    const BOOT_WINDOW_MS = 60000;
    const READY_MS = 9000;
    const READY_HOLD_MS = 1000;
    const EXIT_MS = 550;
    function escape(value) {
      return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
    }
    __STADIUM_CODE__
    const PANELS = [
      ["FLOODLIGHT / 主场灯光", ["$ matchday lights --home", "看台轮廓 ........... <b>点亮</b>", "红色幕墙 ........... <b>展开</b>", '<span class="ok">[01/05]</span> LICHT AN.']],
      ["IDENTITY / 拜仁队徽", ["$ identity reveal --crest", "蓝白菱形 ........... <b>保留</b>", "红白信念 ........... <b>就位</b>", '<span class="ok">[02/05]</span> FC BAYERN.']],
      ["STANDS / 看台氛围", ["$ stands compose --red", "主场色彩 ........... <b>#DC052D</b>", "灯光层次 ........... <b>渐亮</b>", '<span class="ok">[03/05]</span> IMMER WEITER.']],
      ["SEQUENCE / 开场编排", ["$ intro cue --matchday", "队徽入场 ........... <b>02.00s</b>", "标题定格 ........... <b>07.20s</b>", '<span class="ok">[04/05]</span> BEREIT.']],
      ["BELIEF / 主场信念", ["$ belief echo --mia-san-mia", "一份热爱。一座主场。", "每一次出发，都全力以赴。", '<span class="ok">[05/05]</span> MIA SAN MIA.']]
    ];
    function markup(handoffHTML) {
      const panels = PANELS.map(([title, lines], index) => {
        const start = .6 + index * .45;
        return '<section class="bb-panel p' + (index + 1) + '" aria-hidden="true">' +
          '<div class="bb-panel-head"><span class="bb-num">0' + (index + 1) + '</span><strong>' + escape(title) +
          '</strong><span class="bb-lamps">···</span></div><div class="bb-panel-body">' +
          lines.map((line, row) => '<div class="bb-line" style="--bb-line-time:' + (start + row * .32).toFixed(2) + 's">' + line + "</div>").join("") +
          "</div></section>";
      }).join("");
      return '<div class="bb-scene"><div class="bb-atmosphere"></div><div class="bb-grid"></div>' +
        '<div class="bb-beam one"></div><div class="bb-beam two"></div><div class="bb-stadium">' + stadium() + '</div><div class="bb-lightbar"></div>' +
        '<div class="bb-rail"></div><header class="bb-header"><div class="bb-brand"><img src="' + CREST_URI +
        '" alt=""><div><strong>BAYERN / BOOT SEQUENCE</strong><span>DEEPSEEK HARNESS · MATCHDAY EDITION</span></div></div>' +
        '<div class="bb-meta"><b><span class="bb-dot"></span>HOME OF BELIEF</b><br>MÜNCHEN · FAN-MADE</div></header>' +
        '<div class="bb-diamonds" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<span class="bb-coordinate left" aria-hidden="true">HEIMAT / MÜNCHEN · UNSER ZUHAUSE</span>' +
        '<span class="bb-coordinate right" aria-hidden="true">ROT. WEISS. BLAU. / 红 · 白 · 蓝</span>' +
        '<div class="bb-terminals">' + panels + '</div>' +
        '<main class="bb-hero"><div class="bb-emblem"><img src="' + CREST_URI + '" alt="拜仁慕尼黑队徽"></div>' +
        '<h1 class="bb-title">MIA SAN MIA<i>.</i></h1>' +
        '<div class="bb-home-caption"><span class="bb-arena-nameplate">Allianz Arena</span><p class="bb-tagline">我们的主场，准备就绪。</p></div></main>' +
        '<footer class="bb-footer"><div class="bb-edition"><b>一份热爱，每次出发。</b><br>非官方球迷作品 · 开场演绎</div>' +
        '<button class="bb-enter" type="button" data-bb-enter aria-label="进入主场，跳过开场动画">' +
        '<span class="bb-enter-skip">跳过开场 / ESC</span><span class="bb-enter-ready">1 秒后进入主场</span>' +
        '<span class="bb-arrow" aria-hidden="true">↗</span></button></footer>' +
        '<div class="bb-noise"></div><div class="bb-vignette"></div></div>' +
        (handoffHTML ? '<div class="bb-handoff" aria-hidden="true" inert>' + handoffHTML + '</div>' : '');
    }
    function apply(ctx) {
      let retired = false, started = false, cleaned = false, root = null, exitTimer = null, autoExitTimer = null, readyTimer = null;
      const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const style = document.createElement("style");
      style.dataset.plugin = PLUGIN_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
      // Snapshot only the healthy native loading page. Keep the real page untouched;
      // the detached copy is displayed only once the application actually mounts.
      let handoffHTML = "", nativeCanvas = "";
      const nativeLoading = document.querySelector("[data-dsh-boot]");
      if (nativeLoading && nativeLoading.querySelector("[data-dsh-boot-spinner]")) {
        const bounds = nativeLoading.getBoundingClientRect();
        const nativeStyle = window.getComputedStyle(nativeLoading);
        const copy = nativeLoading.cloneNode(true);
        copy.removeAttribute("data-dsh-boot");
        copy.setAttribute("data-bb-native-loading", "");
        const spinner = copy.querySelector("[data-dsh-boot-spinner]");
        if (spinner) { spinner.removeAttribute("data-dsh-boot-spinner"); spinner.setAttribute("data-bb-native-spinner", ""); }
        nativeCanvas = nativeStyle.backgroundColor;
        if (!nativeCanvas || nativeCanvas === "transparent" || nativeCanvas === "rgba(0, 0, 0, 0)") nativeCanvas = window.getComputedStyle(document.body).backgroundColor;
        if (!nativeCanvas || nativeCanvas === "transparent" || nativeCanvas === "rgba(0, 0, 0, 0)") nativeCanvas = "#141414";
        Object.assign(copy.style, {position:"absolute",left:bounds.left+"px",top:bounds.top+"px",width:bounds.width+"px",height:bounds.height+"px",margin:"0",font:nativeStyle.font,color:nativeStyle.color,backgroundColor:nativeCanvas});
        handoffHTML = copy.outerHTML;
      }
      let previousFocus = null;
      function detach() {
        window.removeEventListener("keydown", onKey, true);
        if (root) root.removeEventListener("click", onClick);
        clearTimeout(autoExitTimer); clearTimeout(readyTimer);
      }
      function finish() {
        retired = true;
        detach();
        if (root) { root.style.display = "none"; root.setAttribute("aria-hidden", "true"); root.inert = true; }
        style.remove();
        if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === "function") previousFocus.focus({preventScroll:true});
      }
      function leave() {
        if (retired || (root && root.hasAttribute("data-leaving"))) return;
        detach();
        if (!root) { finish(); return; }
        root.setAttribute("data-leaving", "");
        exitTimer = setTimeout(finish, reduced ? 0 : EXIT_MS);
      }
      function onKey(event) {
        if (event.key === "Tab") { event.preventDefault(); if (root) root.querySelector("[data-bb-enter]").focus({preventScroll:true}); return; }
        if (event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta" || event.isComposing || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
        event.preventDefault(); event.stopPropagation(); leave();
      }
      function onClick(event) {
        if (event.target.closest && event.target.closest("[data-bb-enter]")) leave();
      }
      function attach(node) {
        if (!node) { if (root) { finish(); root = null; } return; }
        if (cleaned || retired) return;
        if (root === node) return;
        root = node;
        if (nativeCanvas) root.style.setProperty("--bb-native-canvas", nativeCanvas);
        if (started) { retired = true; root.style.display = "none"; return; }
        started = true;
        previousFocus = document.activeElement;
        if (reduced) root.setAttribute("data-reduced", "");
        window.addEventListener("keydown", onKey, true);
        root.addEventListener("click", onClick);
        const button = root.querySelector("[data-bb-enter]");
        if (button) button.focus({preventScroll:true});
        readyTimer = setTimeout(() => {
          if (!root || retired || cleaned) return;
          root.setAttribute("data-ready", "");
          autoExitTimer = setTimeout(leave, READY_HOLD_MS);
        }, reduced ? 0 : READY_MS);
      }
      function Splash() {
        if (retired || cleaned) return null;
        if (!started && performance.now() - EVALUATED_AT > BOOT_WINDOW_MS) return null;
        return React.createElement("div", {id:ROOT_ID,ref:attach,role:"dialog","aria-modal":"true","aria-label":"拜仁主题开场，结束一秒后自动进入主场，可按任意键跳过",dangerouslySetInnerHTML:{__html:markup(handoffHTML)}});
      }
      ctx.effect(() => () => {
        cleaned = true; clearTimeout(exitTimer); finish();
      });
      ctx.slots.inject("shell.overlay", () =>
        ctx.slots.register({name:"shell.overlay",id:PLUGIN_ID,order:9999}, Splash));
    }
    return { inject:["slots"], apply };
  }
});




