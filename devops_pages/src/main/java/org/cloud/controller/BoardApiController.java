package org.cloud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.PageResponse;
import org.cloud.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/boards")
public class BoardApiController {

    @Autowired
    private BoardService boardService;

    // 게시글 목록 + 페이징
    @GetMapping
    public ResponseEntity<Map<String, Object>> getBoardList(@ModelAttribute Criteria cri) throws Exception {
        if (cri.getPageNum() <= 0) {
            cri.setPageNum(1);
        }
        if (cri.getAmount() <= 0) {
            cri.setAmount(10);
        }

        List<BoardDto> list = boardService.selectBoardListPaging(cri);
        int total = boardService.selectBoardTotalCount();

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("pageInfo", new PageResponse(cri, total));

        return ResponseEntity.ok(result);
    }

    // 게시글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardDto> getBoardDetail(@PathVariable("boardId") int boardId) throws Exception {
        BoardDto board = boardService.selectDetail(boardId);

        if (board == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(board);
    }

    // 게시글 등록
    // 파일 업로드가 있으므로 multipart/form-data 기준
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createBoard(
            @ModelAttribute BoardDto board,
            MultipartHttpServletRequest request) throws Exception {

        boardService.insertBoard(board, request);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "게시글 등록 성공");
        result.put("board", board);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // 게시글 수정
    @PutMapping(value = "/{boardId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateBoard(
            @PathVariable("boardId") int boardId,
            @ModelAttribute BoardDto board,
            MultipartHttpServletRequest request) throws Exception {

        BoardDto oldBoard = boardService.selectDetail(boardId);
        if (oldBoard == null) {
            return ResponseEntity.notFound().build();
        }

        board.setBoardId(boardId);
        boardService.updateBoard(board, request);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "게시글 수정 성공");
        result.put("boardId", boardId);

        return ResponseEntity.ok(result);
    }

    // 게시글 삭제
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Map<String, Object>> deleteBoard(@PathVariable("boardId") int boardId) throws Exception {

        BoardDto oldBoard = boardService.selectDetail(boardId);
        if (oldBoard == null) {
            return ResponseEntity.notFound().build();
        }

        boardService.deleteBoard(boardId);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "게시글 삭제 성공");
        result.put("boardId", boardId);

        return ResponseEntity.ok(result);
    }

    // 첨부파일 삭제
    @DeleteMapping("/files/{fileIdx}")
    public ResponseEntity<Map<String, Object>> deleteFile(@PathVariable("fileIdx") int fileIdx) throws Exception {
        Map<String, Object> result = new HashMap<>();

        try {
            boardService.deleteFile(fileIdx);
            result.put("message", "파일 삭제 성공");
            result.put("fileIdx", fileIdx);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("message", "파일 삭제 실패");
            result.put("fileIdx", fileIdx);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}