package com.pickmen.backend.user.controller;
import java.util.*;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.Type.StatusType;
import com.pickmen.backend.config.auth.PrincipalDetail;
import com.pickmen.backend.config.auth.PrincipalDetailsService;
import com.pickmen.backend.dto.ResponseDto;
import com.pickmen.backend.user.model.Review;
import com.pickmen.backend.user.model.User;
import com.pickmen.backend.user.repository.ReviewRepository;
import com.pickmen.backend.user.repository.UserRepository;
import com.pickmen.backend.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class UserApiController {

  @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired private UserService userService;

  @Autowired private PrincipalDetailsService principalDetailsService;

  @Autowired private UserRepository userRepository;

  @Autowired private ReviewRepository reviewRepository;

  @PostMapping("/user/login")
  public @ResponseBody ResponseDto<User> login(@RequestParam("username") String username, @RequestParam("password") String password)
  {
    try {
      UserDetails userDetails=principalDetailsService.loadUserByUsername(username);

 
      if(bCryptPasswordEncoder.matches(password, userDetails.getPassword())){
        Authentication authentication=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return new ResponseDto<>(HttpStatus.OK.value(),userRepository.findByUsername(userDetails.getUsername()).get());
      }
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
     catch (NullPointerException e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/user/checkDuplicateNickName")
  public @ResponseBody ResponseDto<Integer> duplicateCheck(@RequestParam("nickname")String nickname) {
    try {
      if(userRepository.findByNickname(nickname).isEmpty()) {
        System.out.println("중복되지 않음");
      return new ResponseDto<>(HttpStatus.OK.value(), null);
      }
      else
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    } catch (Exception e) {
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }
  @GetMapping("/user/checkDuplicateId")
  public @ResponseBody ResponseDto<Integer> duplicateCheckId(@RequestParam("username")String username) {
    try {
      if(userRepository.findByUsername(username).isEmpty()) {
        System.out.println("중복되지 않음");
      return new ResponseDto<>(HttpStatus.OK.value(), null);
      }
      else
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    } catch (Exception e) {
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }

  @GetMapping("/user/getUser")
  public @ResponseBody ResponseDto<String> getUser(@AuthenticationPrincipal PrincipalDetail principalDetail){
    User user=userRepository.getById(principalDetail.getUser().getId());
    if(user==null){
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
    else{
      System.out.println(principalDetail.getUser());
      return new ResponseDto<>(HttpStatus.OK.value(), user.getStatus().toString());
    }

  }


  @GetMapping("/user/signup")
  public @ResponseBody ResponseDto<User> signup(User user)
   {
     User newuser=new User();
     newuser.setUsername(user.getEmail());
     newuser.setPassword(user.getPassword());
     newuser.setNickname(user.getNickname());
     newuser.setAverageRating(3);
     newuser.setEmail(user.getEmail());
     newuser.setRole(RoleType.USER);
     newuser.setStatus(StatusType.NORMAL);  
    try {
      return new ResponseDto<>(HttpStatus.OK.value(), userService.join(newuser));
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
    }
  }  
}


