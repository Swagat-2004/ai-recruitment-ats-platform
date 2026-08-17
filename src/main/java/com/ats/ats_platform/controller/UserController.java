package com.ats.ats_platform.controller;

import org.springframework.web.bind.annotation.RestController;
import com.ats.ats_platform.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import com.ats.ats_platform.entity.User;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import com.ats.ats_platform.dto.UserResponse;
import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public UserResponse createUser(@Valid @RequestBody User user) {
        User savedUser = userService.saveUser(user);
    return userService.createUserResponse(savedUser);
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
}
}