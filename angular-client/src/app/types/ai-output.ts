export class AIOutput {
  keyword: string;
  details: string;
  constructor(keyword: string, details: string) {
    this.keyword = keyword ?? '';
    this.details = details ?? '';
  }
}
