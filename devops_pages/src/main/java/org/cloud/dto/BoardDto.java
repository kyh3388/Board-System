package org.cloud.dto;

import java.util.List;

import lombok.Data;

@Data
public class BoardDto {

	private int boardId;
	private String title;
	private String contents;
	private int hitCnt;
	private String createdDatetime;
	private String creatorId;
	private String updatedDatetime;
	private String updaterId;
	private List<FileDto> fileList;
}
