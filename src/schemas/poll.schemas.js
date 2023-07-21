import joi from "joi"

export const schemaPoll = joi.object({
    title: joi.string().required(),
    expireAt: joi.string().allow("")
})