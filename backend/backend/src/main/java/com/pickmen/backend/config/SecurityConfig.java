package com.pickmen.backend.config;

import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.config.auth.PrincipalDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 아래 3개는 보통 한 묶음으로 사용됨
@Configuration // IoC 등록 (빈 설정)
@EnableWebSecurity // 시큐리티 필터가 등록된다 (시큐리티 활성화)
@EnableGlobalMethodSecurity(prePostEnabled = true) // 특정 주소로 접그하면, 권한 및 인증을 미리 체크
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired private PrincipalDetailsService principalDetailsService;

  @Bean // IoC 등록
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Override
  public void configure(WebSecurity web) throws Exception {
    web.ignoring().antMatchers("/resources/**");
  }

  @Bean
  @Override
  protected AuthenticationManager authenticationManager() throws Exception {
    return super.authenticationManager();
  }

  // 시큐리티가 대신 로그인을 할때,
  // password 가 어떤 해시로 암호화됐는지 알아야 DB 값과 비교 가능하므로,
  // 암호화 알고리즘을 알려줌
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(principalDetailsService).passwordEncoder(passwordEncoder());
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf()
        .disable() // csrf 토큰 비활성화 (테스트시)
        .authorizeRequests()
        .antMatchers("/reply/**,review/**")
        .hasAnyRole("USER")
        .anyRequest()
        .permitAll()
        // .antMatchers("/", "/auth/**", "/js/**", "/css/**", "/images/**")
        // .permitAll()
        // // 그 외의 URL은 인증을 해야만 접근 가능
        // .anyRequest()
        // .authenticated()
        .and()
        .formLogin().disable()
        // 로그인 설정
        // .formLogin()
        // //.loginPage("/auth/loginForm") // 로그인 폼 경로
        // .loginProcessingUrl("/auth/loginProc") // 실제 로그인이 이루어지는 경로
        // .successHandler(new loginSuccessHandler())
        // .and()
        // 로그아웃 설정
        .logout()
        .logoutUrl("/logout"); // 로그아웃이 이루어지는 경로
  }
}
