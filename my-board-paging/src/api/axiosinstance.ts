import axios from "axios";
import type { BoardDto, BoardListResponse, Criteria } from "../types/Board";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/boards",
});

export const boardApi = {
  getList: (cri: Criteria) =>
    instance
      .get<BoardListResponse>("", { params: cri })
      .then((res) => res.data),

  getDetail: (boardId: number) =>
    instance.get<BoardDto>(`/${boardId}`).then((res) => res.data),

  insert: (formData: FormData) =>
    instance.post("", formData).then((res) => res.data),

  update: (boardId: number, formData: FormData) =>
    instance.put(`/${boardId}`, formData).then((res) => res.data),

  delete: (boardId: number) =>
    instance.delete(`/${boardId}`).then((res) => res.data),

  deleteFile: (fileIdx: number) =>
    instance.delete(`/files/${fileIdx}`).then((res) => res.data),
};

export default instance;
