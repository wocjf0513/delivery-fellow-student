package com.pickmen.backend;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.pickmen.backend.Type.RoleType;
import com.pickmen.backend.user.controller.UserApiController;
import com.pickmen.backend.user.model.User;

@Component
public class DemoRunner implements CommandLineRunner {

    @Autowired UserApiController userApiController;

    @Override
    public void run(String... args) {
        System.out.println("CommandLineRunner Args: " + Arrays.toString(args));
        /*try{
        User newUser=new User().builder().username("root").password("1234").email("wocjf0513@ajou.ac.kr").role(RoleType.USER)
            .nickname("administer").build();
            userApiController.signup(newUser);        
        }
        catch(Exception e){
            e.printStackTrace();
        }*/
    }

}