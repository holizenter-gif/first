import { createClient }              from "@/lib/supabase/server";
import type { ConfigEnvio }          from "@/lib/envios";
import { CONFIG_ENVIO_DEFAULT }      from "@/lib/envios";

export async function getConfigEnvio(): Promise<ConfigEnvio> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("config_envios")
    .select("*")
    .eq("activo", true)
    .single();
  return (data as ConfigEnvio | null) ?? CONFIG_ENVIO_DEFAULT;
}
