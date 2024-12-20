import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServer } from "https://esm.sh/vite@5.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    if (url.pathname === '/api/preview/init') {
      // Start Vite server
      const server = await createServer({
        configFile: false,
        root: './preview',
        server: {
          port: 8081,
          strictPort: true,
          hmr: {
            port: 8081,
          },
        },
      });
      
      await server.listen();
      
      return new Response(
        JSON.stringify({ url: 'http://localhost:8081' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (url.pathname === '/api/preview/cleanup') {
      // Cleanup server
      return new Response(null, { headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Preview server error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});