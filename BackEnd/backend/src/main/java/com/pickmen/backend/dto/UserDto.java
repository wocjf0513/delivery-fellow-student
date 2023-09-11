package com.pickmen.backend.dto;

import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.user.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserDto {
	private long id;
	
	private String nickname;
	
	public static UserDto fromEntity(User user) {
		return UserDto.builder()
				.id(user.getId())
				.nickname(user.getNickname())
				.build();
		}
}
