import axios from 'axios';

export interface PdfToWordRes {
  result: number;
}
export function pdfToWord(data: FormData) {
  return axios.post<PdfToWordRes>(`/api/pdfToWord/`, data);
}
