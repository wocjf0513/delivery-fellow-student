package com.pickmen.backend.config.auth;

import java.util.Optional;

import com.pickmen.backend.user.model.User;
import com.pickmen.backend.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PrincipalDetailsService implements UserDetailsService {

  @Autowired private UserRepository userRepository;

  // 시큐리티에 의해 username, password 를 가로채지만,
  // username 만 처리하면 됨 (password 는 시큐리티가 알아서 처리해줌)
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    log.info("[PrincipalDetailsService] Compare account.");
    Optional<User> optionalUser = userRepository.findByUsername(username);
    System.out.println("Hello");
    final User principal =
        optionalUser
            // 계정이 없으면 Exception 발생
            .orElseThrow(
            () -> new UsernameNotFoundException("Not found user. username: " + username));

    // context holder 에 세션이 저장됨

    return new PrincipalDetail(principal);
  }
}
