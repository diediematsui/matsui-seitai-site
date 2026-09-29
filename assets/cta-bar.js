/* ============================================================
   全ページ共通の下部固定CTA
   - ファーストビューを過ぎたらフェードインで表示
   - ページ最下部の予約セクションが見えたら非表示
   - 閉じるとそのセッション中は再表示しない
   スタイルは assets/cta-bar.css を参照。
   ============================================================ */
(function(){
  'use strict';

  var LINE_URL   = 'https://lin.ee/ozaeHCLi';
  var MAIN_TEXT  = '初回90分 5,000円｜LINEで相談・予約';
  var SUB_TEXT   = '質問だけでもOK';
  var CTA_SELECTOR = '.cta-section, .review-cta';  /* 最下部の予約セクション */

  function init(){
    if(document.querySelector('.cta-bar')) return;

    var bar = document.createElement('div');
    bar.className = 'cta-bar';
    bar.id = 'cta-bar';
    bar.innerHTML =
      '<a class="cta-bar-btn" href="' + LINE_URL + '" target="_blank" rel="noopener">' +
        '<span class="cta-bar-main">' + MAIN_TEXT + '</span>' +
        '<span class="cta-bar-sub">' + SUB_TEXT + '</span>' +
      '</a>' +
      '<button class="cta-bar-close" type="button" aria-label="このバーを閉じる">×</button>';
    document.body.appendChild(bar);

    var dismissed = false;
    try{ dismissed = sessionStorage.getItem('ctaBarClosed') === '1'; }catch(e){}
    if(!dismissed) document.body.classList.add('has-cta-bar');

    var pastFirstView = false;
    var atBookingCta  = false;

    function update(){
      bar.classList.toggle('is-visible', !dismissed && pastFirstView && !atBookingCta);
    }

    bar.querySelector('.cta-bar-close').addEventListener('click', function(){
      dismissed = true;
      try{ sessionStorage.setItem('ctaBarClosed', '1'); }catch(e){}
      document.body.classList.remove('has-cta-bar');
      update();
    });

    var cta = document.querySelector(CTA_SELECTOR);
    if(cta && window.IntersectionObserver){
      new IntersectionObserver(function(entries){
        atBookingCta = entries[0].isIntersecting;
        update();
      }, { threshold: 0 }).observe(cta);
    }

    function onScroll(){
      /* 通常はファーストビューを過ぎたら。
         スクロール量が足りない短いページでは、半分まで進んだら表示する。 */
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var trigger = Math.min(window.innerHeight * 0.9, scrollable * 0.5);
      var next = window.pageYOffset > trigger;
      if(next !== pastFirstView){ pastFirstView = next; update(); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
