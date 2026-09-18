package com.gdc.userManagementBackEnd.repository;

import java.io.IOException;
import java.sql.Blob;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.gdc.userManagementBackEnd.model.EmployeeModel;

@Repository

public class EmployeeRepository {
	@Autowired JdbcTemplate jdbcTemplate;
	
	public List<EmployeeModel> getAll(String showActive){
		String sql = "SELECT * FROM empleados WHERE 1=1 ";
		if (showActive!=null && showActive.equals("altas")) {
			sql+=" and fechaBaja is null and bajaDefinitiva is null";
		}else if(showActive!=null && showActive.equals("bajas")){
			sql+=" and fechaBaja is not null and bajaDefinitiva is null";
		}else if(showActive!=null && showActive.equals("bajasDefinitivas")){
			sql+=" and bajaDefinitiva =1 ";
		}
		
        return jdbcTemplate.query(sql, new EmployeeModelMapper());
    } 

    public class EmployeeModelMapper implements RowMapper<EmployeeModel> {
        public EmployeeModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            EmployeeModel empleado = new EmployeeModel();
            empleado.setId(rs.getInt("id"));
            empleado.setNumeroEmpleado(rs.getInt("numeroEmpleado"));
            empleado.setNombres(rs.getString("nombres"));
            empleado.setApellidoP(rs.getString("apellidoP"));
            empleado.setApellidoM(rs.getString("apellidoM"));
            empleado.setCorreo(rs.getString("correo"));
            empleado.setFechaIngreso(rs.getDate("fechaIngreso"));
            empleado.setFechaBaja(rs.getDate("fechaBaja"));
            empleado.setNombrePdf(rs.getString("nombrePdf"));
            empleado.setBajaDefinitiva(rs.getInt("bajaDefinitiva"));
            return empleado;
        }
    }
    
    public Integer save(EmployeeModel employeeModel) throws DataAccessException, IOException{
    	try {
    		return jdbcTemplate.update("INSERT INTO empleados (numeroEmpleado, apellidoP, apellidoM, "
            		+ "nombres, correo, fechaIngreso, fechaBaja, pdf, nombrepdf)"
            		+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", new Object[] {employeeModel.getNumeroEmpleado()
            				, employeeModel.getApellidoP(), employeeModel.getApellidoM(), employeeModel.getNombres(),
            				employeeModel.getCorreo(), employeeModel.getFechaIngreso(), employeeModel.getFechaBaja(),
            				employeeModel.getPdf()!=null ? employeeModel.getPdf().getBytes() : null, employeeModel.getNombrePdf()});
		} catch (Exception e) {
			if (e!= null && e.getMessage()!= null && e.getMessage().contains("numeroEmpleado")) {
				throw new IllegalArgumentException("El número de empleado (" + employeeModel.getNumeroEmpleado () +") ya existe" );
			}else {
				throw e;
			}
		}
        
    } 
    public Integer update(EmployeeModel employeeModel) throws IOException{

        StringBuilder sql = new StringBuilder(" UPDATE empleados SET numeroEmpleado=?, apellidoP=?, "
        		+ "apellidoM=?, nombres=?, correo=?, fechaIngreso=?, fechaBaja=? ");

        List<Object> params = new ArrayList<>();

        params.add(employeeModel.getNumeroEmpleado());
        params.add(employeeModel.getApellidoP());
        params.add(employeeModel.getApellidoM());
        params.add(employeeModel.getNombres());
        params.add(employeeModel.getCorreo());
        params.add(employeeModel.getFechaIngreso());
        params.add(employeeModel.getFechaBaja());

        if(employeeModel.getPdf() != null) {
            sql.append(", pdf = ? ");
            sql.append(", nombrePdf = ? ");
            params.add(employeeModel.getPdf().getBytes());
            params.add(employeeModel.getNombrePdf());
        }

        params.add(employeeModel.getId());
        sql.append(" WHERE id = ?");
        try {
        	return jdbcTemplate.update(sql.toString(), params.toArray());
		} catch (Exception e) {
			if (e!= null && e.getMessage()!= null && e.getMessage().contains("numeroEmpleado")) {
				throw new IllegalArgumentException("El número de empleado (" + employeeModel.getNumeroEmpleado () +") ya existe");
			}else {
				throw e;
			}
		}
        
    }
    public Integer delete(EmployeeModel employeeModel){
        return jdbcTemplate.update("DELETE FROM empleados WHERE id=?"
        		, new Object[] {employeeModel.getId()});
    } 
    public Integer bajaDefinitiva(EmployeeModel employeeModel){
        return jdbcTemplate.update("UPDATE empleados SET bajaDefinitiva =1 WHERE id=?"
        		, new Object[] {employeeModel.getId()});
    } 
    public Blob getPdf(Integer id){
        return jdbcTemplate.queryForObject("SELECT pdf FROM empleados WHERE id=?"
        		, Blob.class , new Object[] {id});
    } 
    
    public List<EmployeeModel> getAllPdf(String tipoPdf){
		String sql = "SELECT * FROM empleados WHERE pdf is not null ";
		if (tipoPdf!=null && tipoPdf.equals("altas")) {
			sql+=" and fechaBaja is null";
		}else if(tipoPdf!=null && tipoPdf.equals("bajas")){
			sql+=" and fechaBaja is not null and bajaDefinitiva is null";
		}else if(tipoPdf!=null && tipoPdf.equals("bajasDefinitivas")){
			sql+=" and bajaDefinitiva =1";
		}
        return jdbcTemplate.query(sql, new EmployeeModelPdfMapper());
    } 

    public class EmployeeModelPdfMapper implements RowMapper<EmployeeModel> {
        public EmployeeModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            EmployeeModel empleado = new EmployeeModel();
            empleado.setId(rs.getInt("id"));
            empleado.setNumeroEmpleado(rs.getInt("numeroEmpleado"));
            Blob pdf = rs.getBlob("pdf");
    		int blobLength = (int) pdf.length();
    		byte[] blobAsBytes = pdf.getBytes(1, blobLength);
            empleado.setPdfAsBytes(blobAsBytes);
            return empleado;
        }
    }
}
 