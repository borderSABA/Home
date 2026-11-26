(() => {
  'use strict';

  const API_URL = (window.BOARDGAME_HUB_API_URL || 'https://boardgame-hub-api.naitoryo7110.workers.dev').replace(/\/$/, '');
  const NAME_KEY = 'boardgamePlayerName';

  function cleanName(value) {
    return String(value || '').trim().slice(0, 32);
  }

  function getPlayerName() {
    return cleanName(localStorage.getItem(NAME_KEY) || '');
  }

  function setPlayerName(name) {
    const value = cleanName(name);
    if (value) localStorage.setItem(NAME_KEY, value);
    else localStorage.removeItem(NAME_KEY);
    window.dispatchEvent(new CustomEvent('boardgamehub:namechange', { detail: { name: value } }));
    return value;
  }

  async function api(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    let data = null;
    try { data = await response.json(); } catch {}
    if (!response.ok) {
      const error = new Error((data && data.error) || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async function isHost(name) {
    const value = cleanName(name);
    if (!value) return false;
    const data = await api(`/api/host/check?name=${encodeURIComponent(value)}`);
    return !!data.allowed;
  }

  async function logPlay({ game, room = '', players = [], mode = '' }) {
    const cleanedPlayers = [...new Set((players || []).map(cleanName).filter(Boolean))].slice(0, 20);
    return api('/api/play/start', {
      method: 'POST',
      body: JSON.stringify({
        game: String(game || '').trim().slice(0, 80),
        room: String(room || '').trim().slice(0, 40),
        players: cleanedPlayers,
        mode: String(mode || '').trim().slice(0, 40)
      })
    });
  }

  function openHome() {
    location.href = 'https://bordersaba.github.io/';
  }

  function openPlayRecords() {
    location.href = 'https://bordersaba.github.io/#play-records';
  }

  window.BoardgameHub = {
    API_URL,
    NAME_KEY,
    getPlayerName,
    setPlayerName,
    isHost,
    logPlay,
    openHome,
    openPlayRecords,
    api
  };
})();
