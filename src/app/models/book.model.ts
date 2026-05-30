export interface Book {
  id: string;
  title: string;
  thumbnail: string;
}

export interface GoogleBooksApiResponse {
  totalItems: number;
  items?: GoogleBookItem[];
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}
