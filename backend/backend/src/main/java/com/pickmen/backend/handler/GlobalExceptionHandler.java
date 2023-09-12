package com.pickmen.backend.handler;

import com.pickmen.backend.dto.ResponseDto;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class GlobalExceptionHandler {

  @ExceptionHandler(value = Exception.class)
  public ResponseDto<String> exceptionHandler(Exception e) {
    return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
  }

  @ExceptionHandler(value = IllegalArgumentException.class)
  public ResponseDto<String> handleIllegalArgumentException(IllegalArgumentException e) {
    return new ResponseDto<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
  }
}
