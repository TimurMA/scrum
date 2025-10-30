package com.tyuiu.backend.utills;

import com.tyuiu.backend.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {

    private final JwtService jwtService;
    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        return Mono.just(authentication)
                .filter(auth -> auth.getCredentials() != null)
                .map(auth -> {
                    String authToken = auth.getCredentials().toString();
                    String username = jwtService.extractUserName(authToken);

                    if (username != null && jwtService.isTokenValid(authToken)) {


                        UsernamePasswordAuthenticationToken at = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                null
                        );
                        SecurityContextHolder.getContext().setAuthentication(at);
                        return auth;
                    } else {
                        throw new RuntimeException("Invalid token");
                    }
                })
                .onErrorResume(throwable -> Mono.empty());
    }
}