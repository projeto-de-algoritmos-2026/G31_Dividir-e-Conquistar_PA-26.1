import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book, GoogleBooksApiResponse } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  searchBook(query: string): Observable<Book | null> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=1&key=AIzaSyCYGuNP_l9K7npWBSFi9DndI9F1M6YYvYs`;

    return this.http.get<GoogleBooksApiResponse>(url).pipe(
      map((response) => {
        if (response.totalItems === 0 || !response.items?.length) {
          return null;
        }

        const item = response.items[0];
        return {
          id: item.id,
          title: item.volumeInfo.title,
          thumbnail:
            item.volumeInfo.imageLinks?.thumbnail ||
            item.volumeInfo.imageLinks?.smallThumbnail ||
            'https://via.placeholder.com/128x192?text=Sem+Capa',
        };
      })
    );
  }
}
