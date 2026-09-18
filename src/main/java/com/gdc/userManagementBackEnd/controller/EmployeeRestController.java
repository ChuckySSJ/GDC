package com.gdc.userManagementBackEnd.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gdc.userManagementBackEnd.model.EmployeeModel;
import com.gdc.userManagementBackEnd.repository.EmployeeRepository;
import com.google.gson.Gson;

@RestController
@RequestMapping("/employeeController")


public class EmployeeRestController {

	@Autowired EmployeeRepository employeeRepository;

	@GetMapping("/getEmployees/{showActive}")
	ResponseEntity<?> getEmployees(@PathVariable String showActive){
		return new ResponseEntity<Object>(employeeRepository.getAll(showActive), HttpStatus.OK);
	}

	@PostMapping("/save")
	ResponseEntity<?> save(@RequestParam("json") String json, @RequestParam(value="file", required = false) MultipartFile file) throws DataAccessException, IOException{
		EmployeeModel employeeModel = new Gson().fromJson(json, EmployeeModel.class);
		if (file!= null) {
			employeeModel.setPdf(file);
			file.getContentType();
			employeeModel.setNombrePdf(file.getOriginalFilename());
		}
		try {
			return new ResponseEntity<Object>(employeeRepository.save(employeeModel), HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = new HashMap<>();
			response.put("error", e.getMessage());
			return new ResponseEntity<Object>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}		
	}

	@PostMapping("/update")
	ResponseEntity<?> update(@RequestParam("json") String json, @RequestParam(value="file", required = false) MultipartFile file) throws DataAccessException, IOException{
		EmployeeModel employeeModel = new Gson().fromJson(json, EmployeeModel.class);
		if (file!= null) {
			employeeModel.setPdf(file);
			file.getContentType();
			employeeModel.setNombrePdf(file.getOriginalFilename());
			
		}
		try {
			return new ResponseEntity<Object>(employeeRepository.update(employeeModel), HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = new HashMap<>();
			response.put("error", e.getMessage());
			return new ResponseEntity<Object>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/delete")
	ResponseEntity<?> delete(@RequestBody EmployeeModel employeeModel){
		return new ResponseEntity<Object>(employeeRepository.delete(employeeModel), HttpStatus.OK);
	}
	@PostMapping("/bajaDefinitiva")
	ResponseEntity<?> bajaDefinitiva(@RequestBody EmployeeModel employeeModel){
		return new ResponseEntity<Object>(employeeRepository.bajaDefinitiva(employeeModel), HttpStatus.OK);
	}

	@GetMapping(value = "/getPdf/{id}")
	public ResponseEntity<byte[]> getPdf(@PathVariable Integer id) throws SQLException {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		Blob pdf = employeeRepository.getPdf(id);
		int blobLength = (int) pdf.length();
		byte[] blobAsBytes = pdf.getBytes(1, blobLength);
		return new ResponseEntity<>(blobAsBytes, headers, HttpStatus.OK);
	}

	@GetMapping(value = "/getZip/{tipoPdf}")
	public ResponseEntity<byte[]> getZip(@PathVariable String tipoPdf) throws Exception {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		List<EmployeeModel> pdfs = employeeRepository.getAllPdf(tipoPdf);
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try(ZipOutputStream zos = new ZipOutputStream(baos)) {
			for(EmployeeModel employee : pdfs){
				if (employee.getPdfAsBytes()!=null) {
					ZipEntry entry = new ZipEntry(employee.getId() + (employee.getNumeroEmpleado() != null ? "_".concat(employee.getNumeroEmpleado().toString()) : "") + ".pdf"); 
					entry.setSize(employee.getPdfAsBytes().length); 
					zos.putNextEntry(entry);
					zos.write(employee.getPdfAsBytes());
					zos.closeEntry();
				}

			}
			zos.close();
			return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
		} catch(IOException ioe) {
			throw new Exception(ioe);
		}

	}


}
