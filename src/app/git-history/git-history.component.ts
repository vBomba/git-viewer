import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { HttpClient } from '@angular/common/http';
import { Commit, GitLink, GitNode } from './interfaces';

@Component({
  selector: 'app-git-history',
  templateUrl: './git-history.component.html',
  styleUrls: ['./git-history.component.scss'],
  standalone: true,
  imports: [CommonModule, BrowserModule, NgxGraphModule],
})
export class GitHistoryComponent {
  nodes: GitNode[] = [];
  links: GitLink[] = [];
  infoContainer?: { position: { x: number; y: number }; label: string };

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<Commit[]>('assets/commits.json').subscribe((commits) => {
      this.buildGraph(commits);
    });
  }

  buildGraph(commits: Commit[]) {
    this.nodes = commits.map((c: any) => ({
      id: c.hash,
      label: '',
      // label: `${c.author}\n${this.getFormattedDate(c.date)}`,
      data: {
        ...c,
        branchColor: this.colorForBranch(c.branch), // визначаємо колір для гілки
      },
    }));

    this.links = this.generateLinksFromGraphStructure(commits); // потрібно реалізувати

    console.log('links', this.links);
    console.log('nodes', this.nodes);
  }

  generateLinksFromGraphStructure(commits: any[]): any[] {
    const links: any[] = [];
    // Створюємо мапу для зберігання хешів комітів та їхніх ID
    const commitMap = new Map<string, any>();

    // Створюємо коміт об'єкти та додаємо їх до мапи
    for (const commit of commits) {
      commitMap.set(commit.hash, {
        id: `${commit.hash}`,
        // label: `${commit.message}\n${commit.author} (${commit.date})`,
        label: `${commit.author} (${commit.date})`,
        source: commit.source || null, // Немає parentHash — це root коміт
        data: commit,
      });
    }

    // Генерація зв'язків між комітами (parent-child)
    for (const [hash, c] of commitMap) {
      if (c.source) {
        links.push({
          id: `id-${hash}`, // Унікальний ID лінку
          source: c.source, // Звідки
          target: c.id, // Куди
          label: c.data.message, // Можна додати підпис
        });
      }
    }

    return links;
  }

  colorForBranch(branch: string): string {
    const colors = [
      '#e6194b',
      '#3cb44b',
      '#ffe119',
      '#4363d8',
      '#f58231',
      '#911eb4',
    ];
    const index = Math.abs(this.hashCode(branch)) % colors.length;
    return colors[index];
  }

  hashCode(str: string): number {
    return (str ?? '')
      .split('')
      .reduce((prev, curr) => prev * 31 + curr.charCodeAt(0), 7);
  }

  getFormattedDate(gitDate: string): string {
    const date = new Date(gitDate);

    // Формат yyyy-mm-dd hh:mm
    const formatted =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0') +
      ' ' +
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0');

    return formatted;
  }

  onNodeSelect(paintedCommit: any): void {
    this.infoContainer = {
      position: paintedCommit.position,
      label: `
      ${paintedCommit.id}<br>${paintedCommit.data.message}<br>${
        paintedCommit.data.author
      }<br>(${this.getFormattedDate(paintedCommit.data.date)})`,
    };
  }
}
