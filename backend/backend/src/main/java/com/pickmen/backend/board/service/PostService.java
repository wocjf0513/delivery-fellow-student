package com.pickmen.backend.board.service;

import com.pickmen.backend.board.model.Post;
import com.pickmen.backend.board.repository.PostRepository;
import com.pickmen.backend.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

  @Autowired private PostRepository postRepository;

  @Transactional
  public Post write(Post post, User user) {
    final Post savedBoard = postRepository.save(post);
    return savedBoard;
  }

  @Transactional(readOnly = true)
  public Page<Post> getPostList(Pageable pageable) {
    return postRepository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Post getPost(long id) {
    return postRepository
        .findById(id)
        .orElseThrow(() -> new IllegalArgumentException("해당 글은 존재하지 않습니다."));
  }

  public void delete(long id) {
    postRepository.deleteById(id);
  }



  @Transactional
  public void update(long id, Post post) {
    Post findBoard = this.getPost(id); // 영속화 완료 (영속화 컨텍스트에 보관)

    // 영속화된 객체를 수정

    // Transactional 에 의해 마지막에 commit 되면서,
    // 영속화 컨텍스트에 위치한 객체가 업데이트 됨 -> 더티 체킹에 의해 flush 됨
  }
}
