package com.tyuiu.backend.utills;

import com.tyuiu.backend.services.JwtService;
import com.tyuiu.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String HEADER_NAME = "Authorization";
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HEADER_NAME);

        if (!StringUtils.hasLength(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            return chain.filter(exchange);
        }

        String jwt = authHeader.substring(BEARER_PREFIX.length());

        try {
            String username = jwtService.extractUserName(jwt);

            if (!StringUtils.hasLength(username) || !jwtService.isTokenValid(jwt)) {
                return chain.filter(exchange);
            }

            return userService.findUserByUsername(username)
                    .filter(user -> jwtService.isTokenValid(jwt, user))
                    .flatMap(user -> {
                        Authentication authToken = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                        );

                        return chain.filter(exchange)
                                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authToken));
                    })
                    .switchIfEmpty(chain.filter(exchange));
        } catch (Exception e) {
            return chain.filter(exchange);
        }
    }
}
