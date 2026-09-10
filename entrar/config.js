/* Configuracao do login da landing.
   A chave "publishable" do Supabase e publica por design — quem protege os dados
   e o RLS no banco, nao o segredo da chave. Trocar de ambiente e so mexer aqui. */
window.AVANT = {
  supabaseUrl: "https://jeqngqcpoeaezfpazbzk.supabase.co",
  supabaseKey: "sb_publishable_lLROyPxdKaJeJii9SgH3yg_DhTj0UDU",
  /* para onde mandamos a pessoa depois de autenticar. Em producao, o dominio do
     sistema (ex.: https://app.avantcell.com.br). */
  sistemaUrl: "http://localhost:3000"
};
