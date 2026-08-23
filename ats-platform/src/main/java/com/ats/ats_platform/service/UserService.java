package com.ats.ats_platform.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ats.ats_platform.repository.UserRepository;
import com.ats.ats_platform.dto.UserResponse;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.exception.EmailAlreadyExistsException;
import java.util.List;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
}

    public User saveUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
}

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
}

    public UserResponse createUserResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
}
   public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::createUserResponse)
            .toList();
}
}
