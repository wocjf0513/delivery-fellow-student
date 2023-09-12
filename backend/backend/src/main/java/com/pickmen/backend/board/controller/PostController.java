package com.pickmen.backend.board.controller;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pickmen.backend.Type.PostStatusType;
import com.pickmen.backend.Type.StatusType;
import com.pickmen.backend.board.model.Food;
import com.pickmen.backend.board.model.Post;
import com.pickmen.backend.board.repository.FoodRepository;
import com.pickmen.backend.board.repository.PostRepository;
import com.pickmen.backend.board.service.PostService;
import com.pickmen.backend.config.auth.PrincipalDetail;
import com.pickmen.backend.dto.ResponseDto;
import com.pickmen.backend.user.model.Review;
import com.pickmen.backend.user.model.User;
import com.pickmen.backend.user.repository.ReviewRepository;
import com.pickmen.backend.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class PostController {

  @Autowired private PostService postService;

  @Autowired private ReviewRepository reviewRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private PostRepository postRepository;

  @Autowired private FoodRepository foodRepository;

  // @AuthenticationPrincipal PrincipalDetail principalDetail
  // 위 코드를 통해 세션에 저장된 사용자 정보를 가져올 수 있다.
  @Transactional
  @GetMapping("/post/getList")
  public @ResponseBody Page<Post> postList(@PageableDefault(size = 5, sort="createDate",direction = Sort.Direction.DESC)Pageable pageable){
    try{
      return postService.getPostList(pageable);
    } catch(Exception e){
      e.printStackTrace();
      return null;
    }
  }
  @Transactional
  @GetMapping("post/getDeliveryId")
  public @ResponseBody ResponseDto<User> deliveryId(@RequestParam("postId") String postId){
    try {
      System.out.println(postRepository.findById(Long.parseLong(postId)).get().getDeliveryId().getId());
      return new ResponseDto<User>(HttpStatus.OK.value(),postRepository.findById(Long.parseLong(postId)).get().getDeliveryId());
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<User>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
    }
  }
  @GetMapping("post/getByUser")
  public @ResponseBody Page<Post> myPost(@RequestParam("user_id") String user_id ,@PageableDefault(size = 5, sort="createDate",direction = Sort.Direction.DESC)Pageable pageable){
    try {
      return postRepository.findByAuthorId(Long.parseLong(user_id), pageable);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
  @GetMapping("post/get/{post_id}")
  public @ResponseBody ResponseDto<Post> postList(@PathVariable Long post_id){
    try {
      return new ResponseDto<Post>(HttpStatus.OK.value(),postRepository.findById(post_id).get());
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseDto<Post>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
    }
  }
  @Transactional
  @GetMapping("post/delivery")
  public @ResponseBody ResponseDto<String> postDelivery(@AuthenticationPrincipal PrincipalDetail principalDetail, @RequestParam("postId") String postId){
    try{
      Post getPost=postRepository.getById(Long.parseLong(postId));
      System.out.println(postId);
      getPost.setPostType(PostStatusType.DELIVERY);
      if(principalDetail.getUser().getStatus()==StatusType.DELIVERY || principalDetail.getUser().getStatus() == StatusType.WRITE){
        return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),principalDetail.getUser().getStatus().toString());
      }
      getPost.setDeliveryId(principalDetail.getUser());
      principalDetail.getUser().setStatus(StatusType.DELIVERY);
      postRepository.save(getPost);
      userRepository.save(principalDetail.getUser());
      return new ResponseDto<>(HttpStatus.OK.value(),null);
    }
    catch(Exception e){
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
  }
}
@Transactional
@GetMapping("post/addReview")
public @ResponseBody ResponseDto<User> userReview(@AuthenticationPrincipal PrincipalDetail principalDetail ,@RequestParam("deliveryId") String deliveryId, @RequestParam("content") String content, @RequestParam("rating") int rating) {
  try {
    long delivery=Long.parseLong(deliveryId);
    User deliveryMan=userRepository.getById(delivery);
    Review newReview=new Review().builder().content(content).rating(rating).targetId(deliveryMan).build();
    principalDetail.getUser().addReview(newReview);
    reviewRepository.save(newReview);
    userRepository.save(deliveryMan);
    return new ResponseDto<>(HttpStatus.OK.value(), null);
  } catch (Exception e) {
    e.printStackTrace();
    return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
  }
}
  @Transactional
  @GetMapping("post/delete")
  public @ResponseBody ResponseDto<Post> postDelete(@RequestParam(required = true, name = "postId" ) String post_id, @AuthenticationPrincipal PrincipalDetail principalDetail){
    try{
      long postId=Long.parseLong(post_id);
      Post post=postRepository.findById(postId).get();
      User author=userRepository.findById(post.getAuthorId().getId()).get();
      author.setStatus(StatusType.NORMAL);
      post.setPostType(PostStatusType.TERMINATE);
      userRepository.save(author);
      postRepository.save(post);
    
      User delivery=userRepository.findById(post.getDeliveryId().getId()).get();
      delivery.setStatus(StatusType.NORMAL);
      userRepository.save(delivery);

    //Post post=postService.getPost(post_id);
    //if(post.getAuthorId().getId()==principalDetail.getUserId()){
  
      //postService.delete(postId);
      return new ResponseDto<>(HttpStatus.OK.value(),null);
    //}
    //else{
    //  return "삭제 실패";
    //}
    }
    catch(Exception e){
      e.printStackTrace();
      return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
    }
  }

     
  
  @Transactional
  @GetMapping("/post/write")
  public @ResponseBody ResponseDto<String> postReply(@AuthenticationPrincipal PrincipalDetail principalDetail, Post post,
   @RequestParam("priFoodName") String prifoodname,@RequestParam("subFoodName") String subfoodname,
    @RequestParam("priFoodPrice") String prifoodprice, @RequestParam("subFoodPrice") String subfoodprice, 
    @RequestParam("priFooodLocation") String prifoodlocation, @RequestParam("subFoodLocation") String subfoodlocation){
      try {
        Post newPost=null;
          if(principalDetail.getUser().getStatus()==StatusType.NORMAL){
            Food priFood=new Food().builder().foodname(prifoodname).foodprice(prifoodprice)
            .foodlocation(prifoodlocation).build();
   

            Food subFood=new Food().builder().foodname(subfoodname).foodprice(subfoodprice)
            .foodlocation(subfoodlocation).build();
          
            foodRepository.save(priFood);
            foodRepository.save(subFood);
            newPost=new Post().builder().authorId(principalDetail.getUser())
           .pickUpTime(post.getPickUpTime()).pickupLocation(post.getPickupLocation()).postType(PostStatusType.WAIT).food(new ArrayList<Food>()).build();
            System.out.print(priFood.getFoodname());
            System.out.println(priFood.getFoodlocation());
            newPost.addFood(priFood);
            newPost.addFood(subFood);
            
            User author=principalDetail.getUser();
            newPost.setAuthorNickName(author.getNickname());
            author.setStatus(StatusType.WRITE);
            userRepository.save(principalDetail.getUser());
          } else {
              return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),principalDetail.getUser().getStatus().toString());
          }

        
          postRepository.save(newPost);
          return new ResponseDto<>(HttpStatus.OK.value(),StatusType.NORMAL.toString());

           } catch (Exception e) {
          e.printStackTrace();
          
          return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
      }
  } 


  
  @PostMapping("post/update/{post_id}")
  public String postUpdate(@PathVariable Long post_id,Post board,@AuthenticationPrincipal PrincipalDetail principalDetail){
    try{
    postService.update(post_id, board);
    return "수정 완료";
    }
    catch(Exception e){
      e.printStackTrace();
      return "수정 실패";
    }
  }


}