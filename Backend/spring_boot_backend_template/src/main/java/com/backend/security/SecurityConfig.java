package com.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // 🔐 JWT FILTER
    private final JwtFilter jwtFilter;

    // 🔐 PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 AUTHENTICATION MANAGER (SPRING SECURITY 6 WAY)
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // 🔐 SECURITY FILTER CHAIN
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // 🌍 PUBLIC ENDPOINTS
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/register/child-welfare",

                    // ✅ SWAGGER (ADD THESE)
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()

                // 👑 ROLE BASED ACCESS
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/parent/**").hasRole("PARENT")
                .requestMatchers("/agency/**").hasRole("AGENCY")
                .requestMatchers("/staff/**").hasRole("STAFF")
                .requestMatchers("/welfare/**").hasRole("CHILD_WELFARE")

                // 🔒 EVERYTHING ELSE
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
