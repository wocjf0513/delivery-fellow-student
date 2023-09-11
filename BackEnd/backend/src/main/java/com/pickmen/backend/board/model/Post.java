package com.pickmen.backend.board.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pickmen.backend.Type.PostStatusType;
import com.pickmen.backend.user.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "post")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;


  @OneToMany(fetch = FetchType.LAZY,
  mappedBy = "postId",
  cascade = {CascadeType.ALL})
  private List<Food> food = new ArrayList<>();

  public void addFood(Food food) {
    if(this.food.size()==2){
      return;
    }
    this.food.add(food);
    food.setPostId(this);
}



  @Column(nullable = false, length = 200)
  private String pickupLocation;

  private String pickUpTime;


  @JsonManagedReference
  @OneToMany(
      // 데이터가 여러개이므로, 가지고 올 때 같이 가지고 오는게 낫지만 (-> LAZY),
      // 반드시 필요하기 때문에 Eager 전략 사용
      fetch = FetchType.LAZY,
      mappedBy = "post",cascade = {CascadeType.ALL}) // FK 가 아님 -> 컬럼을 만들지 말아야 함
  private List<Reply> reply = new ArrayList<>();
  
    public void addReply(Reply reply) {
      this.reply.add(reply);
      reply.setPost(this);
  }

  // Board N : 1 User -> 한명의 유저는 여러개의 게시글을 사용할 수 있으므로..
  @JsonBackReference
  @ManyToOne(fetch = FetchType.EAGER) // 1개밖에 없으므로, 바로 가지고 옴
  @JoinColumn(name = "authorId")
  private User authorId; // 작성이


  private String authorNickName;

 

   // Board N : 1 User -> 한명의 유저는 여러개의 게시글을 사용할 수 있으므로..
   @JsonBackReference
   @OneToOne(fetch = FetchType.EAGER) // 1개밖에 없으므로, 바로 가지고 옴
   @JoinColumn(name = "deliveryId")
   private User deliveryId; // 작성이

   

  @CreationTimestamp 
  private LocalDateTime createDate;

  @Enumerated(EnumType.STRING)
  private PostStatusType postType;


  
}