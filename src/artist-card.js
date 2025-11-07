import { LitElement, html, css } from 'lit';

class ArtistCard extends LitElement {
  static styles = css`
    .card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    img {
      max-width: 100%;
      border-radius: 6px;
    }
    button {
      margin-top: 0.5rem;
      background: #0077ff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }
  `;

  static properties = {
    artist: { type: Object },
  };

  render() {
    const { strArtist, strArtistThumb, strGenre, idArtist } = this.artist;
    return html`
      <div class="card">
        <img
          src=${strArtistThumb || 'https://via.placeholder.com/200'}
          alt=${strArtist} />
        <h3>${strArtist}</h3>
        <p>${strGenre || 'Sin género'}</p>
        <button @click=${() => this.addToFavorites()}>
          ❤️ Añadir a favoritos
        </button>
        <button @click=${() => this.delFromFavorites()}>
          ❌ Quitar de favoritos
        </button>
      </div>
    `;
  }

  addToFavorites() {
    this.dispatchEvent(
      new CustomEvent('add-favorite', {
        detail: this.artist,
        bubbles: true,
        composed: true,
      })
    );
  }
  delFromFavorites() {
    this.dispatchEvent(
      new CustomEvent('del-favorite', {
        detail: this.artist,
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('artist-card', ArtistCard);
