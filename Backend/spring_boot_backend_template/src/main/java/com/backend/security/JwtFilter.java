package com.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

    	// ✅ SKIP JWT CHECK FOR PUBLIC ENDPOINTS
    	String path = request.getServletPath();
    	if (path.startsWith("/api/auth")
    	    || path.startsWith("/swagger-ui")
    	    || path.startsWith("/v3/api-docs")
    	    || path.startsWith("/uploads")) {

    	    filterChain.doFilter(request, response);
    	    return;
    	}

        // PRE-PROCESSING
        String authHeader = request.getHeader("Authorization");
        Authentication auth = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // remove "Bearer "
            auth = jwtUtil.validateToken(token);
        }

        // attach auth to security context
        if (auth != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
