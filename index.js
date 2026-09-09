// index.js — Zerxion Yardım Menüsü 
import {
  Client, GatewayIntentBits, EmbedBuilder, Colors,
  ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle
} from '@jubbio/core';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GÜVENLİ GÖNDERİCİ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function gonder(message, options) {
  try {
    return await message.reply(options);
  } catch {
    return await client.rest.createMessage(
      message.guildId,
      message.channelId,
      options
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  KATEGORİLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const KATEGORILER = {
  moderasyon: {
    ad: '🔧 Moderasyon',
    aciklama: 'Sunucuyu yönetme komutları',
    emoji: '🔧',
    renk: Colors.Red,
    komutlar: [
      ['ban <üye> <sebep>', 'Kullanıcıyı sunucudan yasaklar'],
      ['kick <üye> <sebep>', 'Kullanıcıyı sunucudan atar'],
      ['timeout <üye> <süre>', 'Üyeye geçici sessizlik verir'],
      ['temizle <sayı>', 'Kanaldaki mesajları toplu siler'],
      ['rol-ver <üye> <rol>', 'Üyeye rol verir'],
      ['unban <id>', 'Yasağı kaldırır']
    ]
  },
  kullanici: {
    ad: '👤 Kullanıcı',
    aciklama: 'Kullanıcıya özel komutlar',
    emoji: '👤',
    renk: Colors.Blue,
    komutlar: [
      ['profil', 'Profil kartını gösterir'],
      ['avatar <üye>', 'Avatarı büyütüp gösterir'],
      ['sunucu-bilgi', 'Sunucu bilgilerini gösterir'],
      ['seviye', 'Seviye kartını gösterir']
    ]
  },
  eglence: {
    ad: '🎉 Eğlence',
    aciklama: 'Eğlenceli mini oyunlar',
    emoji: '🎉',
    renk: Colors.Gold,
    komutlar: [
      ['zar', 'Zar atar'],
      ['yazitura', 'Yazı tura atar'],
      ['espri', 'Rastgele espri yapar'],
      ['aşkölç <kişi1> <kişi2>', 'İki kişi arasındaki uyumu ölçer']
    ]
  },
  sistem: {
    ad: '⚙️ Sistem',
    aciklama: 'Bot bilgi komutları',
    emoji: '⚙️',
    renk: Colors.Green,
    komutlar: [
      ['ping', 'Bot gecikmesini gösterir'],
      ['bilgi', 'Bot hakkında bilgi verir'],
      ['davet', 'Bot davet linkini atar']
    ]
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EMBED OLUŞTURUCULAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function anaMenuEmbed(kullanici) {
  const toplamKomut = Object.values(KATEGORILER)
    .reduce((t, k) => t + k.komutlar.length, 0);

  return new EmbedBuilder()
    .setColor(Colors.Purple)
    .setAuthor({ name: 'Zerxion Yardım Sistemi', iconURL: client.user.displayAvatarURL() })
    .setTitle('⚡ Zerxion — Komut Menüsü')
    .setDescription(
      '> Merhaba! Ben **Zerxion** ⚡\n' +
      '> Aşağıdaki **menüden** bir kategori seçerek komutları görebilirsin.\n\n' +
      `**Prefix:** \`${PREFIX}\`\n` +
      `**Komut Sayısı:** ${toplamKomut}`
    )
    .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
    .setFooter({
      text: `İstenen: ${kullanici.username} • Zerxion`,
      iconURL: kullanici.displayAvatarURL()
    })
    .setTimestamp();
}

function kategoriEmbed(kategoriKey, kullanici) {
  const k = KATEGORILER[kategoriKey];
  if (!k) return null;

  return new EmbedBuilder()
    .setColor(k.renk)
    .setAuthor({ name: 'Zerxion Yardım Sistemi', iconURL: client.user.displayAvatarURL() })
    .setTitle(`${k.ad} Komutları`)
    .setDescription(
      k.komutlar
        .map(([cmd, desc]) => `> \`${PREFIX}${cmd}\` — **${desc}**`)
        .join('\n')
    )
    .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
    .setFooter({
      text: `İstenen: ${kullanici.username} • Zerxion`,
      iconURL: kullanici.displayAvatarURL()
    })
    .setTimestamp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COMPONENT OLUŞTURUCULAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function yardimMenu(secili) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('zerxion_yardim')
      .setPlaceholder('Bir kategori seç...')
      .addOptions(
        Object.entries(KATEGORILER).map(([key, k]) => ({
          label: k.ad,
          value: key,
          description: k.aciklama,
          emoji: k.emoji,
          default: key === secili
        }))
      )
  );
}

function altButonlar() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('zerxion_anamenu')
      .setLabel('Ana Menü')
      .setEmoji('🏠')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setLabel('Beni Davet Et')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Link)
      .setURL('https://jubbio.com/'),
    new ButtonBuilder()
      .setLabel('Destek Sunucusu')
      .setEmoji('🛠️')
      .setStyle(ButtonStyle.Link)
      .setURL('https://jubbio.com/')
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PREFIX KOMUTLARI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (['yardim', 'yardım', 'help', 'komutlar'].includes(command)) {
    await gonder(message, {
      embeds: [anaMenuEmbed(message.author)],
      components: [yardimMenu(null), altButonlar()]
    });
  }

  if (command === 'ping') {
    const sent = await gonder(message, '🏓 Ölçülüyor...');
    const gecikme = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(`🏓 **Pong!** Gecikme: \`${gecikme}ms\``);
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INTERACTION İŞLEYİCİ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
client.on('interactionCreate', async (interaction) => {
  try {
    // Select menü: kategori göster
    if (interaction.customId === 'zerxion_yardim') {
      const secilen = interaction.values && interaction.values[0];

      if (!secilen || !KATEGORILER[secilen]) {
        await interaction.reply({ content: '❌ Kategori bulunamadı.', ephemeral: true });
        return;
      }

      const embed = kategoriEmbed(secilen, interaction.user);

      await interaction.update({
        embeds: [embed],
        components: [yardimMenu(secilen), altButonlar()]
      });
      return;
    }

    // Buton: ana menüye dön
    if (interaction.customId === 'zerxion_anamenu') {
      await interaction.update({
        embeds: [anaMenuEmbed(interaction.user)],
        components: [yardimMenu(null), altButonlar()]
      });
      return;
    }
  } catch (err) {
    console.error('[Zerxion] Interaction hatası:', err);
    try {
      await interaction.reply({
        content: '❌ Bir hata oluştu!',
        ephemeral: true
      });
    } catch {}
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BAŞLATMA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
client.on('ready', () => {
  console.log(`⚡ ${client.user.username} hazır! ${client.guilds.size} sunucu aktif.`);
});

client.on('error', (error) => {
  console.error('Client hatası:', error);
});

await client.login(process.env.BOT_TOKEN);
