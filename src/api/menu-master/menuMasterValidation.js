import Joi from 'joi';

export const getDistrictByStateValidate = Joi.object({
    stateAlphaCode: Joi.string().required(),
})
