import { LitElement, html, css } from 'lit';
import './artist-search.js';
import './favourites-list.js';

export class AppRoot extends LitElement {
  static styles = css`
    h1 {
      text-align: center;
    }
  `;

  static properties = {
    favorites: { type: Array },
  };

  constructor() {
    super();
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  addFavorite(artist) {
    if (!this.favorites.find((a) => a.idArtist === artist.idArtist)) {
      this.favorites = [...this.favorites, artist];
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }

  delFavorite(artist) {
    console.log(artist);
    this.favorites = this.favorites.filter(
      (a) => a.idArtist !== artist.idArtist
    );
    console.log(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  render() {
    return html`
      <h1>Buscador de Artistas</h1>
      <artist-search
        @add-favorite=${(e) => this.addFavorite(e.detail)}></artist-search>
      <favorites-list
        .favorites=${this.favorites}
        @del-favorite=${(e) => this.delFavorite(e.detail)}></favorites-list>
    `;
  }
}
customElements.define('app-root', AppRoot);
