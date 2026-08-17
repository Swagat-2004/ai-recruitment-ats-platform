package com.ats.ats_platform.auth;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

@Service
public class JwtService {
    
    private final SecretKey secretKey = 
            Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}