package com.gdc.userManagementBackEnd.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.gdc.userManagementBackEnd.model.User;
import com.gdc.userManagementBackEnd.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service

public class UserServiceImpl {
	@Autowired UserRepository userRepository;
	
	private Integer jwtExpiration = 60;

	public User authenticate(String usuario, String password) throws IllegalArgumentException {
        User user = userRepository.getUser(usuario, password);
        if (user!=null) {
        	user.setName(user.getUsuario());
            user.setToken(this.getToken(usuario, Arrays.asList(new SimpleGrantedAuthority(user.getRol()))));
            return user;
		}else {
			throw new IllegalArgumentException("Error al iniciar sesión");
    }
	 }
	
	public String getToken(String subject, List<GrantedAuthority> grantedAuthorities) {

        String secretKey = "chucky123";

        String token = Jwts.builder()
                .setId("chuckyJWT")
                .setSubject(subject)
                .claim("authorities", grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (jwtExpiration * 60000) ))
                .signWith(SignatureAlgorithm.HS512, secretKey.getBytes()).compact();

        return token;
    }
	
}
