const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const router = express.Router()

/**
 * GET product list.
 *
 * @return product list | empty.
 */
// replace the value below with the Telegram token you receive from @BotFather
const token = '5601866191:AAEY7F3tBgxmnwVV3xz4dcQdKKjVBPyLJ1o'

const webAppUrl = 'https://tg-web-app-frontend.vercel.app'
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

//Взаимодействие с пользователем
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text //Вытаскиваю текст из сообщения, которое отправил пользователь

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]
        ]
      }
    })

    await bot.sendMessage(chatId, 'Заходи на наш сайт', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
        ]
      }
    })
  }

  //Если в сообщении прилетело поле web_app_data и поле data у него непутое, то обрабатываю данные
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data) //изначально data в виде строки
      await bot.sendMessage(chatId, 'Спасибо за обратную связь')
      await bot.sendMessage(chatId, `Ваша страна: ${data.country}`)
      await bot.sendMessage(chatId, `Ваша улица: ${data.street}`)
      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате')
      }, 2000)
    } catch (e) {
      console.log(e)
    }
  }
})

router.get('/', async (req, res) => {
  try {
    res.json({
      status: 200,
      message: 'Get data has successfully'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server error')
  }
})

router.post('/web-data', async (req, res) => {
  const { queryId, products, totalPrice } = req.body
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {
        message_text: `Поздравляю с покупкой! Вы приобрели ${products
          .map((product) => product.title)
          .join(', ')} на сумму ${totalPrice}`
      }
    })
    return res.status(200).json({ success: true })
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не удалось приобрести товар',
      input_message_content: {
        message_text: 'Не удалось приобрести товар'
      }
    })
    return res.status(500).json({})
  }
})

/** Метод answerWebAppQuery на вход ожидает queryId, который является соединяющим звеном для взаимодействия с ботом */

module.exports = router
