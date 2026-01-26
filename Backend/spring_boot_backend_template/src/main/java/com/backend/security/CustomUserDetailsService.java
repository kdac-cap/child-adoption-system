package com.backend.security;

import com.backend.daos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return userRepo.findByUsername(username)
                .map(CustomUserDetails::new)   // ✅ FIX HERE
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username));
    }
}
