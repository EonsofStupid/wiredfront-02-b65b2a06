import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createBot, startBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { generateAIResponse } from "./ai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, config } = await req.json();

    if (action === 'start') {
      const bot = createBot({
        token: config.bot_token,
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: {
          ready: () => {
            console.log("Successfully connected to Discord!");
          },
          messageCreate: async (bot, message) => {
            if (message.isFromBot) return;

            // Handle custom commands
            if (config.commands) {
              const command = config.commands.find((cmd: any) => 
                message.content.startsWith(cmd.name)
              );

              if (command) {
                if (command.type === 'ai') {
                  try {
                    const response = await generateAIResponse(message.content);
                    await bot.helpers.sendMessage(message.channelId, { 
                      content: response 
                    });
                  } catch (error) {
                    console.error('Error generating AI response:', error);
                    await bot.helpers.sendMessage(message.channelId, { 
                      content: "I encountered an error processing your request." 
                    });
                  }
                } else {
                  await bot.helpers.sendMessage(message.channelId, { 
                    content: command.response 
                  });
                }
                return;
              }
            }

            // Default AI response for non-command messages
            try {
              const response = await generateAIResponse(message.content);
              await bot.helpers.sendMessage(message.channelId, { 
                content: response 
              });
            } catch (error) {
              console.error('Error generating AI response:', error);
              await bot.helpers.sendMessage(message.channelId, { 
                content: "I apologize, but I encountered an error processing your request." 
              });
            }
          },
        },
      });

      await startBot(bot);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});