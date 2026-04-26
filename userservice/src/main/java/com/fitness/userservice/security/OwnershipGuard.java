package com.fitness.userservice.security;

import org.springframework.security.access.AccessDeniedException;

public final class OwnershipGuard {

    private OwnershipGuard() {
    }

    public static void requireSameOwner(String expected, String actual) {
        if (expected == null || !expected.equals(actual)) {
            throw new AccessDeniedException("Access denied");
        }
    }
}
