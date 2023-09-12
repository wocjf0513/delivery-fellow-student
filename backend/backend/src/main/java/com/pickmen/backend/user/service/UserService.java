package com.pickmen.backend.user.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pickmen.backend.user.model.User;
import com.pickmen.backend.user.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	/*
	 * @Transactional
	 * public User join(User user) {
	 * user.setPassword(passwordEncoder.encode(user.getPassword()));
	 * user.setRole(user.getRole());
	 * return userRepository.save(user);
	 * }
	 */

	// lectureList 넣어서 Test하는 회원가입 api - 테스트 완료
	@Transactional
	public User join(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setRole(user.getRole());

		User saveUser = userRepository.save(user);

		return saveUser;
	}

	@Transactional(readOnly = true) // select 할때 트랜잭션 시작, 서비스 종료 후 트랜잭션 종료
	public User login(User user) {
		Optional<User> optionalUser = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
		return optionalUser.orElseThrow(() -> new RuntimeException("Not found user"));
	}

	@Transactional
	public User updateUser(User user) {
		Optional<User> optionalUser = userRepository.findById(user.getId());
		User findUser = optionalUser.orElseThrow(() -> new UsernameNotFoundException("해당 사용자는 없습니다."));

		/*if (null != user.getPassword() && !"".equals(user.getPassword())) {
			findUser.setPassword(passwordEncoder.encode(user.getPassword()));
		}*/
		// if (null != user.getEmail() && !"".equals(user.getEmail())) {
		// System.out.println("hello");
		// findUser.setEmail(user.getEmail());
		// }
		// 이메일 수정은 안됨
		
		// 닉네임 수정
		if (user.getNickname() != null) {
			findUser.setNickname(user.getNickname());
		}
		
		// 관심 분야 변경
		return userRepository.save(findUser); 
	}

	


}
