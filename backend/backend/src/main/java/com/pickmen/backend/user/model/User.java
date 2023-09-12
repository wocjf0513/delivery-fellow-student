package com.pickmen.backend.user.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.boot.context.properties.bind.DefaultValue;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.Type.StatusType;
import com.pickmen.backend.board.model.Post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// ORM -> 오브젝트를 테이블로 매핑해주는 역할
// JPA 는 Java의 ORM

@Table(name = "user")
@Data
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
// @DynamicInsert // null 값은 빼고 SQL문을 만든다
@Entity // 알아서 MySQL 테이블을 생성
public class User {

  @Id // PK
  @GeneratedValue(strategy = GenerationType.IDENTITY) // DB 설정의 넘버링 전략을 따라감
  private long id; // 시퀀스

  @Column(nullable = false, length = 30, unique = true)
  private String username; // 사용자 ID

  @Column(nullable = false, length = 100)
  private String password; // 비밀번호

  @Column(nullable = false, length = 50)
  private String email; // 이메일

  // @ColumnDefault("'USER'") -> 별로 안좋음
  @Enumerated(EnumType.STRING) // DB 는 RoleType 이 없기 때문에 String 타입이라고 알려줘야 함
  private RoleType role; // ENUM을 쓰는것이 좋다.

  @JsonManagedReference
  @OneToMany(
      fetch = FetchType.EAGER,
      mappedBy = "authorId",cascade = {CascadeType.ALL}) 
  private List<Post> postId;

  public boolean addPost(Post post){
    try{
    postId.add(post);
    post.setAuthorId(this);
    }
    catch(Exception e){
      e.printStackTrace();
      return false;
    }
    return true;
  }

  @Enumerated(EnumType.STRING)
  private StatusType status;
  

  @CreationTimestamp // Insert 할때 자동으로 날짜가 들어감
  @Column(nullable = false)
  private LocalDateTime createDate; // 생성일

   @Column(nullable= true)
   private String nickname;

   @Column(nullable = true)
   private long averageRating=3;
   
   @JsonManagedReference
   @OneToMany( fetch = FetchType.LAZY,
   mappedBy = "targetId", cascade = CascadeType.ALL)
   private List<Review> reviews=new ArrayList<>();

   public void addReview(Review review){
    reviews.add(review);
    review.setAuthorId(this);

   }

}
