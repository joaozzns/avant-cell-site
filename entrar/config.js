/* Configuracao do login da landing.
   A chave "publishable" do Supabase e publica por design — quem protege os dados
   e o RLS no banco, nao o segredo da chave. Trocar de ambiente e so mexer aqui. */
window.AVANT = {
  supabaseUrl: "https://jeqngqcpoeaezfpazbzk.supabase.co",
  supabaseKey: "sb_publishable_lLROyPxdKaJeJii9SgH3yg_DhTj0UDU",
  /* para onde mandamos a pessoa depois de autenticar. Hoje e o endereco da
     Vercel; quando houver dominio proprio (ex.: https://app.avantcell.com.br),
     e aqui que se troca. */
  sistemaUrl: "https://avant-cell-sistema.vercel.app"
};
