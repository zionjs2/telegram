/*
If you want to recode, please give credit😩
© powered by 𝑰𝑹𝑭𝑨𝑵𝑭𝑭𝟗
*/
//==---------[ Irfanstore]-----------==//
const fs = require('fs');
const { Telegraf } = require('telegraf');
const obfuscateCode = require('./ZyenOBF');
const axios = require('axios');

// Setup bot token and owner ID
const TOKEN = '8411523772:AAGiHFPuCyY1IhoinsYZo5ee-WU0sebfyk4';  // Replace with your bot token
const OWNER_ID = '7009109669'; // Replace with your owner ID
const bot = new Telegraf(TOKEN);


//JANGAN UBAH TAKUTNYA ERROR
let userSessions = {};

function getRuntime() {
  const uptime = process.uptime(); // Waktu aktif dalam detik
  const days = Math.floor(uptime / (24 * 3600)); // Menghitung hari
  const hours = Math.floor((uptime % (24 * 3600)) / 3600); // Menghitung jam
  const minutes = Math.floor((uptime % 3600) / 60); // Menghitung menit
  const seconds = Math.floor(uptime % 60); // Menghitung detik
  
  return `${days} Hari ${hours} Jam ${minutes} Menit`;
}
// ASCII Art for bot startup
const asciiArt = `
⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⢀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⣴⣤⡀⠀⢀⣀⣤⠤⠤⠶⠖⠒⠒⠒⠒⠒⠲⠶⠤⢤⣀⡀⣼⣛⣧⠀⢁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣸⣏⢻⣍⠁⠀⢀⡀⠤⠄⠒⠒⠒⠒⠒⠒⠀⠤⠄⠀⠀⢸⡳⢾⢹⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⠖⠋⠀⢯⡞⣎⡆⠁⠀⠀⠀⢀⡀⠀⠤⠤⠤⠤⠄⠀⡀⠀⠀⠻⣽⣻⡌⠹⣄⠀⠐⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡾⠁⠀⠀⢀⢾⣹⢿⣸⠀⣰⠎⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠆⠹⡿⣏⢆⠈⢷⡀⠀⠆⠀⠀
⠀⠀⠀⠀⣰⠏⠀⠀⢀⠔⠛⠄⠙⠫⠇⢀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢄⠠⠒⠒⠵⡈⢳⡀⠀⠀⠀
⠀⠄⠀⡰⠁⠀⠀⢠⠊⠄⠂⠁⠈⠁⠒⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠄⢳⡀⠈⠀
⠈⠀⣸⠃⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠐⠀⠀⠐⠀⢀⠀⠀⠀⠀⢷⠀⠀
⠀⢠⠇⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠀⠀⠀⠀⠰⠀⠀⠀⠀⠀⠀⡄⠀⡀⠆⢰⠀⠀⠀⡄⠀⠀⠀⠸⡄⠀
⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠉⠀⡄⠀⢀⠀⠀⡄⠂⠆⠀⠀⠀⠀⢁⠀⢁⠀⢸⠀⢇⠀⡇⠀⠀⠀⠀⣧⠀
⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠰⡃⠄⠈⡄⠀⡇⢀⢰⠀⠀⠀⠀⡼⠀⠸⢰⠀⣤⣅⣁⣴⠀⠀⠀⠀⢻⠀
⢠⡇⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠱⢀⣁⣤⣧⣴⣧⣄⡇⢸⣸⡄⠀⢀⣆⠀⣦⠊⢹⣿⣿⡛⠻⢿⠀⠀⠀⠀⢸⡇
⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⣃⠀⠀⢴⣿⠟⠉⢈⣿⣿⣿⡟⠇⠀⠀⠀⠀⠀⠀⢸⣶⣿⣿⡿⣧⠀⢸⡇⠀⢃⠀⢸⡇
⠈⡇⠀⠀⠀⠀⠀⠀⠀⡀⢉⡄⠀⢸⠁⠀⣷⣾⣿⣿⡟⣿⠀⠀⠀⠀⠀⠀⠀⠀⢧⠙⠋⢁⡟⢀⡦⢧⠀⠸⡇⢸⡇
⠀⣿⠀⠀⠀⠀⠀⠀⢀⠔⠪⡄⠀⠸⣁⠀⠹⣉⠉⠉⢠⠏⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢲⠛⠆⢉⠀⢸⠀⢀⢇⢸⡇
⠀⢿⠀⠀⠀⠀⠀⢀⠃⡐⠐⣴⠀⠀⠏⠉⠖⠉⠋⡙⠁⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⢀⡠⠀⠊⠄⠌⢘⠀⠀⠸⢸⠀
⠀⢸⠀⠀⠀⠀⠀⠈⣆⢃⠘⠘⡀⠀⡸⡘⡐⡐⠠⠁⠀⡴⡖⣲⠒⠊⠉⠉⠉⠙⢿⣤⡇⠀⠀⠀⠈⢐⠀⠀⠁⣿⠀
⠀⠘⡇⠀⠀⠀⠀⠀⠈⢶⠬⣁⡇⠀⠀⠑⠐⠤⠐⠀⠀⡇⠉⠀⠀⠀⠀⠀⠀⠀⠀⢙⠇⠀⠀⠀⠀⣼⢀⠀⠀⣿⠀
⠀⠀⣇⠀⠀⠀⢰⠀⠀⠈⠀⠂⡇⠀⠃⢡⠀⠀⠀⠀⠀⠹⡄⠀⠀⠀⠀⠀⠀⠀⣠⠎⠀⠀⢀⡴⡞⡉⠈⠀⠀⣿⠀
⠀⠀⣹⠀⠀⠀⠀⠀⠀⠀⠀⡀⡇⠀⢰⠈⡷⡀⠀⠀⠀⠀⠸⢶⣀⠀⠀⢀⣰⠎⠁⢀⡶⠏⠁⣈⠆⠁⡀⠰⢸⡇⠀
⠀⠀⢸⡀⢸⠀⠀⠆⠀⠀⠀⠀⡇⠀⠀⠀⢡⡄⡏⢆⠒⠢⠤⠤⠤⢨⠥⡴⠒⠚⠉⠉⠀⠀⡠⠁⡘⢠⠁⢀⠆⡇⠀
⠀⠀⢸⡇⠀⡀⠀⠀⠀⠀⢠⢠⠁⠀⠘⡀⠠⣷⠃⠀⠀⠀⠀⠉⢰⠈⢱⠄⡀⡄⠀⢸⠀⠐⠀⠰⠁⠀⠀⡞⠄⣷⠀
⠀⠀⠀⣷⠀⡇⠀⠀⠀⠸⠀⡈⠀⠀⢂⠃⠀⡄⠇⠀⠀⠀⠀⠀⢔⠳⠀⠀⠣⠍⠒⠤⣰⠁⢠⠃⢠⠀⠀⠅⠀⢻⡀
⠀⠀⠀⠉⠀⠁⠀⠀⠀⠀⠀⠁⠀⠀⠈⠀⠀⠁⠈⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀⠈⠁⠀⠈⠀⠁⠀⠈⠀⠀⠁⠀⠈⠁
• Created By Irfanstore
• t.me/Irfanff9
• wa.me/6289699892999
> Bot Is Connect                   
`;

// Log ASCII art to console
console.log(asciiArt);

// Start the bot
bot.start((ctx) => {
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 

  // URL foto yang akan dikirim
  ctx.replyWithPhoto('https://files.catbox.moe/wsshs8.jpg', {
    caption: `
*Hi*, ${firstName} ${lastName}
> I'm *Irfanbot* 
This Bot Telegram With Type JavaScript
Developed By The Irfanff9

♱ ⌜포ㄊ𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐔𝐒𝐄𝐑⌟
╎ 포ㄊ : *Developer: irfanff9*
╎ 포ㄊ : *BotName: IrfanbotTele*
╎ 포ㄊ : *Version: 1.0*
╎ 포ㄊ : *Type: Case*
╎ 포ㄊ : *Prefix: Multi*
╎ 포ㄊ : *runtime: ${getRuntime()}*
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯

♱ ⌜ 𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔 ⌟ 
╎ 포ㄊ : /obfmenu 
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯

♱ ⌜ 𝐒𝐓𝐀𝐓𝐔𝐒 ⌟ 
╎ 포ㄊ : /info 
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`,
    reply_markup: {
      inline_keyboard: [
        [
            { text: '𝐂𝐑𝐄𝐀𝐓𝐎𝐑', url: 'wa.me/6289699892999' }
        ]
      ]
    },
    parse_mode: "Markdown"
  });
});

// Obfuscation menu
bot.command('obfmenu', (ctx) => {
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
  // URL foto yang akan dikirim
  ctx.replyWithPhoto('https://files.catbox.moe/wsshs8.jpg', {
    caption: `
*Hi*, ${firstName} ${lastName}
> I'm *Irfanbot* 
This Is Menu For Obf javascript 
Created By Irfanstore

♱ ⌜포ㄊ𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐔𝐒𝐄𝐑⌟
╎ 포ㄊ : *Developer: 𝑰𝑹𝑭𝑨𝑵𝑭𝑭𝟗*
╎ 포ㄊ : *BotName: IrfanbotTele*
╎ 포ㄊ : *Version: 1.0*
╎ 포ㄊ : *Type: Case*
╎ 포ㄊ : *Prefix: Multi*
╎ 포ㄊ : *runtime: ${getRuntime()}*
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯

♱ ⌜ 𝐎𝐁𝐅 𝐌𝐄𝐍𝐔 ⌟ 
╎ 포ㄊ : /obf1 - Var [HardObf!]
╎ 포ㄊ : /obf2 - Var [ExtremeObf!]
╎ 포ㄊ : /obf3 - DeadCode [ExtremeObf!]
╎ 포ㄊ : /obf4 - EncCode [ExtremeObf!!]
╎ 포ㄊ : /obf5 - ABCD [HardObf!]
╎ 포ㄊ : /obf6 - Name [ExtremeObf!!]
╎ 포ㄊ : /obf7 - Name [ExtremeObf!!]
╎ 포ㄊ : /obf8 - Name [ExtremeObf!]
╎ 포ㄊ : /obf9 - Crass [HardObf!]
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯
> Send your .js file after selecting the obfuscation type.`,
   reply_markup: {
      inline_keyboard: [
        [
            { text: '𝐂𝐑𝐄𝐀𝐓𝐎𝐑', url: 'wa.me/6289699892999' }
        ]
      ]
    },
    parse_mode: "Markdown"
  });
});


// Handler untuk perintah /info
bot.command('info', (ctx) => {
  const username = ctx.from.username || 'Unknown'; // Nama pengguna
  const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
  const lastName = ctx.from.last_name || ''; // Nama belakang pengguna
  const userId = ctx.from.id; // ID pengguna

  // Kirimkan pesan info kepada pengguna
  ctx.reply(`
♱ ⌜𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑⌟
╎ Username: @${username}
╎ User ID: ${userId}
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯
♱ ⌜𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑⌟
╎ Developer: Irfanstore
╎ Contact: https://t.me/Irfanff9
╎ Contact: https://wa.me/6289699892999
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});
//OBF CMD
bot.command('obf1', (ctx) => {
    const userId = ctx.from.id.toString();
   const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 

    userSessions[userId] = { obfuscationType: 'obf1' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for Obfuscation
(Rename All Variable Var)

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

// Command for obfuscation type obf2 (Hexadecimal Anti Dec)
bot.command('obf2', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf2' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for Obfuscation
(Hexadecimal Anti Dec).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

// Command for obfuscation type obf3 (Random Deadcode)
bot.command('obf3', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf3' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for Obfuscation
(Random Deadcode).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

// Command for obfuscation type obf4 (Return Obfuscation)
bot.command('obf4', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf4' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for Obfuscation
(Random Enccode).


♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

//mangled
bot.command('obf5', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf5' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for
Mangled Obfuscation (Type 5)

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

bot.command('obf6', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf6' };
             ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for 
Mangled Obfuscation (Type 6).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

bot.command('obf7', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf7' };
 ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for
Mangled Obfuscation (Type 7).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

bot.command('obf8', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf8' };
    ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for
Mangled Obfuscation (Type 8).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});

bot.command('obf9', (ctx) => {
    const userId = ctx.from.id.toString();
const firstName = ctx.from.first_name || 'Unknown'; // Nama depan pengguna
const lastName = ctx.from.last_name || ''; // Nama belakang 
   

    userSessions[userId] = { obfuscationType: 'obf9' };
ctx.reply(`
Hi, ${firstName} ${lastName}
> I'm Irfanbot
Please send your .js file for
Mangled Obfuscation (Type 9).

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : Waiting Your Sent File.
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`);
});



function isOwner(userId) {
    return userId.toString() === OWNER_ID;
}

// Handle document uploads for premium users
bot.on('document', async (ctx) => {
    const userId = ctx.from.id.toString();

    const fileName = ctx.message.document.file_name;

    if (!fileName.endsWith('.js')) {
        return ctx.reply('❌ Please send a file with the .js extension.');
    }

    if (!userSessions[userId] || !userSessions[userId].obfuscationType) {
        return ctx.reply('❌ Please select an obfuscation type first using one of the commands.');
    }

    const obfuscationType = userSessions[userId].obfuscationType;

    //I LOVE YOU 

    await handleDocumentObfuscation(ctx, obfuscationType);
});

async function handleDocumentObfuscation(ctx, option) {
    const fileId = ctx.message.document.file_id;
    const firstName = ctx.from.first_name || 'Unknown'; 
    const lastName = ctx.from.last_name || ''; 
    const loadingMessage = await ctx.reply('Preparing obfuscation...');

    try {
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const code = await downloadFile(fileLink);

        await ctx.telegram.editMessageText(ctx.chat.id, loadingMessage.message_id, undefined, 'Encrypting...');
        const obfuscatedCode = await obfuscateCode(code, option);

        await ctx.telegram.editMessageText(ctx.chat.id, loadingMessage.message_id, undefined, 'Sending file...');
        await ctx.replyWithDocument({ source: Buffer.from(obfuscatedCode), filename: 'ZyenOBF.js' }, {
            caption: `
*Hi*, ${firstName} ${lastName}
> I'm *Irfanbot* 
this is your file after obf and Don't 
forget say thank you to 𝑰𝑹𝑭𝑨𝑵𝑭𝑭𝟗

♱ ⌜포ㄊ𝐒𝐓𝐀𝐓𝐔𝐒⌟
╎ 포ㄊ : *Type: ${option}*
╎ 포ㄊ : *Obfuscation complete!*
╰╌╌╌╌╌╌╌╌╌╌╌╌╌⌯`,
            parse_mode: 'Markdown'
        });

    } catch (error) {
        console.error('Error during obfuscation process:', error);
        await ctx.telegram.editMessageText(ctx.chat.id, loadingMessage.message_id, undefined, '❌ An error occurred during obfuscation.');
    }
}
 
 
 
async function downloadFile(fileLink) {
    try {
        const response = await axios.get(fileLink);
        return response.data;
    } catch (error) {
        console.error('Error downloading the file:', error);
        throw new Error('Failed to download the file');
    }
}


bot.launch();