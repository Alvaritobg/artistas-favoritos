import { LitElement, html, css } from 'lit';
import './artist-card.js';

class ArtistSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      margin-bottom: 2rem;
    }

    .search {
      display: flex;
      align-items: stretch;
      gap: 0.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    input {
      flex: 1;
      font-size: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      min-width: 0;
    }

    input:focus {
      border-color: #0077ff;
      box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.1);
    }

    .search .button {
      font-size: 1rem;
      background: #0077ff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }

    .search .button:hover {
      background: #0066dd;
    }

    .results {
      display: none;
      /* kept for compatibility if needed */
    }

    .no-results {
      text-align: center;
      color: #e91b1bff;
      font-size: 1rem;
      margin-top: 1rem;
    }

    .loading {
      text-align: center;
      color: #0077ff;
      font-size: 1rem;
      margin-top: 1rem;
    }
    /* Dropdown (search suggestions) */
    .dropdown {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 600px;
      top: 100%;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      max-height: 320px;
      overflow: auto;
      z-index: 40;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .thumb {
      width: 48px;
      height: 48px;
      flex: 0 0 48px;
      border-radius: 4px;
      object-fit: cover;
      background: #f3f3f3;
    }

    .name {
      flex: 1 1 auto;
      font-weight: 600;
      color: #111;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .add-btn {
      background: #0077ff;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      flex: 0 0 auto;
    }
  `;

  static properties = {
    query: { type: String },
    artists: { type: Array },
    searched: { type: Boolean },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.query = '';
    this.artists = [];
    this.searched = false;
    this.loading = false;
  }

  async searchArtists() {
    if (!this.query) return;

    this.searched = true;
    this.loading = true;
    try {
      const url = `/api/v1/json/2/search.php?s=${encodeURIComponent(
        this.query
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      this.artists = data.artists || [];
    } catch (err) {
      console.error('Error buscando artistas:', err);
      this.artists = [];
    } finally {
      this.loading = false;
    }
  }

  clearSearch() {
    this.query = '';
    this.searched = false;
    this.artists = [];
    // También limpiar el input por si acaso
    const input = this.shadowRoot.querySelector('input');
    if (input) input.value = '';
  }

  render() {
    return html`
      <div class="search">
        <input
          .value=${this.query}
          placeholder="Buscar artista..."
          @input=${(e) => {
            this.query = e.target.value;
            this.searched = false;
            if (!this.query) this.artists = [];
          }}
          @keyup=${(e) => e.key === 'Enter' && this.searchArtists()} />
        <button class="button" @click=${this.searchArtists}>🔍 Buscar</button>
      </div>

      ${this.searched
        ? html`
            <div class="dropdown">
              ${this.loading
                ? html`<p class="loading">🔎 Buscando...</p>`
                : this.artists.length
                ? this.artists.map(
                    (artist) => html`
                      <div class="dropdown-item">
                        <img
                          class="thumb"
                          src=${artist.strArtistThumb ||
                          'https://via.placeholder.com/48'}
                          alt=${artist.strArtist} />
                        <div class="name">${artist.strArtist}</div>
                        <button
                          class="add-btn"
                          @click=${() => {
                            this.dispatchEvent(
                              new CustomEvent('add-favorite', {
                                detail: artist,
                                bubbles: true,
                                composed: true,
                              })
                            );
                            this.clearSearch();
                          }}>
                          Añadir a favoritos ❤️
                        </button>
                      </div>
                    `
                  )
                : html`<p class="no-results">
                    No se encontraron coincidencias para "${this.query}"
                  </p>`}
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('artist-search', ArtistSearch);
