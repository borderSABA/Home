(() => {
  'use strict';
  const btn = document.getElementById('installPwaBtn');
  if (!btn) return;
  let installEvent = null;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const update = () => { btn.hidden = standalone(); };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); installEvent = event;
  });
  window.addEventListener('appinstalled', () => { installEvent = null; update(); });
  btn.addEventListener('click', async () => {
    if (installEvent) {
      const event = installEvent; installEvent = null;
      await event.prompt();
      return;
    }
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      alert('Safariでこのページを開き、共有メニューから「ホーム画面に追加」を選択してください。');
    } else if (/Android/i.test(navigator.userAgent)) {
      alert('ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。');
    } else {
      alert('ブラウザのメニューから「インストール」を選択してください（対応ブラウザのみ）。');
    }
  });
  update();
})();
