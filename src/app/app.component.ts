import { Component } from '@angular/core';
import { GitHistoryComponent } from './git-history/git-history.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'git-history-viewer';
}
