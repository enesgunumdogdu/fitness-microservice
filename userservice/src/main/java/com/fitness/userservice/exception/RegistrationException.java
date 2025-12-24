package com.fitness.userservice.exception;

import lombok.Getter;

@Getter
public class RegistrationException extends RuntimeException {
    private final String errorCode;

    public RegistrationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

