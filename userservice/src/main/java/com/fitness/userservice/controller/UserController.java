package com.fitness.userservice.controller;

import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.security.OwnershipGuard;
import com.fitness.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId,
                                                       @RequestHeader("X-User-ID") String callerUserId) {
        OwnershipGuard.requireSameOwner(userId, callerUserId);
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId,
                                                @RequestHeader("X-User-ID") String callerUserId) {
        OwnershipGuard.requireSameOwner(userId, callerUserId);
        return ResponseEntity.ok(userService.existsById(userId));
    }
}
