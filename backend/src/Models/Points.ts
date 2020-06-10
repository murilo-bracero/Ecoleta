import { Point } from '../ADTs/Point'
import knex from '../database/connection'

class Points implements Point {
    id!: number
    image: string
    name: string
    email: string
    whatsapp: string
    latitude: number
    longitude: number
    addressNumber: number
    city: string
    uf: string
    items: number[]

    constructor(
        image: string,
        name: string,
        email: string,
        whatsapp: string,
        latitude: number,
        longitude: number,
        addressNumber: number,
        city: string,
        uf: string,
        items: number[]) {

        this.image = image
        this.name = name
        this.email = email
        this.whatsapp = whatsapp
        this.latitude = latitude
        this.longitude = longitude
        this.addressNumber = addressNumber
        this.city = city
        this.uf = uf
        this.items = items
    }

    serialized (): Point{

        return {
            id: this.id,
            image: `http://192.168.15.147:8080/uploads/${this.image}`,
            name: this.name,
            email: this.email,
            whatsapp: this.whatsapp,
            latitude: this.latitude,
            longitude: this.longitude,
            addressNumber: this.addressNumber,
            city: this.city,
            uf: this.uf,
            items: this.items
        }
    }

    async create (): Promise<void> {
        const serializedPoint = {
            image: this.image,
            name: this.name,
            email: this.email,
            whatsapp: this.whatsapp,
            latitude: this.latitude,
            longitude: this.longitude,
            addressNumber: this.addressNumber,
            city: this.city,
            uf: this.uf,
        }

        const trx = await knex.transaction()

        const insertedIds = await trx('points').insert(serializedPoint)

        this.id = insertedIds[0]

        const pointItems = this.items.map((item_id: number) => {
            return {
                item_id,
                point_id: this.id
            }
        })

        await trx('points_items').insert(pointItems)

        await trx.commit()
    }

    static async getPointById (id: number): Promise<Point | undefined> {
        const point = await knex('points').where('id', id).first()

        if (!point) {
            return undefined
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)

        return {
            ...point,
            items
        }
    }

    static async getPoints (city?: string, uf?: string, items?: number[]): Promise<Points[]> {

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', items || [1, 2, 3, 4, 5, 6])
            .where('city', city || '*')
            .where('uf', uf || '*')
            .distinct()
            .select('points.*')

        return points
    }

}

export default Points