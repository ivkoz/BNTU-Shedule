// Подключаем библиотеку для работы с Telegram API в переменную
var TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
let lastMessageId;
const schedule = JSON.parse(fs.readFileSync('C:/Users/ыукп/Desktop/chatgpt/BNTU Schedule/data/schedule.json', 'utf8'));


// Устанавливаем токен, который выдавал нам бот
var token = '5824246161:AAEDjCTe_HJgxsrvN5kLXHS2-4J2lPXtbOA';
// Включить опрос сервера. Бот должен обращаться к серверу Telegram, чтобы получать актуальную информацию
// Подробнее: https://core.telegram.org/bots/api#getupdates
var bot = new TelegramBot(token, { polling: true });

// Определяем объект клавиатуры
const menu2Keyboard = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'ФГДЭ', callback_data: 'FGDE' }],
          [{ text: 'АТФ', callback_data: 'ATF' }],
          [{ text: 'ФИТР', callback_data: 'FITR' }],
          [{ text: 'ПСФ', callback_data: 'PSF' }]
    ]
  })
};



// Обработчик событий на нажатие кнопок в первом меню
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const messageId = query.message.message_id;
  
  if (data === 'FGDE') {
    // Если пользователь нажал на кнопку "ФГДЭ", то заменяем клавиатуру на клавиатуру с выбором курса
    bot.editMessageReplyMarkup(
      {
        inline_keyboard: [
          [{ text: '1 курс', callback_data: 'first_course_fgde' }],
          [{ text: '2 курс', callback_data: 'second_course_fgde' }],
          [{ text: 'Назад', callback_data: 'back' }]
        ]
      },
      {chat_id: chatId, message_id: messageId},
    ).then(() => {
      // Сохраняем ID предыдущего сообщения
      lastMessageId = messageId;
    });
  } else if (data === 'first_course_fgde') {
    // Если пользователь нажал на кнопку "1 курс" для ФГДЭ, то редактируем предыдущее сообщение с расписанием первого курса и клавиатурой "Назад"
    bot.editMessageText('Выберите специальность:', {
      chat_id: chatId,
      message_id: lastMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'ГМ', callback_data: 'GM_1' }],
          [{ text: 'РМПИ', callback_data: 'second_course_fgde' }],
          [{ text: 'Назад', callback_data: 'FGDE' }]
        ]
      }
    });
  } else if (data === 'second_course_fgde') {
    // Если пользователь нажал на кнопку "2 курс" для ФГДЭ, то редактируем предыдущее сообщение с расписанием второго курса и клавиатурой "Назад"
    bot.editMessageText('Расписание для второго курса ФГДЭ:', {
      chat_id: chatId,
      message_id: lastMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Назад', callback_data: 'FGDE' }]
        ]
      }
    });
  }
  else if (data === 'GM_1') {
    // Если пользователь нажал на кнопку "1 курс" для Горных машин, то редактируем предыдущее сообщение с расписанием второго курса и клавиатурой "Назад"
    console.log('1')
    const gmSchedule = schedule[data]['1 курс']; // получаем расписание для 1 курса Горных машин из файла JSON
    console.log('1')
    bot.editMessageText(gmSchedule, {
      chat_id: chatId,
      message_id: lastMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Назад', callback_data: 'FGDE' }]
        ]
      }
    });
  } else if (data === 'back') {
    // Если пользователь нажал на кнопку "Назад", то возвращаемся к первому меню
    bot.sendMessage(chatId, 'Выберите интересующий вас факультет 🏛:', menu2Keyboard).then((message) => {
      // После отправки сообщения с первым меню, удаляем текущее сообщение с кнопками
      bot.deleteMessage(chatId, messageId);
      // Сохраняем ID предыдущего сообщения
      lastMessageId = message.message_id;
    });
  }
});


// Функция, которая будет вызвана при нажатии на кнопку "Кнопка 2" в первом меню
function showMenu2(chatId) {
  bot.sendMessage(chatId, 'Выберите любую кнопку:', menu2Keyboard);
}

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Выберите интересующий вас факультет 🏛:', menu2Keyboard);
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Здравствуй');
});

