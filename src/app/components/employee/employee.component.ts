import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements AfterViewInit, OnInit, OnDestroy {
 
  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;
  form: FormGroup = this.initForm({});
  @ViewChild('btnClose') btnClose: any;
  @ViewChild('btnAdd') btnAdd: any;
  @ViewChild('idFile')
  idFile: any;
  file: any= null;
  nombreArchivo: any = null;
  today:Date=new Date();
  tipoPdf:any=null;

  dtOptions: DataTables.Settings = {
    lengthMenu: [[3,5, 10, 20, -1], [3,5, 10, 20, 'Todos']],

    createdRow: function( row, data, dataIndex ) {
      console.log('row: ', row, ' - dataIndex ', dataIndex, data);
      
        $(row).css("background-color",(data as any)['fechaBaja']? "#EE7F7F":"#92F3A6");
        $(row).css("color", "black");
        if((data as any)['bajaDefinitiva']== 1){ 
        $(row).css("background-color","#D3D3D3");
        
      }
       
  },
  language: {
    "decimal": "",
    "emptyTable": "No hay información",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
    "infoEmpty": "Mostrando 0 to 0 of 0 Registros",
    "infoFiltered": "(Filtrado de _MAX_ total Registros)",
    "infoPostFix": "",
    "thousands": ",",
    "lengthMenu": "Mostrar _MENU_ Registros",
    "loadingRecords": "Cargando...",
    "processing": "Procesando...",
    "search": "Buscar:",
    "zeroRecords": "Sin registros encontrados",
    "paginate": {
        "first": "Primero",
        "last": "Ultimo",
        "next": "Siguiente",
        "previous": "Anterior"
    }
},
    columns: [{
      title: 'Núm Emp',
      data: 'numeroEmpleado',
      "width": "2%" 
    }, {
      title: 'Apellido Pat',
      data: 'apellidoP',
      "width": "10%" 
    }, {
      title: 'Apellido Mat',
      data: 'apellidoM',
      "width": "10%" 
    }, {
      title: 'Nombres',
      data: 'nombres',
      "width": "10%" 
    }, {
      title: '<div class="text-center">Correo</div>',
      data: 'correo',
      "width": "10%",
      
    }, {
      title: 'Fecha Ingreso',
      data: 'fechaIngreso',
      "width": "10%" 
    },{
      title: 'Fecha Baja',
      data: 'fechaBaja',
      "width": "10%" 
    }, 
    {
      title: 'PDF',
      data: 'nombrePdf',
      "width": "5%" ,
      render: (data) => {
        return data ? '<ins  class=" btnPdf ">' + '<span  class="material-icons "><mat-icon title="'+ data +'">file_copy</mat-icon></span>' +'</ins>': '';
      }
    },{
      title: '...',
      data: 'bajaDefinitiva',
      "width": "25%",
    visible: this.authService.hasRole(['ADMIN']),
      className : 'text-center',
      render: (data) => {
        console.log("data: ", data);
        return data ==  1 ? " " : ' <button class="btn color-button-add btnEdit" type="button"><span class="material-icons">edit</span></button> <button class="btn color-button-danger btnDelete" type="button"><span class="material-icons">delete</span></button>';
      }
    }],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $('.btnEdit', row).off('click');
      $('.btnEdit', row).on('click', () => {
        console.log('edit: ', data, index);
        this.btnAdd.nativeElement.click();
        this.form=this.initForm(data);
        this.file=null;
        this.nombreArchivo=(data as any).nombrePdf;

      });

      $('.btnDelete', row).off('click');
      $('.btnDelete', row).on('click', () => {
        console.log('delete: ', data, index);
        Swal.fire({
          title: '¿Seguro que quieres borrar este registro?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Borrar',
          denyButtonText: `Cancelar`,
        }).then((result) => {
        
          if (result.isConfirmed) {
            this.employeeService.delete(data).subscribe(response=>{
              Swal.fire('Borrado!', '', 'success')
              this.loadTable(null);
            } );
            
          }
        })
      });

      $('.btnPdf', row).off('click');
      $('.btnPdf', row).on('click', () => {
        console.log('pdf: ', data, index);
        this.employeeService.getPDF((data as any).id).subscribe((response)=>{

          let file = new Blob([response], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        });

      });

      return row;
    }
  };

  dtTrigger: Subject<any> = new Subject();

  constructor(private employeeService: EmployeeService, public authService: AuthService) { }
  ngOnInit(): void { 
    this.loadTable(null);
    

   
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  initForm(empleado: any) {

    return new FormGroup({
      id: new FormControl(empleado.id),
      numeroEmpleado: new FormControl(empleado.numeroEmpleado, [Validators.required, Validators.min(0),Validators.max(99999)]),
      apellidoP: new FormControl(empleado.apellidoP, [Validators.required,Validators.minLength(3),Validators.maxLength(30), Validators.pattern("^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s[a-zA-ZÀ-ÿ\u00f1\u00d1])*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$")]), 
      apellidoM: new FormControl(empleado.apellidoM, [Validators.required, Validators.minLength(3),Validators.maxLength(30), Validators.pattern("^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s[a-zA-ZÀ-ÿ\u00f1\u00d1])*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$")]),
      nombres: new FormControl(empleado.nombres, [Validators.required, Validators.minLength(3),Validators.maxLength(30), Validators.pattern("^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s[a-zA-ZÀ-ÿ\u00f1\u00d1])*[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$")]),
      correo: new FormControl(empleado.correo,[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      fechaIngreso: new FormControl(empleado.fechaIngreso, [Validators.required]),
      fechaBaja: new FormControl(empleado.fechaBaja, [])
      
    });

}
  save(modal:any){
    console.log("form: ", this.form.value);
    const data = this.form.value as any;
    if(data.id){
      this.employeeService.update(data, this.file).subscribe(response=>{ 
        console.log("response: ", response)
        console.log("modal: ", modal)
        this.btnClose.nativeElement.click();
        this.loadTable(null)
      }) 
    }
  else{
    this.employeeService.save(data, this.file).subscribe(response=>{ 
      console.log("response: ", response)
      console.log("modal: ", modal)
      this.btnClose.nativeElement.click();
      this.loadTable(null)
    })
  }
  }

     loadTable(showActive: any){
       this.tipoPdf=showActive;
      this.employeeService.getEmployees(showActive).subscribe(employees => {
        this.dtOptions.data = employees
      this.rerender();
    });
  }
  add(){
    this.form=this.initForm({});
    this.file=null;
    this.idFile.nativeElement.value = "";
    this.nombreArchivo=null;
    console.log("{{ |json}}",this.form.controls['numeroEmpleado'] );
   
  }
  changeFile(event: any){
    console.log("event: ", event.target.files[0]);
  this.file= event.target.files[0];
  }

  downoloadZip(){
    this.employeeService.getZip(this.tipoPdf).subscribe((response)=>{

      let file = new Blob([response], { type: 'application/zip' });
      let a = document.createElement("a") 
      let blobURL = URL.createObjectURL(file)
      a.download = 'EmpleadosGDC.zip'
      a.href = blobURL
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    });
  }

  bajaDefinitiva(){
    Swal.fire({
      title: '¿Estás seguro que darás de baja definitiva a este empleado?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Dar de baja',
      denyButtonText: `Cancelar`,
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.employeeService.bajaDefinitiva(this.form.value).subscribe(response=>{
          Swal.fire('Dado de baja!', '', 'success')
          this.loadTable(null);
        } );
        
      }
    })
  }
 }
