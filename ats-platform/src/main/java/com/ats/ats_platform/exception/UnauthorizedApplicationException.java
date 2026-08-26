package com.ats.ats_platform.exception;

public class UnauthorizedApplicationException extends RuntimeException {

    public UnauthorizedApplicationException(String message) {
        super(message);
    }
}