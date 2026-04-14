package org.cloud.dto;

import lombok.Data;

@Data
public class PageResponse {
	private int startPage, endPage, total;
	private boolean prev, next;
	private Criteria cri;
	
	public PageResponse(Criteria cri, int total) {
		super();
		this.cri = cri;
		this.total = total;
		this.endPage = (int)(Math.ceil(cri.getPageNum() / 10.0)) * 10;
		this.startPage = this.endPage - 9;
		int realEnd = (int)(Math.ceil((total * 1.0) / cri.getAmount()));
		
		if(realEnd < this.endPage) {
			this.endPage = realEnd;
		}
		
		this.prev = this.startPage > 1;
		this.next = this.endPage < realEnd;
		
	}
	
	
}
