import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { boardApi } from "../api/axiosinstance";
import "./BoardWrite.css";

const BoardWrite: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState({
    title: "",
    contents: "",
    creatorId: "",
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!board.title.trim() || !board.contents.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", board.title);
    formData.append("contents", board.contents);
    formData.append("creatorId", board.creatorId);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      await boardApi.insert(formData);
      alert("게시글이 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="write-container">
      <h2 className="write-title">글 쓰기</h2>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
            value={board.title}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="creatorId">작성자</label>
          <input
            type="text"
            id="creatorId"
            name="creatorId"
            placeholder="작성자 이름을 입력하세요"
            value={board.creatorId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contents">내용</label>
          <textarea
            id="contents"
            name="contents"
            placeholder="내용을 입력하세요"
            rows={15}
            value={board.contents}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="files">파일 첨부</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
          <p className="file-info">* 여러 파일을 선택할 수 있습니다.</p>
        </div>

        <div className="write-btn-area">
          <button type="submit" className="btn-save">
            저장하기
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWrite;
