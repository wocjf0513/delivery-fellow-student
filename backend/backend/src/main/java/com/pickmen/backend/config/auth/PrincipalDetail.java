package com.pickmen.backend.config.auth;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.pickmen.backend.user.model.User;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.ToString;

// 1. Spring Security 가 로그인 요청을 가로채서 로그인을 진행.
// 2. 로그인 완료 후 UserDetails 타입의 객체를 Spring Security ContextHolder (새션 저장소) 에 저장
@Getter
@ToString
public class PrincipalDetail implements UserDetails {

  private User user;

  // Constructor
  public PrincipalDetail() {}

  public PrincipalDetail(User user) {
    this.user = user;
  }

  /**
   * 권한 정보를 가지고 옴
   *
   * @return
   */
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Set<GrantedAuthority> authorities = new HashSet<>();
    authorities.add(() -> user.getRole().toString()); 
    return authorities;
  }

  /**
   * 사용자 password 를 가지고 옴
   *
   * @return String password
   */

   public long getUserId(){
     return user.getId();
   }


   public String getNickName(){
     return user.getNickname();
   }

 
   public String getEmail(){
     return user.getEmail();
   }


  @Override
  public String getPassword() {
    return user.getPassword();
  }

  /**
   * 사용자 username 을 가지고 옴
   *
   * @return String username
   */
  @Override
  public String getUsername() {
    return user.getUsername();
  }

  /**
   * 계정 만료 여부
   *
   * @return
   */
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  /**
   * 계정 잠금 여부
   *
   * @return
   */
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  /**
   * 계정 Credentials 만료 여부
   *
   * @return
   */
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  /**
   * 계정의 활성화/비활성화 여부
   *
   * @return
   */
  @Override
  public boolean isEnabled() {
    return true;
  }
}
