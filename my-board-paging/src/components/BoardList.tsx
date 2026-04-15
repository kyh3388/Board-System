import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { boardApi } from "../api/axiosinstance";
import { Criteria } from "../types/Board";
import type { BoardDto, PageResponse } from "../types/Board";
import "./BoardList.css";

const BoardList: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<BoardDto[]>([]);
  const [pageMarker, setPageMarker] = useState<PageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBoardList = useCallback(async (pageNum: number) => {
    try {
      const searchParams = new Criteria(pageNum, 10);
      //const searchParams = { pageNum: pageNum, amount: 10 };
      const data = await boardApi.getList(searchParams as any);

      console.log("서버 응답: ", data);

      setList(data.list);
      setPageMarker(data.pageMarker);
    } catch (error) {
      console.error("데이터 로딩 실패: ", error);
    }
  }, []);

  useEffect(() => {
    fetchBoardList(currentPage);
  }, [currentPage, fetchBoardList]);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  if (!pageMarker) {
    return <div className="list-container">로딩 중...</div>;
  }

  const pageNumbers = [];
  for (let i = pageMarker.startPage; i <= pageMarker.endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="list-container">
      <h2 className="list-title">게시판 목록</h2>
      <table className="board-table">
        <thead>
          <tr>
            <th className="th-num">번호</th>
            <th className="th-title">제목</th>
            <th className="th-writer">작성자</th>
            <th className="th-hit">조회수</th>
            <th className="th-date">작성일</th>
          </tr>
        </thead>
        <tbody>
          {list && list.length > 0 ? (
            list.map((board) => (
              <tr
                key={board.boardId}
                onClick={() => navigate(`/detail/${board.boardId}`)}
              >
                <td>{board.boardId}</td>
                <td className="td-subject">
                  <Link
                    to={`/detail/${board.boardId}`}
                    className="title-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {board.title}
                  </Link>
                  {board.fileList && board.fileList.length > 0 && (
                    <span className="file-icon"></span>
                  )}
                </td>
                <td>{board.creatorId}</td>
                <td>{board.hitCnt}</td>
                <td>{board.createDatetime?.substring(0, 10)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-data">
                등록된 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {pageMarker.prev && (
          <button
            className="page-btn prev"
            onClick={() => handlePageChange(pageMarker.startPage - 1)}
          >
            이전
          </button>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`page-btn ${pageMarker.cri.pageNum === num ? "active" : ""}`}
            onClick={() => handlePageChange(num)}
          >
            {num}
          </button>
        ))}

        {pageMarker.next && (
          <button
            className="page-btn next"
            onClick={() => handlePageChange(pageMarker.endPage + 1)}
          >
            다음
          </button>
        )}
      </div>

      <div className="btn-area">
        <button className="btn-write" onClick={() => navigate("/write")}>
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default BoardList;
