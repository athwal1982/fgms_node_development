import Joi from 'joi';

export const commonValidate = {
    objCommon: Joi.object({
        insertedUserID: Joi.string().required(),
        insertedIPAddress: Joi.string().required(),
        dateShort: Joi.string().allow('', null),
        dateLong: Joi.string().allow('', null),
    }),
}
export const commonBNValidate = {
    objCommon: Joi.object({
        insertedUserID: Joi.string().allow('', null),
    }),
}
