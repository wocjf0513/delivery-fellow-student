package com.pickmen.backend.user.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Table(name = "review")
@Data
@ToString  //비정적 변수와 클래스이름을 같이 출력시켜준다. 문자열로
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity // 알아서 MySQL 테이블을 생성
public class Review {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB 설정의 넘버링 전략을 따라감
    private long id;
    
    @Column
    private int rating;

    @Column
    private String content;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "targetId")
    private User targetId;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "authorId")
    private User authorId;

}
