package com.pickmen.backend.dto;

import com.google.cloud.Role;
import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.board.model.Reply;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ReplyDto {
	
	private long id;
	
	private String content;
	
	private String nickname;
	
	private String createDateTime;
	
	private Long post_id;
	
	private Long user_id;

	private RoleType role;
	
	
	public static ReplyDto fromEntity(Reply reply) {
		return ReplyDto.builder()
				.id(reply.getId())
				.content(reply.getContent())
				.nickname(reply.getNickname())
				.createDateTime(reply.getCreateDateTime())
				.post_id(reply.getPost().getId())
				.user_id(reply.getUser().getId())
				.role(reply.getUser().getRole())
				.build();
	}
}
