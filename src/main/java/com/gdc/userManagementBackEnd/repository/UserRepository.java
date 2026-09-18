package com.gdc.userManagementBackEnd.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.gdc.userManagementBackEnd.model.EmployeeModel;
import com.gdc.userManagementBackEnd.model.User;
import com.gdc.userManagementBackEnd.model.User;

@Repository

public class UserRepository {
	@Autowired JdbcTemplate jdbcTemplate;
	
	public User getUser(String usuario, String password) { 	
		
		try {
			return jdbcTemplate.queryForObject("SELECT * FROM usuarios WHERE usuario = ? AND password = ?", 
				new UserMapper(), new Object[] { usuario, password});
		} catch (Exception e) {
			return null;
		}
        
    } 

    public class UserMapper implements RowMapper<User> {
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setUsuario(rs.getString("usuario"));
            user.setRol(rs.getString("rol"));
            return user;
        }
        
    }
    
    public Integer save(User user){
        return jdbcTemplate.update("INSERT INTO usuarios (usuario, password, rol) "
        		+ " VALUES (?, ?, ?)", new Object[] {user.getUsuario(), user.getPassword(), user.getRol()});
    } 
    
    public Boolean userExist(String userName){
        return jdbcTemplate.queryForObject(" SELECT count (*) FROM usuarios WHERE usuario = '" + userName + "'", Integer.class) > 0;
    } 
    
    
	
}
