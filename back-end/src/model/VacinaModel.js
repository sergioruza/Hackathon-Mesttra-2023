const pool = require('../connection/pool');

const findVacinas = async () => {
  const query = `SELECT  vacina.*,  periodo_ano.*,  periodo_mes.*,  rede.* FROM  vacina 
    full JOIN periodoaplicacaoano AS periodo_ano ON vacina.Id_vacina = periodo_ano.Id_vacina 
    full JOIN periodoaplicacaomes AS periodo_mes ON vacina.Id_vacina = periodo_mes.Id_vacina 
    full JOIN  rede AS rede ON vacina.Id_rede = rede.Id_rede;`

    const vacinas = await pool.query(query);

    return vacinas.rows;
}

const findIdade = async (mesAno, valor, tipo) => {

    if (mesAno == 'mes') {
        if (tipo === 'ate') {
            const query = `SELECT *,
            CAST(
              CASE
                WHEN regexp_replace(desc_meses, '\D', '', 'g') ~ E'^\\d+$' THEN regexp_replace(desc_meses, '\D', '', 'g')::integer
                ELSE null
              END AS integer
            ) AS meses_numerico
          FROM
            periodoaplicacaomes as periodo_ano
          inner join vacina as vacinas on vacinas.id_vacina = periodo_ano.id_vacina 
          WHERE
            CAST(
              CASE
                WHEN regexp_replace(desc_meses, '\D', '', 'g') ~ E'^\\d+$' THEN regexp_replace(desc_meses, '\D', '', 'g')::integer
                ELSE null
              END AS integer
            ) <= $1;`

            const consult = await pool.query(query, [valor])

            return consult
        }else{
            const query = `SELECT * FROM public.vacina as vacinas 
            INNER JOIN public.periodoaplicacaomes as periodo_mes ON periodo_mes.id_vacina = vacinas.id_vacina 
            WHERE desc_meses = $1 || ' meses';`;
    
            const consult = await pool.query(query, [valor]);
    
            return consult.rows;
        }
    } else if (mesAno == 'ano') {

        if (tipo == 'ate') {
            const query = `SELECT
            *,
            CAST(
              CASE
                WHEN regexp_replace(desc_meses, '\D', '', 'g') ~ E'^\\d+$' THEN regexp_replace(desc_meses, '\D', '', 'g')::integer
                ELSE null
              END AS integer
            ) AS meses_numerico
          FROM
            public.periodoaplicacaomes as periodo_ano
          inner join public.vacina as vacinas on vacinas.id_vacina = periodo_ano.id_vacina 
          WHERE
            CAST(
              CASE
                WHEN regexp_replace(desc_meses, '\D', '', 'g') ~ E'^\\d+$' THEN regexp_replace(desc_meses, '\D', '', 'g')::integer
                ELSE null
              END AS integer
            ) <= 2;`

            const consult = await pool.query(query, [valor]);
    
            return consult.rows;
        }else{
            const query = `SELECT * FROM public.vacina as vacinas 
            INNER JOIN public.periodoaplicacaoano as periodo_ano ON periodo_ano.id_vacina = vacinas.id_vacina 
            WHERE desc_ano = $1 || ' anos';`;
    
            const consult = await pool.query(query, [valor]);
    
            return consult.rows;
        }
    } else {
        console.log('error') //Vou mudar depois
    }


}


const findPacientes = async (nome) => {
    const query = `SELECT * 
    FROM paciente AS pa
    inner JOIN vacinaaplicada AS vacina_aplicada ON vacina_aplicada.id_paciente = pa.id_paciente
    inner JOIN vacina AS vac ON vac.id_vacina = vacina_aplicada.id_vacina
    WHERE pa.nome = $1;`

    const paciente = await pool.query(query, [nome]);

    return paciente.rows;
}

const findByProtecao = async (protecao) => {
  const query = `select id_vacina ,vacina, sigla_vacina, doenca_protecao, dose 
  from vacina where doenca_protecao ilike '%' || $1 || '%'`;

  const vacinaProtecao = await pool.query(query, [protecao]);

  return vacinaProtecao.rows;
}

module.exports = {
    findVacinas,
    findIdade,
    findPacientes,
    findByProtecao
}