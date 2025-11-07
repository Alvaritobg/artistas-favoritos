import { LitElement, html, css } from 'lit';
import './artist-card.js';

class ArtistSearch extends LitElement {
  static styles = css`
    .search {
      display: flex;
      align-items: stretch;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
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
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .no-results {
      text-align: center;
      color: #e91b1bff;
      font-size: 1rem;
      margin-top: 1rem;
    }
  `;

  static properties = {
    query: { type: String },
    artists: { type: Array },
    searched: { type: Boolean },
  };

  constructor() {
    super();
    this.query = '';
    this.artists = [];
    this.searched = false;
  }

  async searchArtists() {
    if (!this.query) return;

    this.searched = true;
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
    }
  }

  render() {
    return html`
      <div class="search">
        <input
          placeholder="Buscar artista..."
          @input=${(e) => {
            this.query = e.target.value;
            // hide "no results" message while the user is typing
            this.searched = false;
            // if input cleared, also clear previous results
            if (!this.query) this.artists = [];
          }}
          @keyup=${(e) => e.key === 'Enter' && this.searchArtists()} />
        <button class="button" @click=${this.searchArtists}>🔍 Buscar</button>
      </div>

      ${this.searched
        ? this.artists.length
          ? html` <div class="results">
              ${this.artists.map(
                (artist) => html`
                  <artist-card
                    .artist=${artist}
                    @add-favorite=${(e) =>
                      this.dispatchEvent(
                        new CustomEvent('add-favorite', { detail: artist })
                      )}></artist-card>
                `
              )}
            </div>`
          : html`<p class="no-results">
              No se encontraron coincidencias para "${this.query}"
            </p>`
        : ''}
    `;
  }
}

customElements.define('artist-search', ArtistSearch);
