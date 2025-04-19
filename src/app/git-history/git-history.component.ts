import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-git-history',
  templateUrl: './git-history.component.html',
  styleUrls: ['./git-history.component.css'],
  standalone: true,
  imports: [BrowserModule, NgxGraphModule],
})
export class GitHistoryComponent {
  nodes = [
    { id: 'a1', label: 'Initial Commit' },
    { id: 'b2', label: 'Add feature' },
    { id: 'c3', label: 'Bug fix' },
    { id: 'd4', label: 'New branch' },
    { id: 'e5', label: 'Merge branch' },
  ];

  links = [
    { source: 'a1', target: 'b2' },
    { source: 'b2', target: 'c3' },
    { source: 'b2', target: 'd4' },
    { source: 'c3', target: 'e5' },
    { source: 'd4', target: 'e5' },
  ];
}
