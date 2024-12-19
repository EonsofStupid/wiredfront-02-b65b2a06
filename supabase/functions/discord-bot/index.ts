import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createBot, startBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { generateAIResponse } from "./ai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handleQuoteCommand = async (message: any, type: 'idiot' | 'dope', content: string, tags: string[]) => {
  const { data: quote, error } = await supabase.from('discord_quotes').insert({
    server_id: message.guildId,
    user_id: message.authorId,
    quote_type: type,
    content: content,
    author: message.author.username,
    tags: tags
  }).single();

  if (error) {
    console.error('Error saving quote:', error);
    return `Failed to save quote: ${error.message}`;
  }

  return `Quote saved successfully! ID: ${quote.id}`;
};

const handleRandomQuote = async (serverId: string, type?: 'idiot' | 'dope') => {
  let query = supabase.from('discord_quotes').select('*').eq('server_id', serverId);
  
  if (type) {
    query = query.eq('quote_type', type);
  }
  
  const { data: quotes, error } = await query;
  
  if (error || !quotes?.length) {
    return "No quotes found!";
  }
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return `"${randomQuote.content}" - ${randomQuote.author} ${
    randomQuote.tags?.length ? `[${randomQuote.tags.join(', ')}]` : ''
  }`;
};

serve(async (req) => {
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
              const content = message.content.toLowerCase();
              
              // Handle quote commands
              if (content.startsWith('!idiot ') || content.startsWith('!dope ')) {
                const type = content.startsWith('!idiot') ? 'idiot' : 'dope';
                const quoteContent = message.content.slice(type.length + 2);
                const tags = quoteContent.match(/#\w+/g) || [];
                const cleanContent = quoteContent.replace(/#\w+/g, '').trim();
                
                const response = await handleQuoteCommand(message, type, cleanContent, tags);
                await bot.helpers.sendMessage(message.channelId, { content: response });
                return;
              }
              
              // Handle random quote retrieval
              if (content === '!randomquote' || content === '!randomidiot' || content === '!randomdope') {
                const type = content === '!randomidiot' ? 'idiot' : 
                           content === '!randomdope' ? 'dope' : undefined;
                           
                const quote = await handleRandomQuote(message.guildId.toString(), type);
                await bot.helpers.sendMessage(message.channelId, { content: quote });
                return;
              }

              // Default AI response for non-command messages
              const response = await generateAIResponse(message.content);
              await bot.helpers.sendMessage(message.channelId, { content: response });
              
              // Update message count
              await supabase
                .from('discord_bot_config')
                .update({ 
                  total_messages: bot.totalMessages + 1 
                })
                .eq('bot_token', config.bot_token);
                
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