package com.gdc.userManagementBackEnd.model;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

public class EmployeeModel {

	private Integer id;
	private Integer numeroEmpleado;
	private String apellidoP;
	private String apellidoM;
	private String nombres;
	private String correo;
	private Date fechaIngreso;
	private Date fechaBaja;
	private MultipartFile pdf;
	private String nombrePdf;
	private byte[] pdfAsBytes;
	private Integer bajaDefinitiva;
	
	public Integer getBajaDefinitiva() {
		return bajaDefinitiva;
	}
	public void setBajaDefinitiva(Integer bajaDefinitiva) {
		this.bajaDefinitiva = bajaDefinitiva;
	}
	public byte[] getPdfAsBytes() {
		return pdfAsBytes;
	}
	public void setPdfAsBytes(byte[] pdfAsBytes) {
		this.pdfAsBytes = pdfAsBytes;
	}
	public MultipartFile getPdf() {
		return pdf;
	}
	public void setPdf(MultipartFile pdf) {
		this.pdf = pdf;
	}
	public String getNombrePdf() {
		return nombrePdf;
	}
	public void setNombrePdf(String nombrePdf) {
		this.nombrePdf = nombrePdf;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getApellidoP() {
		return apellidoP;
	}
	public void setApellidoP(String apellidoP) {
		this.apellidoP = apellidoP;
	}
	public String getApellidoM() {
		return apellidoM;
	}
	public void setApellidoM(String apellidoM) {
		this.apellidoM = apellidoM;
	}
	public String getNombres() {
		return nombres;
	}
	public void setNombres(String nombres) {
		this.nombres = nombres;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	public Integer getNumeroEmpleado() {
		return numeroEmpleado;
	}
	public void setNumeroEmpleado(Integer numeroEmpleado) {
		this.numeroEmpleado = numeroEmpleado;
	}
	public Date getFechaIngreso() {
		return fechaIngreso;
	}
	public void setFechaIngreso(Date fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
	}
	public Date getFechaBaja() {
		return fechaBaja;
	}
	public void setFechaBaja(Date fechaBaja) {
		this.fechaBaja = fechaBaja;
	}
	@Override
	public String toString() {
		return "EmployeeModel [id=" + id + ", numeroEmpleado=" + numeroEmpleado + ", apellidoP=" + apellidoP
				+ ", apellidoM=" + apellidoM + ", nombres=" + nombres + ", correo=" + correo + ", fechaIngreso="
				+ fechaIngreso + ", fechaBaja=" + fechaBaja + ", pdf=" + pdf + ", nombrePdf=" + nombrePdf + "]";
	}
	
	
}
