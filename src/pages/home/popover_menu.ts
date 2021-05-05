import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

// dropdown menu
@Component({
  template: `
      <ion-list>
        <button ion-item (tap)="go_to('m_info')">Info</button>
        <button ion-item (tap)="go_to('m_demo')">Demo</button>
        <button ion-item (tap)="go_to('m_prevs')">Results</button>
      </ion-list>
    `
})
export class PopoverItems {
  constructor(public viewCtrl: ViewController) { }
  go_to(m_name) {
    this.viewCtrl.dismiss(m_name);
  }
}
