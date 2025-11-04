package com.tyuiu.backend.utills;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
public class SpaWebFilter implements WebFilter {

    private final List<String> excludedPaths = Arrays.asList(
            "/api/", "/actuator/", "/swagger", "/v2/", "/v3/", "/webjars/", "/api"
    );

    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        boolean shouldExclude = excludedPaths.stream()
                .anyMatch(path::startsWith);

        if (shouldExclude) {
            return chain.filter(exchange);
        }

        Resource resource = new ClassPathResource("static" + path);

        if (resource.exists() && resource.isReadable()) {
            return chain.filter(exchange);
        } else {
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .path("/index.html")
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        }
    }
}