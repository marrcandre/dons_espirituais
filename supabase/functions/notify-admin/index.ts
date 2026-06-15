import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('NOTIFY-ADMIN: iniciado')

    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const emailFrom = Deno.env.get('EMAIL_FROM')
    const adminEmail = Deno.env.get('ADMIN_EMAIL') ?? 'marcoandre@gmail.com'

    if (!resendApiKey || !emailFrom) {
      return new Response(
        JSON.stringify({ error: 'Configuração de email ausente' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }

    const { responseId } = await req.json().catch(() => ({}))

    if (!responseId) {
      return new Response(
        JSON.stringify({ error: 'responseId obrigatório' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }

    console.log('Buscando response:', responseId)

    const { data: response, error } = await supabase
      .from('responses')
      .select('id, name, email')
      .eq('id', responseId)
      .single()

    if (error || !response) {
      return new Response(
        JSON.stringify({ error: 'Resposta não encontrada' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }

    const appUrl = Deno.env.get('APP_URL') ?? 'https://dons-espirituais.vercel.app'
    const resultsUrl = `${appUrl}/results/${responseId}`

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: adminEmail,
        subject: `[Dons] ${response.name} fez o teste`,
        html: `
          <p>Novo teste finalizado</p>
          <p><strong>Nome:</strong> ${response.name}</p>
          <p><strong>Email:</strong> ${response.email ?? '—'}</p>
          <p><a href="${resultsUrl}">Ver resultado</a></p>
        `,
      }),
    })

    const text = await sendRes.text()

    console.log('RESEND STATUS:', sendRes.status)
    console.log('RESEND RESPONSE:', text)

    if (!sendRes.ok) {
      return new Response(
        JSON.stringify({
          error: 'Falha ao enviar email',
          detail: text,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }

    // Atualiza a coluna email_sent para true na base de dados
    const { error: updateError } = await supabase
      .from('responses')
      .update({ email_sent: true })
      .eq('id', responseId)

    if (updateError) {
      console.error('Erro ao marcar email_sent como true:', updateError)
      return new Response(
        JSON.stringify({
          error: 'Falha ao atualizar status no banco',
          detail: String(updateError),
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (err) {
    console.error('ERRO:', err)

    return new Response(
      JSON.stringify({ error: 'Erro interno' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }
})
