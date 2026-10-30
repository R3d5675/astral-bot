/**
 * 🌟 A S T R A L  SMP - Official Bot 2026
 * بوت ديسكورد شامل ومتكامل:
 * - أوامر السلاش الحديثة (/help, /server, /ticket, /clear, /ban, /kick, /rules)
 * - نظام الترحيب التلقائي
 * - نظام التذاكر بالأزرار التفاعلية
 * - لوحة معلومات ماين كرافت الحية
 */

const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

// تعريف أوامر السلاش (Slash Commands)
const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض قائمة جميع أوامر البوت المتاحة'),

  new SlashCommandBuilder()
    .setName('server')
    .setDescription('عرض معلومات وآي بي سيرفر ماين كرافت A S T R A L SMP'),

  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('عرض قوانين السيرفر الرسمية'),

  new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('إنشاء لوحة فتح تذاكر الدعم الفني (للإدارة فقط)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('مسح عدد معين من الرسائل من الشات (للإدارة فقط)')
    .addIntegerOption(opt => 
      opt.setName('amount')
         .setDescription('عدد الرسائل المراد مسحها (1 إلى 100)')
         .setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد عضو من السيرفر (للإدارة فقط)')
    .addUserOption(opt => opt.setName('user').setDescription('العضو المراد طرده').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('سبب الطرد'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('حظر (بان) عضو من السيرفر (للإدارة فقط)')
    .addUserOption(opt => opt.setName('user').setDescription('العضو المراد حظره').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('سبب الحظر'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
].map(cmd => cmd.toJSON());

// عند تشغيل البوت بنجاح
client.once('ready', async () => {
  console.log(`===============================================`);
  console.log(`🤖 بوت A S T R A L SMP يعمل الآن بنجاح!`);
  console.log(`👤 مسجل الدخول باسم: ${client.user.tag}`);
  console.log(`===============================================`);

  // تعيين حالة البوت
  client.user.setActivity('⛏️ A S T R A L SMP | /help', { type: 0 });

  // تسجيل الأوامر في ديسكورد
  try {
    const rest = new REST({ version: '10' }).setToken(config.TOKEN);
    console.log('🔄 جاري تحديث وتسجيل أوامر السلاش (/)...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('✅ تم تسجيل أوامر السلاش بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في تسجيل أوامر السلاش:', error);
  }
});

// استقبال التفاعل مع أوامر السلاش
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // أمر /help
    if (commandName === 'help') {
      const helpEmbed = new EmbedBuilder()
        .setColor(config.COLORS.PRIMARY)
        .setTitle(`📖 قائمة أوامر بوت ${config.MINECRAFT.SERVER_NAME}`)
        .setDescription(`مرحباً بك! هنا جميع أوامر السيرفر التي يمكنك استخدامها:`)
        .addFields(
          { name: '🎮 أوامر ماين كرافت', value: '`/server` - عرض معلومات ورابط الآي بي\n`/rules` - عرض قوانين اللعب والسيرفر' },
          { name: '🛡️ أوامر الإدارة', value: '`/ticket-panel` - نشر لوحة التذاكر\n`/clear [العدد]` - مسح رسائل الشات\n`/kick [العضو]` - طرد عضو\n`/ban [العضو]` - حظر عضو' }
        )
        .setFooter({ text: 'A S T R A L SMP © 2026', iconURL: interaction.guild?.iconURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [helpEmbed] });
    }

    // أمر /server
    else if (commandName === 'server') {
      const serverEmbed = new EmbedBuilder()
        .setColor(config.COLORS.GOLD)
        .setTitle(`⛏️ معلومات سيرفر ${config.MINECRAFT.SERVER_NAME}`)
        .setDescription(`سيرفر Survival SMP متكامل يدعم جميع اللاعبين!`)
        .addFields(
          { name: '🌐 الآي بي (Server IP)', value: `\`${config.MINECRAFT.IP}\``, inline: true },
          { name: '📶 الإصدارات المدعومة', value: `\`${config.MINECRAFT.VERSION}\``, inline: true },
          { name: '🎮 نوع الحسابات', value: 'أصلي + مكرك (Cracked & Premium)', inline: false },
          { name: '💎 المميزات', value: 'حماية أراضي (Claims) • اقتصاد ومتاجر • رتب مميزة • فعاليات أسبوعية', inline: false }
        )
        .setThumbnail(interaction.guild?.iconURL())
        .setFooter({ text: 'نتمنى لكم وقتاً ممتعاً في اللعب!' });

      await interaction.reply({ embeds: [serverEmbed] });
    }

    // أمر /rules
    else if (commandName === 'rules') {
      const rulesEmbed = new EmbedBuilder()
        .setColor(config.COLORS.ERROR)
        .setTitle(`📜 قوانين سيرفر ${config.MINECRAFT.SERVER_NAME}`)
        .setDescription(`الالتزام بالقوانين يضمن تجربة لعب عادلة وممتعة للجميع:`)
        .addFields(
          { name: '1️⃣ الاحترام المتبادل', value: 'يُمنع السب والشتم والتشهير بأي شكل.' },
          { name: '2️⃣ منع الهاك والغش', value: 'استخدام X-Ray أو KillAura أو أي برامج تعديل يعرضك للباند النهائي.' },
          { name: '3️⃣ منع التخريب والسرقة', value: 'احترام ممتلكات وأراضي اللاعبين الآخرين.' },
          { name: '4️⃣ الإعلانات', value: 'ممنوع نشر روابط سيرفرات أخرى سواء في العام أو الخاص.' }
        )
        .setFooter({ text: 'مخالفة القوانين تعرضك للميوت أو الطرد أو الباند.' });

      await interaction.reply({ embeds: [rulesEmbed] });
    }

    // أمر /ticket-panel
    else if (commandName === 'ticket-panel') {
      const panelEmbed = new EmbedBuilder()
        .setColor(config.COLORS.PURPLE)
        .setTitle('🎫 نظام الدعم الفني والتذاكر | Support System')
        .setDescription('هل تواجه مشكلة؟ أو ترغب بشراء رتبة في سيرفر ماين كرافت؟\nاضغط على الزر بالأسفل لفتح تذكرة خاصة بك مع الإدارة:')
        .setFooter({ text: 'A S T R A L SMP - سيتم الرد عليك في أقرب وقت' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket_btn')
          .setLabel('📩 فتح تذكرة دعم')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({ content: '✅ تم إنشاء لوحة التذاكر بنجاح!', ephemeral: true });
      await interaction.channel.send({ embeds: [panelEmbed], components: [row] });
    }

    // أمر /clear
    else if (commandName === 'clear') {
      const amount = interaction.options.getInteger('amount');
      if (amount < 1 || amount > 100) {
        return interaction.reply({ content: '❌ الرجاء إدخال عدد بين 1 و 100.', ephemeral: true });
      }

      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🧹 تم مسح **${amount}** رسالة بنجاح!`, ephemeral: true });
    }

    // أمر /kick
    else if (commandName === 'kick') {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'لم يتم تحديد سبب';
      const member = interaction.guild.members.cache.get(targetUser.id);

      if (!member) return interaction.reply({ content: '❌ هذا العضو غير موجود بالسيرفر.', ephemeral: true });
      if (!member.kickable) return interaction.reply({ content: '❌ لا أملك صلاحية طرد هذا العضو (رتبته أعلى مني).', ephemeral: true });

      await member.kick(reason);
      await interaction.reply({ content: `👢 تم طرد **${targetUser.tag}** بنجاح! (السبب: ${reason})` });
    }

    // أمر /ban
    else if (commandName === 'ban') {
      const targetUser = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'لم يتم تحديد سبب';
      const member = interaction.guild.members.cache.get(targetUser.id);

      if (member && !member.bannable) return interaction.reply({ content: '❌ لا أملك صلاحية حظر هذا العضو.', ephemeral: true });

      await interaction.guild.bans.create(targetUser.id, { reason });
      await interaction.reply({ content: `🔨 تم حظر **${targetUser.tag}** نهائياً من السيرفر! (السبب: ${reason})` });
    }
  }

  // التفاعل مع زر فتح التذكرة
  else if (interaction.isButton()) {
    if (interaction.customId === 'create_ticket_btn') {
      const user = interaction.user;
      const guild = interaction.guild;

      // التأكد من عدم فتح أكثر من تذكرة لنفس الشخص
      const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
      if (existingChannel) {
        return interaction.reply({ content: `⚠️ لديك تذكرة مفتوحة بالفعل: <#${existingChannel.id}>`, ephemeral: true });
      }

      // إنشاء روم التذكرة الخاصة
      const ticketChannel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel] // إخفاء عن الكل
          },
          {
            id: user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
          },
          {
            id: client.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          }
        ]
      });

      const ticketEmbed = new EmbedBuilder()
        .setColor(config.COLORS.SUCCESS)
        .setTitle(`🎫 مرحباً بك يا ${user.username}`)
        .setDescription(`لقد قمت بفتح تذكرة دعم فني خاصة.\nيرجى كتابة استفسارك أو مشكلتك هنا بالتفصيل، وسيتواصل معك أحد أفراد الإدارة قريباً!`)
        .setFooter({ text: 'A S T R A L SMP - نظام التذاكر الآلي' });

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket_btn')
          .setLabel('🔒 إغلاق التذكرة')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ content: `<@${user.id}> مرحباً بك!`, embeds: [ticketEmbed], components: [closeRow] });
      await interaction.reply({ content: `✅ تم فتح تذكرتك بنجاح في الروم: <#${ticketChannel.id}>`, ephemeral: true });
    }

    // زر إغلاق التذكرة
    else if (interaction.customId === 'close_ticket_btn') {
      await interaction.reply({ content: '🔒 سيتم إغلاق وحذف هذه التذكرة خلال 5 ثوانٍ...' });
      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch (e) {
          console.error(e);
        }
      }, 5000);
    }
  }
});

// رسالة ترحيبية تلقائية عند انضمام عضو جديد
client.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.cache.find(ch => ch.name.includes('welcome') || ch.name.includes('الترحيب'));
  if (welcomeChannel) {
    const welcomeEmbed = new EmbedBuilder()
      .setColor(config.COLORS.SUCCESS)
      .setTitle(`👋 مرحباً بك في مجتمع ${config.MINECRAFT.SERVER_NAME}!`)
      .setDescription(`أهلاً بك يا <@${member.id}> في ديسكورد السيرفر.\nنورت السيرفر نتمنى لك تجربة لعب ممتعة! ⛏️`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `أنت العضو رقم: ${member.guild.memberCount}` });

    welcomeChannel.send({ embeds: [welcomeEmbed] });
  }
});

const http = require('http');

// خادم ويب مدمج لتشغيل البوت 24/7 على Render واستضافات السحابة
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('A S T R A L Bot is Online 24/7! 🤖⛏️');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 خادم الويب يعمل على البورت: ${PORT}`);
});

client.login(config.TOKEN);

