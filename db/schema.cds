namespace com.empresa.datos;

using { cuid, managed } from '@sap/cds/common';

entity Pagos : cuid, managed {
  referencia  : String(50)    not null;
  monto       : Decimal(15,2) not null;
  moneda      : String(3)     default 'COP';
  estado      : String(20)    default 'PENDIENTE';
  fechaPago   : Date;
  sociedad    : String(4);
  descripcion : String(255);
}