const cds = require('@sap/cds');

module.exports = class PagosService extends cds.ApplicationService {

  async init() {
    const { Pagos } = this.entities;

    // Acción: registrar un pago nuevo
    this.on('registrarPago', async (req) => {
      const { referencia, monto, moneda, sociedad, descripcion } = req.data;

      // Validaciones
      if (!referencia) return req.error(400, 'La referencia es obligatoria');
      if (monto <= 0)  return req.error(400, 'El monto debe ser mayor a cero');

      // Verificar si ya existe
      const existe = await SELECT.one(Pagos).where({ referencia });
      if (existe) return req.error(409, `Ya existe un pago con referencia ${referencia}`);

      // Insertar
      await INSERT.into(Pagos).entries({
        referencia,
        monto,
        moneda:      moneda      || 'COP',
        estado:      'PENDIENTE',
        fechaPago:   new Date().toISOString().split('T')[0],
        sociedad,
        descripcion: descripcion || ''
      });

      // Retornar el registro creado
      return SELECT.one(Pagos).where({ referencia });
    });

    // Función: consultar pagos por sociedad
    this.on('pagosPorSociedad', async (req) => {
      const { sociedad } = req.data;
      if (!sociedad) return req.error(400, 'El parámetro sociedad es obligatorio');

      return SELECT.from(Pagos)
        .where({ sociedad })
        .orderBy({ fechaPago: 'desc' });
    });

    // Validación antes de actualizar
    this.before('UPDATE', Pagos, (req) => {
      if (req.data.monto !== undefined && req.data.monto <= 0) {
        return req.error(400, 'El monto debe ser mayor a cero');
      }
    });

    await super.init();
  }
};