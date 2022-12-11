const express = require('express')
const router = express.Router()

/**
 * GET product list.
 *
 * @return product list | empty.
 */
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
