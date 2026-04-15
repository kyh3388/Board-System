export interface FileDto {
  fileIdx: number;
  boardId: number;
  originalFileName: string;
  storedFilePath: string;
  fileSize: number;
  creatorId: string;
}

export interface BoardDto {
  boardId: number;
  title: string;
  contents: string;
  hitCnt: number;
  createDatetime: string;
  creatorId: string;
  updatedDatetime: string;
  updaterId: string;
  fileList: FileDto[];
}

export class Criteria {
  pageNum: number;
  amount: number;
  skip: number;

  constructor(pageNum: number = 1, amount: number = 10) {
    this.pageNum = pageNum <= 0 ? 1 : pageNum;
    this.amount = amount;
    this.skip = (this.pageNum - 1) * amount;
  }

  setPage(page: number) {
    this.pageNum = page <= 0 ? 1 : page;
    this.skip = (this.pageNum - 1) * this.amount;
  }
}

export interface PageResponse {
  startPage: number;
  endPage: number;
  total: number;
  prev: boolean;
  next: boolean;
  cri: Criteria;
}

export interface BoardListResponse {
  list: BoardDto[];
  pageMarker: PageResponse;
}
