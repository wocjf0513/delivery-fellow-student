package com.pickmen.backend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pickmen.backend.board.model.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    
}
