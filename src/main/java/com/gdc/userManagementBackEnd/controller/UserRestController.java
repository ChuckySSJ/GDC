package com.gdc.userManagementBackEnd.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gdc.userManagementBackEnd.model.EmployeeModel;
import com.gdc.userManagementBackEnd.model.User;
import com.gdc.userManagementBackEnd.repository.UserRepository;
import com.gdc.userManagementBackEnd.service.impl.UserServiceImpl;

@RestController

@RequestMapping("/api")

@CrossOrigin(origins = {"http://localhost:4200"})


public class UserRestController {

	@Autowired UserServiceImpl userServiceImpl;
	@Autowired UserRepository userRepository;
	
	@GetMapping("/authenticate/{usuario}/{password}")
	    public ResponseEntity<Object> authenticateClient(@PathVariable String usuario, @PathVariable String password) {
	        try {
//	            String usuarioDecoded = new String(Base64.getDecoder().decode(usuario));
//	            String passwordDecoded = new String(Base64.getDecoder().decode(password));
	            return ResponseEntity.ok(userServiceImpl.authenticate(usuario, password));
	        } catch (Exception e) {
	            return ResponseEntity.internalServerError().body("Error al iniciar sesion. " + e.getMessage());
	        }
	    }
	
	@PostMapping("/save")
    ResponseEntity<?> save(@RequestBody User user){
		if (userRepository.userExist(user.getUsuario())) {
			Map<String, Object> response = new HashMap<>();
			response.put("error", "Ya existe un usuario registrado con este mismo nombre de usuario");
			return new ResponseEntity<Object>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<Object>(userRepository.save(user), HttpStatus.OK);
        
    }
	
	
}
