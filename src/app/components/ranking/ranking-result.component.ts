import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-ranking-result',
  templateUrl: './ranking-result.component.html',
  styleUrls: ['./ranking-result.component.css'],
})
export class RankingResultComponent implements OnChanges {
  @Input() books: Book[] = [];
  @Input() rankingA: Book[] = [];
  @Input() rankingB: Book[] = [];

  protected inversionsA = 0;
  protected inversionsB = 0;
  protected matchMessage = '';

  private bookIndexMap: Map<string, number> = new Map();

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['books'] || changes['rankingA'] || changes['rankingB']) && this.books.length > 0) {
      this.createBookIndexMap();
      this.calculateResults();
    }
  }

  private createBookIndexMap(): void {
    this.bookIndexMap.clear();
    this.books.forEach((book, index) => {
      this.bookIndexMap.set(book.id, index);
    });
  }

  private calculateResults(): void {
    const rankingAIndices = this.rankingA.map((book) => this.bookIndexMap.get(book.id) as number);
    const rankingBIndices = this.rankingB.map((book) => this.bookIndexMap.get(book.id) as number);

    this.inversionsA = this.countInversions([...rankingAIndices]);
    this.inversionsB = this.countInversions([...rankingBIndices]);

    if (this.inversionsA === this.inversionsB) {
      this.matchMessage = 'Deu match! O número de inversões é o mesmo.';
    } else {
      this.matchMessage = 'Não deu match! O número de inversões é diferente.';
    }
  }

  private countInversions(arr: number[]): number {
    if (arr.length <= 1) {
      return 0;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    let inversions = this.countInversions(left) + this.countInversions(right);

    const merged = this.mergeAndCount(left, right);
    
    for(let i = 0; i < arr.length; i++) {
        arr[i] = merged.arr[i];
    }

    return inversions + merged.inversions;
  }

  private mergeAndCount(left: number[], right: number[]): { arr: number[], inversions: number } {
    const merged: number[] = [];
    let inversions = 0;
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
        inversions += left.length - i;
      }
    }

    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }

    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    return { arr: merged, inversions };
  }
}
