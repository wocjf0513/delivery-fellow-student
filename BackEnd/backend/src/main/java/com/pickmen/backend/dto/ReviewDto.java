package com.pickmen.backend.dto;

import com.pickmen.backend.user.model.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ReviewDto {
	
	private long id;
	private String content;
	private long mentor_id;
	private float rating;

	public static ReviewDto fromEntity(Review review) {
		return ReviewDto.builder()
				.id(review.getId())
				.content(review.getContent())
				.mentor_id(review.getAuthorId().getId())
				.rating(review.getRating())
				.build();
	}
}
