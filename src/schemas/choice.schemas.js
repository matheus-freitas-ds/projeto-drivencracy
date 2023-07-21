import joi from "joi"

export const schemaChoice = joi.object({
    title: joi.string().required(),
    pollId: joi.string().required()
})
