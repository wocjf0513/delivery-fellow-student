package com.pickmen.backend.board.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import com.pickmen.backend.board.model.Post;
import com.pickmen.backend.board.model.Reply;
import com.pickmen.backend.board.repository.PostRepository;
import com.pickmen.backend.board.repository.ReplyRepository;
import com.pickmen.backend.config.auth.PrincipalDetail;
import com.pickmen.backend.dto.ReplyDto;
import com.pickmen.backend.dto.ResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class ReplyController {

    @Autowired
    private ReplyRepository replyRepository;
    
    @Autowired
    private PostRepository postRepository;


    @Transactional
    @PostMapping("/reply/update/{reply_id}")
    public ResponseDto<Reply> updateReply(@PathVariable long reply_id, String content){

        try {
            Reply reply=replyRepository.findById(reply_id).get();
            reply.setContent(content);

            
            
        return new ResponseDto<Reply>(HttpStatus.OK.value(),null);
             } catch (Exception e) {
            e.printStackTrace();
            
            return new ResponseDto<Reply>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
       

        }
    } 

    @Transactional
    @GetMapping("/reply/get/{reply_id}")
    public ResponseDto<List<ReplyDto>> getReply(@PathVariable long reply_id){
        try {
            List<Reply> replylist=postRepository.getById(reply_id).getReply();
            List<ReplyDto> replyDtoList = new ArrayList<>();

            for(Reply reply:replylist){
                LocalDateTime localDateTime=reply.getCreateDate();
                if(reply.getCreateDateTime()!=""){
                reply.setCreateDateTime(localDateTime.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH:mm")));
                }
                replyDtoList.add(ReplyDto.fromEntity(reply));
            }
            
            
            return new ResponseDto<List<ReplyDto>>(HttpStatus.OK.value(), replyDtoList);
             } catch (Exception e) {
            e.printStackTrace();
            return new ResponseDto<List<ReplyDto>>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
        }
    } 


    @Transactional
    @PostMapping("/reply/delete/{reply_id}")
    public ResponseDto<Reply> deleteReply(@PathVariable long reply_id){

        try {
            List<Reply> list=replyRepository.getById(reply_id).getPost().getReply();
            Reply removeReply=new Reply();
            for(Reply reply:list){
                //System.out.println(reply.getId());
                if(reply.getId()==reply_id)
                {
                    removeReply=reply;
                    break;
                }
            }
            list.remove(removeReply);

          
            replyRepository.delete(replyRepository.findById(reply_id).get());



            
        return new ResponseDto<Reply>(HttpStatus.OK.value(),null);
             } catch (Exception e) {
            e.printStackTrace();
            
            return new ResponseDto<Reply>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
       

        }
    } 

    

    @Transactional
    @GetMapping("/reply/write")
    public @ResponseBody ResponseDto<Reply> postReply(@RequestParam("post_id") long post_id, @AuthenticationPrincipal PrincipalDetail principalDetail, String content){

        try {
            Post post=postRepository.getById(post_id);
            //Reply reply=new Reply().builder().content(content).nickname(principalDetail.getNickName()).user(principalDetail.getUser()).build();
            Reply reply=new Reply().builder().nickname(principalDetail.getNickName()).user(principalDetail.getUser()).content(content).post(post).build();
            post.addReply(reply);
            
        return new ResponseDto<Reply>(HttpStatus.OK.value(),null);
             } catch (Exception e) {
            e.printStackTrace();
            
            return new ResponseDto<Reply>(HttpStatus.INTERNAL_SERVER_ERROR.value(),null);
       
        }
    } 

    
 
}