import { celebrate, Joi } from 'celebrate'

export default celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        addressNumber: Joi.number().required(),
        items: Joi.string().regex(/^\d+(,\d+)*$/).required()
    })
},{
    abortEarly: false
})