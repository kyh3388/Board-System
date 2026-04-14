package org.cloud.controller;

import java.util.List;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.PageResponse;
import org.cloud.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
@RequestMapping("/board") //localhost:8080/board/openBoardList.do
public class BoardController {

	@Autowired
	private BoardService boardService;
	
	@GetMapping("/openBoardList.do")
	public String openBoardList(Model model, Criteria cri) throws Exception {
		//List<BoardDto> list = boardService.selectBoardList();
		if (cri.getPageNum() <= 0) {
			cri.setPageNum(1);
		}
		if (cri.getAmount() <= 0) {
			cri.setAmount(10);
		}
		
		List<BoardDto> list = boardService.selectBoardListPaging(cri);
		model.addAttribute("list", list);
		
		int total = boardService.selectBoardTotalCount();
		//int total = 500;
		model.addAttribute("pageMaker", new PageResponse(cri, total));
		return "board/boardList";
	}
	
	@GetMapping("/openBoardWrite.do")
	public String openBoardWrite() {
		return "board/boardWrite";
	}
	
	@PostMapping("/insertBoard.do") //localhost:8080/board/insertBoard.do
	public String insertBoard(BoardDto board, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception {
		boardService.insertBoard(board, multipartHttpServletRequest);
		return "redirect:/board/openBoardList.do";
	}
	
	@GetMapping("/openBoardDetail.do")
	public String openBoardDetail(@RequestParam("boardId") int boardId, Model model, @ModelAttribute("cri") Criteria cri) throws Exception {
		BoardDto board = boardService.selectDetail(boardId);
		model.addAttribute("board", board);
		return "board/boardDetail";
	}
	
	@PostMapping("/updateBoard.do")
	public String updateBoard(BoardDto board, MultipartHttpServletRequest request, Criteria cri) throws Exception {
		boardService.updateBoard(board, request);
		return "redirect:/board/openBoardList.do?pageNum=" + cri.getPageNum();
	}
	
	@PostMapping("/deleteBoard.do")
	public String deleteBoard(@RequestParam("boardId") int boardId) throws Exception {
		boardService.deleteBoard(boardId);
		return "redirect:/board/openBoardList.do";
	}
	
	@PostMapping("/deleteFile.do")
	@ResponseBody
	public String deleteFile(@RequestParam("fileIdx") int fileIdx) throws Exception {
		try {
			boardService.deleteFile(fileIdx);
			return "success";
		} catch (Exception e) {
			// TODO: handle exception
			return "fail";
		}
	}
}






