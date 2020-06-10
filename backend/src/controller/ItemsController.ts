import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
  async index (req: Request, res: Response) {
    const items = await knex('items').select('*')

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.15.147:8080/uploads/${item.image}`
      }
    })

    return res.send(serializedItems)
  }
}

export default new ItemsController()
