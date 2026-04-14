package org.cloud.mapper;

import java.util.List;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.FileDto;

public interface BoardMapper {

	List<BoardDto> selectBoardList() throws Exception;
	void insertBoard(BoardDto board) throws Exception;
	void insertFileList(List<FileDto> list) throws Exception;
	void updateHitCount(int boardId) throws Exception;
	BoardDto selectDetail(int boardId) throws Exception;
	List<FileDto> selectFileList(int boardId) throws Exception;
	void updateBoard(BoardDto board) throws Exception;
	void deleteBoard(int boardId) throws Exception;
	
	void deleteFile(int fileIdx) throws Exception;
	void deleteFileList(int boardIdx) throws Exception;
	FileDto selectFileInfo(int fileIdx) throws Exception;
	
	List<BoardDto> selectBoardListPaging(Criteria cri) throws Exception;
	int selectBoardTotalCount() throws Exception;
}
