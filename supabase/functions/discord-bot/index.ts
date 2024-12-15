import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createBot, startBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { generateAIResponse } from "./ai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, config } = await req.json();
    console.log('Received request:', { action, config });

    if (action === 'start') {
      if (!config?.bot_token) {
        throw new Error('Bot token is required');
      }

      console.log('Creating bot with token');
      const bot = createBot({
        token: config.bot_token,
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: {
          ready: () => {
            console.log("Successfully connected to Discord!");
          },
          messageCreate: async (bot, message) => {
            if (message.isFromBot) return;

            try {
              // Handle custom commands
              if (config.commands) {
                const command = config.commands.find((cmd: any) => 
                  message.content.startsWith(cmd.name)
                );

                if (command) {
                  if (command.type === 'ai') {
                    const response = await generateAIResponse(message.content);
                    await bot.helpers.sendMessage(message.channelId, { 
                      content: response 
                    });
                  } else {
                    await bot.helpers.sendMessage(message.channelId, { 
                      content: command.response 
                    });
                  }
                  return;
                }
              }

              // Default AI response for non-command messages
              const response = await generateAIResponse(message.content);
              await bot.helpers.sendMessage(message.channelId, { 
                content: response 
              });
            } catch (error) {
              console.error('Error handling message:', error);
              await bot.helpers.sendMessage(message.channelId, { 
                content: "I encountered an error processing your request." 
              });
            }
          },
        },
      });

      try {
        await startBot(bot);
        console.log('Bot started successfully');
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error starting bot:', error);
        throw error;
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in discord-bot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});