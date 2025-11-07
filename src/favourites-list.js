import { LitElement, html, css } from 'lit';

class FavoritesList extends LitElement {
  static styles = css`
    h2 {
      margin-top: 2rem;
    }
    ul {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    li {
      background: white;
      margin: 0.5rem 0;
      padding: 0.5rem 1rem;
      border-radius: 6px;
    }
  `;

  static properties = {
    favorites: { type: Array },
  };

  render() {
    return html`
      <h2>❤️ Favoritos</h2>
      <ul>
        ${this.favorites.length === 0
          ? html`<p>No hay artistas favoritos</p>`
          : this.favorites.map(
              (a) => html`
                <artist-card
                  .artist=${a}
                  @add-favorite=${(e) =>
                    this.dispatchEvent(
                      new CustomEvent('add-favorite', { detail: artist }),
                      new CustomEvent('del-favorite', { detail: artist })
                    )}></artist-card>
              `
            )}
      </ul>
    `;
  }
}

customElements.define('favorites-list', FavoritesList);
