import './styles.css';
import {
  createPlato,
  deletePlato,
  getApiConfig,
  getPlato,
  getPlatos,
  getStats,
  setApiKey,
  updatePlato,
} from './api.js';

const fallbackImage =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80';

const emptyForm = {
  nombre: '',
  descripcion: '',
  region: '',
  ingredientes: '',
  precio: '',
  imagenUrl: '',
  categoria: '',
};

let platos = [];
let stats = null;
let selectedPlato = null;
let editingId = null;
let formState = { ...emptyForm };
let message = '';
let error = '';
let loading = false;

const app = document.querySelector('#app');

function render() {
  const config = getApiConfig();

  app.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">EPN Event Manager</p>
          <h1>Platos tipicos ecuatorianos</h1>
        </div>
        <div class="api-key-panel">
          <label for="apiKey">X-FIS-EPN-KEY</label>
          <div class="api-key-row">
            <input id="apiKey" type="password" value="${escapeHtml(config.apiKey)}" />
            <button class="button secondary" data-action="save-key">Guardar</button>
          </div>
        </div>
      </header>

      <section class="status-strip">
        <span>Backend: ${escapeHtml(config.apiUrl)}</span>
        <button class="button ghost" data-action="refresh">Actualizar</button>
      </section>

      ${message ? `<div class="notice success">${escapeHtml(message)}</div>` : ''}
      ${error ? `<div class="notice error">${escapeHtml(error)}</div>` : ''}

      <section class="workspace">
        <form class="editor" data-form="plato">
          <div class="section-title">
            <h2>${editingId ? 'Editar plato' : 'Crear plato'}</h2>
            ${
              editingId
                ? '<button class="button ghost" type="button" data-action="cancel-edit">Cancelar</button>'
                : ''
            }
          </div>
          ${inputField('nombre', 'Nombre', formState.nombre, 'text')}
          ${textareaField('descripcion', 'Descripcion', formState.descripcion)}
          <div class="form-grid">
            ${inputField('region', 'Region', formState.region, 'text')}
            ${inputField('categoria', 'Categoria', formState.categoria, 'text')}
          </div>
          ${textareaField('ingredientes', 'Ingredientes', formState.ingredientes)}
          <div class="form-grid">
            ${inputField('precio', 'Precio', formState.precio, 'number')}
            ${inputField('imagenUrl', 'Imagen URL', formState.imagenUrl, 'url')}
          </div>
          <button class="button primary" type="submit">
            ${editingId ? 'Guardar cambios' : 'Crear plato'}
          </button>
        </form>

        <aside class="stats-panel">
          <div class="section-title">
            <h2>Estadisticas</h2>
            <button class="button ghost" data-action="stats">Recalcular</button>
          </div>
          ${renderStats()}
        </aside>
      </section>

      <section class="content-grid">
        <div>
          <div class="section-title">
            <h2>Listado</h2>
            <span>${loading ? 'Cargando...' : `${platos.length} platos`}</span>
          </div>
          <div class="cards">
            ${platos.map(renderCard).join('') || '<p class="empty">No hay platos registrados.</p>'}
          </div>
        </div>

        <aside class="detail-panel">
          <h2>Detalle</h2>
          ${renderDetail()}
        </aside>
      </section>
    </main>
  `;

  bindEvents();
}

function inputField(name, label, value, type) {
  return `
    <label class="field">
      <span>${label}</span>
      <input name="${name}" type="${type}" value="${escapeHtml(String(value))}" ${type === 'number' ? 'step="0.01" min="0"' : ''} />
    </label>
  `;
}

function textareaField(name, label, value) {
  return `
    <label class="field">
      <span>${label}</span>
      <textarea name="${name}" rows="3">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function renderCard(plato) {
  return `
    <article class="card">
      <img src="${escapeHtml(plato.imagenUrl || fallbackImage)}" alt="${escapeHtml(plato.nombre)}" />
      <div class="card-body">
        <div>
          <h3>${escapeHtml(plato.nombre)}</h3>
          <p>${escapeHtml(plato.descripcion)}</p>
        </div>
        <dl>
          <div><dt>Region</dt><dd>${escapeHtml(plato.region)}</dd></div>
          <div><dt>Categoria</dt><dd>${escapeHtml(plato.categoria)}</dd></div>
          <div><dt>Precio</dt><dd>$${Number(plato.precio).toFixed(2)}</dd></div>
        </dl>
        <p class="ingredients">${escapeHtml(plato.ingredientes)}</p>
        <div class="actions">
          <button class="button secondary" data-action="view" data-id="${plato.id}">Ver</button>
          <button class="button secondary" data-action="edit" data-id="${plato.id}">Editar</button>
          <button class="button danger" data-action="delete" data-id="${plato.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}

function renderDetail() {
  if (!selectedPlato) {
    return '<p class="empty">Selecciona Ver para consultar un plato desde el backend.</p>';
  }

  return `
    <img class="detail-image" src="${escapeHtml(selectedPlato.imagenUrl || fallbackImage)}" alt="${escapeHtml(selectedPlato.nombre)}" />
    <h3>${escapeHtml(selectedPlato.nombre)}</h3>
    <p>${escapeHtml(selectedPlato.descripcion)}</p>
    <ul class="detail-list">
      <li><span>Region</span>${escapeHtml(selectedPlato.region)}</li>
      <li><span>Ingredientes</span>${escapeHtml(selectedPlato.ingredientes)}</li>
      <li><span>Precio</span>$${Number(selectedPlato.precio).toFixed(2)}</li>
      <li><span>Categoria</span>${escapeHtml(selectedPlato.categoria)}</li>
    </ul>
  `;
}

function renderStats() {
  if (!stats) {
    return '<p class="empty">Pulsa Recalcular para cargar estadisticas.</p>';
  }

  return `
    <div class="stats-grid">
      ${statItem('Total', stats.totalPlatos)}
      ${statItem('Promedio', `$${Number(stats.precioPromedio).toFixed(2)}`)}
      ${statItem('Minimo', `$${Number(stats.precioMinimo).toFixed(2)}`)}
      ${statItem('Maximo', `$${Number(stats.precioMaximo).toFixed(2)}`)}
    </div>
    <h3>Por region</h3>
    ${renderCountList(stats.platosPorRegion)}
    <h3>Por categoria</h3>
    ${renderCountList(stats.platosPorCategoria)}
    <p class="timestamp">Generado: ${escapeHtml(stats.generatedAt)}</p>
  `;
}

function statItem(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderCountList(values) {
  const entries = Object.entries(values ?? {});

  if (entries.length === 0) {
    return '<p class="empty">Sin datos.</p>';
  }

  return `
    <ul class="count-list">
      ${entries.map(([key, value]) => `<li><span>${escapeHtml(key)}</span><strong>${value}</strong></li>`).join('')}
    </ul>
  `;
}

function bindEvents() {
  document.querySelector('[data-form="plato"]').addEventListener('submit', handleSubmit);
  document.querySelector('[data-action="save-key"]').addEventListener('click', handleSaveApiKey);
  document.querySelector('[data-action="refresh"]').addEventListener('click', loadDashboard);
  document.querySelector('[data-action="stats"]').addEventListener('click', loadStats);

  document.querySelector('[data-action="cancel-edit"]')?.addEventListener('click', () => {
    editingId = null;
    formState = { ...emptyForm };
    render();
  });

  document.querySelectorAll('[data-action="view"]').forEach((button) => {
    button.addEventListener('click', () => handleView(button.dataset.id));
  });
  document.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => handleEdit(button.dataset.id));
  });
  document.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => handleDelete(button.dataset.id));
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());
  payload.precio = Number(payload.precio);
  formState = { ...payload };

  await runAction(async () => {
    if (editingId) {
      await updatePlato(editingId, payload);
      message = 'Plato actualizado correctamente.';
    } else {
      await createPlato(payload);
      message = 'Plato creado correctamente.';
    }

    editingId = null;
    formState = { ...emptyForm };
    await loadDashboard(false);
  });
}

async function handleView(id) {
  await runAction(async () => {
    const response = await getPlato(id);
    selectedPlato = response.data;
    message = `Detalle cargado: ${response.data.nombre}.`;
  });
}

function handleEdit(id) {
  const plato = platos.find((item) => String(item.id) === String(id));

  if (!plato) {
    error = 'No se encontro el plato para editar.';
    render();
    return;
  }

  editingId = plato.id;
  formState = {
    nombre: plato.nombre,
    descripcion: plato.descripcion,
    region: plato.region,
    ingredientes: plato.ingredientes,
    precio: plato.precio,
    imagenUrl: plato.imagenUrl,
    categoria: plato.categoria,
  };
  message = `Editando ${plato.nombre}.`;
  error = '';
  render();
}

async function handleDelete(id) {
  const confirmed = window.confirm('Eliminar este plato tipico?');

  if (!confirmed) {
    return;
  }

  await runAction(async () => {
    await deletePlato(id);
    selectedPlato = selectedPlato?.id === Number(id) ? null : selectedPlato;
    message = 'Plato eliminado correctamente.';
    await loadDashboard(false);
  });
}

async function handleSaveApiKey() {
  const input = document.querySelector('#apiKey');
  setApiKey(input.value);
  message = 'API Key guardada para las siguientes solicitudes.';
  error = '';
  await loadDashboard(false);
}

async function loadDashboard(showLoading = true) {
  await runAction(async () => {
    if (showLoading) {
      loading = true;
      render();
    }

    const [platosResponse, statsResponse] = await Promise.all([getPlatos(), getStats()]);
    platos = platosResponse.data;
    stats = statsResponse.data;
    loading = false;
  });
}

async function loadStats() {
  await runAction(async () => {
    const response = await getStats();
    stats = response.data;
    message = 'Estadisticas actualizadas.';
  });
}

async function runAction(action) {
  try {
    error = '';
    await action();
  } catch (caughtError) {
    loading = false;
    message = '';
    error = caughtError.message;
  } finally {
    render();
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();
loadDashboard();
