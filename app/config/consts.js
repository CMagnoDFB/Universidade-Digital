
const CARGO_VALUES = [
    {label: 'Estudante', value: 'Estudante'},
    {label: 'Professor', value: 'Professor'},
  ];

const CURSO_VALUES = [
    { label: 'Administração', value: 'Administração' },
    { label: 'Administração Pública', value: 'Administração Pública' },
    { label: 'Agronomia', value: 'Agronomia' },
    { label: 'Análise e Desenvolvimento de Sistemas', value: 'Análise e Desenvolvimento de Sistemas' },
    { label: 'Arquitetura e Urbanismo', value: 'Arquitetura e Urbanismo' },
    { label: 'Biotecnologia', value: 'Biotecnologia' },
    { label: 'Biblioteconomia', value: 'Biblioteconomia' },
    { label: 'Ciência da Computação', value: 'Ciência da Computação' },
    { label: 'Ciências Ambientais', value: 'Ciências Ambientais' },
    { label: 'Ciências Atuariais', value: 'Ciências Atuariais' },
    { label: 'Ciências Biológicas', value: 'Ciências Biológicas' },
    { label: 'Ciências Contábeis', value: 'Ciências Contábeis' },
    { label: 'Ciência de Dados', value: 'Ciência de Dados' },
    { label: 'Ciências Econômicas', value: 'Ciências Econômicas' },
    { label: 'Ciências Sociais', value: 'Ciências Sociais' },
    { label: 'Cinema e Audiovisual', value: 'Cinema e Audiovisual' },
    { label: 'Comunicação Social – Publicidade e Propaganda', value: 'Comunicação Social – Publicidade e Propaganda' },
    { label: 'Dança - B', value: 'Dança - B' },
    { label: 'Dança - L', value: 'Dança - L' },
    { label: 'Design', value: 'Design' },
    { label: 'Design Digital', value: 'Design Digital' },
    { label: 'Design – Moda', value: 'Design – Moda' },
    { label: 'Direito', value: 'Direito' },
    { label: 'Economia Doméstica', value: 'Economia Doméstica' },
    { label: 'Economia Ecológica', value: 'Economia Ecológica' },
    { label: 'Educação Física – Bacharelado e Licenciatura', value: 'Educação Física – Bacharelado e Licenciatura' },
    { label: 'Enfermagem', value: 'Enfermagem' },
    { label: 'Engenharia Ambiental', value: 'Engenharia Ambiental' },
    { label: 'Engenharia Ambiental e Sanitária', value: 'Engenharia Ambiental e Sanitária' },
    { label: 'Engenharia Civil', value: 'Engenharia Civil' },
    { label: 'Engenharia da Computação', value: 'Engenharia da Computação' },
    { label: 'Engenharia de Alimentos', value: 'Engenharia de Alimentos' },
    { label: 'Engenharia de Energias Renováveis', value: 'Engenharia de Energias Renováveis' },
    { label: 'Engenharia de Pesca', value: 'Engenharia de Pesca' },
    { label: 'Engenharia de Petróleo', value: 'Engenharia de Petróleo' },
    { label: 'Engenharia de Produção', value: 'Engenharia de Produção' },
    { label: 'Engenharia de Produção Mecânica', value: 'Engenharia de Produção Mecânica' },
    { label: 'Engenharia de Software', value: 'Engenharia de Software' },
    { label: 'Engenharia de Telecomunicações', value: 'Engenharia de Telecomunicações' },
    { label: 'Engenharia de Teleinformática', value: 'Engenharia de Teleinformática' },
    { label: 'Engenharia Elétrica', value: 'Engenharia Elétrica' },
    { label: 'Engenharia Mecânica', value: 'Engenharia Mecânica' },
    { label: 'Engenharia Metalúrgica', value: 'Engenharia Metalúrgica' },
    { label: 'Engenharia de Minas', value: 'Engenharia de Minas' },
    { label: 'Engenharia Química', value: 'Engenharia Química' },
    { label: 'Estatística', value: 'Estatística' },
    { label: 'Farmácia', value: 'Farmácia' },
    { label: 'Filosofia', value: 'Filosofia' },
    { label: 'Finanças', value: 'Finanças' },
    { label: 'Física', value: 'Física' },
    { label: 'Física - L', value: 'Física - L' },
    { label: 'Física - B', value: 'Física - B' },
    { label: 'Fisioterapia', value: 'Fisioterapia' },
    { label: 'Gastronomia', value: 'Gastronomia' },
    { label: 'Geografia – Bacharelado e Licenciatura', value: 'Geografia – Bacharelado e Licenciatura' },
    { label: 'Geologia', value: 'Geologia' },
    { label: 'Gestão de Políticas Públicas', value: 'Gestão de Políticas Públicas' },
    { label: 'História', value: 'História' },
    { label: 'Letras', value: 'Letras' },
    { label: 'Letras – Espanhol', value: 'Letras – Espanhol' },
    { label: 'Letras – Inglês', value: 'Letras – Inglês' },
    { label: 'Letras – Libras', value: 'Letras – Libras' },
    { label: 'Licenciatura Intercultural Indígena das Etnias Pitaguary,...', value: 'Licenciatura Intercultural Indígena das Etnias Pitaguary,...' },
    { label: 'Licenciatura Intercultural Indígena Kuaba', value: 'Licenciatura Intercultural Indígena Kuaba' },
    { label: 'Matemática - B', value: 'Matemática - B' },
    { label: 'Matemática - L', value: 'Matemática - L' },
    { label: 'Matemática Industrial', value: 'Matemática Industrial' },
    { label: 'Medicina', value: 'Medicina' },
    { label: 'Música', value: 'Música' },
    { label: 'Oceanografia', value: 'Oceanografia' },
    { label: 'Odontologia', value: 'Odontologia' },
    { label: 'Pedagogia', value: 'Pedagogia' },
    { label: 'Pedagogia – PARFOR', value: 'Pedagogia – PARFOR' },
    { label: 'Psicologia', value: 'Psicologia' },
    { label: 'Química', value: 'Química' },
    { label: 'Química - B', value: 'Química - B' },
    { label: 'Química - L', value: 'Química - L' },
    { label: 'Redes de Computadores', value: 'Redes de Computadores' },
    { label: 'Secretariado Executivo', value: 'Secretariado Executivo' },
    { label: 'Segurança da Informação', value: 'Segurança da Informação' },
    { label: 'Sistemas e Mídias Digitais', value: 'Sistemas e Mídias Digitais' },
    { label: 'Teatro', value: 'Teatro' },
    { label: 'Tecnologia em Gestão de Qualidade', value: 'Tecnologia em Gestão de Qualidade' },
    { label: 'Zootecnia', value: 'Zootecnia' },
];

const CAMPUS_VALUES = [
    { label: 'Fortaleza', value: 'Fortaleza' },
    { label: 'Crateús', value: 'Crateús' },
    { label: 'Itapajé', value: 'Itapajé' },
    { label: 'Quixadá', value: 'Quixadá' },
    { label: 'Russas', value: 'Russas' },
    { label: 'Sobral', value: 'Sobral' },
    { label: 'EAD', value: 'EAD' },
];

const BADGE_COLORS = [
    "#603A94","#15EBC3","#C48627","#F1D7E2","#0AEE3E","#4D37FA","#04850D","#EBC01E","#23E8A0","#120F7B","#502C1E","#BE1288","#04C59C","#627AC5","#0F0B21","#52C0AA","#6187D9","#524727","#588A43","#A2A6C4","#BCF5CB","#79D860","#FF1313","#992B1C","#5182EA","#16EC7A","#5051E7","#6172AB","#884EDC","#AD8034",
];

const parseTags = (tags, geral=false) => {

    var tagList = [];
    if (tags) {
        tags.forEach((tag, i) => {
            if (geral || tag.nome != 'Geral') {
                tagList.push({ label: tag.nome, value: tag.id });
            }
        });
    }
    

    return tagList;

}

module.exports = { CARGO_VALUES, CURSO_VALUES, CAMPUS_VALUES, BADGE_COLORS, parseTags };