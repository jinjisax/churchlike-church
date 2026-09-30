/* =========================================================================
   또 하나의 교회다운 교회 — 공통 스크립트
   (일반적인 내용 수정은 assets/js/site-config.js 에서 하세요)
   ========================================================================= */
(function () {
  "use strict";
  var S = window.SITE;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"]/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); };

  /* {중괄호} 로 감싼 말은 줄바꿈 때 끊기지 않게: "{청년 사역}" → <span class="nw">청년 사역</span> */
  function keepTogether(s) {
    return esc(s).replace(/\{([^}]+)\}/g, '<span class="nw">$1</span>');
  }

  /* 설정값 경로로 꺼내기: get("church.name") */
  function get(path) {
    return path.split(".").reduce(function (o, k) { return (o || {})[k]; }, S);
  }

  /* ----------------------------------------------------------------
     아이콘
     ---------------------------------------------------------------- */
  var ICONS = {
    // 재생 삼각형은 구멍으로 뚫어서, 어떤 배경색 위에서도 보이게
    youtube:  '<path fill-rule="evenodd" d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12zM10 15.2V8.8l5.5 3.2z" fill="currentColor" stroke="none"/>',
    blog:     '<path d="M4 4h16v13a3 3 0 0 1-3 3H4z"/><path d="M8 9h8M8 13h5"/>',
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
    kakao:    '<path d="M12 4c-4.9 0-8.9 3.1-8.9 6.9 0 2.4 1.7 4.6 4.2 5.8l-.9 3.4 3.8-2.2c.6.1 1.2.1 1.8.1 4.9 0 8.9-3.1 8.9-6.9S16.9 4 12 4z"/>',
    facebook: '<path d="M14.5 21v-7.3h2.5l.4-2.9h-2.9V9c0-.8.3-1.4 1.5-1.4h1.5V5a20 20 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H9v2.9h2.3V21z" fill="currentColor" stroke="none"/>',
    mail:     '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    phone:    '<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 12l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z"/>',
    pin:      '<path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    card:     '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.6" cy="11" r="2.1"/><path d="M14 10h4M14 14h4M5.2 16.4c.6-1.4 1.9-2.1 3.4-2.1s2.8.7 3.4 2.1"/>',
    book:     '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
    pen:      '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
    bell:     '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6z"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
    paper:    '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    camera:   '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H8l1.5-2h5L16 6h2.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="12.5" r="3.5"/>',
    spark:    '<path d="M12 3l2.1 5.6L20 11l-5.9 2.4L12 19l-2.1-5.6L4 11l5.9-2.4z"/>',
    heart:    '<path d="M12 20s-7.5-4.6-7.5-9.5A4.2 4.2 0 0 1 12 7.8a4.2 4.2 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"/>',
    pray:     '<path d="M12 3v8M8.5 21c0-3 1.5-5 3.5-6.5 2 1.5 3.5 3.5 3.5 6.5z"/><path d="M8 8.5 12 11l4-2.5"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
    play:     '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
    arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
    image:    '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.6" cy="10" r="1.8"/><path d="m4 17 4.8-4.5L13 16l3-2.6 4 3.6"/>',
    close:    '<path d="m6 6 12 12M18 6 6 18"/>',
    chevL:    '<path d="m15 5-7 7 7 7"/>',
    chevR:    '<path d="m9 5 7 7-7 7"/>',
    users:    '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c.6-3.5 3.3-5.4 6.5-5.4s5.9 1.9 6.5 5.4"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.9c2.2.5 3.7 2.3 4.1 5.1"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>'
  };
  function icon(name, cls) {
    var p = ICONS[name] || ICONS.spark;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }
  window.ICON = icon;

  /* 로고 (이미지 파일이 없을 때 표시되는 기본 마크) */
  var LOGO_SVG =
    '<svg class="brand__mark" viewBox="0 0 100 100" role="img" aria-label="교회다운 교회 로고">' +
    '<path d="M62 12a40 40 0 1 0 6 76 33 33 0 1 1-6-76z" fill="#7B5EA7"/>' +
    '<path d="M60 31a24 24 0 1 0 4 46 19 19 0 1 1-4-46z" fill="#A98BD0"/>' +
    '<path d="M79 6l3.6 9.4L92 19l-9.4 3.6L79 32l-3.6-9.4L66 19l9.4-3.6z" fill="#7B5EA7"/>' +
    "</svg>";

  /* ----------------------------------------------------------------
     1) 사진 슬롯 — <div data-img="hero"></div>
     ---------------------------------------------------------------- */
  function renderImages() {
    $$("[data-img]").forEach(function (el) {
      var key = el.getAttribute("data-img");
      var cfg = (S.images || {})[key];
      var ratio = el.getAttribute("data-ratio");
      el.classList.add("imgslot");
      if (ratio) el.style.setProperty("--ratio", ratio);

      var ph =
        '<div class="imgslot__ph">' + icon("image") +
        "<b>" + esc(cfg ? cfg.label : key) + "</b>" +
        "<small>" + esc(cfg ? cfg.hint : "이미지를 넣어주세요") + "</small>" +
        "<code>" + esc(cfg ? cfg.file : "assets/img/" + key + ".jpg") + "</code></div>";

      if (!cfg || !cfg.file) { el.innerHTML = ph; return; }

      el.innerHTML = ph; // 로딩 중에는 안내 박스
      loadAnyExt((el.getAttribute("data-base") || "") + cfg.file, function (img) {
        img.alt = cfg.label || "";
        el.innerHTML = ""; el.appendChild(img);
      });
    });
  }

  /* 확장자가 달라도 찾아줍니다: hero.jpg 가 없으면 hero.jpeg / .png / .webp / .jfif 순으로 시도 */
  var EXTS = [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".JPG", ".JPEG", ".PNG"];
  function loadAnyExt(file, onOk) {
    var base = file.replace(/\.[A-Za-z0-9]+$/, "");
    var tries = [file].concat(EXTS.map(function (e) { return base + e; }))
      .filter(function (v, i, a) { return a.indexOf(v) === i; });
    (function next(i) {
      if (i >= tries.length) return;
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { onOk(img); };
      img.onerror = function () { next(i + 1); };
      img.src = tries[i];
    })(0);
  }

  /* ----------------------------------------------------------------
     2) 설정값 바인딩
        <span data-site="church.name"></span>
        <a data-link="channels.blog">   ← 값이 비어 있으면 요소 자체를 숨김
     ---------------------------------------------------------------- */
  function bindConfig() {
    $$("[data-site]").forEach(function (el) {
      var v = get(el.getAttribute("data-site"));
      if (v == null || v === "") { if (el.hasAttribute("data-hide-empty")) el.remove(); return; }
      el.textContent = v;
    });
    $$("[data-link]").forEach(function (el) {
      var v = get(el.getAttribute("data-link"));
      if (!v) { el.remove(); return; }
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) v = "mailto:" + v;
      else if (/^[\d\-+() ]{7,}$/.test(v)) v = "tel:" + v.replace(/[^0-9+]/g, "");
      el.setAttribute("href", v);
      if (/^https?:/.test(v)) { el.target = "_blank"; el.rel = "noopener"; }
    });
  }

  /* ----------------------------------------------------------------
     3) 헤더 / 모바일 메뉴 / 푸터
     ---------------------------------------------------------------- */
  function currentPage() {
    var f = location.pathname.split("/").pop();
    return !f || f === "" ? "index.html" : f;
  }

  function buildHeader() {
    var host = $("[data-nav]");
    var page = currentPage();
    if (host) {
      host.innerHTML = S.nav.map(function (n) {
        return '<a href="' + n.href + '"' + (n.href === page ? ' class="is-active"' : "") + ">" + esc(n.label) + "</a>";
      }).join("");
    }
    var dw = $("[data-drawer-nav]");
    if (dw) {
      dw.innerHTML =
        '<a class="drawer__item" href="index.html">홈 <span>' + icon("arrow") + "</span></a>" +
        S.nav.map(function (n) {
          return '<a class="drawer__item" href="' + n.href + '">' + esc(n.label) + " <span>" + icon("arrow") + "</span></a>";
        }).join("");
    }

    var header = $(".header"), burger = $(".burger"), drawer = $(".drawer");
    if (burger && drawer) {
      burger.addEventListener("click", function () {
        var open = drawer.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        document.body.classList.toggle("no-scroll", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      drawer.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          drawer.classList.remove("is-open"); burger.classList.remove("is-open");
          document.body.classList.remove("no-scroll");
        }
      });
    }
    if (header) {
      var dark = $(".hero") || $(".pagehead");
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 24);
        if (dark) header.classList.toggle("on-dark", window.scrollY < dark.offsetHeight - 90);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* 로고: 헤더·푸터를 다 만든 뒤 모든 [data-logo] 자리에 넣습니다 */
  function renderLogos() {
    var cfg = (S.images || {}).logo;
    $$("[data-logo]").forEach(function (el) {
      el.innerHTML = LOGO_SVG;
      if (cfg && cfg.file) {
        loadAnyExt((el.getAttribute("data-base") || "") + cfg.file, function (im) {
          im.className = "brand__img"; im.alt = S.church.name; el.innerHTML = ""; el.appendChild(im);
        });
      }
    });
  }

  function snsLinks() {
    var c = S.channels || {}, out = "";
    out += '<a class="sns sns--yt" href="' + S.youtube.channelUrl + '" target="_blank" rel="noopener" aria-label="유튜브">' + icon("youtube") + "</a>";
    if (c.blog)      out += '<a class="sns" href="' + c.blog + '" target="_blank" rel="noopener" aria-label="네이버 블로그">' + icon("blog") + "</a>";
    if (c.instagram) out += '<a class="sns" href="' + c.instagram + '" target="_blank" rel="noopener" aria-label="인스타그램">' + icon("instagram") + "</a>";
    if (c.kakao)     out += '<a class="sns" href="' + c.kakao + '" target="_blank" rel="noopener" aria-label="카카오톡 채널">' + icon("kakao") + "</a>";
    if (c.facebook)  out += '<a class="sns" href="' + c.facebook + '" target="_blank" rel="noopener" aria-label="페이스북">' + icon("facebook") + "</a>";
    if (S.church.email) out += '<a class="sns" href="mailto:' + S.church.email + '" aria-label="이메일">' + icon("mail") + "</a>";
    return out;
  }

  function buildFooter() {
    var host = $("[data-footer]");
    if (!host) return;
    var ch = S.church;
    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer__top">' +
          "<div>" +
            '<a class="brand" href="index.html"><span data-logo></span><span class="brand__txt">' +
              '<b class="brand__ko">' + esc(ch.name) + "</b>" +
              '<span class="brand__en">' + esc(ch.nameEn) + "</span>" +
            "</span></a>" +
            '<p class="footer__desc">' + esc(ch.tagline) +
              "<br>세상이 교회를 염려하는 시대에도,<br>교회는 여전히 이 땅의 소망입니다.</p>" +
            '<div class="footer__sns">' + snsLinks() + "</div>" +
          "</div>" +
          '<div class="footer__col"><h4>바로가기</h4><ul>' +
            S.nav.map(function (n) { return '<li><a href="' + n.href + '">' + esc(n.label) + "</a></li>"; }).join("") +
          "</ul></div>" +
          '<div class="footer__col"><h4>온라인</h4><ul>' +
            '<li><a href="' + S.youtube.channelUrl + '" target="_blank" rel="noopener">유튜브 ' + esc(S.youtube.handle) + "</a></li>" +
            (S.channels.blog ? '<li><a href="' + S.channels.blog + '" target="_blank" rel="noopener">네이버 블로그</a></li>' : "") +
            (S.channels.instagram ? '<li><a href="' + S.channels.instagram + '" target="_blank" rel="noopener">인스타그램</a></li>' : "") +
            (S.channels.kakao ? '<li><a href="' + S.channels.kakao + '" target="_blank" rel="noopener">카카오톡 채널</a></li>' : "") +
            (S.channels.namecard ? '<li><a href="' + S.channels.namecard + '" target="_blank" rel="noopener">담임목사 명함</a></li>' : "") +
          "</ul></div>" +
          '<div class="footer__col"><h4>찾아오시는 길</h4><ul>' +
            "<li>" + esc(ch.address) + "</li>" +
            (ch.phone ? '<li><a href="tel:' + ch.phone.replace(/[^0-9+]/g, "") + '">' + esc(ch.phone) + "</a></li>" : "") +
            (ch.email ? '<li><a href="mailto:' + ch.email + '">' + esc(ch.email) + "</a></li>" : "") +
            '<li><a href="' + ch.naverMap + '" target="_blank" rel="noopener">네이버 지도에서 보기</a></li>' +
          "</ul></div>" +
        "</div>" +
        '<div class="footer__bottom">' +
          "<span>© " + new Date().getFullYear() + " " + esc(ch.name) + ". " + esc(ch.denomination) + "</span>" +
          "<span>" + esc(ch.addressShort) + "</span>" +
        "</div>" +
      "</div>";
  }

  /* ----------------------------------------------------------------
     4) 유튜브
     ---------------------------------------------------------------- */
  var YT = {
    embedVideo: function (id) {
      return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    },
    embedList: function (listId) {
      return "https://www.youtube-nocookie.com/embed/videoseries?list=" + listId +
             "&autoplay=1&rel=0&modestbranding=1&playsinline=1";
    },
    thumb: function (id, big) {
      return "https://i.ytimg.com/vi/" + id + "/" + (big ? "maxresdefault" : "mqdefault") + ".jpg";
    }
  };

  /* 재생목록의 '가장 최근 영상' 정보를 유튜브에서 직접 받아옵니다(키 불필요) */
  var oembedCache = {};
  function playlistPoster(listId, cb) {
    if (oembedCache[listId]) { cb(oembedCache[listId]); return; }
    var url = "https://www.youtube.com/oembed?format=json&url=" +
              encodeURIComponent("https://www.youtube.com/playlist?list=" + listId);
    fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.thumbnail_url) return;
      oembedCache[listId] = j;
      cb(j);
    }).catch(function () { /* 네트워크 차단 시 조용히 무시 */ });
  }

  /* 클릭하면 재생되는 썸네일 만들기 */
  function facade(wrap, opts) {
    var label = opts.label || "영상 재생";
    var thumbHtml = opts.videoId
      ? '<img src="' + YT.thumb(opts.videoId, true) + '" alt="" loading="lazy" ' +
        "onerror=\"this.onerror=null;this.src='https://i.ytimg.com/vi/" + opts.videoId + "/hqdefault.jpg'\">"
      : '<span class="ytfacade__bg"></span>';
    wrap.innerHTML =
      (opts.tag ? '<span class="ytwrap__tag">' + esc(opts.tag) + "</span>" : "") +
      '<button class="ytfacade" type="button" aria-label="' + esc(label) + '">' + thumbHtml +
      '<span class="playbtn">' + icon("play") + "<span>" + esc(opts.btn || "영상 보기") + "</span></span></button>";

    $(".ytfacade", wrap).addEventListener("click", function () {
      wrap.innerHTML = "";
      wrap.appendChild(makeIframe(opts.videoId ? YT.embedVideo(opts.videoId) : YT.embedList(opts.listId), label));
    });

    // 재생목록이면 최신 영상 썸네일(+제목)을 받아와 깔아줍니다
    if (!opts.videoId && opts.listId) {
      playlistPoster(opts.listId, function (info) {
        var bg = $(".ytfacade__bg", wrap);
        if (!bg) return;
        var im = new Image();
        im.alt = "";
        im.onload = function () { bg.replaceWith(im); };
        im.src = info.thumbnail_url.replace("hqdefault", "maxresdefault");
        im.onerror = function () { im.onerror = null; im.src = info.thumbnail_url; };
        if (opts.caption) videoTitle(idFromThumb(info.thumbnail_url), function (t) {
          var btn = $(".ytfacade", wrap);
          if (btn) btn.insertAdjacentHTML("beforeend", '<span class="ytwrap__cap">' + esc(t) + "</span>");
        });
      });
    }
  }
  window.ytFacade = facade;

  function makeIframe(src, title) {
    var f = document.createElement("iframe");
    f.src = src;
    f.title = title || "교회 영상";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    return f;
  }

  function idFromThumb(url) { var m = /\/vi\/([\w-]{11})\//.exec(url || ""); return m ? m[1] : ""; }

  function videoTitle(id, cb) {
    if (!id) return;
    fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + id))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.title) cb(j.title); })
      .catch(function () {});
  }

  /* 예배 영상 재생목록: 라이브(생중계) → 없으면 일반 영상 → 전체 */
  function worshipList() {
    var y = S.youtube;
    return y.livePlaylist || y.sermonPlaylist || y.uploadsPlaylist;
  }

  /* 메인 플레이어 — 유튜브 '라이브' 탭의 가장 최근 예배 */
  function buildMainPlayer() {
    var stage = $("[data-yt-player]");
    if (!stage) return;
    var y = S.youtube;
    var first = (y.featured || []).filter(function (v) { return v && v.id; })[0];
    facade(stage, first
      ? { videoId: first.id, tag: first.badge || "추천 설교", btn: "설교 영상 보기", label: first.title }
      : { listId: worshipList(), tag: "최신 예배", btn: "예배 영상 보기",
          label: "최신 예배 영상", caption: true });
  }

  /* ----------------------------------------------------------------
     4-2) 쇼츠 — 채널의 쇼츠 전용 재생목록(UUSH…)을 자동으로 불러옵니다
          <div data-shorts data-limit="10"></div>
     ---------------------------------------------------------------- */
  var SHORTS_KEY = "clc-shorts-v1", SHORTS_TTL = 20 * 60 * 1000;
  var SHORTS_LOGO =
    '<svg class="shorts__logo" viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="5" y="1.5" width="14" height="21" rx="4.5" fill="#FF0033"/>' +
    '<path d="M10 8.3v7.4l6-3.7z" fill="#fff"/></svg>';

  function loadShorts(cb) {
    var y = S.youtube;
    try {
      var c = JSON.parse(localStorage.getItem(SHORTS_KEY) || "null");
      if (c && c.list === y.shortsPlaylist && Date.now() - c.t < SHORTS_TTL && c.items.length) { cb(c.items); return; }
    } catch (e) { /* 저장소를 못 쓰는 환경 */ }
    if (!y.feedProxy || !y.shortsPlaylist) { cb(null); return; }
    var feed = "https://www.youtube.com/feeds/videos.xml?playlist_id=" + y.shortsPlaylist;
    fetch(y.feedProxy + encodeURIComponent(feed))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || j.status !== "ok" || !j.items || !j.items.length) { cb(null); return; }
        var items = j.items.map(function (it) {
          var m = /(?:shorts\/|v=)([\w-]{11})/.exec(it.link || "") || /([\w-]{11})$/.exec(it.guid || "");
          return m ? { id: m[1], title: it.title || "", date: it.pubDate || "" } : null;
        }).filter(Boolean);
        try { localStorage.setItem(SHORTS_KEY, JSON.stringify({ t: Date.now(), list: y.shortsPlaylist, items: items })); } catch (e) {}
        cb(items.length ? items : null);
      })
      .catch(function () { cb(null); });
  }

  /* 해시태그만 있는 제목은 공통 태그를 빼고 앞의 3개만 보여줍니다 */
  function shortTitle(t) {
    var words = String(t).split(/\s+/).filter(Boolean);
    var text = words.filter(function (w) { return w.charAt(0) !== "#"; }).join(" ");
    if (text) return text;
    var hide = S.youtube.shortsHideTags || [];
    var tags = words.filter(function (w) { return hide.indexOf(w) < 0; });
    return (tags.length ? tags : words).slice(0, 3).join(" ");
  }

  function ago(s) {
    var d = new Date(String(s).replace(" ", "T") + "Z"); // 변환 서비스는 UTC 로 줍니다
    if (isNaN(d)) return "";
    var sec = (Date.now() - d) / 1000;
    if (sec < 3600)  return Math.max(1, Math.round(sec / 60)) + "분 전";
    if (sec < 86400) return Math.round(sec / 3600) + "시간 전";
    if (sec < 86400 * 30) return Math.round(sec / 86400) + "일 전";
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  }

  /* 쇼츠 썸네일: 세로 원본(oar2) → 없으면 가로 썸네일을 세로로 잘라 사용 */
  function shortThumb(id) {
    return '<img src="https://i.ytimg.com/vi/' + id + '/oar2.jpg" alt="" loading="lazy" decoding="async" ' +
      "onerror=\"this.onerror=null;this.src='https://i.ytimg.com/vi/" + id + "/hqdefault.jpg'\" " +
      "onload=\"if(this.naturalWidth<=120&&!this.dataset.f){this.dataset.f=1;this.src='https://i.ytimg.com/vi/" + id + "/hqdefault.jpg'}\">";
  }

  function buildShorts() {
    $$("[data-shorts]").forEach(function (host) {
      var y = S.youtube;
      var limit = +host.getAttribute("data-limit") || 10;
      host.classList.add("shorts");
      host.innerHTML =
        '<div class="shorts__head">' +
          '<h3 class="shorts__title">' + SHORTS_LOGO + "<span>쇼츠</span></h3>" +
          '<div class="shorts__nav">' +
            '<button class="shorts__arrow" type="button" data-dir="-1" aria-label="이전 쇼츠" disabled>' + icon("chevL") + "</button>" +
            '<button class="shorts__arrow" type="button" data-dir="1" aria-label="다음 쇼츠">' + icon("chevR") + "</button>" +
          "</div>" +
        "</div>" +
        '<div class="shorts__track" aria-label="최신 쇼츠 목록">' +
          Array(5).join('<span class="short short--skel"></span>') + // 불러오는 동안 자리 표시 4칸
        "</div>" +
        '<a class="shorts__more" href="' + y.channelUrl + '/shorts" target="_blank" rel="noopener">유튜브에서 쇼츠 전체보기 ' + icon("arrow") + "</a>";

      var track = $(".shorts__track", host);
      var prev = $('[data-dir="-1"]', host), next = $('[data-dir="1"]', host);
      function syncArrows() {
        prev.disabled = track.scrollLeft < 4;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      }
      $$(".shorts__arrow", host).forEach(function (b) {
        b.addEventListener("click", function () {
          track.scrollBy({ left: +b.dataset.dir * track.clientWidth * 0.9, behavior: "smooth" });
        });
      });
      track.addEventListener("scroll", syncArrows, { passive: true });

      loadShorts(function (items) {
        if (!items) {
          // 목록을 못 받으면: 쇼츠 재생목록을 통째로 재생하는 카드 한 장
          track.innerHTML =
            '<button class="short short--list" type="button" aria-label="최신 쇼츠 재생">' +
              '<span class="short__thumb"></span>' +
              '<span class="short__play">' + icon("play") + "</span>" +
              '<span class="short__meta"><span class="short__title">최신 쇼츠 이어보기</span></span></button>';
          playlistPoster(y.shortsPlaylist, function (info) {
            var th = $(".short__thumb", track);
            if (th) th.innerHTML = shortThumb(idFromThumb(info.thumbnail_url));
          });
          $(".short", track).addEventListener("click", function () {
            openVideo({ listId: y.shortsPlaylist, vertical: true });
          });
          syncArrows();
          return;
        }
        items = items.slice(0, limit);
        track.innerHTML = items.map(function (v, i) {
          var t = shortTitle(v.title);
          return '<button class="short" type="button" data-i="' + i + '" aria-label="쇼츠 재생: ' + esc(t) + '">' +
            '<span class="short__thumb">' + shortThumb(v.id) + "</span>" +
            '<span class="short__play">' + icon("play") + "</span>" +
            '<span class="short__meta"><span class="short__title">' +
              esc(t).replace(/(#\S+)/g, '<span class="nw">$1</span>') + "</span>" + // 해시태그가 중간에 끊기지 않게
            '<span class="short__date">' + esc(ago(v.date)) + "</span></span></button>";
        }).join("");
        track.addEventListener("click", function (e) {
          var b = e.target.closest(".short"); if (!b) return;
          openVideo({ list: items, index: +b.dataset.i, vertical: true });
        });
        syncArrows();
      });
    });
  }

  /* 설교 페이지 — 카테고리 탭 */
  function buildSermonTabs() {
    var tabsHost = $("[data-yt-tabs]"), stage = $("[data-yt-tabstage]"), descEl = $("[data-yt-tabdesc]");
    if (!tabsHost || !stage) return;
    var cats = S.youtube.categories || [];
    tabsHost.innerHTML = cats.map(function (c, i) {
      return '<button class="tab' + (i === 0 ? " is-active" : "") + '" type="button" data-k="' + i + '">' + esc(c.label) + "</button>";
    }).join("");

    function show(i) {
      var c = cats[i]; if (!c) return;
      facade(stage, {
        listId: c.playlistId || worshipList(),
        tag: c.label, btn: c.label + " 영상 보기", label: c.label, caption: !c.playlistId
      });
      if (descEl) {
        descEl.innerHTML = "<b>" + esc(c.label) + "</b> · " + esc(c.desc) +
          (c.playlistId ? "" : " <span>(전용 재생목록이 아직 없어 최신 라이브 예배 영상이 재생됩니다)</span>");
      }
    }
    tabsHost.addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (!b) return;
      $$(".tab", tabsHost).forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      show(+b.dataset.k);
    });
    show(0);
  }

  /* 단독 재생 박스 <div data-yt="영상ID 또는 list:재생목록ID" data-tag="..."></div> */
  function buildStandalone() {
    $$("[data-yt]").forEach(function (el) {
      var v = el.getAttribute("data-yt");
      el.classList.add("ytwrap");
      if (v.indexOf("list:") === 0) facade(el, { listId: v.slice(5), tag: el.dataset.tag, btn: el.dataset.btn || "영상 보기" });
      else facade(el, { videoId: v, tag: el.dataset.tag, btn: el.dataset.btn || "영상 보기" });
    });
  }

  /* ----------------------------------------------------------------
     5) 설정 기반 목록 렌더링
     ---------------------------------------------------------------- */
  var RENDER = {
    values: function (host) {
      host.classList.add("values");
      host.innerHTML = S.values.map(function (v, i) {
        return '<article class="value" data-reveal data-d="' + (i + 1) + '">' +
          '<span class="value__no">' + esc(v.no) + "</span>" +
          '<div class="value__body"><h3 class="value__title">' + esc(v.title) + "</h3>" +
          '<p class="value__desc">' + esc(v.desc) + "</p></div></article>";
      }).join("");
    },
    services: function (host) {
      host.innerHTML = S.services.map(function (s) {
        return '<div class="svc">' +
          '<div class="svc__name">' + esc(s.name) + "</div>" +
          '<div class="svc__time">' + esc(s.time) + "</div>" +
          '<div class="svc__meta"><span class="svc__place">' + esc(s.place) + "</span>" +
          (s.note ? '<span class="svc__note">' + esc(s.note) + "</span>" : "") + "</div></div>";
      }).join("");
    },
    blogCategories: function (host) {
      var base = S.channels.blog;
      host.innerHTML = S.blogCategories.map(function (c, i) {
        var url = c.url || base;
        return '<a class="icard" href="' + esc(url) + '" target="_blank" rel="noopener" data-reveal data-d="' + ((i % 4) + 1) + '">' +
          '<span class="icard__ico">' + icon(c.icon) + "</span>" +
          '<span class="icard__name">' + esc(c.name) + "</span>" +
          '<span class="icard__desc">' + esc(c.desc) + "</span>" +
          '<span class="icard__go">블로그에서 보기 →</span></a>';
      }).join("");
    },
    news: function (host) {
      host.innerHTML = S.news.map(function (n) {
        var tag = "<article class=\"news-item\">" +
          '<div class="news-item__date">' + esc(n.date) + "</div>" +
          "<div><span class=\"news-item__tag\">" + esc(n.tag) + "</span>" +
          '<h3 class="news-item__title">' + esc(n.title) + "</h3>" +
          '<p class="news-item__desc">' + esc(n.desc) + "</p></div>" +
          '<div class="news-item__go">' + icon("arrow") + "</div></article>";
        return n.url ? '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + tag + "</a>" : tag;
      }).join("");
    },
    pastorTagline: function (host) {
      host.innerHTML = esc(S.pastor.tagline || "").replace(/\n/g, "<br>");
    },
    pastorCreds: function (host) {
      host.className = "creds";
      host.innerHTML = S.pastor.credentials.map(function (c) {
        return "<li>" + keepTogether(c) + "</li>";
      }).join("");
    },
    pastorBio: function (host) {
      host.className = "pbio";
      host.innerHTML = '<dl class="pbio__list">' + S.pastor.bio.map(function (p) {
        if (typeof p === "string") p = { label: "", text: p };
        return '<div class="pbio__row"><dt>' + esc(p.label) + "</dt><dd>" + keepTogether(p.text) + "</dd></div>";
      }).join("") + "</dl>";
    },
    sns: function (host) { host.innerHTML = snsLinks(); }
  };

  function renderLists() {
    $$("[data-render]").forEach(function (el) {
      var fn = RENDER[el.getAttribute("data-render")];
      if (fn) fn(el);
    });
  }

  /* ----------------------------------------------------------------
     6) 스크롤 등장 애니메이션
     ---------------------------------------------------------------- */
  function reveal() {
    var els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ----------------------------------------------------------------
     7) 영상 모달
        openVideo({ videoId | listId | list+index, vertical })
        · vertical: 쇼츠처럼 세로 화면으로 재생
        · list: 여러 쇼츠를 ‹ › 로 넘겨보기
     ---------------------------------------------------------------- */
  var modal = null, modalState = null, lastFocus = null;

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "영상 재생");
    modal.innerHTML =
      '<button class="modal__close" type="button" aria-label="닫기">' + icon("close") + "</button>" +
      '<button class="modal__nav modal__nav--prev" type="button" aria-label="이전 영상">' + icon("chevL") + "</button>" +
      '<div class="modal__box"><div class="ytwrap" id="modalYt"></div>' +
        '<p class="modal__cap" id="modalCap"></p></div>' +
      '<button class="modal__nav modal__nav--next" type="button" aria-label="다음 영상">' + icon("chevR") + "</button>";
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal__close")) closeVideo();
      else if (e.target.closest(".modal__nav--prev")) stepVideo(-1);
      else if (e.target.closest(".modal__nav--next")) stepVideo(1);
    });
    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeVideo();
      else if (e.key === "ArrowLeft") stepVideo(-1);
      else if (e.key === "ArrowRight") stepVideo(1);
    });
    return modal;
  }

  function renderModal() {
    var st = modalState, box = $("#modalYt", modal), cap = $("#modalCap", modal);
    var cur = st.list ? st.list[st.index] : null;
    var id = cur ? cur.id : st.videoId;
    box.innerHTML = "";
    box.appendChild(makeIframe(id ? YT.embedVideo(id) : YT.embedList(st.listId), cur ? shortTitle(cur.title) : "교회 영상"));
    cap.textContent = cur ? shortTitle(cur.title) + (cur.date ? "  ·  " + ago(cur.date) : "") : "";
    var multi = !!(st.list && st.list.length > 1);
    $(".modal__nav--prev", modal).hidden = !multi || st.index === 0;
    $(".modal__nav--next", modal).hidden = !multi || st.index === st.list.length - 1;
  }

  function openVideo(opts) {
    ensureModal();
    lastFocus = document.activeElement;
    modalState = { videoId: opts.videoId, listId: opts.listId, list: opts.list, index: opts.index || 0 };
    modal.classList.toggle("is-vertical", !!opts.vertical);
    renderModal();
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  }

  function stepVideo(d) {
    var st = modalState;
    if (!st || !st.list) return;
    var n = st.index + d;
    if (n < 0 || n >= st.list.length) return;
    st.index = n;
    renderModal();
  }

  function closeVideo() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    $("#modalYt", modal).innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ----------------------------------------------------------------
     8) 구글 지도 <div data-map></div>  (API 키 없이 주소로 표시)
     ---------------------------------------------------------------- */
  function buildMap() {
    $$("[data-map]").forEach(function (el) {
      var addr = S.church.address;
      var q = encodeURIComponent(S.church.mapQuery || addr);
      var f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + q + "&hl=ko&z=17&output=embed";
      f.title = S.church.name + " 위치 지도";
      f.loading = "lazy";
      f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      f.allowFullscreen = true;
      el.innerHTML =
        '<div class="mapbox__frame"></div>' +
        '<div class="mapbox__bar">' +
          '<span class="mapbox__addr">' + icon("pin") + "<span><b>" + esc(S.church.name) + "</b>" + esc(addr) + "</span></span>" +
          '<a class="btn btn--sm" href="https://www.google.com/maps/dir/?api=1&destination=' + q +
            '" target="_blank" rel="noopener">구글 지도로 길찾기</a>' +
        "</div>";
      $(".mapbox__frame", el).appendChild(f);
    });
  }

  /* ----------------------------------------------------------------
     9) 섹션 바로가기
        about.html#pastor 처럼 링크하면, 섹션 위쪽 여백은 건너뛰고
        내용이 헤더 바로 아래에 딱 맞게 오도록 스크롤합니다.
     ---------------------------------------------------------------- */
  var HEAD_H = 66, HEAD_GAP = 40;
  function sectionTop(el) {
    var y = el.getBoundingClientRect().top + window.pageYOffset;
    if (el.tagName === "SECTION") y += parseFloat(getComputedStyle(el).paddingTop) || 0;
    return Math.max(0, Math.round(y - HEAD_H - HEAD_GAP));
  }
  function jumpTo(hash, smooth) {
    if (!hash || hash.length < 2) return false;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return false;
    window.scrollTo({ top: sectionTop(el), behavior: smooth ? "smooth" : "instant" });
    return true;
  }
  function bindAnchors() {
    // 같은 페이지 안의 #링크
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      var u = new URL(a.getAttribute("href"), location.href);
      if (u.origin !== location.origin || u.pathname !== location.pathname || !u.hash) return;
      if (jumpTo(u.hash, true)) { e.preventDefault(); history.pushState(null, "", u.hash); }
    });
    window.addEventListener("popstate", function () { jumpTo(location.hash, true); });

    // 다른 페이지에서 #섹션 으로 들어온 경우: 내용이 다 그려진 뒤 위치를 다시 맞춤
    if (!location.hash) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var moved = false;
    ["wheel", "touchstart", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true });
    });
    var go = function () { if (!moved) jumpTo(location.hash, false); };
    requestAnimationFrame(go);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    window.addEventListener("load", go);
  }

  /* <a data-modal-yt="영상ID 또는 list:재생목록ID"> 를 누르면 모달로 재생 */
  function buildModal() {
    $$("[data-modal-yt]").forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.preventDefault();
        var v = o.getAttribute("data-modal-yt") || "";
        openVideo(v.indexOf("list:") === 0 ? { listId: v.slice(5) } : { videoId: v });
      });
    });
  }

  /* ----------------------------------------------------------------
     시작
     ---------------------------------------------------------------- */
  function init() {
    if (!S) { console.error("site-config.js 를 먼저 불러와야 합니다."); return; }
    bindConfig();
    buildHeader();
    buildFooter();
    renderLogos();
    renderLists();
    renderImages();
    buildMainPlayer();
    buildShorts();
    buildSermonTabs();
    buildStandalone();
    buildMap();
    buildModal();
    reveal();
    bindAnchors();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
