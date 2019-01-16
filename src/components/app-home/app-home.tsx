import { Component } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})
export class AppHome {

  render() {
    return (
      <div class='app-home'>
        <p>
        View the Date/Time picker below!</p>

        <stencil-route-link url='/profile/stencil'>
          <button>
            A page
          </button>
        </stencil-route-link>
      </div>
    );
  }
}
