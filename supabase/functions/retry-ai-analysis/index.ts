import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

Deno.serve(async () => {
  console.log("retry-ai-analysis iniciado", new Date().toISOString());

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: pending, error } = await supabase
    .from("responses")
    .select("id")
    .is("ai_analysis", null)
    .order("created_at", { ascending: true })
    .limit(5);

  console.log(`Pendências encontradas: ${pending?.length ?? 0}`);

  if (error) {
    return jsonResponse(
      {
        error: error.message,
      },
      500,
    );
  }

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  const errors: Array<{
    id: string;
    status: number;
    response: string;
  }> = [];

  for (const row of pending ?? []) {
    processed++;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/generate-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          responseId: row.id,
          force: false,
        }),
      });

      const responseText = await res.text();

      if (res.ok) {
        succeeded++;
      } else {
        failed++;

        errors.push({
          id: row.id,
          status: res.status,
          response: responseText,
        });

        // Se o Gemini informou falta de quota,
        // interrompe imediatamente e deixa para o próximo cron.
        if (
          responseText.includes("RESOURCE_EXHAUSTED") ||
          responseText.includes("Quota exceeded") ||
          responseText.includes("retryDelay")
        ) {
          console.log("Quota Gemini atingida. Encerrando processamento.");

          break;
        }
      }
    } catch (err) {
      failed++;

      errors.push({
        id: row.id,
        status: 0,
        response: String(err),
      });
    }
  }

  console.log(
    `Processadas: ${processed}, Sucesso: ${succeeded}, Falhas: ${failed}`,
  );

  return jsonResponse({
    success: true,
    processed,
    succeeded,
    failed,
    pendingFound: pending?.length ?? 0,
    errors: errors.slice(0, 3),
  });
});
