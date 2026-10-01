/* Configuracao do login da landing.
   A chave "publishable" do Supabase e publica por design — quem protege os dados
   e o RLS no banco, nao o segredo da chave. Trocar de ambiente e so mexer aqui. */
window.AVANT = {
  supabaseUrl: "https://jeqngqcpoeaezfpazbzk.supabase.co",
  supabaseKey: "sb_publishable_lLROyPxdKaJeJii9SgH3yg_DhTj0UDU",
  /* para onde mandamos a pessoa depois de autenticar. O endereco da Vercel
     (avant-cell-sistema.vercel.app) continua funcionando em paralelo, entao
     trocar aqui nao derruba ninguem no meio do caminho. */
  sistemaUrl: "https://app.avantcell.com.br"
};
