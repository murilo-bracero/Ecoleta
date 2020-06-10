import knex from '../database/connection'
import { Request, Response } from 'express'
import Points from '../Models/Points'

class PointsController {
    async index(req: Request, res: Response){
        const { city, uf, items } = req.query

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await Points.getPoints(
            String(city), 
            String(uf), 
            items ? parsedItems : undefined
        )
        
        const serializedPoints = points.map(
            point => {
                return {
                    ...point,
                    image: `http://192.168.15.147:8080/uploads/${point.image}`
                }
            }
        )

        return res.json(serializedPoints)
    }

    async show (req: Request, res: Response) {
        const { id } = req.params

        const point = await Points.getPointById(Number(id))

        if(!point){
            return res.status(404).json({ message: 'Point not found' })
        }

        return res.status(200).json({ 
            ...point,
            image: `http://192.168.15.147:8080/uploads/${point.image}`
        })
    }

    async create (req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            addressNumber,
            city,
            uf,
            items
        } = req.body
        
        const parsedItems = items.split(',').map((item: string) => Number(item.trim()))

        const image = req.file.filename

        const point = new Points(
            image, name, email, whatsapp, latitude, longitude, addressNumber, city, uf, parsedItems
        )

        await point.create()

        return res.status(201).json(point.serialized())
    }
}

export default new PointsController()
