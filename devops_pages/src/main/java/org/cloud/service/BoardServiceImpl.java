package org.cloud.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.FileDto;
import org.cloud.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	private BoardMapper boardMapper;
	
	@Override
	public List<BoardDto> selectBoardList() throws Exception {
		// TODO Auto-generated method stub
		return boardMapper.selectBoardList();
	}
	
	@Override
	public void insertBoard(BoardDto board, MultipartHttpServletRequest request) throws Exception {
		// TODO Auto-generated method stub
		boardMapper.insertBoard(board); 
		saveFiles(board, request);
	}
	
	@Override
	public BoardDto selectDetail(int boardId) throws Exception {
		// TODO Auto-generated method stub
		boardMapper.updateHitCount(boardId);
		BoardDto board = boardMapper.selectDetail(boardId);
		List<FileDto> fileList = boardMapper.selectFileList(boardId);
		board.setFileList(fileList);
		return board;
	}
	
	@Override
	public void updateBoard(BoardDto board, MultipartHttpServletRequest request) throws Exception {
		// TODO Auto-generated method stub
		boardMapper.updateBoard(board);
		saveFiles(board, request);
	}
	
	@Override
	public void deleteBoard(int boardId) throws Exception {
		// TODO Auto-generated method stub
		
		List<FileDto> fileList = boardMapper.selectFileList(boardId);
		
		for (FileDto file : fileList) {
			File physicalFile = new File(file.getStoredFilePath());
			if (physicalFile.exists()) {
				physicalFile.delete();
			}
		}
		boardMapper.deleteFileList(boardId);
		boardMapper.deleteBoard(boardId);
	}
	
	@Override
	public void deleteFile(int fileIdx) throws Exception {
		// TODO Auto-generated method stub
		FileDto file = boardMapper.selectFileInfo(fileIdx);
		if (file != null) {
			File physicalFile = new File(file.getStoredFilePath());
			if(physicalFile.exists()) {
				physicalFile.delete();
			}
		}
		
		boardMapper.deleteFile(fileIdx);
	}
	
	private void saveFiles(BoardDto board, MultipartHttpServletRequest request) throws Exception {
		if (ObjectUtils.isEmpty(request)) {
			return;
		}
		
		List<FileDto> fileList = new ArrayList<FileDto>();
		String path = "C:/upload/";
		File dir = new File(path);
		
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		Iterator<String> iterator = request.getFileNames();
		while (iterator.hasNext()) {
			List<MultipartFile> list = request.getFiles(iterator.next());
			
			for (MultipartFile mFile : list) {
				if (!mFile.isEmpty()) {
					String saveName = System.currentTimeMillis() + "_" + mFile.getOriginalFilename();
					mFile.transferTo(new File(path + saveName));
					
					FileDto fileDto = new FileDto();
					fileDto.setBoardId(board.getBoardId());
					fileDto.setFileSize(mFile.getSize());
					fileDto.setOriginalFileName(mFile.getOriginalFilename());
					fileDto.setStoredFilePath(path + saveName);
					fileDto.setCreatorId(board.getCreatorId());
					fileList.add(fileDto);
				}
			}
		}
		
		if (fileList.size() > 0) {
			boardMapper.insertFileList(fileList);
		}
	}
	
	@Override
	public List<BoardDto> selectBoardListPaging(Criteria cri) throws Exception {
		// TODO Auto-generated method stub
		return boardMapper.selectBoardListPaging(cri);
	}
	
	@Override
	public int selectBoardTotalCount() throws Exception {
		// TODO Auto-generated method stub
		return boardMapper.selectBoardTotalCount();
	}
}





