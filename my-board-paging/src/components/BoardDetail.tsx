import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { boardApi } from "../api/axiosinstance";
import type { BoardDto, FileDto } from "../types/Board";
import "./BoardDetail.css";

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const [board, setBoard] = useState<BoardDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", contents: "" });
  const [newFiles, setNewFiles] = useState<FileList | null>(null);

  const fetchDetailData = useCallback(async () => {
    try {
      if (!boardId) return;

      const data = await boardApi.getDetail(parseInt(boardId, 10));
      setBoard(data);
      setEditForm({
        title: data.title || "",
        contents: data.contents || "",
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert("데이터를 불러오지 못했습니다.");
      navigate("/");
    }
  }, [boardId, navigate]);

  useEffect(() => {
    fetchDetailData();
  }, [fetchDetailData]);

  const handleEditToggle = () => {
    if (isEditMode) {
      setEditForm({
        title: board?.title || "",
        contents: board?.contents || "",
      });
      setNewFiles(null);
    }
    setIsEditMode((prev) => !prev);
  };

  const handleUpdate = async () => {
    if (!board) return;

    const formData = new FormData();
    formData.append("boardId", String(board.boardId));
    formData.append("title", editForm.title);
    formData.append("contents", editForm.contents);
    formData.append("creatorId", board.creatorId);
    formData.append("updaterId", board.creatorId || "admin");

    if (newFiles && newFiles.length > 0) {
      Array.from(newFiles).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      await boardApi.update(board.boardId, formData);
      alert("수정 완료되었습니다.");
      setNewFiles(null);
      setIsEditMode(false);
      fetchDetailData();
    } catch (error: any) {
      console.error("수정 실패:", error);
      alert(`수정 실패: ${error.response?.data?.message || "서버 통신 오류"}`);
    }
  };

  const handleFileDelete = async (fileIdx: number) => {
    if (!window.confirm("이 파일을 영구적으로 삭제하시겠습니까?")) return;

    try {
      await boardApi.deleteFile(fileIdx);
      fetchDetailData();
    } catch (error) {
      console.error("파일 삭제 실패:", error);
      alert("파일 삭제 실패");
    }
  };

  const handleDelete = async () => {
    if (!board) return;
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await boardApi.delete(board.boardId);
      navigate("/");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 실패");
    }
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
  };

  const getFileUrl = (file: FileDto) => {
    const path = file.storedFilePath || "";
    const normalizedPath = path.replace(/\\/g, "/");

    // 이미 /upload/... 형태로 저장된 경우
    if (normalizedPath.startsWith("/upload/")) {
      return `http://localhost:8080${normalizedPath}`;
    }

    // http:// 또는 https:// 형태로 이미 완전한 URL인 경우
    if (/^https?:\/\//i.test(normalizedPath)) {
      return normalizedPath;
    }

    // C:/upload/파일명 같은 물리 경로로 저장된 경우 파일명만 추출
    const fileName = normalizedPath.substring(
      normalizedPath.lastIndexOf("/") + 1,
    );
    return `http://localhost:8080/upload/${encodeURIComponent(fileName)}`;
  };

  if (!board) {
    return <div className="detail-container">로딩 중...</div>;
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">
        {isEditMode ? "게시글 수정" : "게시글 상세"}
      </h2>

      <div className="detail-header">
        <div className="info-row">
          <span className="info-label">제목</span>
          {isEditMode ? (
            <input
              className="edit-input"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
          ) : (
            <span className="info-value title-text">{board.title}</span>
          )}
        </div>

        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">작성자</span>
            <span className="info-value">{board.creatorId}</span>
          </div>

          <div className="info-row">
            <span className="info-label">조회수</span>
            <span className="info-value">{board.hitCnt}</span>
          </div>

          <div className="info-row">
            <span className="info-label">작성일</span>
            <span className="info-value">{board.createDatetime}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {isEditMode ? (
          <textarea
            className="edit-textarea"
            rows={15}
            value={editForm.contents}
            onChange={(e) =>
              setEditForm({ ...editForm, contents: e.target.value })
            }
          />
        ) : board.contents ? (
          board.contents.split("\n").map((line, i) => (
            <p key={i} style={{ margin: 0, minHeight: "1.2em" }}>
              {line}
            </p>
          ))
        ) : (
          <p style={{ margin: 0 }}>내용이 없습니다.</p>
        )}
      </div>

      <div className="detail-files">
        <h4 className="file-title">첨부파일 목록</h4>

        {board.fileList && board.fileList.length > 0 ? (
          board.fileList.map((file) => {
            const fileUrl = getFileUrl(file);
            const imageFile = isImageFile(file.originalFileName);

            return (
              <div key={file.fileIdx} className="file-item">
                <div className="file-preview-area">
                  {imageFile ? (
                    <>
                      <img
                        src={fileUrl}
                        alt={file.originalFileName}
                        className="file-image-preview"
                      />
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="file-download-link"
                      >
                        {file.originalFileName} (
                        {file.fileSize.toLocaleString()} KB)
                      </a>
                    </>
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="file-download-link"
                    >
                      {file.originalFileName} ({file.fileSize.toLocaleString()}{" "}
                      KB)
                    </a>
                  )}
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    className="btn-file-del"
                    onClick={() => handleFileDelete(file.fileIdx)}
                  >
                    파일삭제
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <span className="no-file">등록된 파일이 없습니다.</span>
        )}

        {isEditMode && (
          <div className="file-add-section">
            <label htmlFor="newFiles">새 파일 추가: </label>
            <input
              id="newFiles"
              type="file"
              multiple
              onChange={(e) => setNewFiles(e.target.files)}
            />
            <p>* 파일을 선택하면 기존 목록에 추가로 저장됩니다.</p>
          </div>
        )}
      </div>

      <div className="detail-btn-area">
        <button className="btn-list" onClick={() => navigate("/")}>
          목록으로
        </button>

        <div className="right-btns">
          {isEditMode ? (
            <>
              <button className="btn-save" onClick={handleUpdate}>
                저장
              </button>
              <button className="btn-cancel" onClick={handleEditToggle}>
                취소
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={handleEditToggle}>
                수정
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
