import { sql } from "../config/db.js";

export const criarReserva = async (req, res) => {
  const { quarto_id, cliente_id, hospedes, inicio, fim } = req.body;

  // Validação dos dados de entrada
  if (!quarto_id || !cliente_id || !hospedes || !inicio || !fim) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Passo 1: Verificar disponibilidade
    const disponibilidadeQuery = `
      SELECT 
        q.quantidade AS total_quartos,
        COUNT(r.id) AS reservas_no_periodo
      FROM quartos q
      LEFT JOIN reservas r 
        ON r.quarto_id = q.id 
        AND (r.inicio <= $1 AND r.fim >= $2)
      WHERE q.id = $3
      GROUP BY q.quantidade;
    `;

    const disponibilidadeResult = await sql.query(disponibilidadeQuery, [
      fim, inicio, quarto_id
    ]);

    // Verificar se o quarto existe
    if (disponibilidadeResult.rows.length === 0) {
      return res.status(404).json({ error: "Quarto não encontrado" });
    }

    const { total_quartos, reservas_no_periodo } = disponibilidadeResult.rows[0];

    if (reservas_no_periodo >= total_quartos) {
      return res.status(400).json({ 
        error: "Não há quartos disponíveis para este período" 
      });
    }

    // Passo 2: Inserir reserva
    const inserirReservaQuery = `
      INSERT INTO reservas 
        (quarto_id, cliente_id, hospedes, inicio, fim)
      VALUES 
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const reservaResult = await sql.query(inserirReservaQuery, [
      quarto_id, cliente_id, hospedes, inicio, fim
    ]);

    res.status(201).json(reservaResult.rows[0]);

  } catch (error) {
    console.error("Erro ao processar a reserva: ", error);
    res.status(500).json({ error: "Erro ao processar a reserva" });
  }
};