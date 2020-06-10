import { Router } from 'express'

import multer from 'multer'
import multerConfig from './config/multer'

import pv from './middlewares/PointValidator'

import PointsController from './controller/PointsController'
import ItemsController from './controller/ItemsController'

const routes = Router()
const uploads = multer(multerConfig)

routes.get('/items', ItemsController.index)

routes.post('/points', uploads.single('image'), pv, PointsController.create )

routes.get('/points/:id', PointsController.show)
routes.get('/points', PointsController.index)

export default routes
