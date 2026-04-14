package org.cloud.dto;

import lombok.Data;

@Data
public class Criteria {
	private int pageNum;
	private int amount;
	private int skip;
	
	public Criteria() {
		this(1, 10);
	}

	public Criteria(int pageNum, int amount) {
		this.pageNum = pageNum <= 0 ? 1 : pageNum;
		this.amount = amount;
		this.skip = (this.pageNum -1 ) * amount;
	}
	
	public void setPageNum(int pageNum) {
		if (pageNum <= 0) {
			this.pageNum = 1;
		} else {
			this.pageNum = pageNum;
		}
		this.skip = (this.pageNum -1 ) * amount;
	}
	
	public void setAmount(int amount) {
		this.amount = amount;
		this.skip = (this.pageNum -1 ) * amount;
	}
}




