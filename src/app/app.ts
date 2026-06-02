import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from './services/book.service';
import { Book } from './models/book.model';
import { RankingResultComponent } from './components/ranking/ranking-result.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RankingResultComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly bookService = inject(BookService);

  protected readonly searchQuery = signal('');
  protected readonly books = signal<Book[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly showRankings = signal(false);
  protected readonly rankingA = signal<Book[]>([]);
  protected readonly rankingB = signal<Book[]>([]);
  protected readonly showResult = signal(false);

  protected readonly canAddMoreBooks = computed(() => this.books().length < 10);
  protected readonly canShowRankingButton = computed(() => this.books().length > 5);

  private draggedIndex: number | null = null;

  searchBook(): void {
    const query = this.searchQuery().trim();

    if (!query) {
      this.errorMessage.set('Digite o nome de um livro');
      return;
    }

    if (!this.canAddMoreBooks()) {
      this.errorMessage.set('Limite de 10 livros atingido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.searchBook(query).subscribe({
      next: (book) => {
        this.isLoading.set(false);
        if (book) {
          this.books.update((books) => [...books, book]);
          this.searchQuery.set('');
        } else {
          this.errorMessage.set('Livro não encontrado');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Erro ao buscar livro. Tente novamente.');
      },
    });
  }

  removeBook(index: number): void {
    this.books.update((books) => books.filter((_, i) => i !== index));
  }

  montarRanking(): void {
    const currentBooks = this.books();
    this.rankingA.set([...currentBooks]);
    this.rankingB.set([...currentBooks]);
    this.showRankings.set(true);
  }

  voltarParaBusca(): void {
    this.showRankings.set(false);
    this.showResult.set(false);
  }

  verificarMatch(): void {
    this.showResult.set(true);
  }

  voltarParaRankings(): void {
    this.showResult.set(false);
  }

  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropRankingA(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    if (this.draggedIndex === null || this.draggedIndex === targetIndex) return;

    const items = [...this.rankingA()];
    const [removed] = items.splice(this.draggedIndex, 1);
    items.splice(targetIndex, 0, removed);
    this.rankingA.set(items);
    this.draggedIndex = null;
  }

  onDropRankingB(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    if (this.draggedIndex === null || this.draggedIndex === targetIndex) return;

    const items = [...this.rankingB()];
    const [removed] = items.splice(this.draggedIndex, 1);
    items.splice(targetIndex, 0, removed);
    this.rankingB.set(items);
    this.draggedIndex = null;
  }
}
