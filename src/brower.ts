import { showme } from './showme.js';

function parse() {
  if (!window.location.hash || window.location.hash.indexOf('/') === -1) {
    const lat = Math.floor(Math.random() * 0xffff);
    const long = Math.floor(Math.random() * 0xffff);
    const _lat = `x${lat.toString(16)}`;
    const _lng = `x${long.toString(16)}`;
    window.location.hash = `${_lat}/${_lng}`;
    return false;
  }

  const [a, b] = window.location.hash.slice(1).split('/');
  const lat = parseInt(a?.replace(/^x/, ''), 16) & 0xffff;
  const long = parseInt(b?.replace(/^x/, ''), 16) & 0xffff;
  const _lat = `x${lat.toString(16)}`;
  const _lng = `x${long.toString(16)}`;

  if (a !== _lat || b !== _lng) {
    window.location.hash = `${_lat}/${_lng}`;
    return false;
  }

  return [lat, long];
}

function update() {
  const parsed = parse();
  if (!parsed) {
    return;
  }

  const [lat, long] = parsed;
  const root = document.querySelector('#root');
  if (root == undefined) {
    return;
  }

  const north = `/whereami/#x${wrap(lat + 1).toString(16)}/x${long.toString(16)}`;
  const east = `/whereami/#x${lat.toString(16)}/x${wrap(long + 1).toString(16)}`;
  const south = `/whereami/#x${wrap(lat - 1).toString(16)}/x${long.toString(16)}`;
  const west = `/whereami/#x${lat.toString(16)}/x${wrap(long - 1).toString(16)}`;

  root.innerHTML = `
    <pre>${showme(lat, long)}</pre>
    <ul>
      <li><a href="${north}">north</a></li>
      <li><a href="${east}">east</a></li>
      <li><a href="${south}">south</a></li>
      <li><a href="${west}">west</a></li>
    </ul>  
  `;
}

function wrap(n: number): number {
  n = Math.abs(n);
  return Math.min(n, 0xffff - n);
}

window.addEventListener('hashchange', update);
update();
