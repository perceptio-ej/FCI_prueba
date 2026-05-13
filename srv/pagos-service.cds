using com.empresa.datos as db from '../db/schema';

service PagosService @(path: '/odata/v4/pagos') {

  entity Pagos as projection on db.Pagos;

  action registrarPago(
    referencia  : String,
    monto       : Decimal,
    moneda      : String,
    sociedad    : String,
    descripcion : String
  ) returns Pagos;

  function pagosPorSociedad(
    sociedad : String
  ) returns array of Pagos;

}