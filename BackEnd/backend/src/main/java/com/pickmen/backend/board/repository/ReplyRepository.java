package com.pickmen.backend.board.repository;


import java.util.List;

import com.pickmen.backend.board.model.Reply;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    public List<Reply> findAllByPostOrderByCreateDate(long boardId);

    
}
